"""
Multi-turn LLaMA 3 Chatbot using Groq API
"""
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from groq import Groq
import sqlite3
import json
from datetime import datetime
import os
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

# Configuration - Use environment variable for API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("NEXT_PUBLIC_GROQ_API_KEY") or ""
MODEL = "llama-3.3-70b-versatile"
DB_PATH = "chatbot.db"

# Initialize Groq client
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

# Initialize database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            title TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            role TEXT,
            content TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            total_messages INTEGER,
            avg_response_time REAL,
            user_feedback TEXT,
            timestamp TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Helper functions
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def generate_session_id():
    import uuid
    return str(uuid.uuid4())

def get_session_messages(session_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC', (session_id,))
    messages = [{"role": row[0], "content": row[1]} for row in c.fetchall()]
    conn.close()
    return messages

def save_message(session_id, role, content):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)',
              (session_id, role, content, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def update_session_title(session_id, title):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?',
              (title, datetime.now().isoformat(), session_id))
    conn.commit()
    conn.close()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/session/new', methods=['POST'])
def new_session():
    session_id = generate_session_id()
    conn = get_db_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    c.execute('INSERT INTO sessions (id, created_at, updated_at, title) VALUES (?, ?, ?, ?)',
              (session_id, now, now, "New Chat"))
    conn.commit()
    conn.close()
    return jsonify({"session_id": session_id})

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT id, title, created_at FROM sessions ORDER BY updated_at DESC')
    sessions = [{"id": row[0], "title": row[1], "created_at": row[2]} for row in c.fetchall()]
    conn.close()
    return jsonify(sessions)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    session_id = data.get('session_id', '')
    
    if not user_message or not session_id:
        return jsonify({"error": "Missing message or session_id"}), 400

    if not client:
        return jsonify({"error": "Groq API key not found. Please set GROQ_API_KEY environment variable."}), 500
    
    save_message(session_id, 'user', user_message)
    
    # Get conversation history
    messages = get_session_messages(session_id)
    
    # Call Groq API
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1024
        )
        
        ai_response = response.choices[0].message.content
        save_message(session_id, 'assistant', ai_response)
        
        # Update session title from first user message
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT title FROM sessions WHERE id = ?', (session_id,))
        current_title = c.fetchone()[0]
        conn.close()
        
        if current_title == "New Chat" and len(user_message) > 0:
            title = user_message[:50] + ("..." if len(user_message) > 50 else "")
            update_session_title(session_id, title)
        
        return jsonify({
            "response": ai_response,
            "session_id": session_id
        })
    
    except Exception as e:
        return jsonify({"error": f"Groq API Error: {str(e)}"}), 500

@app.route('/api/analytics/<session_id>', methods=['GET'])
def get_analytics(session_id):
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('SELECT COUNT(*) FROM messages WHERE session_id = ? AND role = "user"', (session_id,))
    message_count = c.fetchone()[0]
    
    c.execute('SELECT * FROM analytics WHERE session_id = ?', (session_id,))
    analytics = c.fetchone()
    
    conn.close()
    
    return jsonify({
        "total_messages": message_count,
        "analytics": dict(analytics) if analytics else None
    })

@app.route('/api/feedback', methods=['POST'])
def save_feedback():
    data = request.json
    session_id = data.get('session_id')
    feedback = data.get('feedback')
    
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO analytics (session_id, total_messages, user_feedback, timestamp)
        VALUES (?, 0, ?, ?)
    ''', (session_id, feedback, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

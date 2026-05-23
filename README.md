# Multi-Turn LLaMA 3 Chatbot with OpenRouter API

A modern, interactive multi-turn chatbot web application powered by LLaMA 3 through OpenRouter API. Built with Flask backend, modern HTML/CSS/JavaScript frontend, and SQLite for session management.

## Features

✨ **Multi-Turn Conversations**: Maintain context across multiple exchanges in a single session  
💾 **Session Management**: Automatic session creation and chat history storage  
📊 **Analytics Dashboard**: Track conversation metrics and usage statistics  
🎨 **Modern Dark UI**: Sleek, responsive interface with gradient design  
🔄 **Real-time Chat**: Instant messaging with typing indicators  
📱 **Responsive Design**: Works seamlessly on desktop and mobile devices  
💬 **Quick Actions**: Pre-defined prompts for easy interaction  
📝 **Feedback System**: Collect user feedback for improvement

## Architecture

```
chatbot_project/
├── app.py                    # Flask backend with OpenRouter integration
├── requirements.txt          # Python dependencies
├── chatbot.db               # SQLite database (auto-created)
├── templates/
│   └── index.html           # Main HTML template
└── static/
    ├── css/
    │   └── style.css        # Modern styling
    └── js/
        └── script.js        # Client-side logic
```

### Technology Stack

- **Backend**: Flask (Python web framework)
- **API Integration**: OpenRouter API for LLaMA 3 inference
- **Database**: SQLite (chat history, sessions, analytics)
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **AI Model**: Meta LLaMA 3 (8B Instruct via OpenRouter)

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- OpenRouter API key (free tier available at https://openrouter.io)

### Setup Steps

1. **Clone or Navigate to Project Directory**

   ```bash
   cd chatbot_project
   ```

2. **Create Virtual Environment** (Recommended)

   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API Key** (Already set in app.py)
   - The OpenRouter API key is pre-configured in `app.py`
   - To use a different key, edit the `OPENROUTER_API_KEY` variable in `app.py`

5. **Run the Application**

   ```bash
   python app.py
   ```

6. **Access the Chatbot**
   - Open your browser and navigate to: `http://localhost:5000`
   - The application will automatically create the SQLite database

## Usage

### Starting a Conversation

1. Click "New Chat" button (top-left ➕) to create a new conversation
2. Type your message in the input field at the bottom
3. Press Enter or click the send button (➤)
4. The AI will respond while maintaining conversation context

### Quick Actions

Use pre-defined prompts for instant interaction:

- **Quantum Computing**: Ask about quantum physics and computation
- **Python Help**: Get programming assistance
- **Study Tips**: Receive study strategies and tips

### Chat History

- All chats are automatically saved in the left sidebar
- Click any previous chat to resume the conversation
- Chat titles are auto-generated from your first message

### Analytics

1. Click the "📊 Analytics" button in the sidebar
2. View:
   - Total conversations started
   - Messages sent count
   - Sessions created
   - Last active time
3. Submit feedback in the feedback section

## API Endpoints

| Endpoint                      | Method | Description                   |
| ----------------------------- | ------ | ----------------------------- |
| `/`                           | GET    | Main chatbot interface        |
| `/api/session/new`            | POST   | Create new chat session       |
| `/api/sessions`               | GET    | Fetch all chat sessions       |
| `/api/chat`                   | POST   | Send message and get response |
| `/api/analytics/<session_id>` | GET    | Get session analytics         |
| `/api/feedback`               | POST   | Submit user feedback          |

## Database Schema

### Sessions Table

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    title TEXT
);
```

### Messages Table

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    role TEXT,              -- 'user' or 'assistant'
    content TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
);
```

### Analytics Table

```sql
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    total_messages INTEGER,
    avg_response_time REAL,
    user_feedback TEXT,
    timestamp TIMESTAMP
);
```

## Configuration

### Model Settings (in app.py)

```python
MODEL = "meta-llama/llama-3-8b-instruct"  # LLaMA 3 8B model
OPENROUTER_URL = "https://openrouter.io/api/v1/chat/completions"
OPENROUTER_API_KEY = "your-api-key-here"
```

### Temperature & Tokens

- **Temperature**: 0.7 (controls response creativity: 0=deterministic, 1=random)
- **Max Tokens**: 1024 (maximum response length)

Modify these in `app.py` line for different behavior:

```python
json={
    "model": MODEL,
    "messages": messages,
    "temperature": 0.7,      # Adjust here
    "max_tokens": 1024       # Adjust here
}
```

## Features in Detail

### Multi-Turn Conversation

The chatbot maintains full conversation history:

- Every message (user and assistant) is stored in the database
- Full message history is sent to the API on each request
- LLaMA 3 understands context across multiple turns
- Sessions persist across browser sessions

### Modern UI Design

Dark theme with:

- Gradient backgrounds
- Smooth animations and transitions
- Blue accent color (#3b82f6)
- Responsive grid layout
- Typing indicators while waiting for response

### Session Management

- Auto-generated unique session IDs using UUID
- Session titles derived from first user message
- Last-accessed time tracking
- Easy session switching from sidebar

## Troubleshooting

### Issue: "API Error: 401"

**Solution**: Check your OpenRouter API key in `app.py`. Ensure you're using a valid key.

### Issue: "Failed to connect to OpenRouter"

**Solution**:

- Verify internet connection
- Check if OpenRouter is operational (openrouter.io)
- Review API rate limits

### Issue: Database locked error

**Solution**:

- Close all other instances of the app
- Delete `chatbot.db` to reset
- Restart the application

### Issue: Port 5000 already in use

**Solution**: Change port in `app.py`

```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use different port
```

## Performance Tips

1. **Response Time**: Initial response may take 2-5 seconds (API latency)
2. **Long Sessions**: For sessions with 20+ messages, responses may be slightly slower
3. **Browser**: Use Chrome/Firefox for best experience

## Security Considerations

- API key is stored in source code (for development only)
- For production, use environment variables:
  ```python
  import os
  OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
  ```
- Implement HTTPS in production
- Add user authentication for multi-user deployment

## Limitations

- OpenRouter API calls consume credits
- Free tier has rate limits (check OpenRouter dashboard)
- Maximum context window: ~4000 tokens (LLaMA 3)
- No image support (text-only conversations)

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Chat export (PDF, markdown)
- [ ] Custom system prompts per session
- [ ] Voice input/output
- [ ] Code syntax highlighting in responses
- [ ] Conversation search functionality
- [ ] Advanced analytics with charts
- [ ] Dark/Light mode toggle

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions:

1. Check the Troubleshooting section
2. Verify OpenRouter API status
3. Review browser console for errors (F12)
4. Check server logs in terminal

## Project Documentation

This project demonstrates:

- ✅ Multi-turn chatbot interaction
- ✅ Session management and persistence
- ✅ Real-time response handling
- ✅ Data storage with SQLite
- ✅ Analytics and feedback mechanisms
- ✅ Modern responsive UI/UX
- ✅ Flask REST API development
- ✅ Cloud-based AI inference (OpenRouter)

Perfect for CS619 AI Systems course requirements!

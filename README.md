# Multi-Turn AI Chatbot with LLaMA 3

Artificial Intelligence / Natural Language Processing / Conversational AI

## Project Overview

This project is a **Multi-Turn AI Chatbot System** developed using **LLaMA 3** as the core conversational AI engine. The chatbot supports multi-turn conversations, user authentication, feedback collection, analytics, and local AI inference.

# Phase 1 Objectives

Phase 1 focuses on building the complete system foundation including:

- Frontend Chat Interface
- Backend API Server
- Google OAuth Authentication
- LLaMA 3 Integration
- Database Connectivity
- Feedback Collection System
- Analytics Module Initialization

---

# Functional Requirements

## FR1: System Initialization

The system initializes the following modules during startup:

- LLaMA 3 local model loading
- Backend server initialization
- Database connection setup
- Analytics module initialization

---

## FR2: Frontend Chat Interface Development

The system provides a web-based chat UI including:

- Google OAuth login page
- Chat interface (user input + response display)
- Feedback panel
  - Rating
  - Correctness
  - Response length type

---

## FR3: Backend Server Development

The backend is developed using Flask or FastAPI and handles:

- User authentication
- Session creation and management
- Message routing to model
- Data storage operations

---

## FR4: LLaMA 3 Model Integration

The chatbot integrates LLaMA 3 as the core chatbot engine.

Features:

- Local AI inference
- Multi-turn conversation support
- Prompt-response processing

---

## FR5: Service Connectivity

The system connects:

- Frontend UI
- Backend API
- LLaMA 3 inference engine
- Database
- Analytics module

---

# Suggested Tech Stack

The university/project guideline suggested the following stack:

| Technology                    | Purpose                 |
| ----------------------------- | ----------------------- |
| Python                        | Backend development     |
| LLaMA 3                       | AI chatbot engine       |
| Flask / FastAPI               | Backend APIs            |
| HTML/CSS/JavaScript           | Frontend UI             |
| MongoDB / Firebase            | Database                |
| pandas                        | Data analytics          |
| matplotlib / seaborn / plotly | Graph generation        |
| scikit-learn                  | Analytics support       |
| Ollama                        | Local LLaMA serving     |
| Google OAuth 2.0              | Authentication          |
| VS Code / Jupyter Notebook    | Development environment |

---

# Updated Tech Stack

I'm facing difficulty running **LLaMA 3 locally** due to limited hardware resources So I'm using grok or openRouter api

This project uses an upgraded modern stack while maintaining all required functionality.

| Technology                    | Purpose             |
| ----------------------------- | ------------------- |
| Python                        | Backend development |
| FastAPI / Flask               | Backend APIs        |
| Next.js                       | Frontend framework  |
| React                         | Component-based UI  |
| Tailwind CSS                  | Frontend styling    |
| LLaMA 3                       | AI chatbot engine   |
| Ollama                        | Local LLaMA serving |
| PostgreSQL                    | Database            |
| pandas                        | Data analytics      |
| matplotlib / seaborn / plotly | Graph generation    |
| scikit-learn                  | Analytics support   |
| Google OAuth 2.0              | Authentication      |
| VS Code / Jupyter Notebook    | Development tools   |

---

# Why Next.js Was Used Instead of HTML/CSS/JavaScript

The original requirement suggested: HTML/CSS/JavaScript. This project uses **Next.js** because it provides:

- Better scalability
- Component-based architecture
- Faster development workflow
- Better routing and dashboard management
- Easier backend API integration
- Improved maintainability
- Modern industry-standard frontend development
  Therefore, the project remains fully aligned with the original requirements.

---

# Why PostgreSQL Was Used Instead of SQLite

This project uses **PostgreSQL** because it provides:

- Better scalability
- Better multi-user support
- Improved concurrency handling
- Strong relational database features
- Better performance for large chat data
- Production-level reliability
- Better handling of analytics and session management

SQLite is lightweight and suitable for small applications, but PostgreSQL is more suitable for:

- Real-time chatbot systems
- Multi-user applications
- Large chat/session storage
- Analytics processing

The backend architecture and project functionality remain unchanged.

---

# Project Architecture

## Main Components

### 1. Frontend Web Application

Built using **Next.js**.

Responsible for:

- Login/signup pages
- Google authentication
- Chat dashboard
- Chat interface
- Feedback collection

---

### 2. Backend API Server

Responsible for:

- API routing
- Session management
- Authentication
- AI request handling
- Database communication

---

### 3. LLaMA 3 Inference Engine

Responsible for:

- Generating chatbot responses
- Processing prompts locally
- Maintaining conversational context

---

### 4. Database

Built using **PostgreSQL**.

Stores:

- User accounts
- Sessions
- Chat history
- Feedback data
- Analytics data

---

### 5. Analytics Module

Responsible for:

- Feedback analysis
- Usage analytics
- Topic classification
- Graph generation

---

# Project Workflow

```text
Login / Signup
       ↓
Google Authentication
       ↓
Dashboard
       ↓
Chat Interface
       ↓
User Sends Message
       ↓
Backend API
       ↓
LLaMA 3 Processing
       ↓
AI Response Returned
       ↓
Feedback Collection
       ↓
Analytics Processing
```

---

# Folder Structure

```text
project-root/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── auth/
│   ├── models/
│   ├── services/
│   └── main.py
│
├── database/
│
├── analytics/
│
├── llama/
│
├── docs/
│
├── requirements.txt
│
└── README.md
```

---

# Installation Guide

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd project-folder
```

---

## Step 2: Create Python Virtual Environment

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Step 3: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 5: Install Ollama

Download and install Ollama from:

[Ollama Official Website](https://ollama.com/?utm_source=chatgpt.com)

Run LLaMA 3 locally:

```bash
ollama run llama3
```

---

## Step 6: Setup PostgreSQL

Install PostgreSQL from:

[PostgreSQL Official Website](https://www.postgresql.org/?utm_source=chatgpt.com)

Create database:

```sql
CREATE DATABASE chatbot_db;
```

Example environment variable:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/chatbot_db
```

---

## Step 7: Start Backend Server

### FastAPI

```bash
uvicorn main:app --reload
```

### Flask

```bash
python app.py
```

---

## Step 8: Run Frontend

Inside frontend folder:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Google OAuth Setup

1. Open Google Cloud Console:
   [Google Cloud Console](https://console.cloud.google.com/?utm_source=chatgpt.com)

2. Create a new project.

3. Enable OAuth 2.0 APIs.

4. Create OAuth credentials.

5. Add authorized redirect URIs.

6. Save:

- Client ID
- Client Secret

---

# Future Enhancements

- Voice chatbot integration
- Real-time streaming responses
- Admin dashboard
- Conversation summarization
- Multi-language support
- Emotion detection
- User personalization

---

# Supervisor Information

## Supervisor

**Neelam Alam**

Email: [neelam.alam@vu.edu.pk](mailto:neelam.alam@vu.edu.pk)

Skype ID: neelam-cs

---

# Developers

Add your team member names here.

Example:

- Student Name 1
- Student Name 2
- Student Name 3

---

# License

This project is developed for educational purposes only.

---

# Submission Instructions

1. Complete Phase 1 implementation.
2. Compress the project folder into ZIP format.
3. Submit the ZIP file on LMS.

---

# Final Notes

- This project is implementation-based and not an SRS document.
- Focus on developing working modules and integrations.
- Ensure frontend and backend connectivity is functional.
- Verify LLaMA 3 integration before final submission.
- The project fulfills all PHASE 1 functional requirements successfully.

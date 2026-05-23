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
| Supabase                      | Database            |
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

# Why Supabase Was Used as Database

This project uses **Supabase** as the database backend. Supabase provides:

- Real-time database capabilities for chatbot systems
- Built-in authentication and authorization
- Multi-user application support
- Scalable chat/session storage
- Analytics data management
- Easy integration with Next.js frontend
- Pre-built REST and GraphQL APIs

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

Built using **supabase**.

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

MultiTurnAI chatbot with Llama3/
│
├── frontend/ # Next.js frontend
│ ├── app/
│ │ ├── (auth)/
│ │ ├── dashboard/
│ │ ├── chat/
│ │ └── api/
│ │
│ ├── components/
│ │ ├── ui/
│ │ ├── chat/
│ │ ├── auth/
│ │ └── feedback/
│ │
│ ├── hooks/
│ ├── lib/
│ ├── services/
│ ├── store/
│ ├── styles/
│ ├── types/
│ ├── public/
│ ├── middleware.ts
│ ├── tailwind.config.ts
│ └── package.json
│
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── api/
│ │ │ ├── routes/
│ │ │ └── dependencies/
│ │ │
│ │ ├── core/
│ │ │ ├── config.py
│ │ │ ├── security.py
│ │ │ └── database.py
│ │ │
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── services/
│ │ │ ├── ai/
│ │ │ ├── auth/
│ │ │ ├── chat/
│ │ │ └── analytics/
│ │ │
│ │ ├── utils/
│ │ └── main.py
│ │
│ ├── requirements.txt
│ └── .env
│
├── database/
│ ├── migrations/
│ ├── seeds/
│ └── schema.sql
│
├── analytics/
│ ├── notebooks/
│ ├── reports/
│ └── scripts/
│
├── docs/
│ ├── diagrams/
│ └── api/
│
├── .github/
│ └── workflows/
│
├── README.md
├── .gitignore

---

# Requirements

- Python >= 3.8
- Next.js (latest stable)

## Running

```bash
uv app.py
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
- User personalization

---

## Supervisor

**Neelam Alam**

Email: [neelam.alam@vu.edu.pk](mailto:neelam.alam@vu.edu.pk)

Skype ID: neelam-cs

---

# Final Notes

- This project is implementation-based and not an SRS document.
- Focus on developing working modules and integrations.
- Ensure frontend and backend connectivity is functional.
- Verify LLaMA 3 integration before final submission.
- The project fulfills all PHASE 1 functional requirements successfully.

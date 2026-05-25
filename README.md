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

# Updated Tech Stack

I'm facing difficulty running **LLaMA 3 locally** due to limited hardware resources So I'm using grok or openRouter api

This project uses an upgraded modern stack while maintaining all required functionality.

| Technology      | Purpose             |
| --------------- | ------------------- |
| Python          | Backend development |
| FastAPI / Flask | Backend APIs        |
| Next.js         | Frontend framework  |
| Ollama          | Local LLaMA serving |
| Supabase        | Database            |

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

# Requirements

- docker
- supabase cli
- Python > 3.8
- Next.js 16.2.6 stable versio

---

## Supervisor

**Neelam Alam**

Email: [neelam.alam@vu.edu.pk](mailto:neelam.alam@vu.edu.pk)

Skype ID: neelam-cs

---

# Output

- This project is implementation-based and not an SRS document.
- Focus on developing working modules and integrations.
- Ensure frontend and backend connectivity is functional.
- Verify LLaMA 3 integration before final submission.
- The project fulfills all PHASE 1 functional requirements successfully.

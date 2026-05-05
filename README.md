# Multi-Turn AI Chatbot With using Llama3
     (Artifical Intelligence / Natural language Processing / Conversational AI)
## Project IDEA: 

 - We first install ollama Software and then run llama3 model locally, Then llama3 model exposes it's api then we use this api in our website. We build backend & frontend In backend we do query classification and validation about query length and taking input feedback after 4 to 5 queries and storing the queries in database with validation. Then making two roles User & Admin. Admin see feedback analytics graph, statics of multi-dimmensional query classification and see response time from starting to end 

## Phases:

- The project has already divided into three phases
  1. Phase 1: Chatbot System Development (Frontend + Backend)
  2. Phase 2: Chat Execution + Data Storage System
  3. Phase 3: Analytics System 

## Phase 1: ChatBot System Development (Frontend + Backend)

FR1: System Initialization

 - LLaMA 3 local model loading
 - Backend server initialization
 - Database connection setup
 - Analytics module initialization

FR2: Frontend Chat Interface Development
 - Google OAuth login page
 - Chat interface (user input + response display)
 - Feedback panel (rating, correctness, length type)

FR3: Backend Server Development

 - The system shall implement a backend using Flask/FastAPI.
 - The backend shall handle:
 - User authentication
 - Session creation and management
 - Message routing to model
 - Data storage operations

FR4: LLaMA 3 Model Integration

 - The system shall integrate LLaMA 3 as the core chatbot engine.
 - The system shall process user queries locally through the model.

FR5: Service Connectivity
 - The system shall connect:
    1. Frontend UI
    2. Backend API
    3. LLaMA 3 model inference engine
    4. Database
    5. Analytics module

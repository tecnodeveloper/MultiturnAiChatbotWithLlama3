# Backend Viva Questions - Multi-Turn AI Chatbot

## Table of Contents
1. [Architecture & Setup](#architecture--setup)
2. [Authentication & Security](#authentication--security)
3. [Database Design & MongoDB](#database-design--mongodb)
4. [API Endpoints & Routes](#api-endpoints--routes)
5. [Chat & Streaming Mechanism](#chat--streaming-mechanism)
6. [Feedback System](#feedback-system)
7. [Analytics System](#analytics-system)
8. [External Service Integration](#external-service-integration)
9. [Error Handling & Validation](#error-handling--validation)
10. [Performance & Optimization](#performance--optimization)

---

## Architecture & Setup

### Basic Questions

1. **Explain the overall architecture of the backend. What technologies are used and how do they communicate?**
   - FastAPI as the web framework
   - MongoDB as the database (via Motor async driver)
   - Ollama for LLM inference
   - Google OAuth for authentication

2. **What is the purpose of the lifespan context manager in FastAPI?**
   - Manages app startup and shutdown events
   - Connects to MongoDB at startup
   - Probes Ollama availability
   - Initializes analytics at startup
   - Closes MongoDB connection at shutdown

3. **Why is Motor used instead of PyMongo in this project?**
   - Motor provides async/await support for MongoDB operations
   - Required for non-blocking I/O in FastAPI's async event loop
   - Better performance and scalability for concurrent requests

4. **What are the middleware configurations applied to the FastAPI application?**
   - CORS middleware to allow requests from frontend (http://localhost:5173)
   - Configured with allow_credentials=True for sending tokens

5. **How is environment configuration managed in this project?**
   - Uses Pydantic-settings (BaseSettings)
   - Reads from .env file using SettingsConfigDict
   - Singleton pattern via @lru_cache decorator
   - Validates required fields (e.g., JWT_SECRET min 32 chars)

### Intermediate Questions

6. **Describe the app initialization sequence. What happens when the application starts?**
   - FastAPI app is instantiated with lifespan context manager
   - On startup: connects to MongoDB, checks Ollama readiness, initializes analytics
   - Registers routers for health, auth, chat, feedback, analytics
   - CORS middleware is added
   - On shutdown: closes MongoDB connection

7. **What is the significance of using @lru_cache for settings?**
   - Ensures only one instance of settings exists throughout the app lifecycle
   - Prevents re-reading .env file multiple times
   - Improves performance by caching configuration

8. **How does the project structure support separation of concerns?**
   - config/: Configuration management
   - database/: MongoDB connection and operations
   - routes/: API endpoints grouped by functionality
   - services/: Business logic (Ollama, Google OAuth)
   - models/: Database collection documentation
   - schemas/: Request/response validation (Pydantic)
   - auth/: Authentication dependencies
   - utils/: Utility functions (security, token handling)
   - analytics/: Analytics-specific logic

### Advanced Questions

9. **Explain the singleton pattern used with database connections. Why is this important?**
   - Global _MongoState object maintains single client and database connection
   - Prevents multiple connections to MongoDB from being created
   - get_db() function provides access to the database throughout the app
   - Critical for resource efficiency and connection pooling

10. **What configuration parameters would you need to change to deploy this to production?**
    - MONGODB_URL: Point to production MongoDB instance
    - OLLAMA_URL: Point to production Ollama server
    - CORS_ORIGINS: Add production frontend URL
    - JWT_SECRET: Generate new secure secret
    - app_env: Change from "development" to "production"
    - GOOGLE_CLIENT_ID/SECRET: Update to production OAuth credentials
    - Database replica set configuration for high availability

---

## Authentication & Security

### Basic Questions

11. **How does Google OAuth authentication work in this backend?**
    - Client sends Google ID token (JWT) to POST /auth/google endpoint
    - Backend verifies token signature and expiration using google-auth library
    - Extracts claims (sub, email, name, picture) from verified token
    - Creates or updates user document in MongoDB

12. **What is a JWT and why is it used in this project?**
    - JSON Web Token: a compact, self-contained way to transmit information
    - Contains payload (claims) encoded and signed with a secret key
    - Used for stateless authentication after initial Google OAuth login
    - Includes subject (user_id), expiration time, and issued-at time

13. **How are tokens created and what information do they contain?**
    - Created in create_access_token() function
    - Contains: sub (user_id), exp (expiration), iat (issued-at time)
    - Signed using HS256 algorithm with JWT_SECRET
    - Expiration set to current time + jwt_access_token_expire_minutes (default 60)

14. **How does the get_current_user dependency work?**
    - Uses HTTPBearer scheme to extract Bearer token from Authorization header
    - Decodes token using decode_access_token()
    - Validates token signature and expiration
    - Looks up user in MongoDB by user_id from token payload
    - Returns UserPublic object if user exists, otherwise raises 401

15. **What fields are stored in the users collection?**
    - _id: ObjectId (unique identifier)
    - email: str (unique, lowercased)
    - name: str (user's display name)
    - google_id: str (Google's unique identifier for the user)
    - auth_provider: str (always "google")
    - profile_picture: str | None (URL to Google profile image)
    - created_at: datetime (account creation time)
    - updated_at: datetime (last update time)

### Intermediate Questions

16. **Explain the Google ID token verification process. What security checks are performed?**
    - Signature verification: Ensures token wasn't tampered with
    - Expiration check: Ensures token hasn't expired
    - Audience validation: Verifies token was issued for our GOOGLE_CLIENT_ID
    - Issuer validation: Checks token came from accounts.google.com
    - Raises GoogleAuthError if any check fails

17. **How does the application handle user creation vs update during Google login?**
    - First login: Creates new user document with all fields
    - Subsequent logins: Updates user document with latest profile picture and timestamp
    - Uses MongoDB find_one() then insert_one() or update_one()
    - Ensures email and google_id uniqueness via indexes

18. **What is the purpose of the user_doc_to_public() function?**
    - Converts MongoDB user document to UserPublic Pydantic schema
    - Ensures sensitive fields are not exposed in API responses
    - Extracts only necessary fields: id, email, name, auth_provider, profile_picture
    - Converts _id ObjectId to string for JSON serialization

19. **Why is email lowercased during user creation?**
    - Ensures consistency and prevents duplicate accounts with different casings
    - Email comparison is case-insensitive per RFC standards
    - Simplifies database queries and uniqueness constraints

20. **What happens if JWT token expires? How is this handled?**
    - Expired tokens fail decode_access_token() validation (JWTError)
    - Backend returns 401 Unauthorized with "invalid or expired token"
    - Frontend intercepts 401 responses and dispatches logout action
    - User is redirected to login page
    - No automatic refresh token mechanism (user must re-login)

### Advanced Questions

21. **Discuss potential security vulnerabilities in the authentication system and how to mitigate them.**
    - No refresh token flow: Mitigate by implementing refresh tokens with longer expiry
    - JWT in Bearer token: Mitigate by using HTTPS only
    - No rate limiting: Mitigate by adding rate limiting middleware
    - Profile picture from user input: Validate URL format before storing
    - Fix missing index on feedback.message_id to prevent duplicate feedback

22. **How would you implement a refresh token mechanism?**
    - Store refresh tokens in MongoDB with expiration and user_id
    - Return both access_token (short-lived) and refresh_token (long-lived) on login
    - Create new endpoint POST /auth/refresh that validates refresh token
    - Issue new access token without requiring user to re-authenticate
    - Implement token rotation and revocation for security

23. **What security measures protect against CSRF attacks?**
    - CORS middleware configured with specific origins (no wildcard)
    - Credentials allowed only for specific origins
    - Google ID tokens have built-in CSRF protection (state parameter in OAuth flow)
    - Frontend uses Secure, SameSite cookies (if using cookies instead of Bearer tokens)

---

## Database Design & MongoDB

### Basic Questions

24. **Describe the MongoDB database structure. What collections exist and why?**
    - users: Stores user profiles from Google OAuth
    - chat_sessions: Stores conversation sessions (one per chat instance)
    - messages: Stores individual messages in conversations
    - feedback: Stores user ratings and feedback on assistant messages

25. **What indexes are created on MongoDB collections and why?**
    - users.email (unique): Prevent duplicate emails
    - users.google_id (unique, sparse): Prevent duplicate Google accounts
    - chat_sessions [user_id, updated_at -1]: Efficient session listing by user
    - messages [session_id, ts]: Efficient message retrieval in chronological order
    - Missing: feedback.message_id (should be unique) - potential bug at scale

26. **Explain the denormalization pattern used in the messages collection.**
    - Stores user_id redundantly (already in session via session_id)
    - Reason: Allows direct user authorization checks without joining sessions
    - Improves query performance for listing user's messages
    - Trade-off: Requires updates in multiple places if user changes

27. **How does the chat_sessions collection track topic labels?**
    - topic_label field set on first user message
    - Uses keyword matching to categorize: Coding, Math, Science, Writing, General
    - Enables topic-based analytics and organization
    - Updated only once (is_first_message check)

28. **What is the relationship between chat_sessions, messages, and feedback?**
    - Session contains multiple messages
    - Message belongs to one session
    - Feedback belongs to one assistant message (unique relationship)
    - Denormalized: feedback stores both session_id and user_id for efficiency

### Intermediate Questions

29. **Explain the ObjectId to string conversion pattern used throughout the API.**
    - MongoDB uses BSON ObjectId, but JSON requires strings
    - _oid() helper converts string hex to ObjectId for DB queries
    - _session_out(), _message_out(), etc. convert ObjectId to string for responses
    - Error handling: raises HTTP 400 if string is not valid ObjectId

30. **How does MongoDB handle concurrent writes to the same session?**
    - Each message insertion is atomic (single document insert)
    - Session updates use atomic $set operator
    - No explicit locking, relies on MongoDB's ACID guarantees per document
    - Potential issue: Race condition if multiple messages sent simultaneously

31. **Why is the feedback collection structured as upsert instead of insert-or-update separately?**
    - Single atomic operation: reduces race conditions
    - $set: Updates rating, correctness, length_type if feedback exists
    - $setOnInsert: Sets created_at only on insert, not on update
    - Allows users to modify feedback multiple times without duplicates

32. **Explain the indexing strategy and its impact on performance.**
    - Index on sessions (user_id, updated_at -1): Sorts sessions by recency for user
    - Index on messages (session_id, ts): Retrieves messages in order for conversation
    - These indexes avoid full collection scans for common operations
    - Index creation at startup ensures consistency across instances

### Advanced Questions

33. **Design a migration strategy if you need to add a new field to users collection.**
    - Create migration script using Motor to update existing documents
    - Use MongoDB's bulk operations for performance
    - Implement backwards compatibility in schema validation
    - Handle missing field gracefully in application code
    - Test migration on development database first

34. **How would you implement soft deletes for chat sessions?**
    - Add deleted_at: datetime | None field to sessions
    - Modify queries to filter out deleted sessions
    - Implement undelete functionality if needed
    - Archive deleted sessions separately or schedule hard delete
    - Consider compliance requirements for data retention

35. **What is the scalability concern with the current denormalization strategy?**
    - Redundant user_id in messages requires keeping in sync
    - Update operation would need to update all documents if user_id changed
    - Large feedback collection would require fetching by user_id frequently
    - Solution: Add composite index on (user_id, created_at) for better queries

36. **Explain how to implement pagination for message lists.**
    - Add skip() and limit() to MongoDB query
    - Use cursor timestamp or _id for cursor-based pagination
    - Timestamp-based is better for real-time data (new messages added)
    - Return cursor token to client for next page request
    - Prevents issues with deleted messages shifting results

---

## API Endpoints & Routes

### Basic Questions

37. **List all available API endpoints and their purposes.**
    - POST /auth/google: Google OAuth login
    - GET /auth/me: Get current authenticated user
    - POST /chat/sessions: Create new chat session
    - GET /chat/sessions: List user's sessions
    - GET /chat/sessions/{id}/messages: Get messages in session
    - POST /chat/sessions/{id}/messages: Send message and stream response
    - POST /feedback: Submit/update feedback on message
    - GET /feedback: List feedback for a session
    - GET /analytics/feedback-distribution: Chart data for ratings
    - GET /analytics/topic-breakdown: Chart data for topics
    - GET /analytics/message-volume: Chart data for message volume
    - GET /health: Probe endpoint

38. **What HTTP methods and status codes are used for each endpoint?**
    - POST with 201 (Created): /auth/google, /chat/sessions, /feedback
    - GET with 200 (OK): /auth/me, /chat/sessions, /chat/sessions/{id}/messages, /feedback, /analytics/*
    - POST with 200 (OK): /chat/sessions/{id}/messages (StreamingResponse)
    - 400 Bad Request: Invalid ObjectId, validation errors
    - 401 Unauthorized: Invalid/expired token
    - 404 Not Found: Session/message/user not found

39. **How is request validation performed in FastAPI?**
    - Pydantic schemas define request/response models
    - GoogleLoginRequest: credential field required
    - SendMessageRequest: content 1-20000 chars
    - FeedbackRequest: rating 1-4, enums for correctness and length_type
    - Automatic validation with error responses

40. **Explain the Depends() mechanism used throughout the routes.**
    - FastAPI dependency injection system
    - get_current_user = Depends(): Validates JWT and loads user from DB
    - get_db() returns shared database instance
    - Dependencies are injected before handler executes
    - Enables reusable authentication and database access patterns

41. **How does the SendMessageRequest payload look and what validation is applied?**
    - Single field: content (string)
    - Validation: min_length=1, max_length=20000
    - Purpose: Prevent empty messages and huge inputs
    - Max length: Reasonable limit for LLM context

### Intermediate Questions

42. **Explain the response structure for the send_message endpoint.**
    - Returns StreamingResponse with media_type="text/event-stream"
    - Streams JSON events with format: "data: {json}\n\n"
    - Events with "t" field: Token strings from LLM
    - Final event with "done": true contains full message objects
    - Client-side SSE parsing reconstructs full response

43. **Why does list_sessions use sort("updated_at", -1)?**
    - -1 means descending order (most recent first)
    - Shows users their most recently active chats at top
    - Improves UX by reducing scrolling to find recent conversations
    - Matches typical chat application behavior (like WhatsApp, Gmail)

44. **How does the API handle permission validation for sessions?**
    - _get_session_for_user() checks both session_id and user_id match
    - Prevents users from accessing other users' sessions
    - Applied to message retrieval and sending
    - Returns 404 if user doesn't own session

45. **What is the purpose of the topic labeling in chat endpoints?**
    - _label_topic() analyzes first user message for keywords
    - Categorizes conversation topic without ML complexity
    - Used for analytics grouping and organization
    - Labels: Coding, Math, Science, Writing, General

46. **How is the session title auto-generated?**
    - _autotitle() extracts first line of first message
    - Truncates to 60 characters with "…" if longer
    - Fallback to "New chat" if message empty
    - User can manually edit (not shown in current code, but could add feature)

### Advanced Questions

47. **Design an API endpoint for editing a message. What security considerations apply?**
    - Only allow editing own messages, own sessions
    - Only allow editing user messages, not assistant replies (immutable)
    - Track edit history (add edited_at and edited_content fields)
    - Validate authorization at _get_session_for_user level
    - Potentially regenerate session topic if first message changed

48. **How would you implement message deletion with cascade logic?**
    - Add soft delete: deleted_at field instead of hard delete
    - Mark message as deleted, don't remove from DB
    - Cascade: If user deletes their message, should assistant reply be deleted?
    - Decision: Archive both messages together for conversation integrity
    - Update indexes to exclude deleted messages from queries

49. **Explain how to add batch message operations (delete multiple, export session).**
    - POST /chat/sessions/{id}/messages/export: Export as JSON/PDF
    - DELETE /chat/sessions/{id}/messages: Delete all in session
    - POST /chat/sessions/{id}/messages/delete-multiple: Delete specific messages
    - Validate user ownership for entire operation
    - Consider performance if session has 1000+ messages

50. **Design a rate limiting strategy for the send_message endpoint.**
    - Per-user rate limit: E.g., 100 messages per hour
    - Per-session rate limit: E.g., 5 messages per minute
    - Implement using Redis cache or in-memory counter
    - Return 429 Too Many Requests when exceeded
    - Provide Retry-After header for client backoff

---

## Chat & Streaming Mechanism

### Basic Questions

51. **How does the message streaming work in the send_message endpoint?**
    - Client sends message content
    - Backend inserts user message to MongoDB
    - Builds conversation history (system prompt + all prior messages)
    - Calls Ollama API with stream: true
    - Yields tokens as Server-Sent Events (SSE)
    - On completion: inserts assistant message, updates session, sends final event

52. **What is the purpose of the SYSTEM_PROMPT constant?**
    - Sets assistant personality and behavior
    - "You are llama3-chatbot, a friendly local AI assistant on Ollama"
    - Instructs to keep responses concise unless asked for depth
    - Prepended to message history before each Ollama call
    - Ensures consistent behavior across conversations

53. **Explain how conversation history is built before each Ollama call.**
    - Query all messages for session from MongoDB (sorted by ts)
    - Create list with system message first
    - Append all prior user and assistant messages in order
    - Send complete history to Ollama for context awareness
    - Enables multi-turn conversation with full context

54. **What does the async event_stream() generator do?**
    - Streams tokens from Ollama LLM
    - Sends each token as SSE event immediately
    - Collects full response in full_reply list
    - After streaming complete: inserts assistant message to DB
    - Sends final event with persisted message metadata

55. **How is response time calculated and stored?**
    - response_time_ms = (reply_ts - now).total_seconds() * 1000
    - Measures time from user message insertion to response completion
    - Stored on assistant message document
    - Displayed in frontend as formatted response time
    - Useful metric for performance monitoring

### Intermediate Questions

56. **Explain the optimistic UI update pattern for streaming messages.**
    - Frontend creates temp message with temp ID (tmp-u-*, tmp-a-*)
    - Appends to UI immediately before server response
    - As tokens arrive, appends to assistant temp message
    - On final event: Replaces temp messages with persisted versions
    - Provides instant feedback while actual save completes

57. **What happens if Ollama fails mid-stream? How is error handling done?**
    - LlamaError exception caught in event_stream() try-except
    - User message already inserted is deleted (rollback)
    - Error event sent to client with error message
    - Frontend removes temp messages from UI
    - User can retry sending the message

58. **Why is user_id stored redundantly in messages collection?**
    - Allows direct authorization check without fetching session
    - Improves query performance for user-specific operations
    - Simplifies feedback submission (verify user owns message)
    - Trade-off: Requires updates if user data changes

59. **Explain the difference between streaming vs non-streaming Ollama calls.**
    - Streaming: stream: true in payload, yields tokens as they generate
    - Non-streaming: stream: false, waits for full response then returns
    - Streaming better for UX (shows response building in real-time)
    - Non-streaming simpler but poorer perceived performance
    - This project uses streaming for better user experience

60. **How does the backend prevent concurrent message conflicts in the same session?**
    - MongoDB atomic operations ensure message inserts succeed
    - Session title/topic only updated on first message (is_first_message check)
    - No explicit locking; relies on MongoDB document-level atomicity
    - Potential race condition if multiple messages sent very quickly
    - Not a practical issue but could be problematic at scale

### Advanced Questions

61. **Design a system to implement message editing with history tracking.**
    - Add edit_history array to messages collection
    - Each edit: {edited_at, old_content, new_content}
    - Regenerate assistant response if user message edited
    - Mark assistant message as stale, prompt user to regenerate
    - Allow viewing conversation before/after edit

62. **How would you implement conversation branching (multiple response alternatives)?**
    - Add branch_id to messages to group alternative paths
    - Store multiple assistant responses per user message
    - Implement toggle UI to switch between branches
    - Each branch has separate feedback scores
    - Complex analytics: separate tracking per branch

63. **Explain how to add citation/source tracking for Ollama responses.**
    - Modify SYSTEM_PROMPT to include citation instruction
    - Parse response for [citation: ...] markers
    - Extract citations and store separately in message
    - Link to external sources or internal documents
    - Display citations in frontend with source information

64. **Design a system for handling very long conversations (1000+ messages).**
    - Implement message summarization for older messages
    - Compress old messages into summary before reaching token limit
    - Store original and compressed versions
    - Dynamically decide which messages to include in Ollama history
    - Use BM25 or semantic similarity to select relevant messages

65. **How would you implement multi-turn context pruning?**
    - Track token count for each message
    - When history approaches Ollama's context limit
    - Remove oldest non-essential messages
    - Optionally keep recent messages (conversation recency)
    - Implement smart pruning: keep different topics separate

---

## Feedback System

### Basic Questions

66. **What information is collected in the feedback system?**
    - rating: 1-4 stars indicating quality
    - correctness: Enum (correct, partially, incorrect)
    - length_type: Enum (short, to_the_point, lengthy)
    - Implicit: message_id, session_id, user_id, created_at, updated_at

67. **Why is feedback collected only on assistant messages?**
    - User messages are self-generated, no need for quality feedback
    - Assistant responses need validation for accuracy
    - Enables model improvement through user ratings
    - Tracks assistant performance over time

68. **Explain the upsert pattern used in feedback submission.**
    - update_one() with upsert=True: Update if exists, insert if not
    - $set: Fields to update every time (rating, correctness, length_type, updated_at)
    - $setOnInsert: Fields to set only on insert (created_at, etc.)
    - Allows users to modify feedback multiple times without duplicates
    - One feedback doc per message_id (unique constraint intended)

69. **What validation is performed on feedback input?**
    - Rating: Pydantic Field(ge=1, le=4) ensures 1-4
    - Correctness: Enum validation to allowed values
    - Length_type: Enum validation to allowed values
    - Message ownership: Verify message belongs to user
    - Role check: Only allow feedback on assistant messages

70. **How does the feedback lookup verify user authorization?**
    - Query messages by _id, user_id, and role="assistant"
    - If message not found or user_id doesn't match: 404
    - Prevents users from giving feedback on others' conversations
    - Prevents feedback on user messages (role != assistant)

### Intermediate Questions

71. **Design a feedback schema that supports more granular quality metrics.**
    - Add factuality score: 1-10
    - Add relevance score: 1-10
    - Add clarity score: 1-10
    - Add helpful tags: [factually correct, well explained, outdated, etc.]
    - Add user comments for qualitative feedback
    - Migrate existing 4-star rating to composite score

72. **How would you implement anonymous feedback collection?**
    - Create separate anonymous_feedback collection
    - Remove user_id field or replace with session hash
    - Use UUID instead of MongoDB ObjectId
    - Ensure session_id is not enough to identify user
    - Consider GDPR compliance for data retention

73. **Explain how to track feedback trends over time.**
    - Add timestamp tracking to analytics
    - Aggregate feedback by date range
    - Plot rating distribution over time (sliding window)
    - Identify if model quality improving/declining
    - Alert if negative feedback exceeds threshold

74. **Design a feedback-driven model fine-tuning pipeline.**
    - Collect high-rating messages (gold standard)
    - Collect low-rating messages (bad examples)
    - Export annotated dataset for LLM fine-tuning
    - Retrain Ollama model on positive examples
    - A/B test new model against old
    - Iterate based on feedback results

75. **How would you prevent feedback spam or manipulation?**
    - Rate limit: Max 1 feedback update per message per minute
    - User reputation: Track feedback consistency over time
    - Outlier detection: Flag unusual feedback patterns
    - Require minimum session length before feedback
    - Validate rating aligns with message content length/quality

### Advanced Questions

76. **Design a collaborative feedback system with expert review.**
    - Crowdsource feedback from multiple users
    - Calculate inter-rater agreement (Cohen's kappa)
    - Expert review queue for low-agreement cases
    - Weighted aggregation: Expert ratings weighted higher
    - Appeal mechanism for users to dispute ratings

77. **Implement a feedback versioning and dispute resolution system.**
    - Track feedback versions with creator and timestamp
    - Allow users to comment on feedback disagreements
    - Implement voting system for resolving disputes
    - Escalation path to moderators
    - Learn from disputes to improve rating guidelines

---

## Analytics System

### Basic Questions

78. **What three analytics charts are currently provided?**
    - Feedback distribution: 3-bar chart (rating, correctness, length)
    - Topic breakdown: Bar chart of session clusters and their sizes
    - Message volume: Time-series chart of messages over time (implied)

79. **How is the feedback distribution calculated?**
    - Query all feedback documents for authenticated user
    - Aggregate counts by rating (1-4), correctness (3 types), length (3 types)
    - Create Plotly subplots with 3 bar charts side-by-side
    - Handle empty data case with "No data yet" message

80. **Explain the topic clustering algorithm used.**
    - TF-IDF vectorization of session text (user messages only)
    - KMeans clustering with n_clusters parameter
    - Extract top N terms from each cluster's centroid
    - Label clusters by top terms (e.g., "coding", "math")
    - Enable content-based organization of conversations

81. **What is the purpose of classify_topics() function?**
    - Clusters sessions by content using unsupervised learning
    - User can see what topics they discuss most
    - Identify patterns in conversation distribution
    - Support session organization by topic
    - Returns session-to-topic mapping

82. **How is Plotly used for visualization?**
    - Plotly library generates interactive charts
    - Charts converted to JSON format with to_json()
    - Frontend uses react-plotly.js to render JSON charts
    - Supports hover tooltips, zoom, pan, export to PNG
    - Theme applied with brand colors (#7c3aed primary)

### Intermediate Questions

83. **Design a message volume over time chart. How would you calculate this?**
    - Group messages by date (e.g., daily buckets)
    - Count messages per day for authenticated user
    - Optionally: Separate user vs assistant messages
    - Plot as line or bar chart with date on X-axis
    - Handle timezone considerations for date grouping

84. **How would you implement advanced analytics filters?**
    - Date range filter: Only include messages from certain period
    - Session filter: Analyze specific session or all sessions
    - Topic filter: Show charts for specific topic cluster
    - Message type filter: Only user/assistant messages
    - Feedback filter: Only rated/unrated messages

85. **Explain how to add session recommendation based on analytics.**
    - Calculate session similarity using TF-IDF cosine similarity
    - Recommend related sessions to current session
    - Or recommend next topic user might be interested in
    - Use clustering results to group similar sessions
    - Display recommendations in sidebar or dedicated UI

86. **Design a system to compare feedback trends across different models.**
    - Add model_name field to messages and sessions
    - Keep analytics separate per model
    - Side-by-side comparison charts
    - Show performance delta (Model A vs Model B)
    - Statistical significance testing (A/B test)

87. **How would you implement real-time analytics updates?**
    - Currently analytics are fetched on demand (static)
    - Implement WebSocket connection for live updates
    - Broadcast analytics updates when new feedback/messages added
    - Cache analytics results with TTL (5 min refresh)
    - Use Redis for distributed cache if multi-server

### Advanced Questions

88. **Design a machine learning pipeline for user engagement prediction.**
    - Features: Feedback scores, message volume, session duration
    - Label: User active/inactive in next 7 days
    - Train model to identify at-risk users
    - Implement intervention system (send notification to inactive users)
    - Measure intervention effectiveness

89. **Implement a quality assurance system using analytics.**
    - Track assistant response quality metrics (rating, correctness)
    - Set SLA thresholds (e.g., 80% correctness rate)
    - Alert if metrics fall below SLA
    - Implement escalation (e.g., switch to better Ollama model)
    - Generate weekly quality reports

90. **Design an anomaly detection system for analytics.**
    - Track feedback distribution over time
    - Detect sudden drops in rating/correctness
    - Flag unusual user behavior (e.g., all 5-star ratings)
    - Implement alerting system
    - Root cause analysis (model change, user spam, etc.)

---

## External Service Integration

### Basic Questions

91. **How does the backend connect to Ollama? What is the communication protocol?**
    - HTTP REST API calls to Ollama endpoint (default http://localhost:11434)
    - POST /api/chat endpoint with model, messages, stream parameters
    - Streaming response with newline-delimited JSON chunks
    - Each chunk contains partial response in message.content field

92. **What is check_ollama_ready() and when is it called?**
    - Probes Ollama availability at application startup
    - Fetches /api/tags to list available models
    - Verifies configured model (llama3) is pulled
    - Logs warning if Ollama unreachable or model missing
    - Does not raise exception; backend boots but chat will fail

93. **How is Ollama model failure handled during chat?**
    - stream_chat_complete() catches httpx.HTTPError
    - Raises LlamaError with descriptive message
    - Event stream catches exception and sends error event
    - User message already inserted; assistant message not created
    - Frontend shows error toast to user

94. **Explain the timeout configuration for Ollama calls.**
    - connect: 10.0s - time to establish connection
    - read: 300.0s (5 minutes) - time to receive response
    - write: 30.0s - time to send request
    - pool: 10.0s - connection pool timeout
    - Long read timeout accounts for slow LLM generation

95. **What Google OAuth fields are used in verification?**
    - sub: Google's unique user identifier
    - email: User's Google account email
    - name: User's display name
    - picture: URL to user's profile picture
    - iss: Issuer (must be Google)

### Intermediate Questions

96. **How would you implement failover to a secondary Ollama server?**
    - Add OLLAMA_SECONDARY_URL to configuration
    - In stream_chat_complete(), try primary first
    - On failure, retry with secondary URL
    - Implement exponential backoff for retries
    - Log/alert failover events for monitoring
    - Consider session-level state if retrying mid-stream

97. **Design a system to handle Ollama model updates without downtime.**
    - Implement version checking in check_ollama_ready()
    - Support multiple model versions simultaneously
    - Implement gradual traffic migration to new model
    - A/B test new model with subset of users
    - Automatic rollback if error rate increases

98. **How would you cache Ollama responses to reduce latency?**
    - Hash user message + conversation context
    - Check Redis cache before calling Ollama
    - Store successful responses with TTL
    - Invalidate cache if feedback contradicts response
    - Probably not worth complexity for this use case

99. **Design rate limiting for Ollama API calls.**
    - Track calls per user/per minute
    - Return 429 Too Many Requests if exceeded
    - Implement token bucket algorithm or sliding window
    - Different limits per user (free vs premium)
    - Provide Retry-After header to clients

100. **Implement Google OAuth token refresh mechanism.**
    - Google ID tokens expire (typically 1 hour)
    - Store refresh token from OAuth response
    - Implement endpoint to refresh Google token
    - Automatically refresh token when about to expire
    - Handle refresh token revocation gracefully

### Advanced Questions

101. **Design a circuit breaker pattern for Ollama integration.**
    - Track Ollama errors over time
    - After N consecutive failures, circuit opens
    - Immediately return error without trying Ollama
    - Half-open state: periodically test if Ollama recovered
    - Closed state: normal operation
    - Implement fallback: Return canned response or queue message

102. **How would you implement tracing and monitoring for Ollama calls?**
    - Add OpenTelemetry instrumentation
    - Trace request from frontend through backend to Ollama
    - Collect metrics: latency, error rate, token count
    - Export to Prometheus or similar
    - Alert on unusual patterns
    - Integration with observability platform (e.g., Datadog, New Relic)

---

## Error Handling & Validation

### Basic Questions

103. **What HTTP status codes does the application use and when?**
    - 200 OK: Successful GET, successful POST, streaming response
    - 201 Created: POST /chat/sessions, /auth/google
    - 400 Bad Request: Invalid ObjectId, validation error
    - 401 Unauthorized: Invalid/expired JWT token
    - 404 Not Found: Session/message/user not found
    - 429 Too Many Requests: Rate limit exceeded (if implemented)

104. **How is ObjectId validation handled?**
    - _oid() helper function converts string to ObjectId
    - Catches InvalidId exception
    - Raises HTTPException(400, "invalid id")
    - Applied to all string IDs in route parameters

105. **What Pydantic validation is applied to SendMessageRequest?**
    - content: Required string
    - min_length=1: Prevent empty messages
    - max_length=20000: Prevent extremely long inputs
    - Validation runs automatically before handler executes

106. **How are enum fields validated in FeedbackRequest?**
    - Correctness: Enum(correct, partially, incorrect)
    - LengthType: Enum(short, to_the_point, lengthy)
    - Pydantic validates against enum values
    - Invalid value returns validation error

107. **Explain error propagation in the streaming response.**
    - Exception caught in event_stream()
    - User message rolled back (deleted from DB)
    - Error event sent to client: {"error": "message"}
    - Frontend receives error event and shows toast
    - Temp messages removed from UI

### Intermediate Questions

108. **Design comprehensive error recovery for database operations.**
    - Implement retry logic with exponential backoff
    - Handle connection timeouts vs permanent failures differently
    - Implement connection pooling with health checks
    - Log detailed error context for debugging
    - Send alerts for repeated failures

109. **How would you handle MongoDB connection pool exhaustion?**
    - Monitor pool statistics
    - Implement graceful degradation: Queue requests if pool full
    - Return 503 Service Unavailable with Retry-After
    - Alert operations team
    - Implement circuit breaker for database
    - Increase pool size if consistently full

110. **Design validation for message content (prevent prompt injection).**
    - Sanitize message content before sending to Ollama
    - Check for suspicious patterns (e.g., "/system override")
    - Implement content filter for harmful requests
    - Log suspicious messages for review
    - Rate limit users with repeated suspicious inputs

111. **Implement comprehensive logging for debugging.**
    - Log all API requests with request ID
    - Log database query performance
    - Log Ollama call details (latency, token count)
    - Structured logging with context (user_id, session_id)
    - Different log levels: DEBUG, INFO, WARNING, ERROR
    - Centralized log aggregation (e.g., ELK stack)

### Advanced Questions

112. **Design a graceful degradation strategy during system overload.**
    - Monitor resource usage (CPU, memory, DB connections)
    - Under load: Queue chat requests, return 202 Accepted
    - Process queue in background with rate limiting
    - Prioritize: Quick operations (feedback) over slow (chat)
    - Fallback to simpler model or cached responses
    - Notify users of delays with accurate estimates

113. **Implement distributed tracing for multi-service architecture.**
    - Use OpenTelemetry for tracing
    - Propagate trace ID through FastAPI, Motor, httpx
    - Track latency breakdown (app, DB, Ollama)
    - Export to Jaeger or Zipkin
    - Implement alerting on high latency

114. **Design a system for handling partial failures in multi-step operations.**
    - Example: Send message creates user message, calls Ollama, inserts assistant message
    - Implement transaction semantics with rollback
    - Compensating transactions: Delete user message if Ollama fails
    - Idempotency: Ensure retries don't create duplicates
    - Status tracking: Message in "pending", "processing", "complete" states

---

## Performance & Optimization

### Basic Questions

115. **What is the N+1 query problem and does this application have it?**
    - N+1 occurs when fetching parent records (N) then fetching children (1 each)
    - Not present here: Sessions fetched once, messages fetched once per session
    - Could occur if listing messages then fetching feedback for each message
    - Fix: Fetch all feedback in single query, join in application

116. **How are database queries optimized with indexes?**
    - Index on (user_id, updated_at -1): Sorts sessions for list endpoint
    - Index on (session_id, ts): Retrieves messages in order
    - Indexes avoid full collection scans for common queries
    - MongoDB query planner chooses best index automatically
    - Monitor slow queries with profiler

117. **What caching strategies could improve performance?**
    - Cache feedback distribution chart (TTL 5 min)
    - Cache topic clustering results (TTL 10 min)
    - Cache user profile info (TTL 1 hour)
    - Cache Ollama model availability check (TTL 5 min)
    - Redis for distributed cache

118. **How does async/await improve performance?**
    - Multiple requests processed concurrently
    - While waiting for MongoDB/Ollama, other requests processed
    - Better resource utilization vs synchronous blocking
    - Motor enables async MongoDB operations
    - httpx enables async HTTP calls to Ollama

119. **What is connection pooling and why does this application use it?**
    - MongoDB connection pooling: Reuse connections instead of creating new
    - Reduces connection overhead for each request
    - Configured in motor AsyncIOMotorClient initialization
    - Default pool size: 10-50 connections
    - Prevents resource exhaustion under high load

### Intermediate Questions

120. **Design a caching layer for frequently accessed data.**
    - Session list: Cache with 2-minute TTL per user
    - Message list: Cache per session with 1-minute TTL
    - Feedback data: Cache per session with 1-minute TTL
    - Invalidate cache on write operations
    - Use Redis with key pattern: user:{user_id}:sessions

121. **How would you implement lazy loading for message lists?**
    - Return only last 50 messages initially
    - Pagination cursor: based on message timestamp
    - Load older messages when user scrolls up
    - Prevents loading 1000+ messages for old sessions
    - Improves initial page load performance

122. **Design database query optimization for analytics.**
    - Instead of Python aggregation, use MongoDB aggregation pipeline
    - $group stage: Aggregate ratings by value
    - $sort, $limit stages on server before sending to Python
    - Reduces data transfer and processing
    - Much faster for large datasets

123. **How would you optimize the topic clustering for large datasets?**
    - Currently: Loads all user's messages into memory for TF-IDF
    - Problem: Out of memory if user has 100k+ messages
    - Solution: Sample messages (every 10th message)
    - Or: Use incremental clustering (online KMeans)
    - Or: Cache clustering results, only cluster new messages

124. **Implement query result streaming for large message lists.**
    - Instead of fetching all messages at once
    - Stream results to client as they're retrieved
    - Backend sends chunked JSON array
    - Frontend renders messages incrementally
    - Improves perceived performance

### Advanced Questions

125. **Design a comprehensive performance monitoring system.**
    - Track endpoint latency (p50, p95, p99)
    - Monitor database query latency per operation
    - Track Ollama API latency and token generation rate
    - Alert if metrics exceed thresholds
    - Export to Prometheus, visualize in Grafana
    - Monthly performance reports

126. **Implement query optimization for complex analytics.**
    - Use MongoDB aggregation pipeline for all analytics
    - Pre-compute aggregates on scheduled intervals
    - Store pre-computed results in separate collection
    - Serve analytics from pre-computed collection
    - Refresh nightly or after significant data changes
    - Falls back to on-demand if real-time needed

127. **Design sharding strategy for scale-out to multiple servers.**
    - Shard by user_id: All user's data on same shard
    - Shard range: First 100k users on shard 1, etc.
    - Consistent hashing: Minimize remapping on scale-out
    - Handle cross-shard queries (analytics across all users)
    - Implement shard-aware routing in application

128. **Implement request batching to reduce database round-trips.**
    - Client batches multiple operations (delete 5 sessions)
    - Backend executes batch in single transaction
    - MongoDB bulk operations: bulkWrite()
    - Reduces latency vs individual requests
    - Requires API design change for batch endpoints

129. **Design resource pooling and connection management at scale.**
    - Monitor MongoDB connection pool: current vs max
    - Alert if pool consistently full (need to increase)
    - Implement connection timeout and graceful closure
    - Monitor httpx connection pooling to Ollama
    - Implement circuit breaker if Ollama unreachable
    - Consider multi-server setup with load balancer

130. **Implement adaptive timeout strategies based on load.**
    - Under normal load: 5-second response timeout
    - Under high load: 30-second response timeout
    - Timeout increases gradually as queue depth grows
    - Prevents cascading failures in overload scenarios
    - Return retry-after header with estimated wait time

---

## Miscellaneous Advanced Questions

131. **Design a compliance system for data privacy (GDPR, CCPA).**
    - Right to be forgotten: Delete all user data (hard delete)
    - Data portability: Export user's chats and feedback
    - Consent management: Track what user consented to
    - Data retention: Auto-delete after 90 days if inactive
    - Audit logs: Track all data access

132. **Implement user roles and permissions (admin, moderator, user).**
    - Add role field to users collection
    - Implement role-based access control middleware
    - Admin endpoints: Delete users, view all feedback
    - Moderator endpoints: Flag/review suspicious messages
    - User endpoints: Existing endpoints with user role check

133. **Design an A/B testing framework for Ollama models.**
    - Create experiment collection with version info
    - Assign users to control (model A) vs treatment (model B)
    - Track outcomes (ratings, correctness) per variant
    - Statistical significance testing (t-test, chi-square)
    - Implement winner selection and traffic migration

134. **How would you add email notifications?**
    - On new feature: Send email to users
    - On weekly digest: Summarize week's chats
    - On model update: Notify about improvements
    - Implement email queue (Celery, Bull)
    - Track unsubscribe preferences per user
    - Implement email template system

135. **Design a multi-user collaboration feature (shared sessions).**
    - Add collaborators list to sessions
    - Implement WebSocket for real-time collaboration
    - Show who's typing/viewing
    - Implement conflict resolution for simultaneous edits
    - Track who said what in the conversation
    - Implement permission levels (view-only, edit, admin)

---

## Conclusion

These questions cover the breadth and depth of the backend architecture. During a viva:
- **Basic questions** test understanding of architecture and basic functionality
- **Intermediate questions** test design decisions and real-world scenarios
- **Advanced questions** test system design, scalability, and production considerations

Interviewees should be able to:
1. Explain the overall system architecture and data flow
2. Design and implement new features
3. Identify and fix bugs
4. Consider scalability, security, and performance
5. Make trade-off decisions (consistency vs availability, etc.)

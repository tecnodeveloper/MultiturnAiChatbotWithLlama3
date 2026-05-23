---
name: llama3-chatbot-python
description: |
  Custom agent for Multi-Turn LLaMA 3 Chatbot project using OpenRouter API.
  Use when: building AI-powered chatbots, integrating OpenRouter API, creating Flask applications with LLM backends, implementing session management for conversations, or designing modern chat UIs.
type: general-purpose
applyTo: "**/*.{py,js,html,css}"
---

# LLaMA 3 Multi-Turn Chatbot Agent

## Overview

This custom agent is optimized for developing a complete multi-turn chatbot system using LLaMA 3 (via OpenRouter API) with a modern web interface. It combines Flask backend development, database design, and frontend engineering with AI/ML integration patterns.

## Scope & Capabilities

### What This Agent Handles

- **Flask Backend Development**
  - REST API design for chatbot operations
  - OpenRouter API integration and error handling
  - Session management and conversation routing

- **Database Architecture**
  - SQLite schema design for chats, sessions, and analytics
  - Data persistence and query optimization
  - Analytics data aggregation

- **Frontend Implementation**
  - HTML5/CSS3 modern UI design
  - Vanilla JavaScript for real-time chat
  - Message rendering and conversation management
  - Responsive design patterns

- **AI/LLM Integration**
  - OpenRouter API communication
  - Token management and cost optimization
  - Multi-turn conversation context handling
  - Response formatting and streaming

### What This Agent Does NOT Handle

- Docker containerization (use Docker docs directly)
- AWS/GCP deployment (use platform docs)
- Advanced ML model fine-tuning
- Kubernetes orchestration

## Project Structure

```
chatbot_project/
├── app.py                          # Flask backend + API routes
├── requirements.txt                # Python dependencies
├── README.md                       # User documentation
├── AGENT.md                        # This file
├── chatbot.db                      # SQLite database (auto-generated)
├── templates/
│   └── index.html                  # Jinja2 template
└── static/
    ├── css/
    │   └── style.css               # Modern dark theme styling
    └── js/
        └── script.js               # Client-side logic
```

## Key Decisions & Rationale

### Architecture Choices

| Component         | Choice           | Rationale                                                        |
| ----------------- | ---------------- | ---------------------------------------------------------------- |
| Backend Framework | Flask            | Lightweight, perfect for simple LLM API wrappers, easy to extend |
| Database          | SQLite           | Zero-configuration, file-based, sufficient for chat history      |
| Frontend          | Vanilla JS       | No build step needed, lightweight, responsive                    |
| API Client        | Requests         | Simple, synchronous, easy to debug                               |
| Styling           | CSS Grid/Flexbox | Modern layout, no CSS framework overhead                         |

### Design Patterns

1. **Session-Based Conversations**
   - UUID for session identification
   - Full message history sent with each request
   - Automatic title generation from first user message

2. **Stateless API Design**
   - Each API call contains full context
   - No server-side session state (stateless design)
   - Enables horizontal scaling

3. **Progressive Enhancement**
   - Works without JavaScript (basic functionality)
   - Enhanced UX with JS (real-time chat, animations)
   - Graceful degradation on older browsers

4. **Error Handling**
   - API errors displayed to user
   - Timeout protection (30s)
   - Failed requests don't corrupt session

## Configuration & Customization

### OpenRouter API Integration

Current setup in `app.py`:

```python
MODEL = "meta-llama/llama-3-8b-instruct"
OPENROUTER_API_KEY = "sk-or-v1-..."  # Pre-configured
OPENROUTER_URL = "https://openrouter.io/api/v1/chat/completions"
```

**To customize:**

- Change `MODEL` to different LLM (check OpenRouter docs)
- Adjust `temperature` (0-2) for creativity
- Adjust `max_tokens` for response length

### Database Customization

To add new analytics fields:

1. Update `init_db()` in `app.py` (ALTER TABLE)
2. Update analytics endpoints to fetch/store new fields
3. Update frontend to display new metrics

### UI Customization

CSS variables at top of `style.css`:

```css
:root {
  --primary-color: #3b82f6; /* Blue accent */
  --bg-dark: #0f172a; /* Dark background */
  --text-primary: #f1f5f9; /* Light text */
}
```

Change these for different color schemes.

## Common Development Tasks

### Adding a New API Endpoint

```python
@app.route('/api/new-feature', methods=['POST'])
def new_feature():
    data = request.json
    # Implementation
    return jsonify({"result": "success"})
```

### Modifying Message Format

Edit `addMessageToUI()` in `script.js`:

```javascript
function addMessageToUI(role, content) {
  // Modify message HTML structure here
}
```

### Adding Database Fields

1. Update schema in `init_db()`
2. Update INSERT statements
3. Update SELECT queries
4. Update frontend display logic

## Testing & Validation

### Manual Testing Checklist

- [ ] New session creates successfully
- [ ] Messages save to database
- [ ] OpenRouter API responds correctly
- [ ] Chat history loads from previous session
- [ ] Analytics metrics calculate accurately
- [ ] Feedback submission works
- [ ] UI is responsive on mobile (F12 DevTools)

### API Testing

Use curl or Postman:

```bash
# Create session
curl -X POST http://localhost:5000/api/session/new

# Send message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "...", "message": "Hello"}'
```

## Performance Considerations

1. **Database Indexing**: Consider adding indexes on `session_id` for large deployments
2. **API Rate Limiting**: OpenRouter has rate limits; implement local rate limiting if needed
3. **Message Caching**: Store frequently asked questions to reduce API calls
4. **UI Optimization**: Lazy-load chat history for old sessions

## Security Notes

### Current State (Development)

- API key hardcoded in source
- No user authentication
- No input validation/sanitization
- No HTTPS

### Production Improvements Needed

- Move API key to environment variables
- Add user authentication (OAuth/JWT)
- Validate/sanitize user input
- Implement rate limiting
- Add HTTPS/TLS
- Implement CORS properly
- Add request signing for API calls

## Dependencies & Versions

```
flask==2.3.3           # Web framework
flask-cors==4.0.0      # CORS support
requests==2.31.0       # HTTP client
```

No version pinning beyond major.minor for flexibility. Test with latest patch versions.

## Maintenance & Monitoring

### Important Files to Monitor

- `chatbot.db` - Database file size (archive/cleanup old sessions)
- Server logs - Monitor OpenRouter API errors
- Browser console - Check JavaScript errors

### Regular Tasks

- Backup `chatbot.db` daily (for production)
- Monitor OpenRouter API usage/costs
- Review feedback submissions
- Cleanup old sessions (>30 days)

## Known Limitations & Future Work

### Current Limitations

- Context window limited to ~4000 tokens
- No streaming responses (full response waits)
- No user authentication
- No conversation export

### Future Enhancement Ideas

1. **Streaming Responses**: Use Server-Sent Events (SSE) for real-time streaming
2. **Advanced Analytics**: Add graphs using Chart.js
3. **Multi-Model Support**: Add dropdown to switch between LLM models
4. **Conversation Export**: Add PDF/Markdown export
5. **Voice Support**: Integrate speech recognition API

## Troubleshooting Guide

### Problem: Module not found error

```
Solution: pip install -r requirements.txt
```

### Problem: OpenRouter 401 error

```
Solution: Verify API key in app.py matches your OpenRouter account
```

### Problem: Port already in use

```
Solution: Change port in app.py or kill existing process
```

### Problem: Database locked error

```
Solution: Close all app instances and delete chatbot.db
```

## Resources & References

- **OpenRouter**: https://openrouter.io
- **LLaMA 3 Docs**: https://llama.meta.com/
- **Flask Docs**: https://flask.palletsprojects.com/
- **SQLite Docs**: https://www.sqlite.org/docs.html

## Agent Usage Guidelines

This agent is optimized for:
✅ Building chat interfaces  
✅ Integrating OpenRouter API  
✅ Database schema design  
✅ Flask backend development  
✅ Frontend JavaScript logic  
✅ Debugging API issues

Use a different agent for:
❌ System administration  
❌ DevOps/Infrastructure  
❌ Mobile app development  
❌ Complex ML model development

---

**Last Updated**: 2026-05-22  
**Version**: 1.0  
**Author**: Copilot  
**Status**: Production Ready

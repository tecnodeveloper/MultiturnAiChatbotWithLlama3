# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the App

```bash
python app.py
```

### Step 3: Open Browser

Go to: **http://localhost:5000**

## 📁 File Overview

| File                   | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `app.py`               | Flask backend with OpenRouter API integration |
| `templates/index.html` | Main chat interface                           |
| `static/css/style.css` | Modern dark theme UI                          |
| `static/js/script.js`  | Chat logic and messaging                      |
| `requirements.txt`     | Python dependencies                           |
| `README.md`            | Full documentation                            |
| `AGENT.md`             | Agent configuration & development guide       |
| `chatbot.db`           | SQLite database (auto-created)                |

## 🔑 API Key

Set your GROQ_API_KEY environment variable before running:

```powershell
$env:GROQ_API_KEY = "your_key_here"
```

## 💡 Key Features

✅ Multi-turn conversations  
✅ Session management  
✅ Chat history  
✅ Analytics dashboard  
✅ Modern dark UI  
✅ Real-time typing indicators

## 🛠️ Troubleshooting

**Port already in use?**

```python
# In app.py, line 99, change port:
app.run(debug=True, port=5001)
```

**API key expired?**

```python
# Update in app.py, line 16:
OPENROUTER_API_KEY = "your-new-key"
```

## 📊 What's Stored

- All chats saved to `chatbot.db`
- Sessions auto-created with unique IDs
- Messages stored with timestamps
- Feedback tracked for improvement

## 🎯 Next Steps

1. Read full `README.md` for detailed docs
2. Check `AGENT.md` for development patterns
3. Customize colors in `static/css/style.css`
4. Modify model in `app.py` (line 18)

---

**Ready?** Run `python app.py` and start chatting! 🤖

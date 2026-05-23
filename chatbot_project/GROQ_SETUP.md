# Groq API Setup Guide

Your chatbot has been updated to use **Groq API** instead of OpenRouter for faster, more reliable LLaMA 3 inference.

## ✅ What Changed

- **Backend**: Now uses Groq SDK (`from groq import Groq`)
- **Model**: `llama-3.3-70b-versatile` (faster and more capable)
- **API Key**: Set via environment variable `GROQ_API_KEY`

## 🔧 Setup Instructions

### Step 1: Fix Windows Python Path Issue

Windows is blocking direct Python access. Disable the app execution alias:

1. **Open Settings** → Search "App execution aliases"
2. **Turn OFF** these two toggles:
   - ☐ `python.exe`
   - ☐ `python3.exe`
3. Click **Apply** and close Settings

### Step 2: Verify Python Works

Open PowerShell and run:

```powershell
python --version
```

You should see: `Python 3.8+` (or similar)

### Step 3: Install Groq Library

```powershell
cd f:\Phase1\chatbot_project
python -m pip install groq
```

### Step 4: Set Environment Variable (Optional but Recommended)

**Why?** Keeps your API key secure and out of source code.

#### Option A: Temporary (Current Session Only)

```powershell
$env:GROQ_API_KEY = "your_groq_api_key_here"
```

#### Option B: Permanent (Windows Environment)

1. **Win + X** → "Environment Variables"
2. Click **"New"** under User variables
   - Variable name: `GROQ_API_KEY`
   - Variable value: `your_groq_api_key_here`
3. Click **OK** twice
4. **Restart PowerShell** for changes to take effect

### Step 5: Run the Chatbot

```powershell
cd f:\Phase1\chatbot_project
python app.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Step 6: Open in Browser

**Go to:** http://localhost:5000

Start chatting! The first message should respond with Groq's fast LLaMA 3 inference.

---

## 🐛 Troubleshooting

### "No module named groq"

```powershell
python -m pip install --upgrade groq
```

### "API Error" in chat

- Verify your API key is correct
- Check Groq API status: https://console.groq.com/keys
- Ensure your key has API calls remaining (check usage at console)

### "python not found"

⚠️ Windows app execution alias is blocking Python. Follow **Step 1** above.

### "Connection refused"

- Flask isn't running. Run `python app.py` in PowerShell
- Or port 5000 is in use. Change line 99 in `app.py` from `port=5000` to `port=5001`

### "SSL Certificate Error"

Update certificates:

```powershell
python -m pip install --upgrade certifi
```

---

## 📊 Performance Comparison

| Feature       | Groq                 | OpenRouter       |
| ------------- | -------------------- | ---------------- |
| **Speed**     | ⚡⚡⚡ Ultra-fast    | ⚡⚡ Fast        |
| **Cost**      | Free tier available  | Pay-as-you-go    |
| **Model**     | LLaMA 3.3 70B        | LLaMA 3 8B       |
| **Inference** | Specialized hardware | General API      |
| **Setup**     | Easier               | Requires billing |

---

## 🔐 Security Notes

**DO NOT** commit your API key to Git! The `.gitignore` is set up to exclude:

- `*.env`
- `.venv/`
- `__pycache__/`

### For Production Deployment

Create a `.env` file (not committed to Git):

```
GROQ_API_KEY=your_key_here
```

Then load it in `app.py`:

```python
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
```

Install python-dotenv:

```powershell
pip install python-dotenv
```

---

## 📚 Useful Links

- **Groq Console**: https://console.groq.com/
- **API Documentation**: https://console.groq.com/docs
- **Model Card (LLaMA 3.3)**: https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
- **Python Groq SDK**: https://pypi.org/project/groq/

---

## ✨ Next Steps

1. ✅ Fix Windows Python issue
2. ✅ Install Groq library
3. ✅ Set API key environment variable
4. ✅ Run `python app.py`
5. ✅ Chat at http://localhost:5000

**Questions?** Check the troubleshooting section above or review `app.py` for API integration details.

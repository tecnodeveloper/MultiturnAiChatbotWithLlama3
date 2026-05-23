# ⚠️ Windows Python Issue - SOLUTION

Your system has Python installed, but **Windows is blocking direct access** through app execution aliases. This is a common issue on Windows 10/11 when Python is installed from Microsoft Store.

---

## 🔴 Problem

When you run Python commands, you get:

```
PPython was not found; run without arguments to install from the Microsoft Store
```

This happens because:

- Windows intercepts `python` and `python3` commands
- Redirects them to Microsoft Store installer instead of your Python installation
- This blocks the actual Python from running

---

## ✅ Solution (2 minutes)

### Step 1: Disable App Execution Aliases

**Windows 10/11:**

1. Press **Win + I** to open Settings
2. Search for: **"app execution aliases"**
3. Click "Manage app execution aliases"
4. **Turn OFF** these two toggles:
   - ☐ `python.exe`
   - ☐ `python3.exe`
5. Close Settings

### Step 2: Verify Fix

Open **PowerShell** (as regular user, not admin) and run:

```powershell
python --version
```

You should see something like:

```
Python 3.11.0
```

If you see an error, your real Python path is different. Run:

```powershell
where.exe python
```

This shows you the real path. If it points to `\WindowsApps\`, the toggle didn't work.

---

## ✨ Now Run Your Chatbot

Once Python works, simply run:

### Option A: Using Batch Script (Easiest)

```
Double-click: run-groq.bat
```

### Option B: Manual (PowerShell)

```powershell
cd f:\Phase1\chatbot_project
python -m pip install groq
python app.py
```

Then open: **http://localhost:5000**

---

## 🔧 If It Still Doesn't Work

**Check your actual Python installation:**

```powershell
# Find real Python
Get-Command python | Select-Object Source
Get-Command python3 | Select-Object Source

# Or check common locations
Test-Path "C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python311\python.exe"
```

**If you have an actual Python installation** (not the Windows Store shortcut):

Use the full path directly:

```powershell
cd f:\Phase1\chatbot_project
C:\Users\rdev\AppData\Local\Programs\Python\Python311\python.exe -m pip install groq
C:\Users\rdev\AppData\Local\Programs\Python\Python311\python.exe app.py
```

_(Replace `Python311` with your actual version)_

---

## 📋 Quick Checklist

- [ ] Disabled `python.exe` app execution alias
- [ ] Disabled `python3.exe` app execution alias
- [ ] Restarted PowerShell/Command Prompt
- [ ] Verified: `python --version` works
- [ ] Installed Groq: `python -m pip install groq`
- [ ] Ran app: `python app.py`
- [ ] Opened: `http://localhost:5000`
- [ ] ✨ Chatbot works!

---

## 🎯 Final Command (Once Fixed)

Simply run this every time you want to start the chatbot:

```powershell
cd f:\Phase1\chatbot_project
python app.py
```

Or use the batch file: `run-groq.bat`

---

**Still stuck?** Make sure you:

1. ✓ Actually disabled both toggles (not just unchecked)
2. ✓ Restarted your PowerShell/Command Prompt window
3. ✓ Don't have a conflicting Python installation blocking the path

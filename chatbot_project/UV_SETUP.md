# UV Package Manager Setup Guide for Windows

## 🚀 Install UV on Windows

UV is a blazingly fast Python package installer written in Rust. Much faster than pip!

### Option 1: PowerShell (Recommended)

```powershell
powershell -ExecutionPolicy BypassProcess -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Option 2: Using pip

```powershell
pip install uv
```

### Option 3: Using Cargo (if you have Rust)

```powershell
cargo install uv
```

### Option 4: Download from GitHub

Visit: https://github.com/astral-sh/uv/releases
Download the Windows executable and add to PATH

## ✅ Verify Installation

```powershell
uv --version
```

Should show something like: `uv 0.1.XX`

## 🚀 Run Your Chatbot Project with UV

### Step 1: Navigate to Project

```powershell
cd f:\Phase1\chatbot_project
```

### Step 2: Create Virtual Environment (Optional but Recommended)

```powershell
uv venv
```

Then activate it:

```powershell
# On Windows
.venv\Scripts\activate

# After activation, your terminal will show (.venv)
```

### Step 3: Install Dependencies Using UV

```powershell
# Install from requirements.txt
uv pip install -r requirements.txt

# OR install from pyproject.toml (faster)
uv pip sync
```

### Step 4: Run Your Application

```powershell
python app.py
```

### Step 5: Open Browser

```
http://localhost:5000
```

## 📦 Common UV Commands

```powershell
# Install packages
uv pip install flask

# Sync dependencies from pyproject.toml
uv pip sync

# Compile lock file
uv pip compile requirements.txt -o requirements.lock

# Show installed packages
uv pip list

# Show package info
uv pip show flask

# Remove virtual environment
uv venv --remove

# Create venv with specific Python version
uv venv --python 3.11
```

## ⚡ UV vs pip Performance

UV is **10-100x faster** than pip! Typical comparisons:

| Task                  | pip          | uv         |
| --------------------- | ------------ | ---------- |
| Install 1000 packages | 10-30 min    | 10-30 sec  |
| Dependency resolution | Often hangs  | Instant    |
| Lock file creation    | Not built-in | Ultra-fast |
| Cold cache install    | Very slow    | Very fast  |

## 🔒 Using Lock Files (Recommended for Production)

### Create lock file:

```powershell
uv pip compile requirements.txt -o requirements.lock
```

### Use lock file (faster, deterministic):

```powershell
uv pip sync requirements.lock
```

### Update lock file:

```powershell
uv pip compile --upgrade requirements.txt -o requirements.lock
```

## 📁 Project Structure with UV

```
chatbot_project/
├── app.py
├── pyproject.toml          ← New! Project metadata
├── requirements.txt        ← Kept for compatibility
├── requirements.lock       ← Optional: for deterministic installs
├── .venv/                  ← Virtual environment (created by uv venv)
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── README.md, AGENT.md, etc.
```

## 🔧 Troubleshooting UV

### Issue: "uv: command not found"

**Solution**: Add UV to PATH or reinstall using PowerShell method

### Issue: "Permission denied" on PowerShell

**Solution**: Change execution policy temporarily:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Issue: Virtual environment not activating

**Solution**: Use absolute path:

```powershell
& ".\\.venv\Scripts\Activate.ps1"
```

### Issue: Different Python versions

**Solution**: Specify version:

```powershell
uv venv --python 3.11
```

## 💡 Pro Tips

1. **Always use virtual environments**: `uv venv`
2. **Use lock files for consistency**: `uv pip compile` → `uv pip sync`
3. **Check pip compatibility**: `uv pip list` shows all installed packages
4. **Parallel downloads**: UV downloads packages in parallel (faster!)
5. **Smart caching**: UV caches packages locally (even faster next time!)

## 🎯 Recommended Workflow

```powershell
# Initial setup
cd f:\Phase1\chatbot_project
uv venv
.\.venv\Scripts\activate
uv pip install -r requirements.txt

# Or better: create requirements.lock
uv pip compile requirements.txt -o requirements.lock
uv pip sync requirements.lock

# Run your app
python app.py
```

## 📚 UV Documentation

- Official Docs: https://docs.astral.sh/uv/
- GitHub: https://github.com/astral-sh/uv
- Quick Start: https://docs.astral.sh/uv/getting-started/

## ✨ Key Advantages of UV

✅ **10-100x faster** than pip  
✅ **Built-in lock files** for reproducibility  
✅ **Parallel downloads** of dependencies  
✅ **Excellent dependency resolution**  
✅ **Standalone executable** (no Python needed to run!)  
✅ **Works with all Python projects**  
✅ **pip-compatible** (drop-in replacement)  
✅ **Active development** and community support

---

**Ready?** Run `uv --version` to get started! 🚀

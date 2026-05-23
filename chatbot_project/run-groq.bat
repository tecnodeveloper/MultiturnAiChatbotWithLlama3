@echo off
REM Groq Chatbot Launcher for Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║  Groq LLaMA 3 Chatbot - Launcher       ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Python is available
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python not found!
    echo.
    echo Solution:
    echo 1. Open Settings ^> App execution aliases
    echo 2. Turn OFF python.exe and python3.exe
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo ✓ Python found
python --version

REM Install Groq if not already installed
echo.
echo Checking Groq library...
python -m pip show groq >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Groq...
    python -m pip install groq --quiet
    echo ✓ Groq installed
) else (
    echo ✓ Groq already installed
)

REM Set API key (replace with your actual key)
echo.
echo Setting Groq API key...
echo Enter your GROQ_API_KEY as environment variable before running
REM set GROQ_API_KEY=your_key_here

REM Run Flask app
echo.
echo ✓ Starting chatbot...
echo.
echo 🌐 Open your browser: http://localhost:5000
echo.
python app.py

pause

@echo off
REM Multi-Turn LLaMA 3 Chatbot - UV Setup Script for Windows
REM This script sets up the project using uv package manager

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  LLaMA 3 Chatbot - UV Setup Script for Windows            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if uv is installed
uv --version >nul 2>&1
if errorlevel 1 (
    echo ❌ UV is not installed
    echo.
    echo Installing UV...
    powershell -ExecutionPolicy BypassProcess -c "irm https://astral.sh/uv/install.ps1 | iex"
    echo.
    echo Please restart PowerShell and run this script again!
    pause
    exit /b 1
)

echo ✅ UV found: 
uv --version
echo.

REM Create virtual environment
echo Creating virtual environment...
uv venv
echo ✅ Virtual environment created
echo.

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat
echo ✅ Virtual environment activated
echo.

REM Install dependencies using uv
echo Installing dependencies with UV (this is fast!)...
uv pip install -r requirements.txt
echo ✅ Dependencies installed
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              🎉 Setup Complete!                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo   1. python app.py
echo   2. Open http://localhost:5000
echo.
echo Virtual environment: .venv\Scripts\activate.bat
echo.
pause

# Multi-Turn LLaMA 3 Chatbot - UV Setup Script for Windows PowerShell
# This script automates the setup using uv package manager

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  LLaMA 3 Chatbot - UV Setup Script (PowerShell)           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if uv is installed
try {
    $uvVersion = uv --version 2>&1
    Write-Host "✅ UV found: $uvVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ UV is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing UV..." -ForegroundColor Yellow
    powershell -ExecutionPolicy BypassProcess -c "irm https://astral.sh/uv/install.ps1 | iex"
    Write-Host ""
    Write-Host "⚠️ Please restart PowerShell and run this script again!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
uv venv
Write-Host "✅ Virtual environment created" -ForegroundColor Green
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"
Write-Host "✅ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Install dependencies using uv
Write-Host "Installing dependencies with UV (this is fast!)..." -ForegroundColor Yellow
uv pip install -r requirements.txt
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              🎉 Setup Complete!                           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. python app.py" -ForegroundColor White
Write-Host "   2. Open http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Virtual environment is already activated!" -ForegroundColor Green
Write-Host ""
Write-Host "To deactivate later, type: deactivate" -ForegroundColor Gray
Write-Host ""

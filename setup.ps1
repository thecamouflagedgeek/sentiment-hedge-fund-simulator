# Quick Start Script for Windows PowerShell
# This script sets up and starts both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sentiment Hedge Fund Simulator - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Backend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to backend
Push-Location backend

# Create virtual environment if it doesn't exist
if (-Not (Test-Path venv)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Check for .env file
if (-Not (Test-Path .env.local)) {
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "⚠ Please update .env.local with your database credentials!" -ForegroundColor Yellow
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to frontend
Push-Location frontend/hedgefundsim

# Install npm dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

# Check for .env.local file
if (-Not (Test-Path .env.local)) {
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env.local with your database credentials" -ForegroundColor White
Write-Host "2. Open Terminal 1 and run: cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000" -ForegroundColor White
Write-Host "3. Open Terminal 2 and run: cd frontend/hedgefundsim; npm run dev" -ForegroundColor White
Write-Host "4. Open browser to http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Backend API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan

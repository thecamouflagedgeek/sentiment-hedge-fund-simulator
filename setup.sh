#!/bin/bash
# Quick Start Script for macOS/Linux
# This script sets up and starts both backend and frontend

echo "========================================"
echo "Sentiment Hedge Fund Simulator - Setup"
echo "========================================"
echo ""

# Check Python installation
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo "✓ Python found: $python_version"
else
    echo "✗ Python not found! Please install Python 3.8+"
    exit 1
fi

# Check Node.js installation
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✓ Node.js found: $node_version"
else
    echo "✗ Node.js not found! Please install Node.js 18+"
    exit 1
fi

echo ""
echo "========================================"
echo "Setting up Backend..."
echo "========================================"

# Navigate to backend
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠ Please update .env.local with your database credentials!"
fi

cd ..

echo ""
echo "========================================"
echo "Setting up Frontend..."
echo "========================================"

# Navigate to frontend
cd frontend/hedgefundsim

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Check for .env.local file
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
fi

cd ../..

echo ""
echo "========================================"
echo "Setup Complete! ✓"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Update backend/.env.local with your database credentials"
echo "2. Open Terminal 1 and run: cd backend; source venv/bin/activate; uvicorn main:app --reload --port 8000"
echo "3. Open Terminal 2 and run: cd frontend/hedgefundsim; npm run dev"
echo "4. Open browser to http://localhost:3000"
echo ""
echo "Backend API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"

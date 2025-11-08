#!/bin/bash

# ResuBlocks Backend Startup Script

echo "🚀 Starting ResuBlocks Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Start the server
echo "🌟 Starting FastAPI server on http://localhost:5001"
echo "📖 API docs available at http://localhost:5001/docs"
echo ""
cd api
python main.py


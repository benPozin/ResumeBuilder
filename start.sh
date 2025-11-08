#!/bin/bash

# Resume Builder - Quick Start Script
# This script starts both the Flask backend and Next.js frontend

echo "🚀 Starting Resume Builder..."
echo ""

# Check if Python dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "❌ Flask not found. Installing Python dependencies..."
    python3 -m pip install -r requirements.txt
fi

# Check if Node dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Node modules not found. Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "✅ Dependencies installed"
echo ""
echo "📝 Starting Flask backend on http://localhost:5000"
python3 app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

echo "⚛️  Starting Next.js frontend on http://localhost:3000"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are running!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

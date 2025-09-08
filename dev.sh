#!/bin/bash

echo "🌟 Starting FastAPI + React Development Servers"
echo "==============================================="

# Check if dependencies are installed
if [ ! -d "frontend-react/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend-react
    npm install
    cd ..
fi

echo ""
echo "Starting development servers..."
echo "🔧 Backend will be available at: http://localhost:8000"
echo "📱 Frontend will be available at: http://localhost:5173"
echo "📚 API Docs will be available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up signal handler
trap cleanup SIGINT SIGTERM

# Start backend server
echo "Starting backend server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend-react
npm run dev &

# Wait for both processes
wait

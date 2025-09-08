@echo off
chcp 65001 >nul
echo Starting FastAPI + React Development Servers
echo ===============================================

echo Installing dependencies if needed...
if not exist "frontend-react\node_modules" (
    echo Installing frontend dependencies...
    cd frontend-react
    npm install
    cd ..
)

echo.
echo Starting development servers...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo API Docs will be available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop both servers
echo.

start /B "Backend" cmd /c "uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
timeout /t 3 >nul
start /B "Frontend" cmd /c "cd frontend-react && npm run dev"

echo Both servers are starting...
echo You can now open your browser to:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000
echo.
pause

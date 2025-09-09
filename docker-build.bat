@echo off
echo 🐳 Building Document Digitizer Docker Image
echo ========================================

echo Building Docker image...
docker build -t document-digitizer:latest .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker image built successfully!
    echo.
    echo To run the container:
    echo   docker run -p 8000:8000 document-digitizer:latest
    echo.
    echo The application will be available at:
    echo   http://localhost:8000
) else (
    echo ❌ Docker build failed!
    exit /b 1
)

pause

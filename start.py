#!/usr/bin/env python3
"""
Simple start script for FastAPI + React application
"""
import sys
import subprocess
import os

def main():
    """Simple start command"""
    if len(sys.argv) > 1 and sys.argv[1] == "prod":
        # Production mode
        print("🚀 Starting production server...")
        print("📍 Building frontend first...")
        
        # Build frontend
        result = subprocess.run(["npm", "run", "build"], cwd="frontend-react", capture_output=True)
        if result.returncode != 0:
            print("❌ Frontend build failed!")
            print(result.stderr.decode())
            sys.exit(1)
        
        print("✅ Frontend built successfully!")
        print("🚀 Starting FastAPI server...")
        os.system("uvicorn app.main:app --host 0.0.0.0 --port 8000")
    
    else:
        # Development mode
        print("🌟 FastAPI + React Development Mode")
        print("====================================")
        print("📱 Frontend: http://localhost:5173")
        print("🔧 Backend: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        print()
        print("💡 This will start the backend server.")
        print("💡 Open another terminal and run: cd frontend-react && npm run dev")
        print()
        print("🚀 Starting FastAPI development server...")
        os.system("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Build script for document digitizer application
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and handle errors"""
    try:
        result = subprocess.run(command, shell=True, check=True, cwd=cwd, capture_output=True, text=True)
        print(f"✓ {command}")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {command}")
        print(f"Error: {e.stderr}")
        return False

def build_frontend():
    """Build the React frontend"""
    print("Building React frontend...")
    
    # Check if frontend directory exists
    if not Path("frontend-react").exists():
        print("Error: frontend-react directory not found")
        return False
    
    # Install dependencies if node_modules doesn't exist
    if not Path("frontend-react/node_modules").exists():
        print("Installing frontend dependencies...")
        if not run_command("npm install", cwd="frontend-react"):
            return False
    
    # Build the frontend
    print("Building frontend...")
    if not run_command("npm run build", cwd="frontend-react"):
        return False
    
    print("✓ Frontend build completed successfully!")
    return True

def dev_mode():
    """Start development servers"""
    print("Starting development mode...")
    print("This will start both backend and frontend dev servers")
    print("\nBackend will be available at: http://localhost:8000")
    print("Frontend will be available at: http://localhost:5173")
    print("\nPress Ctrl+C to stop both servers\n")
    
    import threading
    import time
    
    def start_backend():
        os.system("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    
    def start_frontend():
        time.sleep(2)  # Wait a bit for backend to start
        os.system("cd frontend-react && npm run dev")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Start frontend
    start_frontend()

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python build.py build    - Build for production")
        print("  python build.py dev      - Start development servers")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "build":
        if build_frontend():
            print("\n🎉 Build completed successfully!")
            print("\nTo run the application:")
            print("  uvicorn app.main:app --host 0.0.0.0 --port 8000")
        else:
            print("\n❌ Build failed!")
            sys.exit(1)
    
    elif command == "dev":
        dev_mode()
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Run script for document digitizer application
Starts both backend and frontend development servers
"""

import os
import sys
import subprocess
import threading
import time
import signal
from pathlib import Path
from importlib.util import find_spec

# Global variable to track running processes
processes = []


def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n🛑 Shutting down servers...")
    for process in processes[:]:
        try:
            process.terminate()
        except Exception as e:
            print(f"❌ Failed to terminate {process.name}: {e}")
            processes.remove(process)
    sys.exit(0)


def run_command_async(command, cwd=None, name="Process"):
    """Run a command asynchronously and return the process"""
    try:
        print(f"🚀 Starting {name}...")

        # Set environment to handle Unicode properly
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"

        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1,
            env=env,
            encoding="utf-8",
            errors="replace",  # Replace problematic characters
        )
        processes.append(process)

        # Print output in real-time with character filtering
        def print_output():
            for line in iter(process.stdout.readline, ""):
                if line.strip():
                    # Clean up Unicode characters that don't display well
                    clean_line = (
                        line.strip().replace("➜", "=>")
                        # .replace('⚡', '*')
                        # .replace('🔥', '*')
                        # .replace('✨', '*')
                        # .replace('⌥', 'Alt')
                        # .replace('⇧', 'Shift')
                    )
                    print(f"[{name}] {clean_line}")

        output_thread = threading.Thread(target=print_output)
        output_thread.daemon = True
        output_thread.start()

        return process
    except Exception as e:
        print(f"❌ Failed to start {name}: {e}")
        return None


def check_dependencies():
    """Check if required dependencies are installed"""
    errors = []

    # Check Python dependencies (from requirements.txt)
    modules = {
        "fastapi": "fastapi",
        "uvicorn": "uvicorn",
        "python-multipart": "python_multipart",
        "pydantic": "pydantic",
        "pydantic-settings": "pydantic_settings",
        "Jinja2": "jinja2",
        "httpx": "httpx",
        "openai": "openai",
    }

    for pkg, mod in modules.items():
        if find_spec(mod) is None:
            errors.append(f"Missing Python dependency: {pkg}")

    # Check if frontend dependencies are installed
    if not Path("frontend-react/node_modules").exists():
        errors.append(
            "Frontend dependencies not installed. Run: cd frontend-react && npm install"
        )

    if errors:
        print("❌ Dependencies missing:")
        for error in errors:
            print(f"  - {error}")
        return False

    return True


def main():
    """Main function"""
    print("🌟 Development Server")
    print("=" * 50)

    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)

    # Check dependencies
    if not check_dependencies():
        print("\n💡 To install dependencies:")
        print("Backend: pip install -r requirements.txt")
        print("Frontend: cd frontend-react && npm install")
        sys.exit(1)

    print("✅ Dependencies OK")
    print()

    # Try to start backend server on different ports if needed
    backend_ports = [8000, 8001, 8002, 8080]
    backend_process = None

    for port in backend_ports:
        try:
            print(f"🔧 Trying to start backend on port {port}...")
            backend_process = run_command_async(
                f"uvicorn app.main:app --reload --host 127.0.0.1 --port {port}",
                name="Backend",
            )
            if backend_process:
                print(f"✅ Backend started on port {port}")
                backend_port = port
                break
        except Exception as e:
            print(f"❌ Port {port} failed: {e}")
            continue

    if not backend_process:
        print("❌ Failed to start backend server on any port")
        sys.exit(1)

    # Wait a moment for backend to start
    time.sleep(3)

    # Start frontend development server
    frontend_process = run_command_async(
        "npm run dev", cwd="frontend-react", name="Frontend (React)"
    )

    if not frontend_process:
        print("❌ Failed to start frontend server")
        backend_process.terminate()
        sys.exit(1)

    print()
    print("🎉 Both servers are starting!")
    print("📱 Frontend (Vite): http://localhost:5173")
    print(f"🔧 Backend: http://localhost:{backend_port}")
    print(f"📚 API Docs: http://localhost:{backend_port}/docs")
    print()
    print("💡 The frontend will proxy API calls to the backend")
    if backend_port != 8000:
        print(f"⚠️  Backend is running on port {backend_port} instead of 8000")
        print("💡 You may need to update the frontend proxy settings")
    print("🛑 Press Ctrl+C to stop both servers")
    print()

    # Wait for processes to finish
    try:
        while True:
            # Check if processes are still running
            for process in processes[:]:  # Create a copy to iterate safely
                if process.poll() is not None:
                    processes.remove(process)
                    print("⚠️ A process has stopped unexpectedly")

            if not processes:
                print("❌ All processes have stopped")
                break

            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(None, None)


if __name__ == "__main__":
    main()

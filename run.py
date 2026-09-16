#!/usr/bin/env python3
"""
NeuroTriage AI — Unified Single-Command Runner
Launches both the FastAPI backend (port 8000) and Next.js frontend (port 3000) in parallel.
"""

import os
import sys
import subprocess
import time
import signal

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("\n" + "=" * 60)
    print("  NeuroTriage AI — Explainable Multimodal Alzheimer's Triage")
    print("  Starting unified backend (port 8000) and frontend (port 3000)...")
    print("=" * 60 + "\n")

    # 1. Start FastAPI backend
    backend_cmd = [
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--app-dir", "backend",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ]
    print("[BACKEND] Launching FastAPI on http://127.0.0.1:8000...")
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    # Allow backend a moment to start
    time.sleep(1.5)

    # 2. Start Next.js frontend
    # Use npm on Windows / Unix
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]
    print("[FRONTEND] Launching Next.js on http://localhost:3000...")
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n" + "-" * 60)
    print("  ✓ Application ready at: http://localhost:3000")
    print("  ✓ API Docs available at: http://localhost:8000/docs")
    print("  Press Ctrl+C to stop both servers.")
    print("-" * 60 + "\n")

    def signal_handler(sig, frame):
        print("\nStopping NeuroTriage AI servers...")
        try:
            backend_proc.terminate()
        except Exception:
            pass
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()

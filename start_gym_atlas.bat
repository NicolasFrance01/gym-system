@echo off
title Gym-Atlas Auto-Starter
echo Starting Gym-Atlas Ecosystem...

:: Kill existing processes to avoid port conflicts
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

:: Start Backend (Camera API)
echo [1/2] Starting Backend...
start "GYM-BACKEND" echo 1. Iniciar App de Escritorio (Control de Acceso)
start cmd /k "cd backend && .\venv\Scripts\activate && python desktop_kiosk.py"

echo 2. Iniciar Backend API (Para Dashboard en la Nube)
start cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000"

echo --------------------------------------------------
echo Gym-Atlas Desktop is running!
echo Use the Desktop Window for Access Control.
echo Use Vercel for Admin/User Dashboard.
echo --------------------------------------------------
echo.
timeout /t 10

@echo off
title Gym-Atlas Auto-Starter
echo Starting Gym-Atlas Ecosystem...

:: Kill existing processes to avoid port conflicts
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

:: Start Backend (Camera API)
echo [1/2] Starting Backend...
start "GYM-BACKEND" cmd /k "cd backend && set LOCAL_CAMERA=true && .\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: Start Frontend (Kiosk)
echo [2/2] Starting Frontend...
start "GYM-FRONTEND" cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================
echo Gym-Atlas is running!
echo LOCAL Kiosk: http://localhost:5173
echo CLOUD Admin: https://gym-system-sigma.vercel.app/admin
echo CLOUD User App: https://gym-system-sigma.vercel.app/app
echo ==================================================
echo.
timeout /t 10

@echo off
title Gym-Atlas Auto-Starter
echo Starting Gym-Atlas Ecosystem...

:: Kill existing processes to avoid port conflicts
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

:: Install/Update dependencies
echo [1/3] Updating libraries...
cd backend && .\venv\Scripts\python.exe -m pip install -r requirements.txt && cd ..

echo [2/3] Iniciar App de Escritorio (Control de Acceso)
start "GYM-KIOSK" cmd /k "cd backend && set LOCAL_CAMERA=true && .\venv\Scripts\python.exe desktop_kiosk.py"

echo [3/3] Iniciar Backend API (Para Dashboard en la Nube)
start "GYM-API" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000"

echo --------------------------------------------------
echo Gym-Atlas Desktop is running!
echo --------------------------------------------------
echo.
timeout /t 10

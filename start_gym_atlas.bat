@echo off
title Gym-Atlas Auto-Starter
echo Starting Gym-Atlas Ecosystem...

:: Start Backend
start /d "backend" cmd /c ".\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: Start Frontend
start /d "frontend" cmd /c "npm run dev"

echo.
echo Gym-Atlas is running!
echo Kiosk: http://localhost:5173
echo Admin: http://localhost:5173/admin
echo User App: http://localhost:5173/app
echo.
pause

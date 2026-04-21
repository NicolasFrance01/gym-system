@echo off
title Gym-Atlas Auto-Starter
echo Starting Gym-Atlas Ecosystem...

:: Start Backend
start /d "backend" cmd /c "set LOCAL_CAMERA=true && .\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: Start Frontend
start /d "frontend" cmd /c "npm run dev"

echo.
echo Gym-Atlas is running!
echo Kiosk: https://gym-system-sigma.vercel.app/
echo Admin: https://gym-system-sigma.vercel.app/admin
echo User App: https://gym-system-sigma.vercel.app/app
echo.
pause

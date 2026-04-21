@echo off
title Gym-Atlas Loader
echo.
echo    [ GYM-ATLAS 2026 ]
echo    Iniciando sistema central...
echo.

:: Install dependencies silently
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements.txt >nul 2>&1

:: Launch the Unified Desktop Kiosk (pythonw hides the console)
start "" ".\venv\Scripts\pythonw.exe" "desktop_kiosk.py"

echo    Sistema lanzado con éxito.
echo    Esta ventana se cerrará en 3 segundos...
timeout /t 3 /nobreak >nul
exit

# Gym System - Access Control

## Requisitos para PC del Gimnasio
- Python 3.10+
- Node.js 18+
- Base de datos Neon conectada

## Cómo Correr Localmente

Todo este proceso se preparó asumiendo permisos de escritura sobre una WebCam local (generalmente \`/dev/video0\` en Linux o \`CAP_DSHOW 0\` en Windows).

### 1. Backend (IA y API)
Abrir consola en \`backend\`:
\`\`\`bash
cd backend
.\venv\Scripts\activate
# Instalar requerimientos (si la carpeta recién se clona)
pip install -r requirements.txt
# Iniciar backend local
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
\`\`\`
*(El backend prenderá la cámara web por defecto)*

### 2. Frontend (Kiosko)
Abrir consola paralela en \`frontend\`:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Abrir **http://localhost:5173/** en el navegador de la PC del Kiosko (modo F11 recomendado).

## DNIs de Prueba:
- "1111" - Socio Al Día (Glow Verde)
- "2222" - Socio Por Vencer (Glow Amarillo)
- "3333" - Socio Deuda -> **Activa Alarma Fullscreen Roja si detecta una persona**

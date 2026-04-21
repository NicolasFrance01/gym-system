import CheckInPanel from './components/CheckInPanel';
import CameraPanel from './components/CameraPanel';
import AlarmOverlay from './components/AlarmOverlay';
import { useGymStore } from './store/useGymStore';
import { useEffect, useState } from 'react';

export default function KioskView() {
  const { setAlarmActive, currentMember, setCurrentMember } = useGymStore();
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const isHttps = window.location.protocol === 'https:';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isHttps && !isLocal) {
        setWsConnected(false);
        return;
    }

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'alarm_state') {
          setAlarmActive(data.active);
        }
      } catch (e) {
        console.error(e);
      }
    };
    return () => ws.close();
  }, [setAlarmActive]);

  useEffect(() => {
    if (currentMember) {
      const timer = setTimeout(() => {
        setCurrentMember(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentMember, setCurrentMember]);

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-red-900/10 pointer-events-none" />
      
      <div className="w-[30%] min-w-[350px] flex-shrink-0 z-10 border-r border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl shadow-black/50">
        <CheckInPanel className="h-full bg-transparent" />
      </div>

      <div className="flex-1 flex flex-col z-0 relative bg-neutral-900">
        <CameraPanel className="h-full w-full object-cover" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
             <span className="text-sm font-mono text-white/50">{wsConnected ? 'WS CONNECTED' : 'WS OFFLINE'}</span>
          </div>
          <span className="text-sm font-mono text-white/50">SYSTEM: GYM-AI-YOLOv8</span>
        </div>
      </div>
      
      <AlarmOverlay />
    </div>
  );
}

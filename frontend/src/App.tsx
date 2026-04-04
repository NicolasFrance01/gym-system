import { useEffect, useState } from 'react';
import CheckInPanel from './components/CheckInPanel';
import CameraPanel from './components/CameraPanel';
import AlarmOverlay from './components/AlarmOverlay';
import { useGymStore } from './store/useGymStore';

function App() {
  const { setAlarmActive } = useGymStore();
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket to receive YOLO alerts 
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

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-red-900/10 pointer-events-none" />
      
      {/* Left Area - Form and Data (30%) */}
      <div className="w-[30%] min-w-[350px] flex-shrink-0 z-10 border-r border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl shadow-black/50">
        <CheckInPanel className="h-full bg-transparent" />
      </div>

      {/* Right Area - Camera Details (70%) */}
      <div className="flex-1 flex flex-col z-0 relative bg-neutral-900">
        <CameraPanel className="h-full w-full object-cover" />
        
        {/* Status bar */}
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

export default App;

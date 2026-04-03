import { useEffect } from 'react';
import CheckInPanel from './components/CheckInPanel';
import CameraPanel from './components/CameraPanel';
import AlarmOverlay from './components/AlarmOverlay';
import { useGymStore } from './store/useGymStore';

function App() {
  const { currentMember, setAlarmActive } = useGymStore();

  useEffect(() => {
    // Basic logic to trigger alarm if debt
    if (currentMember && currentMember.status === 'DEUDA') {
      setAlarmActive(true);
      // Turn off alarm after 5 seconds
      const timeout = setTimeout(() => {
        setAlarmActive(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentMember, setAlarmActive]);

  return (
    <div className="flex h-screen bg-neutral-900 text-white overflow-hidden font-sans">
      <CheckInPanel className="w-1/3 flex-shrink-0 border-r border-neutral-800" />
      <CameraPanel className="flex-grow flex flex-col items-center justify-center bg-black" />
      <AlarmOverlay />
    </div>
  );
}

export default App;

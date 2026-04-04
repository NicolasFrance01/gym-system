import { useEffect, useRef } from 'react';
import { useGymStore } from '../store/useGymStore';

export default function AlarmOverlay() {
  const { isAlarmActive } = useGymStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
    }

    if (isAlarmActive) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
      
      // Stop the sound after 2.5 seconds (half the time)
      const timeout = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 2000);
      
      return () => clearTimeout(timeout);
    } else {
      // Pause immediately if alarm turns off early
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isAlarmActive]);

  // We return null because the visual aspect is now fully handled 
  // by the bounding box inside the CameraPanel.
  return null;
}


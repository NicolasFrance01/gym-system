import { motion, AnimatePresence } from 'framer-motion';
import { useGymStore } from '../store/useGymStore';
import { AlertOctagon } from 'lucide-react';
import { useEffect } from 'react';

export default function AlarmOverlay() {
  const { isAlarmActive } = useGymStore();

  useEffect(() => {
    if (isAlarmActive) {
      // Play a siren sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
    }
  }, [isAlarmActive]);

  return (
    <AnimatePresence>
      {isAlarmActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-red-950/90 backdrop-blur-sm"
        >
          {/* Flashing red border */}
          <motion.div
            animate={{ 
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
            className="absolute inset-0 border-[20px] border-red-600"
          />

          {/* Shake animation content */}
          <motion.div
            animate={{ 
              x: [-10, 10, -10, 10, 0],
              y: [-10, 10, -10, 10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="flex flex-col items-center justify-center p-16 bg-red-600 rounded-3xl shadow-[0_0_100px_rgba(220,38,38,1)] border-4 border-white text-white"
          >
            <AlertOctagon size={120} className="mb-8" />
            <h1 className="text-7xl font-black mb-4 uppercase tracking-tighter">ALERTA</h1>
            <h2 className="text-5xl font-bold uppercase text-center">Socio con<br/>cuota impaga</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

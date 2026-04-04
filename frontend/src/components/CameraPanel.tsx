import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CameraPanel({ className = '' }: { className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ping to check if video feed is alive by checking image load
    const img = imgRef.current;
    if (img) {
      img.onload = () => setIsConnected(true);
      img.onerror = () => setIsConnected(false);
      
      // Attempting to stream the MJPEG
      img.src = "http://127.0.0.1:8000/video_feed";
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Live Indicator */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-3 bg-black/50 p-4 rounded-2xl backdrop-blur-md border border-neutral-800">
        <motion.div 
          animate={{ opacity: isConnected ? [1, 0.3, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-4 h-4 rounded-full ${isConnected ? 'bg-red-500' : 'bg-neutral-500'}`} 
        />
        <span className="text-xl font-medium font-mono uppercase tracking-widest">
          {isConnected ? 'LIVE CV FEED' : 'CONNECTING...'}
        </span>
      </div>

      {!isConnected && (
         <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 text-neutral-500">
            <div className="w-16 h-16 border-4 border-neutral-600 border-t-white rounded-full animate-spin" />
            <p className="text-2xl font-light">Esperando conexión de cámara YOLOv8...</p>
         </div>
      )}

      {/* MJPEG Stream rendered into an img element */}
      <img
        ref={imgRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-0'}`}
        alt="Live Gym Stream"
      />

      {/* Cool tech grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PGRlZnM+PHBhdHRlcm4gaWQ9J2EnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgcGF0dGVyblVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHBhdGggZD0nTTAgNDBoNDBWMEgweiIgZmlsbD0nbm9uZScvPjxwYXRoIGQ9J00wIDQwaDQwTTAgMjBoNDBNMCAwaDQwTTAgMHY0ME0yMCAwdjQwTTQwIDB2NDAnIHN0cm9rZT0nI2ZmZmZmZicgc3Ryb2tlLW9wYWNpdHk9JzAuMDInIHN0cm9rZS13aWR0aD0nMScvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0ndXJsKCNhKScvPjwvc3ZnPg==')] pointer-events-none opacity-50" />
    </div>
  );
}

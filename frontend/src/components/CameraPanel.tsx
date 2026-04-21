import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CameraPanel({ className = '' }: { className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const isHttps = window.location.protocol === 'https:';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isHttps && !isLocal) {
        // Mixed content protection - camera won't work on HTTPS unless backend is also HTTPS
        setIsConnected(false);
        return;
    }

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
    <div className={`relative overflow-hidden w-full h-full bg-black ${className}`}>
      {/* Live Indicator */}
      <div className="absolute top-8 right-8 z-10 flex items-center gap-3 bg-black/40 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
        <motion.div 
          animate={{ opacity: isConnected ? [1, 0.3, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${isConnected ? 'bg-red-500 text-red-500' : 'bg-neutral-500 text-neutral-500'}`} 
        />
        <span className="text-sm font-bold font-mono tracking-[0.2em] text-white">
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
        className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isConnected ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        alt="Live Gym Stream"
      />

      {/* Cool tech grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PGRlZnM+PHBhdHRlcm4gaWQ9J2EnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgcGF0dGVyblVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHBhdGggZD0nTTAgNDBoNDBWMEgweiIgZmlsbD0nbm9uZScvPjxwYXRoIGQ9J00wIDQwaDQwTTAgMjBoNDBNMCAwaDQwTTAgMHY0ME0yMCAwdjQwTTQwIDB2NDAnIHN0cm9rZT0nI2ZmZmZmZicgc3Ryb2tlLW9wYWNpdHk9JzAuMDInIHN0cm9rZS13aWR0aD0nMScvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0ndXJsKCNhKScvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay opacity-30" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />
    </div>
  );
}

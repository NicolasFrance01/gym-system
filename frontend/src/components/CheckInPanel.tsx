import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGymStore, type Member } from '../store/useGymStore';
import { Search } from 'lucide-react';

export default function CheckInPanel({ className = '' }: { className?: string }) {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { currentMember, setCurrentMember } = useGymStore();

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`http://localhost:8000/members/${dni}`);
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setCurrentMember(data);
        setDni('');
      } else {
        setError('Socio no encontrado');
        setCurrentMember(null);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
      // Keep focus on input for kiosk mode
      inputRef.current?.focus();
    }
  };

  const getGlowColor = (status: Member['status']) => {
    switch (status) {
      case 'AL DIA': return 'shadow-[0_0_40px_rgba(34,197,94,0.6)] border-green-500';
      case 'POR VENCER': return 'shadow-[0_0_40px_rgba(234,179,8,0.6)] border-yellow-500';
      case 'DEUDA': return 'shadow-[0_0_40px_rgba(239,68,68,0.8)] border-red-500 animate-pulse';
      default: return 'border-neutral-700';
    }
  };

  const getStatusText = (status: Member['status']) => {
    switch (status) {
      case 'AL DIA': return 'text-green-400';
      case 'POR VENCER': return 'text-yellow-400';
      case 'DEUDA': return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className={`p-8 flex flex-col bg-neutral-900 ${className}`}>
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Access Control</h1>
        <p className="text-neutral-400">Ingrese su DNI para acceder</p>
      </div>

      <form onSubmit={handleCheckIn} className="mb-12 relative w-full">
        <input 
          ref={inputRef}
          type="text" 
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Número de DNI" 
          autoFocus
          className="w-full bg-neutral-800 text-white text-4xl p-6 rounded-2xl border border-neutral-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-600" 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
        >
          {loading ? (
             <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={32} />
          )}
        </button>
      </form>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 mb-8"
        >
          {error}
        </motion.div>
      )}

      <div className="flex-grow flex flex-col justify-end pb-12">
        <AnimatePresence mode="wait">
          {currentMember && (
            <motion.div
              key={currentMember.dni}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className={`bg-neutral-800 rounded-3xl p-8 border-2 flex flex-col items-center text-center ${getGlowColor(currentMember.status)}`}
            >
              {currentMember.photo_url ? (
                <img 
                  src={currentMember.photo_url} 
                  alt="Member" 
                  className="w-48 h-48 rounded-full object-cover border-4 border-neutral-700 mb-6 drop-shadow-2xl" 
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-neutral-700 mb-6" />
              )}
              
              <h2 className="text-3xl font-bold mb-2">{currentMember.name}</h2>
              <p className="text-xl text-neutral-400 mb-4">DNI: {currentMember.dni}</p>
              
              <div className="mt-4 px-6 py-2 rounded-full bg-black/50 border border-neutral-700">
                <span className={`text-2xl font-bold ${getStatusText(currentMember.status)}`}>
                  {currentMember.status}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

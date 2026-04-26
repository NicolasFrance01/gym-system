import { Calendar, Activity, Zap, Brain, Dumbbell, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserApp() {
  const [activeTab, setActiveTab] = useState('Home');
  const [profile] = useState({
    name: "Nicolas France",
    plan: "Elite Member",
    dni: "1111",
    expiry: "25 Mayo 2026",
    streak: 14,
    assigned_routine: "Hipertrofia Avanzada (Empuje)",
    assigned_classes: ["Yoga Flow", "CrossFit HIIT"],
    exercises: [
      { name: "Press de Banca", sets: "4x10", weight: "80kg" },
      { name: "Sentadilla Libre", sets: "3x12", weight: "100kg" },
      { name: "Peso Muerto", sets: "4x8", weight: "120kg" }
    ]
  });

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    // Sync logic
  }, []);

  const handleBooking = (className: string, time: string) => {
    if (bookings.find(b => b.time === time)) {
      alert("Ya tienes una reserva a esta hora.");
      return;
    }
    setBookings([...bookings, { name: className, time }]);
    alert(`¡Reserva confirmada: ${className} a las ${time}!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Training':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-blue-600/20 to-transparent p-6 rounded-[40px] border border-blue-500/20">
               <h3 className="text-xl font-bold flex items-center gap-3 mb-2"><Dumbbell className="text-blue-500" /> Mi Plan Actual</h3>
               <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">{profile.assigned_routine}</p>
            </div>
            <div className="space-y-3">
               {profile.exercises.map((ex, i) => (
                 <div key={i} className="bg-neutral-900 border border-white/5 p-5 rounded-3xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                    <div><p className="font-bold text-white">{ex.name}</p><p className="text-xs text-white/30">{ex.sets} • {ex.weight}</p></div>
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors"><CheckCircle size={14} /></div>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'Calendar':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-neutral-900 border border-white/10 rounded-[40px] p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3"><Clock className="text-blue-500" /> Reservar Turno</h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {["08:00", "10:00", "12:00", "15:00", "18:00", "19:00"].map(time => (
                     <button 
                       key={time}
                       onClick={() => handleBooking("Musculación", time)}
                       className={`p-4 rounded-2xl text-xs font-bold transition-all border ${bookings.find(b=>b.time===time) ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:border-blue-500'}`}
                     >
                       {time} hs
                     </button>
                   ))}
                </div>
                <h3 className="text-lg font-bold mb-4">Mis Clases Asignadas</h3>
                <div className="space-y-3">
                   {profile.assigned_classes.map((c, i) => (
                     <div key={i} className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                        <p className="font-bold text-xs">{c}</p>
                        <button onClick={() => handleBooking(c, "Hoy")} className="text-[10px] font-black uppercase text-blue-400">Reservar</button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
               <div className="flex flex-col items-center mb-8">
                 <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">NF</div>
                 <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                 <p className="text-blue-400 font-mono text-xs tracking-widest uppercase">{profile.plan}</p>
               </div>
               <div className="space-y-4 border-t border-white/10 pt-6">
                 <div className="flex justify-between text-sm"><span className="text-white/40">DNI</span> <span>{profile.dni}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-white/40">Vencimiento</span> <span>{profile.expiry}</span></div>
               </div>
            </div>
            <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Cerrar Sesión</button>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="bg-gradient-to-br from-neutral-900 to-black p-10 rounded-[50px] border border-white/10 shadow-3xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
              <p className="text-xs uppercase tracking-[0.4em] font-black text-blue-500 mb-8 relative z-10">Días de Racha</p>
              <div className="relative z-10 flex items-center justify-center gap-4 mb-8">
                  <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 animate-bounce"><Zap size={32} /></div>
                  <span className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">{profile.streak}</span>
                  <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 animate-bounce" style={{animationDelay: '0.2s'}}><Zap size={32} /></div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-sm text-white/60 leading-relaxed font-medium relative z-10 mx-4">
                 ¡Increíble progreso! Estás en el top 5% de atletas este mes. Mantén el ritmo. 🚀
              </div>
            </section>
            <div className="grid grid-cols-2 gap-4">
               <div onClick={() => setActiveTab('Training')} className="p-6 bg-neutral-900 border border-white/5 rounded-[35px] flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
                  <Dumbbell className="text-blue-500" />
                  <p className="font-bold text-lg">Mi Rutina</p>
                  <p className="text-xs text-white/30">{profile.assigned_routine}</p>
               </div>
               <div onClick={() => setActiveTab('Calendar')} className="p-6 bg-neutral-900 border border-white/5 rounded-[35px] flex flex-col gap-4 group cursor-pointer hover:border-indigo-500/30 transition-all">
                  <Brain className="text-indigo-500" />
                  <p className="font-bold text-lg">IA Advice</p>
                  <p className="text-xs text-white/30">Prioriza descanso hoy</p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 mb-24 overflow-x-hidden">
      <header className="relative z-10 flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('Profile')}>
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5">
             <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center text-sm font-black">NF</div>
           </div>
           <div><h2 className="text-lg font-black text-white">Nicolas</h2><span className="text-[8px] text-blue-400 uppercase font-black tracking-widest">{profile.plan}</span></div>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><Activity size={20} className="text-blue-500" /></div>
      </header>
      <main className="relative z-10 max-w-lg mx-auto">{renderTabContent()}</main>
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[30px] z-50 flex items-center justify-around px-4 shadow-2xl">
        <NavIcon icon={<LayoutDashboard size={22} />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
        <NavIcon icon={<Dumbbell size={22} />} active={activeTab === 'Training'} onClick={() => setActiveTab('Training')} />
        <NavIcon icon={<Calendar size={22} />} active={activeTab === 'Calendar'} onClick={() => setActiveTab('Calendar')} />
        <NavIcon icon={<StoreIcon size={22} />} active={activeTab === 'Store'} onClick={() => setActiveTab('Store')} />
      </nav>
    </div>
  );
}

function NavIcon({ icon, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-3 rounded-xl transition-all cursor-pointer ${active ? 'text-blue-500 bg-blue-500/10' : 'text-white/20 hover:text-white/50'}`}>{icon}</div>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  );
}

function StoreIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}

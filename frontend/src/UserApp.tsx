import { Activity, Zap, Brain, Dumbbell, Clock, Check, Play, LayoutDashboard, User, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  // Simulated User Data
  const [userData] = useState({
    name: "Nicolas France",
    dni: "1111",
    plan: "Elite Member",
    maxDaysPerWeek: 7,
    streak: 14,
    currentRoutine: [
      { id: 1, name: "Press de Banca", sets: "4", reps: "10", weight: 75, completed: false },
      { id: 2, name: "Sentadillas", sets: "3", reps: "12", weight: 100, completed: true },
      { id: 3, name: "Jalón al Pecho", sets: "4", reps: "10", weight: 65, completed: false }
    ],
    evolution: [
      { date: "Ene", weight: 50 },
      { date: "Feb", weight: 60 },
      { date: "Mar", weight: 68 },
      { date: "Abr", weight: 75 }
    ],
    attendanceHistory: ["2026-04-20", "2026-04-22", "2026-04-24"]
  });

  const [bookings, setBookings] = useState<string[]>([]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (dni === '1111' && password === '123') {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales inválidas (DNI: 1111, Pass: 123)");
    }
  };

  const toggleExercise = (id: number) => {
    console.log(`Exercice ${id} toggled`);
    alert("¡Ejercicio completado! Buen trabajo.");
  };

  const handleBooking = (day: string, time: string) => {
    const slot = `${day} ${time}`;
    if (bookings.includes(slot)) {
      setBookings(bookings.filter(b => b !== slot));
    } else {
      if (bookings.length >= userData.maxDaysPerWeek) {
        alert(`Has alcanzado el límite de tu plan (${userData.maxDaysPerWeek} días)`);
        return;
      }
      setBookings([...bookings, slot]);
      alert(`Reserva confirmada para ${slot}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 font-sans">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-6">
               <Brain size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">ATLAS APP</h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Inicia sesión para entrenar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">DNI</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all" value={dni} onChange={e=>setDni(e.target.value)} required />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Contraseña</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all" value={password} onChange={e=>setPassword(e.target.value)} required />
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Training':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Dumbbell size={80}/></div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Mi Rutina Hoy</h3>
                <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest">Enfoque: Hipertrofia Fuerza</p>
             </div>
             <div className="space-y-3">
                {userData.currentRoutine.map(ex => (
                  <div key={ex.id} className={`p-6 rounded-[32px] border ${ex.completed ? 'bg-green-500/10 border-green-500/20' : 'bg-neutral-900 border-white/5'} flex items-center justify-between group transition-all`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ex.completed ? 'bg-green-500 text-white' : 'bg-white/5 text-white/20'}`}>
                           {ex.completed ? <Check size={20}/> : <Play size={20}/>}
                        </div>
                        <div>
                           <p className="font-bold text-white text-base">{ex.name}</p>
                           <p className="text-xs text-white/30 font-bold uppercase">{ex.sets} Sets × {ex.reps} Reps • {ex.weight}kg</p>
                        </div>
                     </div>
                     <button onClick={()=>toggleExercise(ex.id)} className={`w-10 h-10 rounded-full flex items-center justify-center ${ex.completed ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white/40'} hover:scale-110 transition-transform`}>
                        <Check size={18}/>
                     </button>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'Evolution':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
             <div className="bg-neutral-900 border border-white/5 p-8 rounded-[40px]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><TrendingUp className="text-blue-500"/> Mi Evolución</h3>
                <div className="h-60 mb-8">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userData.evolution}>
                         <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'16px'}} />
                         <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-white/20 font-black uppercase mb-1">Carga Máxima</p>
                      <p className="text-2xl font-black text-white">100kg</p>
                      <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold mt-1"><ArrowUpRight size={10}/> +15% vs mes ant.</div>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-white/20 font-black uppercase mb-1">Consistencia</p>
                      <p className="text-2xl font-black text-white">92%</p>
                      <div className="flex items-center gap-1 text-blue-400 text-[10px] font-bold mt-1">Nivel: Atleta Pro</div>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'Calendar':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
             <div className="bg-neutral-900 border border-white/5 p-8 rounded-[40px]">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black flex items-center gap-3"><Clock className="text-blue-500"/> Mis Reservas</h3>
                   <div className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded-full uppercase">{bookings.length}/{userData.maxDaysPerWeek} Días</div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-8 text-center font-bold text-xs">
                   {["L","M","M","J","V","S","D"].map((d,i)=>(<div key={i} className="text-white/20">{d}</div>))}
                   {Array.from({length:31}).map((_,i)=>(<div key={i} className={`h-10 flex items-center justify-center rounded-xl ${bookings.some(b=>b.includes((i+1).toString())) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-white/20'}`}>{i+1}</div>))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {["08:00", "10:00", "15:00", "18:00", "20:00", "21:00"].map(t => (
                     <button key={t} onClick={()=>handleBooking("Mañana", t)} className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${bookings.includes(`Mañana ${t}`) ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        {t} HS
                     </button>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
             <div className="bg-neutral-900 border border-white/5 p-10 rounded-[50px] flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-5xl font-black shadow-2xl mb-6 ring-4 ring-white/5">NF</div>
                <h2 className="text-3xl font-black text-white mb-2">{userData.name}</h2>
                <span className="px-4 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">{userData.plan}</span>
                <button onClick={()=>setIsAuthenticated(false)} className="w-full mt-10 py-4 bg-red-500/10 text-red-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Cerrar Sesión</button>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
             <header className="flex items-center justify-between">
                <div><h2 className="text-3xl font-black text-white tracking-tighter">¡Hola, Nico!</h2><p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Prepárate para reventarla</p></div>
                <div onClick={()=>setActiveTab('Profile')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer active:scale-90 transition-transform"><User size={20} className="text-blue-500" /></div>
             </header>
             <section className="bg-gradient-to-br from-neutral-900 to-black p-10 rounded-[50px] border border-white/10 shadow-3xl text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
                <p className="text-xs uppercase tracking-[0.4em] font-black text-blue-500 mb-8 relative z-10">Días de Racha</p>
                <div className="relative z-10 flex items-center justify-center gap-4 mb-8"><div className="p-4 bg-orange-500/10 rounded-full text-orange-500 animate-bounce"><Zap size={32} /></div><span className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">{userData.streak}</span></div>
                <div onClick={()=>setActiveTab('Evolution')} className="bg-white/5 py-4 px-6 rounded-3xl border border-white/5 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white transition-all cursor-pointer relative z-10 flex items-center justify-center gap-2">Ver Evolución <Activity size={14}/></div>
             </section>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={()=>setActiveTab('Training')} className="p-6 bg-neutral-900 border border-white/5 rounded-[40px] flex flex-col gap-4 group hover:border-blue-500/30 transition-all text-left">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><Dumbbell size={24}/></div>
                   <div><p className="font-bold text-lg leading-tight">Entrenar</p><p className="text-[9px] text-white/20 font-black uppercase">Rutina de Hoy</p></div>
                </button>
                <button onClick={()=>setActiveTab('Calendar')} className="p-6 bg-neutral-900 border border-white/5 rounded-[40px] flex flex-col gap-4 group hover:border-indigo-500/30 transition-all text-left">
                   <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Clock size={24}/></div>
                   <div><p className="font-bold text-lg leading-tight">Agendar</p><p className="text-[9px] text-white/20 font-black uppercase">{bookings.length} Reservas</p></div>
                </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 pb-32 overflow-x-hidden">
      <main className="max-w-lg mx-auto">{renderTabContent()}</main>
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[40px] z-50 flex items-center justify-around px-6 shadow-2xl">
         <NavBtn active={activeTab === 'Home'} onClick={()=>setActiveTab('Home')} icon={<LayoutDashboard size={24}/>} />
         <NavBtn active={activeTab === 'Training'} onClick={()=>setActiveTab('Training')} icon={<Dumbbell size={24}/>} />
         <NavBtn active={activeTab === 'Calendar'} onClick={()=>setActiveTab('Calendar')} icon={<Clock size={24}/>} />
         <NavBtn active={activeTab === 'Evolution'} onClick={()=>setActiveTab('Evolution')} icon={<TrendingUp size={24}/>} />
      </nav>
    </div>
  );
}

function NavBtn({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all relative ${active ? 'text-blue-500' : 'text-white/20'}`}>
       {icon}
       {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
    </button>
  );
}

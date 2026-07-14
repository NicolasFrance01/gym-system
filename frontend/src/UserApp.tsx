import { Zap, Dumbbell, Clock, Check, Play, LayoutDashboard, User, TrendingUp, ArrowUpRight, X, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';

export default function UserApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:8000" 
    : "/api";

  // User Data State
  const [userData, setUserData] = useState({
    name: "", dni: "", plan: "Miembro", maxDaysPerWeek: 7, streak: 0,
    currentRoutine: [
      { id: 1, name: "Press de Banca", sets: "4", reps: "10", weight: 0, completed: false },
      { id: 2, name: "Sentadillas", sets: "3", reps: "12", weight: 0, completed: false },
      { id: 3, name: "Jalón al Pecho", sets: "4", reps: "10", weight: 0, completed: false }
    ],
    evolution: [
      { date: "Ene", "Press de Banca": 40, "Sentadillas": 60, "Jalón al Pecho": 35 },
      { date: "Feb", "Press de Banca": 45, "Sentadillas": 70, "Jalón al Pecho": 45 },
      { date: "Mar", "Press de Banca": 55, "Sentadillas": 85, "Jalón al Pecho": 50 },
      { date: "Abr", "Press de Banca": 60, "Sentadillas": 95, "Jalón al Pecho": 55 }
    ],
    attendanceHistory: []
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [daySchedules, setDaySchedules] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekSchedulesMap, setWeekSchedulesMap] = useState<Record<string, any[]>>({});

  const getWeekDates = (offsetWeeks: number) => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setDate(monday.getDate() + offsetWeeks * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const fetchWeekSchedules = async (dates: Date[]) => {
    try {
      const promises = dates.map(d => {
        const dateStr = d.toISOString().split('T')[0];
        return fetch(`${API_URL}/user/class_schedules?date=${dateStr}`)
          .then(r => r.json())
          .then(data => ({ dateStr, schedules: data }));
      });
      const results = await Promise.all(promises);
      const map: Record<string, any[]> = {};
      results.forEach(res => {
        map[res.dateStr] = Array.isArray(res.schedules) ? res.schedules : [];
      });
      setWeekSchedulesMap(map);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (viewMode === 'week') {
      const dates = getWeekDates(weekOffset);
      fetchWeekSchedules(dates);
    }
  }, [weekOffset, viewMode]);

  const fetchUserBookings = async (memberDni: string) => {
    try {
      const res = await fetch(`${API_URL}/user/${memberDni}/bookings`);
      if (res.ok) setBookings(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchHolidays = async () => {
    try {
      const res = await fetch(`${API_URL}/user/holidays`);
      if (res.ok) setHolidays(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        const loadedRoutine = Array.isArray(data.member.routine) && data.member.routine.length > 0
          ? data.member.routine
          : [
              { id: 1, name: "Press de Banca", sets: "4", reps: "10", weight: 0, completed: false },
              { id: 2, name: "Sentadillas", sets: "3", reps: "12", weight: 0, completed: false },
              { id: 3, name: "Jalón al Pecho", sets: "4", reps: "10", weight: 0, completed: false }
            ];

        setUserData(prev => ({
          ...prev,
          name: data.member.name,
          dni: data.member.dni,
          plan: data.member.membership_type,
          currentRoutine: loadedRoutine,
          streak: data.member.streak || 0
        }));
        setIsAuthenticated(true);
        fetchUserBookings(data.member.dni);
        fetchHolidays();
      } else {
        alert(data.detail || "Error al ingresar");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/${userData.dni}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });
      if (res.ok) {
        alert("Contraseña actualizada con éxito");
        setNewPassword('');
      } else {
        alert("Error al actualizar contraseña");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExercise = (id: number) => {
    setUserData(prev => ({
      ...prev,
      currentRoutine: prev.currentRoutine.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex)
    }));
  };

  const updateWeight = (id: number, newWeight: number) => {
    setUserData(prev => ({
      ...prev,
      currentRoutine: prev.currentRoutine.map(ex => ex.id === id ? { ...ex, weight: newWeight } : ex)
    }));
  };

  const handleDayClick = async (dayNum: number) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const holiday = holidays.find(h => h.date === dateStr);
    if (holiday) {
      alert(`Día no laborable: ${holiday.description}`);
      return;
    }
    setSelectedDay(dayNum);
    try {
      const res = await fetch(`${API_URL}/user/class_schedules?date=${dateStr}`);
      if (res.ok) {
        setDaySchedules(await res.json());
        setIsBookingModalOpen(true);
      }
    } catch (e) { console.error(e); }
  };

  const handleBookClass = async (scheduleId: number) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    try {
      const res = await fetch(`${API_URL}/user/${userData.dni}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_schedule_id: scheduleId, date: dateStr })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reserva realizada con éxito");
        fetchUserBookings(userData.dni);
        setIsBookingModalOpen(false);
      } else {
        alert(data.detail || "Error al reservar");
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor");
    }
  };

  const handleBookClassFromWeek = async (scheduleId: number, dateStr: string) => {
    try {
      const res = await fetch(`${API_URL}/user/${userData.dni}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_schedule_id: scheduleId, date: dateStr })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reserva realizada con éxito");
        fetchUserBookings(userData.dni);
        fetchWeekSchedules(getWeekDates(weekOffset));
      } else {
        alert(data.detail || "Error al reservar");
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try {
      const res = await fetch(`${API_URL}/user/${userData.dni}/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Reserva cancelada");
        fetchUserBookings(userData.dni);
        if (viewMode === 'week') {
          fetchWeekSchedules(getWeekDates(weekOffset));
        }
      } else {
        const data = await res.json();
        alert(data.detail || "Error al cancelar");
      }
    } catch (e) { console.error(e); }
  };

  const todayBooking = bookings.find(b => {
    const dt = new Date(b.start_time);
    const now = new Date();
    return dt.getFullYear() === now.getFullYear() && 
           dt.getMonth() === now.getMonth() && 
           dt.getDate() === now.getDate() &&
           b.status !== "cancelled";
  });

  const handleSaveWorkout = async () => {
    if (!todayBooking) {
      alert("Debes tener una reserva confirmada para hoy para registrar tus ejercicios.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/bookings/${todayBooking.id}/workout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises: userData.currentRoutine })
      });
      if (res.ok) {
        alert("Entrenamiento registrado en tu historial.");
        fetchUserBookings(userData.dni);
      } else {
        alert("Error al guardar entrenamiento");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#212C40] flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
        <div className="w-full max-w-sm bg-black/30 border border-white/10 p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] backdrop-blur-2xl shadow-3xl space-y-6 sm:space-y-10">
          <div className="text-center">
            <img src="/logo_dark.png" alt="Koach Gym Logo" className="h-28 sm:h-44 w-auto mx-auto object-contain mb-4 sm:mb-8 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]" />
            <p className="text-white/20 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Personal Fitness OS</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
             <div className="space-y-1 sm:space-y-2">
               <label className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest ml-4 sm:ml-6">Documento</label>
               <input type="text" className="w-full bg-white/5 border-2 border-[#F38E26] rounded-[2rem] py-3 sm:py-5 px-6 sm:px-8 text-white outline-none transition-all text-center font-black text-xs sm:text-sm" value={dni} onChange={e=>setDni(e.target.value)} required />
             </div>
             <div className="space-y-1 sm:space-y-2">
               <label className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest ml-4 sm:ml-6">Password</label>
               <input type="password" placeholder="••••••••" className="w-full bg-white/5 border-2 border-[#F38E26] rounded-[2rem] py-3 sm:py-5 px-6 sm:px-8 text-white outline-none transition-all text-center font-black text-xs sm:text-sm" value={password} onChange={e=>setPassword(e.target.value)} required />
             </div>
             <button type="submit" disabled={isLoading} className="w-full py-3.5 sm:py-5 text-white bg-[#6E8AC9] border border-[#F38E26] rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm disabled:opacity-50 shadow-md">
               {isLoading ? "Ingresando..." : "Entrar"}
             </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Training':
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
             <div className="bg-gradient-to-br from-orange-500 to-red-600 p-10 rounded-[50px] text-white shadow-3xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 p-10 opacity-10 rotate-12"><Dumbbell size={160}/></div>
                <h3 className="text-3xl font-black mb-2 tracking-tighter">Plan del Día</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Sigue tu progreso y sube cargas</p>
             </div>
             <div className="space-y-4">
                {userData.currentRoutine.map(ex => (
                  <div key={ex.id} className={`p-8 rounded-[40px] border transition-all ${ex.completed ? 'bg-green-500/10 border-green-500/20 shadow-lg shadow-green-500/5' : 'bg-[#141b29] border-white/5'}`}>
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                           <div onClick={()=>toggleExercise(ex.id)} className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${ex.completed ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}>
                              {ex.completed ? <Check size={24} strokeWidth={4}/> : <Play size={24}/>}
                           </div>
                           <div><p className="font-black text-lg text-white uppercase leading-none mb-1">{ex.name}</p><p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{ex.sets} Sets × {ex.reps} Reps</p></div>
                        </div>
                        <button onClick={()=>toggleExercise(ex.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${ex.completed ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40'}`}>{ex.completed ? 'Hecho' : 'Completar'}</button>
                     </div>
                     <div className="flex items-center gap-4 bg-black/40 rounded-3xl p-4 border border-white/5">
                        <TrendingUp size={16} className="text-orange-500" />
                        <span className="text-[10px] font-black text-white/20 uppercase mr-auto">Carga Actual:</span>
                        <input type="number" className="bg-transparent text-white font-black text-xl w-16 outline-none text-right" value={ex.weight} onChange={e=>updateWeight(ex.id, parseInt(e.target.value) || 0)} />
                        <span className="text-sm font-black text-white/40">KG</span>
                      </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <button onClick={handleSaveWorkout} disabled={isLoading} className="w-full py-5 text-white bg-green-600 border border-green-500 rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-50 shadow-md">
                    {isLoading ? "Guardando..." : "Finalizar y Guardar Entrenamiento"}
                  </button>
                </div>
             </div>
          </div>
        );
      case 'Evolution':
        return (
          <div className="space-y-4 animate-in slide-in-from-bottom-8">
             <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 sm:p-10 rounded-[30px] sm:rounded-[50px] shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-8 flex items-center gap-3 uppercase tracking-tighter"><TrendingUp className="text-orange-500" size={22}/> Mi Progreso</h3>
                <div className="h-52 sm:h-80 mb-6 sm:mb-10">
                   <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={userData.evolution}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                           <XAxis dataKey="date" stroke="#666" fontSize={8} />
                           <YAxis stroke="#666" fontSize={8} />
                           <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'20px', padding:'10px'}} />
                           <Legend wrapperStyle={{fontSize:'8px', textTransform:'uppercase', fontWeight:'900', marginTop:'10px'}} />
                           <Line type="monotone" dataKey="Press de Banca" stroke="#3b82f6" strokeWidth={3} dot={{r:4, fill:'#3b82f6'}} activeDot={{r:8}} />
                           <Line type="monotone" dataKey="Sentadillas" stroke="#10b981" strokeWidth={3} dot={{r:4, fill:'#10b981'}} />
                           <Line type="monotone" dataKey="Jalón al Pecho" stroke="#f59e0b" strokeWidth={3} dot={{r:4, fill:'#f59e0b'}} />
                       </LineChart>
                   </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                   <div className="bg-white/5 p-3.5 sm:p-6 rounded-[20px] sm:rounded-[32px] border border-white/5"><p className="text-[8px] sm:text-[9px] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl sm:text-3xl font-black text-white">+25kg</p><p className="text-[9px] sm:text-[10px] text-green-500 font-black mt-1 uppercase">Imparable</p></div>
                   <div className="bg-white/5 p-3.5 sm:p-6 rounded-[20px] sm:rounded-[32px] border border-white/5"><p className="text-[8px] sm:text-[9px] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl sm:text-3xl font-black text-white">48</p><p className="text-[9px] sm:text-[10px] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>
                </div>
             </div>
          </div>
        );
      case 'Calendar':
        const allWeekSchedules = Object.values(weekSchedulesMap).flat();
        const getUniqueSlots = (allSchedules: any[]) => {
          const slotsMap = new Map<string, { start: string, end: string }>();
          const defaultSlots = [
            { start: "08:30", end: "09:30" },
            { start: "08:50", end: "09:50" },
            { start: "10:00", end: "11:00" },
            { start: "17:30", end: "18:30" },
            { start: "18:15", end: "19:15" },
            { start: "18:30", end: "19:30" },
            { start: "19:30", end: "20:30" }
          ];
          defaultSlots.forEach(s => slotsMap.set(`${s.start}-${s.end}`, s));
          allSchedules.forEach(s => {
            if (s && s.start_time && s.end_time) {
              const key = `${s.start_time}-${s.end_time}`;
              slotsMap.set(key, { start: s.start_time, end: s.end_time });
            }
          });
          const sortedSlots = Array.from(slotsMap.values()).sort((a, b) => a.start.localeCompare(b.start));
          const morning = sortedSlots.filter(s => parseInt(s.start.split(":")[0]) < 12);
          const evening = sortedSlots.filter(s => parseInt(s.start.split(":")[0]) >= 12);
          return { morning, evening };
        };

        const { morning: morningSlots, evening: eveningSlots } = getUniqueSlots(allWeekSchedules);
        const weekdayShortNames = ["L", "M", "MI", "J", "V", "S", "D"];
        const weekDates = getWeekDates(weekOffset);

        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-8">
             <div className="bg-[#141b29] border border-white/5 p-10 rounded-[50px] shadow-3xl space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4"><Clock className="text-blue-500" size={28}/> Agenda</h3>
                   <div onClick={()=>setActiveTab('Calendar')} className="px-5 py-2 text-[10px] font-black rounded-2xl uppercase shadow-lg bg-blue-500/20 text-[#6E8AC9]">{bookings.filter(b=>b.status !== "cancelled").length} Reservas</div>
                </div>

                {/* Vista Toggle Slider */}
                <div className="flex bg-black/40 p-1 border border-white/5 rounded-2xl max-w-xs mx-auto">
                   <button 
                      onClick={() => setViewMode('month')} 
                      className={`flex-1 py-2.5 px-6 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${viewMode === 'month' ? 'bg-[#F38E26] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                      Mes
                   </button>
                   <button 
                      onClick={() => setViewMode('week')} 
                      className={`flex-1 py-2.5 px-6 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${viewMode === 'week' ? 'bg-[#F38E26] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                      Semana
                   </button>
                </div>

                {viewMode === 'month' ? (
                  <>
                     <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            {new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                         </p>
                     </div>
                     <div className="grid grid-cols-7 gap-2 mb-10 text-center font-black text-[10px] uppercase">
                         {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d,i)=>(<div key={i} className="text-white/10">{d}</div>))}
                         {(() => {
                           const now = new Date();
                           const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
                           const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                           const padding = firstDay === 0 ? 6 : firstDay - 1;
                           
                           const days = [];
                           for (let i = 0; i < padding; i++) {
                             days.push(<div key={`pad-${i}`} />);
                           }
                           for (let i = 1; i <= daysInMonth; i++) {
                             const bookingDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                             const isBookedReal = bookings.some(b => {
                               const dt = new Date(b.start_time);
                               return dt.getFullYear() === now.getFullYear() && 
                                      (dt.getMonth() + 1) === (now.getMonth() + 1) && 
                                      dt.getDate() === i &&
                                      b.status !== "cancelled";
                             });
                             const isHoliday = holidays.some(h => h.date === bookingDateStr);
                             days.push(
                               <div key={i} 
                                 onClick={() => handleDayClick(i)} 
                                 className={`h-12 flex items-center justify-center rounded-2xl text-sm font-black cursor-pointer transition-all border ${isHoliday ? 'bg-red-500/10 border-red-500/30 text-red-500' : isBookedReal ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20 hover:text-white'}`}>
                                 {i}
                               </div>
                             );
                           }
                           return days;
                         })()}
                     </div>
                  </>
                ) : (
                  <div className="space-y-6">
                     {/* Controles de Semana */}
                     <div className="flex justify-between items-center gap-3">
                        <button 
                           onClick={() => setWeekOffset(prev => prev - 1)} 
                           className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 text-white transition-all">
                           Anterior
                        </button>
                        <span className="text-[10px] font-black uppercase text-white/60 text-center tracking-wider">
                           {weekDates[0].toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'})} AL {weekDates[6].toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'})}
                        </span>
                        <button 
                           onClick={() => setWeekOffset(prev => prev + 1)} 
                           className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 text-white transition-all">
                           Siguiente
                        </button>
                     </div>

                     {/* Grilla Semanal */}
                     <div className="space-y-6 bg-white/5 border border-white/10 p-5 rounded-3xl">
                        
                        {/* Clases por la Mañana */}
                        <div>
                          <div className="bg-[#F38E26] text-white font-black text-center py-2 uppercase tracking-widest text-[8px] rounded-t-xl">
                            Clases por la Mañana
                          </div>
                          <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-xl scrollbar-thin">
                            <table className="w-full border-collapse text-left table-fixed">
                              <thead>
                                <tr className="bg-white/[0.02] text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                  <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                </tr>
                              </thead>
                              <tbody>
                                {morningSlots.map((slot, rowIndex) => (
                                  <tr key={rowIndex} className="border-b border-white/5">
                                    <td className="p-1 text-center">
                                      <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-white/5 text-white/50 font-black rounded-lg border border-white/5 text-[6.5px] sm:text-[8px] tracking-tight">
                                        {slot.start} - {slot.end}
                                      </span>
                                    </td>
                                    {weekdayShortNames.map((_, dayIndex) => {
                                      const date = weekDates[dayIndex];
                                      const dateStr = date.toISOString().split('T')[0];
                                      const holiday = holidays.find(h => h.date === dateStr);
                                      const daySchedulesList = weekSchedulesMap[dateStr] || [];
                                      const cellSchedules = daySchedulesList.filter((s: any) => s.start_time === slot.start && s.end_time === slot.end);

                                      return (
                                        <td key={dayIndex} className="p-0.5 sm:p-1.5 text-center min-w-[38px] sm:min-w-[55px]">
                                          <div className="flex flex-col gap-1 items-center justify-center">
                                            {holiday ? (
                                              <span className="text-[6px] sm:text-[7px] font-black text-red-500/30 uppercase">Feriado</span>
                                            ) : cellSchedules.length > 0 ? cellSchedules.map((s: any) => {
                                              const isAlreadyBooked = bookings.some(b => b.class_schedule_id === s.id && b.start_time.split('T')[0] === dateStr && b.status !== "cancelled");
                                              const userBooking = bookings.find(b => b.class_schedule_id === s.id && b.start_time.split('T')[0] === dateStr && b.status !== "cancelled");
                                              
                                              return (
                                                <button
                                                  key={s.id}
                                                  onClick={async () => {
                                                    if (isAlreadyBooked) {
                                                      await handleCancelBooking(userBooking.id);
                                                    } else {
                                                      if (confirm(`¿Reservar clase de ${s.name} para el ${date.toLocaleDateString('es-AR')} a las ${s.start_time} HS?`)) {
                                                        await handleBookClassFromWeek(s.id, dateStr);
                                                      }
                                                    }
                                                  }}
                                                  style={{ backgroundColor: s.color }}
                                                  className={`w-9 sm:w-12 h-7 sm:h-8 rounded-lg sm:rounded-xl text-white font-black text-[7.5px] sm:text-[9px] uppercase flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md relative ${isAlreadyBooked ? 'ring-2 ring-white scale-105' : 'opacity-90'}`}>
                                                  <span className="leading-none text-[7.5px] sm:text-[9px]">{s.code}</span>
                                                  <span className="text-[5px] sm:text-[6px] opacity-75 leading-none mt-0.5">{s.bookings_count}/{s.capacity}</span>
                                                  {isAlreadyBooked && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full flex items-center justify-center text-[6px] sm:text-[7px] text-white border border-[#141b29] font-black">✓</span>
                                                  )}
                                                </button>
                                              );
                                            }) : (
                                              <div className="w-9 sm:w-12 h-7 sm:h-8 rounded-lg sm:rounded-xl border border-white/5 bg-transparent flex items-center justify-center opacity-10 text-[7px] sm:text-[9px] font-black text-white">
                                                -
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Clases por la Tarde / Noche */}
                        <div>
                          <div className="bg-[#F38E26] text-white font-black text-center py-2 uppercase tracking-widest text-[8px] rounded-t-xl">
                            Clases por la Tarde/Noche
                          </div>
                          <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-xl scrollbar-thin">
                            <table className="w-full border-collapse text-left table-fixed">
                              <thead>
                                <tr className="bg-white/[0.02] text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                  <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                  <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                </tr>
                              </thead>
                              <tbody>
                                {eveningSlots.map((slot, rowIndex) => (
                                  <tr key={rowIndex} className="border-b border-white/5">
                                    <td className="p-1 text-center">
                                      <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-white/5 text-white/50 font-black rounded-lg border border-white/5 text-[6.5px] sm:text-[8px] tracking-tight">
                                        {slot.start} - {slot.end}
                                      </span>
                                    </td>
                                    {weekdayShortNames.map((_, dayIndex) => {
                                      const date = weekDates[dayIndex];
                                      const dateStr = date.toISOString().split('T')[0];
                                      const holiday = holidays.find(h => h.date === dateStr);
                                      const daySchedulesList = weekSchedulesMap[dateStr] || [];
                                      const cellSchedules = daySchedulesList.filter((s: any) => s.start_time === slot.start && s.end_time === slot.end);

                                      return (
                                        <td key={dayIndex} className="p-0.5 sm:p-1.5 text-center min-w-[38px] sm:min-w-[55px]">
                                          <div className="flex flex-col gap-1 items-center justify-center">
                                            {holiday ? (
                                              <span className="text-[6px] sm:text-[7px] font-black text-red-500/30 uppercase">Feriado</span>
                                            ) : cellSchedules.length > 0 ? cellSchedules.map((s: any) => {
                                              const isAlreadyBooked = bookings.some(b => b.class_schedule_id === s.id && b.start_time.split('T')[0] === dateStr && b.status !== "cancelled");
                                              const userBooking = bookings.find(b => b.class_schedule_id === s.id && b.start_time.split('T')[0] === dateStr && b.status !== "cancelled");
                                              
                                              return (
                                                <button
                                                  key={s.id}
                                                  onClick={async () => {
                                                    if (isAlreadyBooked) {
                                                      await handleCancelBooking(userBooking.id);
                                                    } else {
                                                      if (confirm(`¿Reservar clase de ${s.name} para el ${date.toLocaleDateString('es-AR')} a las ${s.start_time} HS?`)) {
                                                        await handleBookClassFromWeek(s.id, dateStr);
                                                      }
                                                    }
                                                  }}
                                                  style={{ backgroundColor: s.color }}
                                                  className={`w-9 sm:w-12 h-7 sm:h-8 rounded-lg sm:rounded-xl text-white font-black text-[7.5px] sm:text-[9px] uppercase flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md relative ${isAlreadyBooked ? 'ring-2 ring-white scale-105' : 'opacity-90'}`}>
                                                  <span className="leading-none text-[7.5px] sm:text-[9px]">{s.code}</span>
                                                  <span className="text-[5px] sm:text-[6px] opacity-75 leading-none mt-0.5">{s.bookings_count}/{s.capacity}</span>
                                                  {isAlreadyBooked && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full flex items-center justify-center text-[6px] sm:text-[7px] text-white border border-[#141b29] font-black">✓</span>
                                                  )}
                                                </button>
                                              );
                                            }) : (
                                              <div className="w-9 sm:w-12 h-7 sm:h-8 rounded-lg sm:rounded-xl border border-white/5 bg-transparent flex items-center justify-center opacity-10 text-[7px] sm:text-[9px] font-black text-white">
                                                -
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Actividades Leyenda */}
                        <div className="pt-3 border-t border-white/5 text-center">
                          <span className="text-[8px] font-black uppercase tracking-wider text-white/30 block mb-2">Actividades</span>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-[7px] font-black uppercase">
                            <span className="text-[#3b82f6]">● Entrenamiento Funcional (EF)</span>
                            <span className="text-[#f97316]">● Pilates en Suelo (PS)</span>
                            <span className="text-[#ec4899]">● Entrenamiento Personalizado (EP)</span>
                            <span className="text-[#eab308]">● Salsa y Bachata (SB)</span>
                            <span className="text-[#ef4444]">● Zumba (ZB)</span>
                            <span className="text-[#06b6d4]">● Reguetón Juvenil (RJ)</span>
                          </div>
                        </div>

                     </div>
                  </div>
                )}

                <div className="space-y-4 border-t border-white/5 pt-6">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Próximas Sesiones</p>
                   {bookings.filter(b=>b.status !== "cancelled").slice(0, 10).map((b,i)=>{
                     const dt = new Date(b.start_time);
                     const dateStr = dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
                     const timeStr = b.start_time.split('T')[1]?.substring(0, 5) || '';
                     return (
                      <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                         <div>
                           <p className="font-black text-white uppercase">{b.class_name}</p>
                           <p className="text-[10px] text-white/25 font-black uppercase mt-1">Día {dateStr} • {timeStr} HS • Estado: {b.status === 'attended' ? 'ASISTIDO' : 'CONFIRMADO'}</p>
                         </div>
                         {b.status === "reserved" && (
                           <button onClick={()=>handleCancelBooking(b.id)} className="text-red-500/20 group-hover:text-red-500 transition-colors"><X size={20}/></button>
                         )}
                      </div>
                     );
                   })}
                   {bookings.filter(b=>b.status !== "cancelled").length === 0 && <p className="text-center text-white/10 italic text-[10px] font-black uppercase py-10">No tienes reservas aún</p>}
                </div>
             </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
             <div className="bg-[#141b29] border border-white/5 p-10 rounded-[50px] flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-5xl font-black shadow-2xl mb-6 ring-4 ring-white/5">{userData.name[0]}</div>
                <h2 className="text-3xl font-black text-white mb-2">{userData.name}</h2>
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-10">{userData.plan}</span>
                
                <div className="w-full space-y-4 pt-10 border-t border-white/5">
                   <h4 className="text-xs font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><Dumbbell size={14}/> Historial de Entrenamientos</h4>
                   <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar text-left w-full">
                      {bookings.filter(b => b.exercises_done && b.exercises_done.length > 0).map((b, i) => {
                         const dt = new Date(b.start_time);
                         const dateStr = dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                         return (
                            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                               <p className="font-black text-white text-[10px] uppercase">{b.class_name} • {dateStr}</p>
                               <div className="space-y-1 pl-2 border-l border-[#F38E26]/50">
                                  {b.exercises_done.map((ex: any, idx: number) => (
                                     <p key={idx} className="text-[9px] text-white/55 uppercase font-black">
                                        {ex.name}: {ex.completed ? `✅ ${ex.sets}x${ex.reps} (${ex.weight}kg)` : '❌ Incompleto'}
                                     </p>
                                  ))}
                               </div>
                            </div>
                         );
                      })}
                      {bookings.filter(b => b.exercises_done && b.exercises_done.length > 0).length === 0 && (
                         <p className="text-center text-white/20 italic text-[9px] font-black uppercase py-4">No hay entrenamientos registrados aún</p>
                      )}
                   </div>
                </div>

                <div className="w-full space-y-4 pt-10 border-t border-white/5 mt-10">
                   <h4 className="text-xs font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><Lock size={14}/> Cambiar Contraseña</h4>
                   <div className="space-y-3">
                      <input type="password" placeholder="Nueva Contraseña" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                      <button onClick={handleChangePassword} disabled={isLoading || !newPassword} className="w-full py-4 bg-[#6E8AC9] text-white border border-[#F38E26] rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md disabled:opacity-50 hover:scale-[1.01] transition-all">Actualizar Contraseña</button>
                   </div>
                </div>

                <button onClick={()=>setIsAuthenticated(false)} className="w-full mt-10 py-4 bg-[#212C40] text-white border border-[#F38E26] rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.01] transition-all">Cerrar Sesión</button>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-in fade-in duration-1000">
             <header className="flex items-center justify-between">
                <div><h2 className="text-3xl font-black text-white tracking-tighter">¡Hola, {userData.name.split(' ')[0]}! 👋</h2><p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Estatus: Bestia en Entrenamiento</p></div>
                <div onClick={()=>setActiveTab('Profile')} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 active:scale-90 transition-all"><User size={20} className="text-blue-500" /></div>
             </header>
             <section className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-[35px] border border-white/10 shadow-2xl text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(243,142,38,0.15),transparent_70%)]" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-6 relative z-10 animate-pulse" style={{color:'#F38E26'}}>Racha de Fuego</p>
                  <div className="relative z-10 flex items-center justify-center gap-4 mb-6">
                    <div className="p-4 bg-orange-500/10 rounded-full text-orange-500"><Zap size={32} strokeWidth={3} /></div>
                    <span className="text-7xl font-black tracking-tighter text-white">{userData.streak}</span>
                  </div>
                  <div onClick={()=>setActiveTab('Evolution')} className="py-3 px-6 rounded-2xl border text-[9px] sm:text-[10px] uppercase font-black tracking-widest hover:text-white transition-all cursor-pointer relative z-10 mx-auto flex items-center justify-center gap-2 w-fit" style={{backgroundColor:'rgba(243,142,38,0.05)', borderColor:'rgba(243,142,38,0.15)', color:'#F38E26'}} onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.backgroundColor='#F38E26';(e.currentTarget as HTMLDivElement).style.color='#fff'}} onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.backgroundColor='rgba(243,142,38,0.05)';(e.currentTarget as HTMLDivElement).style.color='#F38E26'}}>Explorar Evolución <ArrowUpRight size={14}/></div>
             </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#212C40] text-white font-sans p-6 pb-32 overflow-x-hidden">
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-300">
           <div className="bg-[#1b2435] border border-white/10 p-6 sm:p-10 rounded-[35px] sm:rounded-[50px] w-full max-w-sm max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-6 sm:mb-10 flex-shrink-0">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Día {selectedDay}</h3>
                <button onClick={()=>setIsBookingModalOpen(false)}><X size={24} className="text-white/20 hover:text-white"/></button>
              </div>
              <div className="space-y-6 flex-1 flex flex-col min-h-0">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest flex-shrink-0">Clases Disponibles</p>
                 <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar min-h-0">
                    {daySchedules.length > 0 ? daySchedules.map((s) => {
                      const isAlreadyBooked = bookings.some(b => b.class_schedule_id === s.id && new Date(b.start_time).getDate() === selectedDay && b.status !== "cancelled");
                      const userBooking = bookings.find(b => b.class_schedule_id === s.id && new Date(b.start_time).getDate() === selectedDay && b.status !== "cancelled");
                      return (
                        <div key={s.id} className="p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="px-2 py-0.5 rounded text-[8px] font-black text-white mt-0.5 flex-shrink-0" style={{backgroundColor: s.color}}>{s.code}</span>
                              <span className="font-black text-white uppercase text-[10px] sm:text-[11px] leading-tight break-words flex-1 min-w-0">{s.name}</span>
                            </div>
                            <p className="text-[9px] text-white/30 font-black uppercase tracking-wider">⏰ {s.start_time} A {s.end_time}</p>
                            <p className="text-[9px] text-[#F38E26] font-black uppercase tracking-wider">👥 Confirmados: {s.bookings_count} / {s.capacity}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {isAlreadyBooked ? (
                              <button onClick={() => handleCancelBooking(userBooking.id)} className="px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[8px] font-black uppercase whitespace-nowrap">Cancelar</button>
                            ) : (
                              <button 
                                onClick={() => handleBookClass(s.id)} 
                                disabled={s.bookings_count >= s.capacity}
                                className="px-3 py-2 bg-green-500 text-white rounded-xl text-[8px] font-black uppercase disabled:opacity-50 whitespace-nowrap">
                                Reservar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-center text-white/20 italic text-[10px] font-black uppercase py-4">No hay clases programadas para este día.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
      <main className="max-w-lg mx-auto">{renderTabContent()}</main>
       <nav className="fixed bottom-4 left-4 right-4 h-16 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-around px-4 shadow-lg animate-in slide-in-from-bottom-10 duration-1000">
          <NavBtn active={activeTab === 'Home'} onClick={()=>setActiveTab('Home')} icon={<LayoutDashboard size={22}/>} />
          <NavBtn active={activeTab === 'Training'} onClick={()=>setActiveTab('Training')} icon={<Dumbbell size={22}/>} />
          <NavBtn active={activeTab === 'Calendar'} onClick={()=>setActiveTab('Calendar')} icon={<Clock size={22}/>} />
          <NavBtn active={activeTab === 'Evolution'} onClick={()=>setActiveTab('Evolution')} icon={<TrendingUp size={22}/>} />
       </nav>
     </div>
   );
 }
 
 function NavBtn({ active, onClick, icon }: any) {
   return (
     <button onClick={onClick} className={`p-3 rounded-xl transition-all relative flex items-center justify-center`} style={{color: active ? '#F38E26' : 'rgba(255,255,255,0.2)'}} onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.5)'}} onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.2)'}}>
        {icon}
        {active && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{backgroundColor:'#F38E26', boxShadow:'0 0 4px rgba(243,142,38,0.8)'}} />}
     </button>
   );
 }

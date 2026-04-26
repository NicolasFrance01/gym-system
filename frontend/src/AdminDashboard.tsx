import { LayoutDashboard, Users, Brain, TrendingUp, DollarSign, Lock, ShieldCheck, Briefcase, Download, Target, CheckCircle, XCircle, Trash2, Dumbbell, Calendar as CalendarIcon, Flame, Plus, X, Search, Settings, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EXERCISE_DB = {
  Pecho: ["Press de Banca", "Press Inclinado", "Aperturas con Mancuernas", "Flexiones de Brazos", "Cruce de Poleas"],
  Espalda: ["Jalón al Pecho", "Remo con Barra", "Dominadas", "Peso Muerto", "Remo en Polea Baja"],
  Brazos: ["Curls de Bíceps", "Extensiones de Tríceps", "Curl Martillo", "Press Francés", "Fondos en Paralelas"],
  Abdomen: ["Crunches", "Plancha", "Elevación de Piernas", "Russian Twist", "Rueda Abdominal"],
  Glúteos: ["Hip Thrust", "Puente de Glúteo", "Patada de Glúteo", "Abducción de Cadera"],
  Piernas: ["Sentadillas", "Prensa de Piernas", "Estocadas", "Extensión de Cuádriceps", "Curl Femoral", "Elevación de Gemelos"]
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'operador'>('admin');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [activeTab, setActiveTab] = useState('Resumen');
  
  // Date Filters
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split('T')[0]; });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Unified State
  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([
    { id: 1, name: "Básico", price: 5000, daysPerWeek: 3, classes: [] },
    { id: 2, name: "Premium", price: 8500, daysPerWeek: 5, classes: ["Yoga"] },
    { id: 3, name: "Elite", price: 12000, daysPerWeek: 7, classes: ["Yoga", "CrossFit", "Spinning"] },
  ]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([
    { id: 1, name: "Yoga", day: "Lunes", startTime: "09:00", endTime: "10:00", instructor: "Ana" },
    { id: 2, name: "CrossFit", day: "Martes", startTime: "18:00", endTime: "19:30", instructor: "Marcos" },
    { id: 3, name: "Spinning", day: "Miércoles", startTime: "19:00", endTime: "20:00", instructor: "Elena" },
  ]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'staff' | 'workout' | 'plan' | 'evolution' | 'class'>('member');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');

  useEffect(() => { if (isAuthenticated) refreshData(); }, [isAuthenticated, startDate, endDate]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'admin123') { setIsAuthenticated(true); setUserRole('admin'); }
    else if (loginUser === 'operador' && loginPass === 'operador123') { setIsAuthenticated(true); setUserRole('operador'); setActiveTab('Resumen'); }
    else { alert("Credenciales incorrectas"); }
  };

  const refreshData = async () => {
    if (members.length === 0) {
      setMembers([
        { id: 1, name: "Neon Matrix", dni: "1111", password: "123", status: "ACTIVO", membership_type: "Elite", expiry_date: "2026-05-20", custom_routine: [{name: "Press de Banca", sets: "4", reps: "10"}, {name: "Sentadillas", sets: "3", reps: "12"}], assigned_classes: ["Yoga"], evolution: [{ date: "2026-01-01", exercise: "Press de Banca", weight: 50 }, { date: "2026-02-01", exercise: "Press de Banca", weight: 60 }, { date: "2026-03-01", exercise: "Press de Banca", weight: 75 }] },
        { id: 2, name: "Sarah Connor", dni: "2222", password: "123", status: "DEUDA", membership_type: "Premium", expiry_date: "2026-04-10", custom_routine: [], assigned_classes: [], evolution: [] },
      ]);
    }
    if (staff.length === 0) {
      setStaff([{ id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" }]);
    }
    setFinanceData({
      cashflow_data: [{ month: "Ene", ingresos: 4800, egresos: 3000 }, { month: "Feb", ingresos: 6500, egresos: 3200 }, { month: "Mar", ingresos: 8900, egresos: 3500 }, { month: "Abr", ingresos: 12450, egresos: 4000 }],
      total_revenue: 12450, total_expenses: 13700, arpu: 87.5, churn_rate: 2.4
    });
    setAiData({
      performance_radar: [{ subject: 'Retención', A: 85, B: 65 }, { subject: 'Asistencia', A: 78, B: 70 }, { subject: 'Satisfacción', A: 95, B: 80 }, { subject: 'Ingresos', A: 88, B: 60 }],
      member_growth: [{ month: 'Ene', altas: 80, bajas: 10 }, { month: 'Feb', altas: 65, bajas: 15 }, { month: 'Mar', altas: 95, bajas: 18 }],
      streaks: [{ name: "Neon Matrix", racha: 18, risk: 5 }, { name: "John Wick", racha: 12, risk: 12 }, { name: "Sarah Connor", racha: 0, risk: 89 }],
      predictions: [{ month: 'May', proy: 15000 }, { month: 'Jun', proy: 17500 }, { month: 'Jul', proy: 21000 }]
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text('GYM ATLAS: REPORTE OFICIAL', 14, 22);
    doc.setFontSize(11); doc.text(`Filtro: ${startDate} al ${endDate}`, 14, 30);
    doc.text('RESUMEN EJECUTIVO', 14, 45);
    autoTable(doc, { startY: 50, head: [['Métrica', 'Valor']], body: [['Ingresos', `$${financeData.total_revenue}`], ['Egresos', `$${financeData.total_expenses}`], ['Socios', members.length], ['Churn', `${financeData.churn_rate}%`]] });
    doc.save(`Reporte_Atlas_${startDate}_${endDate}.pdf`);
  };

  const handleSavePlan = () => { if (isEditMode) setPlans(prev => prev.map(p => p.id === selectedItem.id ? { ...selectedItem } : p)); else setPlans(prev => [...prev, { id: Date.now(), ...selectedItem }]); setIsModalOpen(false); };
  const handleSaveMember = () => { if (isEditMode) setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...selectedItem } : m)); else setMembers(prev => [...prev, { id: Date.now(), ...selectedItem, custom_routine: [], assigned_classes: [], evolution: [], password: '123' }]); setIsModalOpen(false); };
  const handleSaveStaff = () => { if (isEditMode) setStaff(prev => prev.map(s => s.id === selectedItem.id ? { ...selectedItem } : s)); else setStaff(prev => [...prev, { id: Date.now(), ...selectedItem, status: 'ACTIVO' }]); setIsModalOpen(false); };
  const handleSaveWorkout = () => { setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, custom_routine: selectedItem.custom_routine, assigned_classes: selectedItem.assigned_classes } : m)); setIsModalOpen(false); };
  const handleSaveClass = () => { if (isEditMode) setClasses(prev => prev.map(c => c.id === selectedItem.id ? { ...selectedItem } : c)); else setClasses(prev => [...prev, { id: Date.now(), ...selectedItem }]); setIsModalOpen(false); };

  const handlePayment = () => { setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, status: 'ACTIVO', expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } : m)); setIsPaymentModalOpen(false); setPaymentAmount(''); refreshData(); };

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onEvolution={(m:any)=>{setSelectedItem(m); setModalType('evolution'); setIsModalOpen(true);}} onEdit={(m: any) => { setSelectedItem(m); setIsEditMode(true); setModalType('member'); setIsModalOpen(true); }} onDelete={(id: any) => setMembers(m => m.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', dni:'', status:'ACTIVO', membership_type:'Premium'}); setIsEditMode(false); setModalType('member'); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedItem(m); setIsPaymentModalOpen(true); }} />;
      case 'Planes': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType('plan'); setIsModalOpen(true);}} onDelete={(id:any)=>setPlans(p=>p.filter(x=>x.id!==id))} onAddClick={()=>{setSelectedItem({name:'', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType('plan'); setIsModalOpen(true);}} />;
      case 'Staff': return <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem({...s}); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={(id: any) => setStaff(st => st.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', role:'Entrenador', shift:'Mañana'}); setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} />;
      case 'Entrenamientos': return <WorkoutsModule members={members} onAssign={(m: any) => { setSelectedItem({...m, custom_routine: m.custom_routine || [], assigned_classes: m.assigned_classes || []}); setModalType('workout'); setIsModalOpen(true); }} />;
      case 'Calendario': return <CalendarModule classes={classes} onAdd={(d:string, h:number)=>{setSelectedItem({name:'Yoga', day:d, startTime:`${h}:00`, endTime:`${h+1}:00`, instructor:'Staff'}); setIsEditMode(false); setModalType('class'); setIsModalOpen(true);}} onEdit={(c:any)=>{setSelectedItem(c); setIsEditMode(true); setModalType('class'); setIsModalOpen(true);}} />;
      case 'Finanzas': return userRole === 'admin' ? <FinanceModule data={financeData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} /> : <NoAccess />;
      case 'Analítica IA': return userRole === 'admin' ? <AIAnalyticsModule data={aiData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} /> : <NoAccess />;
      default: return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Socios" value={members.length} icon={<Users size={18}/>} onClick={() => setActiveTab('Socios')} color="blue" />
            <SummaryCard title="Caja" value={`$${financeData?.total_revenue?.toLocaleString()}`} icon={<DollarSign size={18}/>} onClick={() => setActiveTab('Finanzas')} color="green" />
            <SummaryCard title="Rachas" value={aiData?.streaks?.length || 0} icon={<Flame size={18}/>} onClick={() => setActiveTab('Analítica IA')} color="orange" />
            <SummaryCard title="Planes" value={plans.length} icon={<Settings size={18}/>} onClick={() => setActiveTab('Planes')} color="purple" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl"><h3 className="text-sm font-bold mb-4">Flujo de Caja</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financeData?.cashflow_data}><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}/><Area type="monotone" dataKey="egresos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div>
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl"><h3 className="text-sm font-bold mb-4">Crecimiento IA</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={aiData?.predictions}><Bar dataKey="proy" fill="#8b5cf6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></div>
          </div>
        </div>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-3xl shadow-2xl">
          <div className="flex justify-center mb-8"><div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30"><ShieldCheck size={40} className="text-white" /></div></div>
          <h2 className="text-3xl font-black text-center text-white mb-8 tracking-tighter">ATLAS ADMIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all text-center" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all text-center" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-black text-white transition-all hover:bg-blue-500 shadow-xl shadow-blue-600/20">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[13px]">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full ${modalType === 'evolution' || modalType === 'workout' ? 'max-w-4xl' : 'max-w-md'} shadow-2xl my-auto`}>
            <div className="flex justify-between items-center mb-8"><h2 className="text-xl font-black uppercase tracking-widest text-blue-500">{modalType}</h2><button onClick={() => setIsModalOpen(false)}><X size={24} className="text-white/20 hover:text-white transition-colors"/></button></div>
            <div className="space-y-4">
              {modalType === 'class' && (
                <div className="space-y-4">
                   <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem.name} onChange={e=>setSelectedItem({...selectedItem, name:e.target.value})}>
                      <option value="Spinning">Spinning</option><option value="Yoga">Yoga</option><option value="CrossFit">CrossFit</option><option value="Zumba">Zumba</option><option value="Musculación">Musculación</option>
                   </select>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-white/20 uppercase font-black">Desde</label><input type="time" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem.startTime} onChange={e=>setSelectedItem({...selectedItem, startTime:e.target.value})}/></div>
                      <div className="space-y-1"><label className="text-[10px] text-white/20 uppercase font-black">Hasta</label><input type="time" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem.endTime} onChange={e=>setSelectedItem({...selectedItem, endTime:e.target.value})}/></div>
                   </div>
                   <input type="text" placeholder="Instructor" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem.instructor} onChange={e=>setSelectedItem({...selectedItem, instructor:e.target.value})}/>
                </div>
              )}
              {modalType === 'staff' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="text" placeholder="Rol" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" value={selectedItem?.role} onChange={e => setSelectedItem({...selectedItem, role: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" value={selectedItem?.shift} onChange={e => setSelectedItem({...selectedItem, shift: e.target.value})}>
                    <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option>
                  </select>
                </div>
              )}
              {modalType === 'evolution' && (
                <div className="space-y-6">
                   <div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={selectedItem.evolution}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><XAxis dataKey="date" stroke="#444" fontSize={10}/><YAxis stroke="#444" fontSize={10}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none'}}/><Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
                   <div className="grid grid-cols-4 gap-4">
                      {selectedItem.evolution.map((ev:any, i:number)=>(<div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center"><p className="text-[10px] text-white/20 uppercase font-black">{ev.date}</p><p className="text-xl font-black">{ev.weight}kg</p></div>))}
                   </div>
                </div>
              )}
              {modalType === 'plan' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Plan" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="number" placeholder="Precio" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.price} onChange={e => setSelectedItem({...selectedItem, price: e.target.value})} />
                  <input type="number" placeholder="Días" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.daysPerWeek} onChange={e => setSelectedItem({...selectedItem, daysPerWeek: e.target.value})} />
                </div>
              )}
              {modalType === 'workout' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4"><h3 className="text-xs font-black uppercase text-white/40 tracking-widest">Ejercicios</h3><div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" size={12} /><input type="text" placeholder="Buscar..." className="bg-black/20 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[10px] text-white outline-none w-32" value={exerciseSearch} onChange={e => setExerciseSearch(e.target.value)} /></div></div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(EXERCISE_DB).map(([cat, exs]) => {
                        const filteredExs = exs.filter(ex => ex.toLowerCase().includes(exerciseSearch.toLowerCase()));
                        if (filteredExs.length === 0) return null;
                        return (<div key={cat} className="space-y-2"><p className="text-[10px] font-black text-blue-400 uppercase">{cat}</p><div className="flex flex-wrap gap-2">{filteredExs.map(ex => (<button key={ex} onClick={() => setSelectedItem({...selectedItem, custom_routine: [...selectedItem.custom_routine, {name: ex, sets: "3", reps: "10"}]})} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] hover:bg-blue-600 transition-all">+ {ex}</button>))}</div></div>);
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white/40 mb-4 tracking-widest">Rutina</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                       {selectedItem.custom_routine.map((ex:any, i:number) => (
                         <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                            <div className="flex-1"><p className="font-bold text-xs">{ex.name}</p><div className="flex gap-2 mt-2"><input type="text" className="w-12 bg-black/40 border border-white/5 rounded p-1 text-[10px] text-center" value={ex.sets} onChange={e => { const nr = [...selectedItem.custom_routine]; nr[i].sets = e.target.value; setSelectedItem({...selectedItem, custom_routine: nr}); }} /><input type="text" className="w-12 bg-black/40 border border-white/5 rounded p-1 text-[10px] text-center" value={ex.reps} onChange={e => { const nr = [...selectedItem.custom_routine]; nr[i].reps = e.target.value; setSelectedItem({...selectedItem, custom_routine: nr}); }} /></div></div>
                            <button onClick={() => setSelectedItem({...selectedItem, custom_routine: selectedItem.custom_routine.filter((_:any,idx:number)=>idx!==i)})} className="text-red-500/20 group-hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}
              {modalType === 'member' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.dni} onChange={e => setSelectedItem({...selectedItem, dni: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.membership_type} onChange={e => setSelectedItem({...selectedItem, membership_type: e.target.value})}>{plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-10 border-t border-white/5 pt-8"><button className="flex-1 py-4 text-white/40 font-black uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20" onClick={() => { if(modalType==='plan') handleSavePlan(); else if(modalType==='workout') handleSaveWorkout(); else if(modalType==='member') handleSaveMember(); else if(modalType==='staff') handleSaveStaff(); else if(modalType==='class') handleSaveClass(); }}>Guardar</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-sm">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-green-500">Cobrar</h2>
            <input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-3xl font-black text-white text-center mb-8" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
            <div className="flex gap-4"><button className="flex-1 py-4 text-white/40 font-black uppercase" onClick={() => setIsPaymentModalOpen(false)}>Cerrar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-black uppercase shadow-xl shadow-green-600/20" onClick={handlePayment}>Pagar</button></div>
          </div>
        </div>
      )}

      <aside className="w-52 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-10"><div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30"><Brain size={18} className="text-white" /></div><h1 className="text-lg font-black tracking-tighter">ATLAS</h1></div>
        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={16} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<Settings size={16} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Dumbbell size={16} />} label="Entrenamientos" active={activeTab === 'Entrenamientos'} onClick={() => setActiveTab('Entrenamientos')} />
          <SidebarItem icon={<CalendarIcon size={16} />} label="Calendario" active={activeTab === 'Calendario'} onClick={() => setActiveTab('Calendario')} />
          <SidebarItem icon={<Briefcase size={16} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="h-px bg-white/5 my-6" />
          <SidebarItem icon={<DollarSign size={16} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={16} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-3 bg-red-500/10 hover:bg-red-500 rounded-2xl text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all mt-6">Log Out</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex items-center justify-between mb-10">
          <div><h2 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase">{activeTab}</h2><p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Atlas Management System</p></div>
          <button onClick={handleExportPDF} className="flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all"><Download size={16}/> Descargar Reporte</button>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-white/20 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-[11px] font-black uppercase tracking-widest">{label}</span></div>;
}

function SummaryCard({ title, value, icon, onClick, color }: any) {
  const colors: any = { blue: 'text-blue-400', green: 'text-green-400', orange: 'text-orange-400', purple: 'text-purple-400' };
  return <div onClick={onClick} className="bg-white/5 border border-white/5 p-6 rounded-3xl cursor-pointer hover:border-blue-500/20 transition-all group flex justify-between items-center"><div className="space-y-1"><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{title}</p><p className="text-2xl font-black text-white">{value}</p></div><div className={`${colors[color]} bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-transform`}>{icon}</div></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onEvolution }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase tracking-tighter">Gestión de Socios</h3><button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">+ Nuevo Socio</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {members.map((m: any) => (
           <div key={m.id} className="p-6 bg-white/5 rounded-[32px] border border-white/5 hover:border-blue-500/20 transition-all group">
             <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center font-black text-xl text-blue-500">{m.name[0]}</div><div><p className="font-black text-white text-sm uppercase">{m.name}</p><p className="text-[9px] text-white/20 uppercase font-black">{m.membership_type}</p></div></div>{m.status === 'ACTIVO' ? <CheckCircle className="text-green-500" size={16} /> : <XCircle className="text-red-500" size={16} />}</div>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => onPayClick(m)} className="p-3 bg-green-500/10 text-green-500 rounded-xl text-[9px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Cobrar</button>
               <button onClick={() => onEdit(m)} className="p-3 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Editar</button>
               <button onClick={() => onEvolution(m)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl text-[9px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"><Activity size={12}/> Evolución</button>
               <button onClick={() => onDelete(m.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase">Planes</h3><button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">+ Nuevo Plan</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {plans.map((p: any) => (
           <div key={p.id} className="p-8 bg-white/5 rounded-[40px] border border-white/5 relative overflow-hidden group">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">{p.name}</p>
              <p className="text-5xl font-black mb-8 tracking-tighter">${p.price}<span className="text-sm text-white/20 font-black">/mes</span></p>
              <div className="space-y-3 mb-10">
                 <div className="flex items-center gap-3 text-xs text-white/60 font-bold"><CheckCircle size={14} className="text-green-500"/> {p.daysPerWeek} días por semana</div>
                 <div className="flex items-center gap-3 text-xs text-white/60 font-bold"><CheckCircle size={14} className="text-green-500"/> Acceso a {p.classes.length > 0 ? p.classes.join(', ') : 'Musculación'}</div>
              </div>
              <div className="flex gap-3"><button onClick={()=>onEdit(p)} className="flex-1 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Editar</button><button onClick={()=>onDelete(p.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={20}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function WorkoutsModule({ members, onAssign }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase">Rutinas</h3></div>
      <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-white/20 uppercase text-[10px] font-black tracking-widest"><tr className="border-b border-white/5"><th className="p-6">Socio</th><th className="p-6">Rutina</th><th className="p-6">Acción</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {members.map((m:any) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6 font-black text-white text-sm">{m.name}</td>
                <td className="p-6 text-white/40 text-[11px] uppercase font-bold">{m.custom_routine?.length || 0} Ejercicios Asignados</td>
                <td className="p-6"><button onClick={() => onAssign(m)} className="px-5 py-3 bg-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/20 flex items-center gap-2"><Plus size={14}/> Gestionar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarModule({ classes, onAdd, onEdit }: any) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hours = Array.from({length: 19}, (_, i) => i + 6);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase">Horarios del Gym</h3><div className="flex gap-4 items-center text-[10px] font-black text-white/20 uppercase"><span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-600 rounded-full"/> Clases</span><span className="flex items-center gap-2"><div className="w-2 h-2 bg-white/10 rounded-full"/> Libre</span></div></div>
      <div className="bg-white/5 border border-white/5 rounded-[40px] p-10 overflow-x-auto shadow-3xl">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-white/5 pb-6 mb-6">
             <div />{days.map(d => <p key={d} className="text-center text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">{d}</p>)}
          </div>
          <div className="space-y-2">
             {hours.map(h => (
               <div key={h} className="grid grid-cols-[100px_repeat(7,1fr)] py-2 border-b border-white/5 last:border-none">
                  <div className="text-xs text-white/20 font-black pr-6 text-right flex items-center justify-end">{h}:00</div>
                  {days.map(d => {
                    const cls = classes.filter((c:any) => c.day === d && parseInt(c.startTime.split(':')[0]) === h);
                    return (
                      <div key={d} onClick={()=>onAdd(d, h)} className="min-h-[60px] px-3 flex flex-col gap-2 justify-center cursor-pointer hover:bg-white/5 transition-all rounded-2xl group border border-transparent hover:border-white/5 relative">
                         {cls.map((c:any, i:number) => (
                           <div key={i} onClick={(e)=>{e.stopPropagation(); onEdit(c);}} className="p-3 bg-blue-600 border border-blue-400 rounded-2xl text-white text-[9px] font-black leading-tight shadow-xl shadow-blue-600/20 group-hover:scale-[1.02] transition-transform animate-in zoom-in">
                              <p className="uppercase mb-1">{c.name}</p><p className="text-white/60 font-bold">{c.startTime} - {c.endTime}</p>
                           </div>
                         ))}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16} className="text-white/20"/></div>
                      </div>
                    );
                  })}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffModule({ staff, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="font-black text-xl uppercase">Personal del Staff</h3><button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">+ Nuevo Staff</button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {staff.map((s: any) => (
           <div key={s.id} className="p-8 bg-white/5 rounded-[40px] border border-white/5 group hover:border-blue-500/20 transition-all">
             <div className="flex items-center gap-5 mb-8"><div className="w-16 h-16 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 text-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">{s.name[0]}</div><div><p className="font-black text-white text-base uppercase mb-1">{s.name}</p><p className="text-[9px] text-white/20 uppercase font-black tracking-widest">{s.role}</p></div></div>
             <div className="flex gap-3"><button onClick={() => onEdit(s)} className="flex-1 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Editar Perfil</button><button onClick={() => onDelete(s.id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"><Trash2 size={18}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function FinanceModule({ data, startDate, setStartDate, endDate, setEndDate }: any) {
  if (!data) return <p>Cargando...</p>;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-[32px] border border-white/5">
         <div className="flex items-center gap-6">
            <div className="space-y-1"><label className="text-[10px] text-white/20 uppercase font-black">Desde</label><input type="date" className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs outline-none" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div>
            <div className="space-y-1"><label className="text-[10px] text-white/20 uppercase font-black">Hasta</label><input type="date" className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs outline-none" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
         </div>
         <div className="flex gap-8"><div className="text-right"><p className="text-[9px] text-white/20 uppercase font-black">Margen Neto</p><p className="text-2xl font-black text-green-500">+24.5%</p></div><div className="text-right"><p className="text-[9px] text-white/20 uppercase font-black">ARPU</p><p className="text-2xl font-black text-white">${data.arpu}</p></div></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[40px] p-10"><h3 className="font-black mb-10 text-[11px] text-white/20 uppercase tracking-[0.3em]">Crecimiento Financiero Proyectado</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={10} /><YAxis stroke="#444" fontSize={10} /><Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'20px'}}/><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.1} /><Area type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={4} fill="#ef4444" fillOpacity={0.05} /></AreaChart></ResponsiveContainer></div></div>
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center text-center">
           <h3 className="font-black mb-10 text-[11px] text-white/20 uppercase tracking-[0.3em] w-full">Churn Rate IA</h3>
           <div className="relative w-48 h-48 flex items-center justify-center"><div className="text-5xl font-black text-red-500">{data.churn_rate}%</div><div className="absolute inset-0 border-8 border-red-500/20 rounded-full border-t-red-500 animate-spin-slow"/></div>
           <p className="mt-8 text-xs text-white/40 font-bold max-w-[150px]">Riesgo de pérdida de socios este mes</p>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, startDate, setStartDate, endDate, setEndDate }: any) {
  if (!data) return <p>Cargando...</p>;
  return (
    <div className="space-y-8">
      <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex gap-6">
         <div className="space-y-1"><label className="text-[10px] text-white/20 uppercase font-black">Periodo Analítico</label><div className="flex gap-2"><input type="date" className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs" value={startDate} onChange={e=>setStartDate(e.target.value)}/><input type="date" className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-10"><h3 className="font-black mb-10 text-[11px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-4"><Target size={18} className="text-blue-500" /> Rendimiento Operativo</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="#222" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 10 }} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} /></RadarChart></ResponsiveContainer></div></div>
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-10"><h3 className="font-black mb-10 text-[11px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-4"><TrendingUp size={18} className="text-green-500" /> Flujo de Socios</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.member_growth}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={10} /><Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'20px'}}/><Bar dataKey="altas" fill="#10b981" radius={[5, 5, 0, 0]} /><Bar dataKey="bajas" fill="#ef4444" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      </div>
    </div>
  );
}

function NoAccess() {
  return <div className="h-64 flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[40px] border border-white/10"><Lock size={48} className="text-red-500 mb-6" /><h3 className="text-xl font-black text-white uppercase tracking-widest">Acceso Restringido</h3><p className="text-white/20 text-xs font-bold mt-2">No tienes permisos para ver este módulo.</p></div>;
}

import { LayoutDashboard, Users, Brain, TrendingUp, DollarSign, Lock, ShieldCheck, Briefcase, Download, Target, CheckCircle, XCircle, Trash2, Dumbbell, Calendar as CalendarIcon, Flame, Plus, X, Search, Settings, ArrowUpRight, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, LineChart, Line
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
  const [classes] = useState<any[]>([
    { id: 1, name: "Yoga", day: "Lunes", time: "09:00", instructor: "Ana" },
    { id: 2, name: "CrossFit", day: "Martes", time: "18:00", instructor: "Marcos" },
    { id: 3, name: "Spinning", day: "Miércoles", time: "19:00", instructor: "Elena" },
  ]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'staff' | 'workout' | 'plan' | 'evolution'>('member');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'admin123') {
      setIsAuthenticated(true);
      setUserRole('admin');
    } else if (loginUser === 'operador' && loginPass === 'operador123') {
      setIsAuthenticated(true);
      setUserRole('operador');
      setActiveTab('Resumen');
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const refreshData = async () => {
    if (members.length === 0) {
      setMembers([
        { 
          id: 1, name: "Neon Matrix", dni: "1111", password: "123", status: "ACTIVO", membership_type: "Elite", expiry_date: "2026-05-20", 
          custom_routine: [{name: "Press de Banca", sets: "4", reps: "10"}, {name: "Sentadillas", sets: "3", reps: "12"}], 
          assigned_classes: ["Yoga"],
          evolution: [
            { date: "2026-01-01", exercise: "Press de Banca", weight: 50 },
            { date: "2026-02-01", exercise: "Press de Banca", weight: 60 },
            { date: "2026-03-01", exercise: "Press de Banca", weight: 75 },
          ]
        },
        { id: 2, name: "Sarah Connor", dni: "2222", password: "123", status: "DEUDA", membership_type: "Premium", expiry_date: "2026-04-10", custom_routine: [], assigned_classes: [], evolution: [] },
      ]);
    }
    if (staff.length === 0) {
      setStaff([{ id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" }]);
    }
    setFinanceData({
      cashflow_data: [{ month: "Ene", ingresos: 4800, egresos: 3000 }, { month: "Feb", ingresos: 6500, egresos: 3200 }, { month: "Mar", ingresos: 8900, egresos: 3500 }, { month: "Abr", ingresos: 12450, egresos: 4000 }],
      revenue_distribution: [{ name: "Básico", value: 3000 }, { name: "Premium", value: 5500 }, { name: "Elite", value: 3950 }],
      total_revenue: 12450,
      total_expenses: 13700,
      arpu: 87.5,
      churn_rate: 2.4
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
    doc.setFontSize(18); doc.text('GYM ATLAS: REPORTE FINANCIERO Y ANALÍTICO', 14, 22);
    doc.setFontSize(11); doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text('RESUMEN EJECUTIVO', 14, 45);
    autoTable(doc, {
      startY: 50,
      head: [['Métrica', 'Valor']],
      body: [
        ['Ingresos Totales', `$${financeData.total_revenue}`],
        ['Egresos Totales', `$${financeData.total_expenses}`],
        ['Socios Activos', members.length.toString()],
        ['Tasa de Abandono (Churn)', `${financeData.churn_rate}%`],
        ['ARPU', `$${financeData.arpu}`]
      ]
    });

    doc.text('RIESGO DE ABANDONO (IA PREDICTIONS)', 14, (doc as any).lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Socio', 'Racha', 'Riesgo']],
      body: aiData.streaks.map((s:any) => [s.name, `${s.racha} días`, `${s.risk}%`])
    });

    doc.save(`Reporte_Atlas_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSavePlan = () => {
    if (isEditMode) setPlans(prev => prev.map(p => p.id === selectedItem.id ? { ...selectedItem } : p));
    else setPlans(prev => [...prev, { id: Date.now(), ...selectedItem }]);
    setIsModalOpen(false);
  };

  const handleSaveMember = () => {
    if (isEditMode) setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...selectedItem } : m));
    else setMembers(prev => [...prev, { id: Date.now(), ...selectedItem, custom_routine: [], assigned_classes: [], evolution: [], password: '123' }]);
    setIsModalOpen(false);
  };

  const handleSaveStaff = () => {
    if (isEditMode) setStaff(prev => prev.map(s => s.id === selectedItem.id ? { ...selectedItem } : s));
    else setStaff(prev => [...prev, { id: Date.now(), ...selectedItem }]);
    setIsModalOpen(false);
  };

  const handleSaveWorkout = () => {
    setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, custom_routine: selectedItem.custom_routine, assigned_classes: selectedItem.assigned_classes } : m));
    setIsModalOpen(false);
  };

  const handlePayment = () => {
    setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, status: 'ACTIVO', expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } : m));
    setIsPaymentModalOpen(false); setPaymentAmount(''); refreshData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onEvolution={(m:any)=>{setSelectedItem(m); setModalType('evolution'); setIsModalOpen(true);}} onEdit={(m: any) => { setSelectedItem(m); setIsEditMode(true); setModalType('member'); setIsModalOpen(true); }} onDelete={(id: any) => setMembers(m => m.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', dni:'', status:'ACTIVO', membership_type:'Premium'}); setIsEditMode(false); setModalType('member'); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedItem(m); setIsPaymentModalOpen(true); }} />;
      case 'Planes': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType('plan'); setIsModalOpen(true);}} onDelete={(id:any)=>setPlans(p=>p.filter(x=>x.id!==id))} onAddClick={()=>{setSelectedItem({name:'', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType('plan'); setIsModalOpen(true);}} />;
      case 'Staff': return <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem(s); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={(id: any) => setStaff(st => st.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', role:'Entrenador', shift:'Mañana'}); setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} />;
      case 'Entrenamientos': return <WorkoutsModule members={members} onAssign={(m: any) => { setSelectedItem({...m, custom_routine: m.custom_routine || [], assigned_classes: m.assigned_classes || []}); setModalType('workout'); setIsModalOpen(true); }} />;
      case 'Calendario': return <CalendarModule classes={classes} />;
      case 'Finanzas': return userRole === 'admin' ? <FinanceModule data={financeData} /> : <NoAccess />;
      case 'Analítica IA': return userRole === 'admin' ? <AIAnalyticsModule data={aiData} /> : <NoAccess />;
      default: return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Socios" value={members.length} icon={<Users size={18}/>} onClick={() => setActiveTab('Socios')} color="blue" />
            <SummaryCard title="Caja" value={`$${financeData?.total_revenue?.toLocaleString()}`} icon={<DollarSign size={18}/>} onClick={() => setActiveTab('Finanzas')} color="green" />
            <SummaryCard title="Rachas" value={aiData?.streaks?.length || 0} icon={<Flame size={18}/>} onClick={() => setActiveTab('Analítica IA')} color="orange" />
            <SummaryCard title="Planes" value={plans.length} icon={<Settings size={18}/>} onClick={() => setActiveTab('Planes')} color="purple" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex justify-between">Ingresos vs Egresos <ArrowUpRight size={14} className="text-white/20"/></h3>
              <div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financeData?.cashflow_data}><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}/><Area type="monotone" dataKey="egresos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4">Predicción de Crecimiento IA</h3>
              <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={aiData?.predictions}><Bar dataKey="proy" fill="#8b5cf6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
          </div>
        </div>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-sm bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl">
          <div className="flex justify-center mb-6"><ShieldCheck size={48} className="text-blue-500" /></div>
          <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-tight">Acceso Atlas</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[13px]">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full ${modalType === 'evolution' || modalType === 'workout' ? 'max-w-4xl' : 'max-w-md'} shadow-2xl my-auto`}>
            <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold uppercase tracking-widest text-blue-500">{modalType}</h2><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-white/20"/></button></div>
            <div className="space-y-4">
              {modalType === 'evolution' && (
                <div className="space-y-6">
                   <div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={selectedItem.evolution}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><XAxis dataKey="date" stroke="#444" fontSize={10}/><YAxis stroke="#444" fontSize={10}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none'}}/><Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{r:6, fill:'#3b82f6'}} /></LineChart></ResponsiveContainer></div>
                   <div className="grid grid-cols-3 gap-4">
                      {selectedItem.evolution.map((ev:any, i:number)=>(
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                           <p className="text-[10px] text-white/20 font-bold uppercase">{ev.date}</p>
                           <p className="text-xl font-black">{ev.weight}kg</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
              {modalType === 'plan' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre del Plan" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="number" placeholder="Precio" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.price} onChange={e => setSelectedItem({...selectedItem, price: e.target.value})} />
                  <input type="number" placeholder="Días por Semana" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.daysPerWeek} onChange={e => setSelectedItem({...selectedItem, daysPerWeek: e.target.value})} />
                </div>
              )}
              {modalType === 'workout' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-black uppercase text-white/40 tracking-widest">Base de Ejercicios</h3>
                      <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" size={12} /><input type="text" placeholder="Buscar..." className="bg-black/20 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[10px] text-white outline-none focus:border-blue-500/50 w-32" value={exerciseSearch} onChange={e => setExerciseSearch(e.target.value)} /></div>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(EXERCISE_DB).map(([cat, exs]) => {
                        const filteredExs = exs.filter(ex => ex.toLowerCase().includes(exerciseSearch.toLowerCase()));
                        if (filteredExs.length === 0) return null;
                        return (
                          <div key={cat} className="space-y-2">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{cat}</p>
                             <div className="flex flex-wrap gap-2">{filteredExs.map(ex => (<button key={ex} onClick={() => setSelectedItem({...selectedItem, custom_routine: [...selectedItem.custom_routine, {name: ex, sets: "3", reps: "10"}]})} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] hover:bg-blue-600 hover:border-blue-500 transition-all">+ {ex}</button>))}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white/40 mb-4 tracking-widest">Rutina de {selectedItem.name}</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                       {selectedItem.custom_routine.map((ex:any, i:number) => (
                         <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                            <div className="flex-1"><p className="font-bold text-xs">{ex.name}</p><div className="flex gap-2 mt-2"><input type="text" className="w-12 bg-black/40 border border-white/5 rounded p-1 text-[10px] text-center" value={ex.sets} onChange={e => { const nr = [...selectedItem.custom_routine]; nr[i].sets = e.target.value; setSelectedItem({...selectedItem, custom_routine: nr}); }} placeholder="Sets" /><input type="text" className="w-12 bg-black/40 border border-white/5 rounded p-1 text-[10px] text-center" value={ex.reps} onChange={e => { const nr = [...selectedItem.custom_routine]; nr[i].reps = e.target.value; setSelectedItem({...selectedItem, custom_routine: nr}); }} placeholder="Reps" /></div></div>
                            <button onClick={() => setSelectedItem({...selectedItem, custom_routine: selectedItem.custom_routine.filter((_:any,idx:number)=>idx!==i)})} className="text-red-500/20 group-hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                       ))}
                       {selectedItem.custom_routine.length === 0 && <p className="text-[10px] text-white/10 text-center py-10 italic">No hay ejercicios asignados.</p>}
                    </div>
                  </div>
                </div>
              )}
              {modalType === 'member' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.dni} onChange={e => setSelectedItem({...selectedItem, dni: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={selectedItem?.membership_type} onChange={e => setSelectedItem({...selectedItem, membership_type: e.target.value})}>
                    {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-8 border-t border-white/5 pt-6"><button className="flex-1 py-3 text-white/40 font-bold" onClick={() => setIsModalOpen(false)}>Cerrar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl font-bold" onClick={modalType === 'plan' ? handleSavePlan : modalType === 'workout' ? handleSaveWorkout : modalType === 'member' ? handleSaveMember : handleSaveStaff}>Guardar Cambios</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Cobrar a {selectedItem.name}</h2>
            <input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-bold text-white" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
            <div className="flex gap-3 mt-8"><button className="flex-1 py-3 text-white/40" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</button><button className="flex-1 py-3 bg-green-600 rounded-xl font-bold" onClick={handlePayment}>Pagar</button></div>
          </div>
        </div>
      )}

      <aside className="w-52 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8"><div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><Brain size={16} className="text-white" /></div><h1 className="text-base font-bold tracking-tight">ATLAS</h1></div>
        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={16} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<Settings size={16} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Dumbbell size={16} />} label="Entrenamientos" active={activeTab === 'Entrenamientos'} onClick={() => setActiveTab('Entrenamientos')} />
          <SidebarItem icon={<CalendarIcon size={16} />} label="Calendario" active={activeTab === 'Calendario'} onClick={() => setActiveTab('Calendario')} />
          <SidebarItem icon={<Briefcase size={16} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="h-px bg-white/5 my-4" />
          <SidebarItem icon={<DollarSign size={16} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={16} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 text-[10px] font-bold mt-4">Log Out</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 relative">
        <header className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-white mb-1">{activeTab}</h2><p className="text-[10px] text-white/20 uppercase tracking-widest">Management Core</p></div>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest"><Download size={14}/> Exportar Reporte PDF</button>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-[11px] font-bold">{label}</span></div>;
}

function SummaryCard({ title, value, icon, onClick, color }: any) {
  const colors: any = { blue: 'text-blue-400', green: 'text-green-400', orange: 'text-orange-400', purple: 'text-purple-400' };
  return <div onClick={onClick} className="bg-white/5 border border-white/5 p-5 rounded-2xl cursor-pointer hover:border-white/10 transition-all group flex justify-between items-center"><div className="space-y-1"><p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{title}</p><p className="text-xl font-bold text-white">{value}</p></div><div className={`${colors[color]} bg-white/5 p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>{icon}</div></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onEvolution }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Socios</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-blue-600/20">+ Nuevo Socio</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {members.map((m: any) => (
           <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
             <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center font-bold">{m.name[0]}</div><div><p className="font-bold text-white text-xs">{m.name}</p><p className="text-[8px] text-white/20 uppercase font-black">{m.membership_type}</p></div></div>{m.status === 'ACTIVO' ? <CheckCircle className="text-green-500" size={14} /> : <XCircle className="text-red-500" size={14} />}</div>
             <div className="grid grid-cols-2 gap-2 mt-4">
               <button onClick={() => onPayClick(m)} className="p-2 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-bold hover:bg-green-500 hover:text-white transition-all">Cobrar</button>
               <button onClick={() => onEdit(m)} className="p-2 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold hover:bg-white/20 transition-all">Editar</button>
               <button onClick={() => onEvolution(m)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-1"><Activity size={10}/> Evolución</button>
               <button onClick={() => onDelete(m.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold hover:bg-red-500 transition-all">Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Planes de Membresía</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold">+ Nuevo Plan</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {plans.map((p: any) => (
           <div key={p.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><Settings size={32}/></div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{p.name}</p>
              <p className="text-3xl font-black mb-4">${p.price}<span className="text-xs text-white/20 font-bold"> / mes</span></p>
              <div className="space-y-2 mb-6">
                 <div className="flex items-center gap-2 text-xs text-white/60"><CheckCircle size={12} className="text-green-500"/> {p.daysPerWeek} días por semana</div>
                 <div className="flex items-center gap-2 text-xs text-white/60"><CheckCircle size={12} className="text-green-500"/> {p.classes.length > 0 ? p.classes.join(', ') : 'Solo musculación'}</div>
              </div>
              <div className="flex gap-2"><button onClick={()=>onEdit(p)} className="flex-1 py-2 bg-white/5 rounded-xl text-[10px] font-bold hover:bg-white/10">Editar</button><button onClick={()=>onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function WorkoutsModule({ members, onAssign }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Planificación de Rutinas</h3></div>
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-white/40 uppercase text-[9px] font-bold tracking-widest">
            <tr><th className="p-4">Socio</th><th className="p-4">Ejercicios</th><th className="p-4">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((m:any) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">{m.name}</td>
                <td className="p-4 text-white/30 text-[10px]">{m.custom_routine?.length || 0} Ejercicios Asignados</td>
                <td className="p-4"><button onClick={() => onAssign(m)} className="px-4 py-2 bg-blue-600 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"><Plus size={12}/> Armar Rutina</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarModule({ classes }: any) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hours = Array.from({length: 19}, (_, i) => i + 6);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Agenda de Gimnasio (6:00 - 00:00)</h3></div>
      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/10 pb-4 mb-4">
             <div />{days.map(d => <p key={d} className="text-center text-[10px] font-black text-blue-500 uppercase tracking-widest">{d}</p>)}
          </div>
          <div className="space-y-1">
             {hours.map(h => (
               <div key={h} className="grid grid-cols-[80px_repeat(7,1fr)] group hover:bg-white/5 transition-all py-1">
                  <div className="text-[10px] text-white/20 font-bold pr-4 text-right flex items-center justify-end">{h}:00</div>
                  {days.map(d => {
                    const cls = classes.filter((c:any) => c.day === d && parseInt(c.time.split(':')[0]) === h);
                    return (
                      <div key={d} className="min-h-[40px] border-l border-white/5 px-2 flex flex-col gap-1 justify-center">
                         {cls.map((c:any, i:number) => (
                           <div key={i} className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-[8px] font-black leading-tight animate-in zoom-in">{c.name}<br/><span className="text-white/40">{c.instructor}</span></div>
                         ))}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Staff</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold">+ Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {staff.map((s: any) => (
           <div key={s.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 group">
             <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">{s.name[0]}</div><div><p className="font-bold text-white text-xs">{s.name}</p><p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">{s.role}</p></div></div>
             <div className="flex gap-2"><button onClick={() => onEdit(s)} className="flex-1 p-2 bg-white/5 rounded-lg text-[9px] font-bold hover:bg-white/20 transition-all">Perfil</button><button onClick={() => onDelete(s.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function FinanceModule({ data }: any) {
  if (!data) return <p>Cargando...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-5 bg-white/5 rounded-2xl border border-white/5"><p className="text-[9px] text-white/20 font-bold uppercase mb-1">Margen Neto</p><p className="text-xl font-black text-green-500">+24.5%</p></div>
         <div className="p-5 bg-white/5 rounded-2xl border border-white/5"><p className="text-[9px] text-white/20 font-bold uppercase mb-1">ARPU</p><p className="text-xl font-black">${data.arpu}</p></div>
         <div className="p-5 bg-white/5 rounded-2xl border border-white/5"><p className="text-[9px] text-white/20 font-bold uppercase mb-1">Churn Rate</p><p className="text-xl font-black text-red-500">{data.churn_rate}%</p></div>
         <div className="p-5 bg-white/5 rounded-2xl border border-white/5"><p className="text-[9px] text-white/20 font-bold uppercase mb-1">Lifetime Value</p><p className="text-xl font-black">$45,000</p></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-[10px] text-white/30 uppercase tracking-widest">Ingresos Proyectados vs Real</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={9} /><YAxis stroke="#444" fontSize={9} /><Tooltip contentStyle={{backgroundColor:'#111', border:'none'}}/><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /><Area type="monotone" dataKey="egresos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-[10px] text-white/30 uppercase tracking-widest">Mix de Ingresos</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">{data.revenue_distribution.map((_: any, index: number) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Legend wrapperStyle={{fontSize:'9px'}} /></PieChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data }: any) {
  if (!data) return <p>Cargando...</p>;
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><Target size={14} /> Salud Operativa IA</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} isAnimationActive={false} /></RadarChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14} /> Predicción de Crecimiento</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.member_growth}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={9} /><Tooltip contentStyle={{backgroundColor:'#111', border:'none'}}/><Bar dataKey="altas" fill="#10b981" radius={[3, 3, 0, 0]} /><Bar dataKey="bajas" fill="#ef4444" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
         <h3 className="font-bold mb-6 text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><Flame size={14} /> Monitor de Rachas</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.streaks.map((s:any, i:number) => (
              <div key={i} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center hover:border-blue-500/30 transition-all group">
                 <p className="text-[9px] font-black text-white/20 uppercase mb-2 tracking-[0.2em]">{s.name}</p>
                 <div className="text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform">{s.racha} <span className="text-xl">🔥</span></div>
                 <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className={`h-full ${s.risk > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${s.risk}%`}} /></div>
                 <p className={`text-[8px] font-black mt-2 uppercase tracking-widest ${s.risk > 50 ? 'text-red-500' : 'text-green-500'}`}>{s.risk > 50 ? `Riesgo: ${s.risk}%` : 'Fidelidad Óptima'}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function NoAccess() {
  return <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10"><Lock size={40} className="text-red-500 mb-4" /><h3 className="text-base font-bold text-white">Acceso Restringido</h3></div>;
}

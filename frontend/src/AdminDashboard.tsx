import { LayoutDashboard, Users, Brain, TrendingUp, DollarSign, Lock, ShieldCheck, Briefcase, Download, CheckCircle, XCircle, Trash2, Dumbbell, Calendar as CalendarIcon, Flame, Plus, X, Settings, Activity, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    { id: 1, name: "Yoga", day: "Lunes", startTime: "09:00", endTime: "10:30", instructor: "Ana" },
    { id: 2, name: "CrossFit", day: "Martes", startTime: "18:00", endTime: "19:30", instructor: "Marcos" },
    { id: 3, name: "Spinning", day: "Miércoles", startTime: "19:00", endTime: "20:30", instructor: "Elena" },
  ]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'staff' | 'workout' | 'plan' | 'evolution' | 'class'>('member');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
        { id: 3, name: "John Wick", dni: "3333", password: "123", status: "ACTIVO", membership_type: "Elite", expiry_date: "2026-05-15", custom_routine: [], assigned_classes: [], evolution: [] },
      ]);
    }
    if (staff.length === 0) {
      setStaff([{ id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" }]);
    }
    setFinanceData({
      cashflow_data: [{ month: "Ene", ingresos: 4800, egresos: 3000 }, { month: "Feb", ingresos: 6500, egresos: 3200 }, { month: "Mar", ingresos: 8900, egresos: 3500 }, { month: "Abr", ingresos: 12450, egresos: 4000 }],
      revenue_breakdown: [{ name: "Musculación", value: 8500 }, { name: "Clases", value: 3000 }, { name: "Suplementos", value: 950 }],
      monthly_growth: [{ month: "Ene", v: 12 }, { month: "Feb", v: 18 }, { month: "Mar", v: 22 }, { month: "Abr", v: 28 }],
      total_revenue: 12450, total_expenses: 4000, arpu: 87.5, churn_rate: 2.4
    });
    setAiData({
      performance_radar: [{ subject: 'Retención', A: 85, B: 65 }, { subject: 'Asistencia', A: 78, B: 70 }, { subject: 'Satisfacción', A: 95, B: 80 }, { subject: 'Ingresos', A: 88, B: 60 }],
      member_growth: [{ month: 'Ene', altas: 80, bajas: 10 }, { month: 'Feb', altas: 65, bajas: 15 }, { month: 'Mar', altas: 95, bajas: 18 }],
      streaks: [{ name: "Neon Matrix", racha: 18, risk: 5, status: "Buena Racha" }, { name: "John Wick", racha: 12, risk: 12, status: "Constante" }, { name: "Sarah Connor", racha: 0, risk: 89, status: "En Riesgo" }],
      predictions: [{ month: 'May', proy: 15000, socios: 160 }, { month: 'Jun', proy: 17500, socios: 185 }, { month: 'Jul', proy: 21000, socios: 220 }]
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
  const handleSaveClass = () => { if (isEditMode) setClasses(prev => prev.map(c => c.id === selectedItem.id ? { ...selectedItem } : c)); else setClasses(prev => [...prev, { id: Date.now(), ...selectedItem }]); setIsModalOpen(false); };

  const handlePayment = (amount: string) => { console.log('Paid:', amount); setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, status: 'ACTIVO', expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } : m)); setIsPaymentModalOpen(false); refreshData(); };

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onEvolution={(m:any)=>{setSelectedItem(m); setModalType('evolution'); setIsModalOpen(true);}} onEdit={(m: any) => { setSelectedItem(m); setIsEditMode(true); setModalType('member'); setIsModalOpen(true); }} onDelete={(id: any) => setMembers(m => m.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', dni:'', status:'ACTIVO', membership_type:'Premium'}); setIsEditMode(false); setModalType('member'); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedItem(m); setIsPaymentModalOpen(true); }} />;
      case 'Planes': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType('plan'); setIsModalOpen(true);}} onDelete={(id:any)=>setPlans(p=>p.filter(x=>x.id!==id))} onAddClick={()=>{setSelectedItem({name:'', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType('plan'); setIsModalOpen(true);}} />;
      case 'Staff': return <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem({...s}); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={(id: any) => setStaff(st => st.filter(x => x.id !== id))} onAddClick={() => { setSelectedItem({name:'', role:'Entrenador', shift:'Mañana'}); setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} />;
      case 'Entrenamientos': return <WorkoutsModule members={members} onAssign={(m: any) => { setSelectedItem({...m, custom_routine: m.custom_routine || [], assigned_classes: m.assigned_classes || []}); setModalType('workout'); setIsModalOpen(true); }} />;
      case 'Calendario': return <CalendarModule classes={classes} onAdd={(d:string, h:number)=>{setSelectedItem({name:'Yoga', day:d, startTime:`${h.toString().padStart(2,'0')}:00`, endTime:`${(h+1).toString().padStart(2,'0')}:00`, instructor:'Staff'}); setIsEditMode(false); setModalType('class'); setIsModalOpen(true);}} onEdit={(c:any)=>{setSelectedItem(c); setIsEditMode(true); setModalType('class'); setIsModalOpen(true);}} />;
      case 'Finanzas': return userRole === 'admin' ? <FinanceModule data={financeData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} /> : <NoAccess />;
      case 'Analítica IA': return userRole === 'admin' ? <AIAnalyticsModule data={aiData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} /> : <NoAccess />;
      default: return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard title="Socios Activos" value={members.length} icon={<Users size={16}/>} onClick={() => setActiveTab('Socios')} color="blue" />
            <SummaryCard title="Facturación" value={`$${financeData?.total_revenue?.toLocaleString()}`} icon={<DollarSign size={16}/>} onClick={() => setActiveTab('Finanzas')} color="green" />
            <SummaryCard title="Rachas" value={aiData?.streaks?.filter((s:any)=>s.racha>10).length || 0} icon={<Flame size={16}/>} onClick={() => setActiveTab('Analítica IA')} color="orange" />
            <SummaryCard title="Proyección" value={`$${aiData?.predictions?.[0]?.proy?.toLocaleString()}`} icon={<BarChart3 size={16}/>} onClick={() => setActiveTab('Analítica IA')} color="purple" />
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/5 p-4 rounded-xl"><h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Balance Mensual</h3><div className="h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financeData?.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/><XAxis dataKey="month" stroke="#444" fontSize={9}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}}/><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.1}/><Area type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={3} fill="#ef4444" fillOpacity={0.05}/></AreaChart></ResponsiveContainer></div></div>
             <div className="bg-white/5 border border-white/5 p-4 rounded-xl"><h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Predicción IA Socios</h3><div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={aiData?.predictions}><XAxis dataKey="month" stroke="#444" fontSize={9}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}}/><Bar dataKey="socios" fill="#8b5cf6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></div>
          </div>
        </div>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-3xl shadow-2xl">
          <div className="flex justify-center mb-8"><div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30"><ShieldCheck size={32} className="text-white" /></div></div>
          <h2 className="text-2xl font-black text-center text-white mb-8 tracking-tighter uppercase">Atlas Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all text-center text-xs" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all text-center text-xs" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-black text-white text-xs uppercase tracking-widest transition-all hover:bg-blue-500 shadow-xl shadow-blue-600/20">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[11px] scale-[0.85] origin-top-left w-[125%] h-[125%]">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`bg-neutral-900 border border-white/10 p-8 rounded-[40px] w-full ${modalType === 'evolution' || modalType === 'workout' ? 'max-w-4xl' : 'max-w-md'} shadow-2xl my-auto`}>
            <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-black uppercase tracking-widest text-blue-500">{modalType}</h2><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-white/20 hover:text-white transition-colors"/></button></div>
            <div className="space-y-3">
              {modalType === 'class' && (
                <div className="space-y-4">
                   <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem.name} onChange={e=>setSelectedItem({...selectedItem, name:e.target.value})}>
                      <option value="Spinning">Spinning</option><option value="Yoga">Yoga</option><option value="CrossFit">CrossFit</option><option value="Zumba">Zumba</option><option value="Musculación">Musculación</option>
                   </select>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[9px] text-white/20 uppercase font-black">Desde</label><input type="time" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem.startTime} onChange={e=>setSelectedItem({...selectedItem, startTime:e.target.value})}/></div>
                      <div className="space-y-1"><label className="text-[9px] text-white/20 uppercase font-black">Hasta</label><input type="time" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem.endTime} onChange={e=>setSelectedItem({...selectedItem, endTime:e.target.value})}/></div>
                   </div>
                   <input type="text" placeholder="Instructor" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem.instructor} onChange={e=>setSelectedItem({...selectedItem, instructor:e.target.value})}/>
                </div>
              )}
              {modalType === 'staff' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Nombre" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="text" placeholder="Rol" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.role} onChange={e => setSelectedItem({...selectedItem, role: e.target.value})} />
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.shift} onChange={e => setSelectedItem({...selectedItem, shift: e.target.value})}>
                    <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option>
                  </select>
                </div>
              )}
              {modalType === 'evolution' && (
                <div className="space-y-6">
                   <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={selectedItem.evolution}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><XAxis dataKey="date" stroke="#444" fontSize={9}/><YAxis stroke="#444" fontSize={9}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none'}}/><Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
                   <div className="grid grid-cols-4 gap-3">
                      {selectedItem.evolution.map((ev:any, i:number)=>(<div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 text-center"><p className="text-[8px] text-white/20 uppercase font-black">{ev.date}</p><p className="text-base font-black">{ev.weight}kg</p></div>))}
                   </div>
                </div>
              )}
              {modalType === 'plan' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Plan" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="number" placeholder="Precio" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.price} onChange={e => setSelectedItem({...selectedItem, price: e.target.value})} />
                  <input type="number" placeholder="Días" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.daysPerWeek} onChange={e => setSelectedItem({...selectedItem, daysPerWeek: e.target.value})} />
                </div>
              )}
              {modalType === 'member' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Nombre" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                  <input type="text" placeholder="DNI" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.dni} onChange={e => setSelectedItem({...selectedItem, dni: e.target.value})} />
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.membership_type} onChange={e => setSelectedItem({...selectedItem, membership_type: e.target.value})}>{plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-8 border-t border-white/5 pt-6"><button className="flex-1 py-3 text-white/40 font-black uppercase text-[10px]" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20" onClick={() => { if(modalType==='plan') handleSavePlan(); else if(modalType==='member') handleSaveMember(); else if(modalType==='staff') handleSaveStaff(); else if(modalType==='class') handleSaveClass(); }}>Guardar</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <PaymentModal onPay={handlePayment} onClose={()=>setIsPaymentModalOpen(false)} />
      )}

      <aside className="w-48 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8"><div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Brain size={16} className="text-white" /></div><h1 className="text-base font-black tracking-tighter">ATLAS</h1></div>
        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
          <SidebarItem icon={<LayoutDashboard size={14} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={14} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<Settings size={14} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Dumbbell size={14} />} label="Rutinas" active={activeTab === 'Entrenamientos'} onClick={() => setActiveTab('Entrenamientos')} />
          <SidebarItem icon={<CalendarIcon size={14} />} label="Agenda" active={activeTab === 'Calendario'} onClick={() => setActiveTab('Calendario')} />
          <SidebarItem icon={<Briefcase size={14} />} label="Personal" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="h-px bg-white/5 my-4" />
          <SidebarItem icon={<DollarSign size={14} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={14} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-2 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mt-4">Salir</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 relative">
        <header className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-black text-white tracking-tighter uppercase">{activeTab}</h2><p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em]">Management OS v2.0</p></div>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all"><Download size={14}/> Exportar Reporte</button>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function PaymentModal({ onPay, onClose }: any) {
  const [amt, setAmt] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-sm">
        <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-green-500 text-center">Cobrar Cuota</h2>
        <input type="number" placeholder="Monto" className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-3xl font-black text-white text-center mb-8 outline-none focus:border-green-500" value={amt} onChange={e => setAmt(e.target.value)} />
        <div className="flex gap-4"><button className="flex-1 py-4 text-white/40 font-black uppercase text-[10px]" onClick={onClose}>Cerrar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-green-600/20" onClick={()=>onPay(amt)}>Confirmar</button></div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${active ? 'bg-blue-600 text-white' : 'text-white/20 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>;
}

function SummaryCard({ title, value, icon, onClick, color }: any) {
  const colors: any = { blue: 'text-blue-400', green: 'text-green-400', orange: 'text-orange-400', purple: 'text-purple-400' };
  return <div onClick={onClick} className="bg-white/5 border border-white/5 p-4 rounded-xl cursor-pointer hover:border-blue-500/20 transition-all flex justify-between items-center"><div className="space-y-1"><p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{title}</p><p className="text-xl font-black text-white">{value}</p></div><div className={`${colors[color]} bg-white/5 p-2 rounded-lg`}>{icon}</div></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onEvolution }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase">Socios</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
         {members.map((m: any) => (
           <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/10 transition-all">
             <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center font-black text-blue-500">{m.name[0]}</div><div><p className="font-black text-white text-[10px] uppercase">{m.name}</p><p className="text-[8px] text-white/20 uppercase font-black">{m.membership_type}</p></div></div>{m.status === 'ACTIVO' ? <CheckCircle className="text-green-500" size={12} /> : <XCircle className="text-red-500" size={12} />}</div>
             <div className="grid grid-cols-2 gap-2">
               <button onClick={() => onPayClick(m)} className="py-2 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Cobrar</button>
               <button onClick={() => onEdit(m)} className="py-2 bg-white/5 text-white/40 rounded-lg text-[8px] font-black uppercase">Editar</button>
               <button onClick={() => onEvolution(m)} className="py-2 bg-blue-500/10 text-blue-500 rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-1"><Activity size={10}/> Evol.</button>
               <button onClick={() => onDelete(m.id)} className="py-2 bg-red-500/10 text-red-500 rounded-lg text-[8px] font-black uppercase">Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase">Planes</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {plans.map((p: any) => (
           <div key={p.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative group">
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-2">{p.name}</p>
              <p className="text-3xl font-black mb-4">${p.price}<span className="text-[10px] text-white/20 font-black">/mes</span></p>
              <div className="space-y-1 mb-6">
                 <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold"><CheckCircle size={10} className="text-green-500"/> {p.daysPerWeek} días</div>
                 <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold"><CheckCircle size={10} className="text-green-500"/> {p.classes.join(', ') || 'Musculación'}</div>
              </div>
              <div className="flex gap-2"><button onClick={()=>onEdit(p)} className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase">Editar</button><button onClick={()=>onDelete(p.id)} className="p-2 text-red-500/30 hover:text-red-500"><Trash2 size={14}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function WorkoutsModule({ members, onAssign }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase tracking-tight">Asignación de Rutinas</h3></div>
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-white/20 uppercase text-[9px] font-black tracking-widest border-b border-white/5"><tr ><th className="p-4">Socio</th><th className="p-4">Ejercicios</th><th className="p-4">Acción</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {members.map((m:any) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-black text-white text-[10px] uppercase">{m.name}</td>
                <td className="p-4 text-white/30 text-[9px] uppercase font-black">{m.custom_routine?.length || 0} Ejercicios</td>
                <td className="p-4"><button onClick={() => onAssign(m)} className="px-3 py-1.5 bg-blue-600 rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">Gestionar</button></td>
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
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase">Agenda Operativa</h3></div>
      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/5 pb-4 mb-4">
             <div />{days.map(d => <p key={d} className="text-center text-[9px] font-black text-blue-500 uppercase tracking-widest">{d}</p>)}
          </div>
          <div className="space-y-1">
             {hours.map(h => (
               <div key={h} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/5 last:border-none relative min-h-[40px]">
                  <div className="text-[9px] text-white/20 font-black pr-4 text-right flex items-center justify-end">{h}:00</div>
                  {days.map(d => {
                    const activeClasses = classes.filter((c:any) => {
                       if (c.day !== d) return false;
                       const start = parseInt(c.startTime.split(':')[0]);
                       const end = parseInt(c.endTime.split(':')[0]);
                       const currentH = h;
                       return currentH >= start && currentH < end + (parseInt(c.endTime.split(':')[1]) > 0 ? 1 : 0);
                    });

                    return (
                      <div key={d} onClick={()=>onAdd(d, h)} className="border-l border-white/5 relative min-h-[40px] group cursor-pointer hover:bg-white/5 transition-all">
                         {activeClasses.map((c:any, i:number) => {
                            const isStart = parseInt(c.startTime.split(':')[0]) === h;
                            if (!isStart) return null;
                            const hStart = parseInt(c.startTime.split(':')[0]);
                            const hEnd = parseInt(c.endTime.split(':')[0]);
                            const duration = hEnd - hStart + (parseInt(c.endTime.split(':')[1]) > 0 ? 1 : 0);
                            return (
                              <div key={i} onClick={(e)=>{e.stopPropagation(); onEdit(c);}} 
                                className="absolute left-1 right-1 bg-blue-600/90 border border-blue-400 rounded-lg p-2 text-[8px] font-black z-10 shadow-lg"
                                style={{ height: `${duration * 40}px`, top: '4px' }}>
                                 <p className="uppercase text-white">{c.name}</p>
                                 <p className="text-white/60 font-bold">{c.startTime} - {c.endTime}</p>
                              </div>
                            );
                         })}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} className="text-white/10"/></div>
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
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase">Personal</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {staff.map((s: any) => (
           <div key={s.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
             <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-lg font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">{s.name[0]}</div><div><p className="font-black text-white text-[11px] uppercase mb-1">{s.name}</p><p className="text-[8px] text-white/20 uppercase font-black tracking-widest">{s.role}</p></div></div>
             <div className="flex gap-2"><button onClick={() => onEdit(s)} className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase">Editar</button><button onClick={() => onDelete(s.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={16}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function FinanceModule({ data, startDate, setStartDate, endDate, setEndDate }: any) {
  if (!data) return <p>Cargando...</p>;
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Ingresos por Categoría</h3>
            <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={data.revenue_breakdown} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                        {data.revenue_breakdown.map((_:any, index:number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                     <Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}} />
                     <Legend wrapperStyle={{fontSize:'9px', textTransform:'uppercase', fontWeight:'900'}} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Crecimiento de Ventas</h3>
            <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_growth}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                     <XAxis dataKey="month" stroke="#444" fontSize={9} />
                     <YAxis stroke="#444" fontSize={9} />
                     <Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}} />
                     <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={{r:4}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center">
            <PieIcon size={32} className="text-blue-500 mx-auto mb-4" />
            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Ticket Promedio (ARPU)</p>
            <p className="text-3xl font-black text-white mt-2">${data.arpu}</p>
            <div className="mt-6 flex justify-around"><div className="text-center"><p className="text-[8px] text-white/20 uppercase font-black">Facturado</p><p className="text-base font-black text-green-500">${data.total_revenue}</p></div><div className="text-center"><p className="text-[8px] text-white/20 uppercase font-black">Gastos</p><p className="text-base font-black text-red-500">${data.total_expenses}</p></div></div>
         </div>
      </div>
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
         <div className="flex items-center gap-4">
            <div className="space-y-1"><label className="text-[8px] text-white/20 uppercase font-black">Desde</label><input type="date" className="bg-black/40 border border-white/10 rounded-lg p-2 text-white text-[9px] outline-none" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div>
            <div className="space-y-1"><label className="text-[8px] text-white/20 uppercase font-black">Hasta</label><input type="date" className="bg-black/40 border border-white/10 rounded-lg p-2 text-white text-[9px] outline-none" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
         </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, startDate, setStartDate, endDate, setEndDate }: any) {
  if (!data) return <p>Cargando...</p>;
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
         <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-black uppercase text-white/40 mb-6 flex items-center gap-3"><Flame size={14} className="text-orange-500"/> Análisis de Rachas y Riesgo</h3>
            <div className="space-y-3">
               {data.streaks.map((s:any, i:number)=>(
                 <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center font-black text-[10px] text-white">{s.name[0]}</div>
                       <div><p className="font-black text-white uppercase text-[9px]">{s.name}</p><p className={`text-[8px] font-black uppercase ${s.racha > 10 ? 'text-green-500' : 'text-orange-500'}`}>{s.status} • {s.racha} días</p></div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-white/20 font-black uppercase">Riesgo IA</p>
                       <p className={`text-sm font-black ${s.risk < 20 ? 'text-green-500' : s.risk < 50 ? 'text-orange-500' : 'text-red-500'}`}>{s.risk}%</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="text-[10px] font-black uppercase text-white/40 mb-6 flex items-center gap-3"><TrendingUp size={14} className="text-blue-500"/> Proyecciones Trimestrales</h3>
            <div className="flex-1 space-y-6">
               {data.predictions.map((p:any, i:number)=>(
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center"><p className="text-[9px] font-black uppercase text-white/40">{p.month}</p><p className="text-xs font-black text-white">${p.proy.toLocaleString()}</p></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width: `${(p.socios/250)*100}%`}}/></div>
                    <p className="text-[8px] text-right font-black uppercase text-blue-500">{p.socios} Socios esperados</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6"><h3 className="text-[10px] font-black uppercase text-white/40 mb-6 flex items-center justify-between">Periodo Analítico IA <div className="flex gap-2"><input type="date" className="bg-black/20 border border-white/5 rounded p-1 text-[9px] text-white" value={startDate} onChange={e=>setStartDate(e.target.value)}/><input type="date" className="bg-black/20 border border-white/5 rounded p-1 text-[9px] text-white" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div></h3><div className="h-60"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="#222" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 9 }} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} /></RadarChart></ResponsiveContainer></div></div>
    </div>
  );
}

function NoAccess() {
  return <div className="h-48 flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-2xl border border-white/10"><Lock size={32} className="text-red-500 mb-4" /><h3 className="text-sm font-black text-white uppercase tracking-widest">Acceso Restringido</h3></div>;
}

import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, DollarSign, Lock, ShieldCheck, Briefcase, Download, Target, CheckCircle, XCircle, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';
import jsPDF from 'jspdf';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'operador'>('admin');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Resumen');
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // State Management
  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([
    { id: 1, name: "Básico", price: 3500, duration: "30 días", description: "Acceso a musculación" },
    { id: 2, name: "Premium", price: 5500, duration: "30 días", description: "Musculación + Clases" },
    { id: 3, name: "Elite", price: 8500, duration: "30 días", description: "Personal Trainer + VIP" },
  ]);
  const [payments, setPayments] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'staff' | 'plan'>('member');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [newMember, setNewMember] = useState({ 
    name: '', dni: '', status: 'ACTIVO', membership_type: 'Premium',
    last_payment: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [newStaff, setNewStaff] = useState({ name: '', role: 'Entrenador', status: 'ACTIVO', shift: 'Mañana' });
  const [newPlan, setNewPlan] = useState({ name: '', price: 0, duration: '30 días', description: '' });
  
  const [paymentAmount, setPaymentAmount] = useState('');

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated, startDate, endDate]);

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
    const daysDiff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    const volumeScale = Math.max(0.1, Math.min(2, daysDiff / 30));

    setStats({
      active_members: members.length || 142,
      total_revenue: 18450.50 * volumeScale,
      churn_risk_count: 8,
      por_vencer_count: 15,
      alerts: [
        {"type": "Vencimiento", "message": "12 socios vencen en las próximas 48hs."},
        {"type": "Acceso", "message": "4 intentos de acceso denegados hoy."}
      ]
    });

    if (members.length === 0) {
      setMembers([
        { id: 1, name: "Neon Matrix", dni: "00110011", status: "ACTIVO", membership_type: "Elite", expiry_date: "2026-05-20" },
        { id: 2, name: "Sarah Connor", dni: "10101010", status: "DEUDA", membership_type: "Premium", expiry_date: "2026-04-10" },
        { id: 3, name: "John Wick", dni: "99999999", status: "ACTIVO", membership_type: "Básico", expiry_date: "2026-05-15" },
        { id: 4, name: "Trinity Silva", dni: "77777777", status: "POR VENCER", membership_type: "Elite", expiry_date: "2026-04-28" },
      ]);
    }

    if (staff.length === 0) {
      setStaff([
        { id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" },
        { id: 102, name: "Elena Rojas", role: "Recepcionista", status: "ACTIVO", shift: "Tarde" },
      ]);
    }

    setFinanceData({
      cashflow_data: [
        { month: "Ene", ingresos: 4800, gastos: 2000 }, 
        { month: "Feb", ingresos: 6500, gastos: 3100 },
        { month: "Mar", ingresos: 8900, gastos: 4200 }, 
        { month: "Abr", ingresos: 12450 * volumeScale, gastos: 4800 }
      ],
      revenue_distribution: [
        { name: "Básico", value: 3000 },
        { name: "Premium", value: 5500 },
        { name: "Elite", value: 3950 }
      ],
      recent_transactions: payments.length > 0 ? payments.slice(-5).reverse() : [
        { id: "FAC-001", socio: "Neon Matrix", date: "2026-04-20", amount: 8500, method: "Tarjeta", status: "Pagado" },
        { id: "FAC-002", socio: "John Wick", date: "2026-04-15", amount: 3500, method: "Efectivo", status: "Pagado" },
      ],
      arpu: 5400,
      operating_margin: 62,
      total_revenue: 12450 * volumeScale
    });

    setAiData({
      performance_radar: [
        { subject: 'Retención', A: 85, B: 65 },
        { subject: 'Adquisición', A: 90, B: 75 },
        { subject: 'Asistencia', A: 78, B: 70 },
        { subject: 'Satisfacción', A: 95, B: 80 },
        { subject: 'Ingresos', A: 88, B: 60 },
      ],
      member_growth: [
        { month: 'Oct', altas: 15, bajas: 5 },
        { month: 'Nov', altas: 20, bajas: 8 },
        { month: 'Dic', altas: 45, bajas: 12 },
        { month: 'Ene', altas: 80, bajas: 10 },
        { month: 'Feb', altas: 65, bajas: 15 },
        { month: 'Mar', altas: 95, bajas: 18 },
      ],
      streaks: [
        { name: "Neon Matrix", racha: 18, status: "Buena Racha" },
        { name: "John Wick", racha: 12, status: "Buena Racha" },
        { name: "Trinity Silva", racha: 8, status: "En Peligro" },
      ]
    });
  };

  const handleSaveMember = () => {
    if (isEditMode) {
      setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...selectedItem } : m));
    } else {
      setMembers(prev => [...prev, { id: Date.now(), ...newMember }]);
    }
    setIsModalOpen(false);
  };

  const handleSaveStaff = () => {
    if (isEditMode) {
      setStaff(prev => prev.map(s => s.id === selectedItem.id ? { ...selectedItem } : s));
    } else {
      setStaff(prev => [...prev, { id: Date.now(), ...newStaff }]);
    }
    setIsModalOpen(false);
  };

  const handleSavePlan = () => {
    if (isEditMode) {
      setPlans(prev => prev.map(p => p.id === selectedItem.id ? { ...selectedItem } : p));
    } else {
      setPlans(prev => [...prev, { id: Date.now(), ...newPlan }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('¿Eliminar socio?')) setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm('¿Eliminar personal?')) setStaff(prev => prev.filter(s => s.id !== id));
  };

  const handlePayment = () => {
    const newPayment = {
      id: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      socio: selectedItem.name,
      socio_id: selectedItem.id,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(paymentAmount),
      method: "Efectivo",
      status: "Pagado"
    };
    setPayments(prev => [...prev, newPayment]);
    setMembers(prev => prev.map(m => m.id === selectedItem.id ? { ...m, status: 'ACTIVO', expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } : m));
    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    refreshData();
  };

  const generateInvoicePDF = (payment: any) => {
    const doc = new jsPDF();
    doc.text("RECIBO GYM ATLAS", 15, 20);
    doc.text(`Comprobante: ${payment.id}`, 15, 30);
    doc.text(`Cliente: ${payment.socio}`, 15, 40);
    doc.text(`Monto: $${payment.amount}`, 15, 50);
    doc.save(`Factura_${payment.id}.pdf`);
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFillColor(10, 10, 10);
    pdf.rect(0, 0, 210, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('GYM-ATLAS: REPORTE EJECUTIVO', 15, 20);
    pdf.save(`Reporte_Atlas_${activeTab}.pdf`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl z-10 shadow-2xl">
          <div className="flex justify-center mb-6"><ShieldCheck size={48} className="text-blue-500" /></div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Acceso Atlas</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white transition-all hover:bg-blue-500">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onEdit={(m: any) => { setSelectedItem(m); setIsEditMode(true); setModalType('member'); setIsModalOpen(true); }} onDelete={handleDeleteMember} onAddClick={() => { setIsEditMode(false); setModalType('member'); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedItem(m); setIsPaymentModalOpen(true); }} onHistoryClick={(m: any) => { setSelectedItem(m); setIsHistoryModalOpen(true); }} />;
      case 'Staff': return <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem(s); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={handleDeleteStaff} onAddClick={() => { setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} />;
      case 'Planes': return <PlansModule plans={plans} onEdit={(p: any) => { setSelectedItem(p); setIsEditMode(true); setModalType('plan'); setIsModalOpen(true); }} onAddClick={() => { setIsEditMode(false); setModalType('plan'); setIsModalOpen(true); }} />;
      case 'Finanzas': return userRole === 'admin' ? <FinanceModule data={financeData} chartRef={chartRef1} pieChartRef={chartRef2} /> : <NoAccess />;
      case 'Analítica IA': return userRole === 'admin' ? <AIAnalyticsModule data={aiData} radarRef={chartRef1} growthRef={chartRef2} /> : <NoAccess />;
      default: return (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard title="Total Socios" value={members.length} icon={<Users size={18}/>} onClick={() => setActiveTab('Socios')} color="blue" />
            <SummaryCard title="Caja Total" value={`$${stats?.total_revenue?.toLocaleString()}`} icon={<DollarSign size={18}/>} onClick={() => setActiveTab('Finanzas')} color="green" />
            <SummaryCard title="Riesgo IA" value={aiData?.streaks?.length || 0} icon={<Brain size={18}/>} onClick={() => setActiveTab('Analítica IA')} color="purple" />
            <SummaryCard title="Planes" value={plans.length} icon={<CreditCard size={18}/>} onClick={() => setActiveTab('Planes')} color="orange" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-all" onClick={() => setActiveTab('Finanzas')}>
                <h3 className="text-sm font-bold mb-4">Vista Financiera</h3>
                <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={financeData?.cashflow_data}><Bar dataKey="ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]}/></BarChart></ResponsiveContainer></div>
             </div>
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-all" onClick={() => setActiveTab('Analítica IA')}>
                <h3 className="text-sm font-bold mb-4">Tendencia de Socios</h3>
                <div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={aiData?.member_growth}><Area type="monotone" dataKey="altas" stroke="#10b981" fill="#10b981" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[13px]">
      {/* Universal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold mb-6">{isEditMode ? 'Modificar' : 'Crear'} {modalType === 'member' ? 'Socio' : modalType === 'staff' ? 'Staff' : 'Plan'}</h2>
            <div className="space-y-4">
              {modalType === 'member' && (
                <>
                  <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.name : newMember.name} onChange={e => isEditMode ? setSelectedItem({...selectedItem, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})} />
                  <input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.dni : newMember.dni} onChange={e => isEditMode ? setSelectedItem({...selectedItem, dni: e.target.value}) : setNewMember({...newMember, dni: e.target.value})} />
                </>
              )}
              {modalType === 'staff' && (
                <>
                  <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.name : newStaff.name} onChange={e => isEditMode ? setSelectedItem({...selectedItem, name: e.target.value}) : setNewStaff({...newStaff, name: e.target.value})} />
                  <input type="text" placeholder="Rol" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.role : newStaff.role} onChange={e => isEditMode ? setSelectedItem({...selectedItem, role: e.target.value}) : setNewStaff({...newStaff, role: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.shift : newStaff.shift} onChange={e => isEditMode ? setSelectedItem({...selectedItem, shift: e.target.value}) : setNewStaff({...newStaff, shift: e.target.value})}>
                    <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option>
                  </select>
                </>
              )}
              {modalType === 'plan' && (
                <>
                  <input type="text" placeholder="Nombre Plan" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.name : newPlan.name} onChange={e => isEditMode ? setSelectedItem({...selectedItem, name: e.target.value}) : setNewPlan({...newPlan, name: e.target.value})} />
                  <input type="number" placeholder="Precio" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.price : newPlan.price} onChange={e => isEditMode ? setSelectedItem({...selectedItem, price: parseFloat(e.target.value)}) : setNewPlan({...newPlan, price: parseFloat(e.target.value)})} />
                  <input type="text" placeholder="Descripción" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={isEditMode ? selectedItem.description : newPlan.description} onChange={e => isEditMode ? setSelectedItem({...selectedItem, description: e.target.value}) : setNewPlan({...newPlan, description: e.target.value})} />
                </>
              )}
            </div>
            <div className="flex gap-3 mt-8"><button className="flex-1 py-3 text-white/40" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl font-bold" onClick={modalType === 'member' ? handleSaveMember : modalType === 'staff' ? handleSaveStaff : handleSavePlan}>Guardar</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Cobrar Abono</h2>
            <input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-bold text-white" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
            <div className="flex gap-3 mt-8"><button className="flex-1 py-3 text-white/40" onClick={() => setIsPaymentModalOpen(false)}>Cerrar</button><button className="flex-1 py-3 bg-green-600 rounded-xl font-bold" onClick={handlePayment}>Pagar</button></div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">Historial de {selectedItem.name}</h2><button onClick={() => setIsHistoryModalOpen(false)}>×</button></div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
               {payments.filter(p => p.socio_id === selectedItem.id).map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div><p className="font-bold">{p.date}</p><p className="text-[10px] text-white/30">{p.id}</p></div>
                    <div className="flex items-center gap-4"><p className="font-bold text-green-400">${p.amount}</p><button onClick={() => generateInvoicePDF(p)} className="text-blue-400"><FileText size={16} /></button></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-52 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-10"><div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><Brain size={16} className="text-white" /></div><h1 className="text-base font-bold tracking-tight">ATLAS</h1></div>
        <nav className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={16} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<CreditCard size={16} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Briefcase size={16} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="h-px bg-white/5 my-4" />
          <SidebarItem icon={<DollarSign size={16} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={16} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <div className="mt-auto border-t border-white/5 pt-4">
           <button onClick={() => setIsAuthenticated(false)} className="w-full p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 text-[10px] font-bold">Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        <header className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-white mb-1">{activeTab}</h2><p className="text-[10px] text-white/20 uppercase tracking-widest">Gym Management Core</p></div>
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
             <div className="flex items-center gap-4 px-3">
                <input type="date" className="bg-transparent text-[10px] font-bold outline-none text-white" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <div className="w-px h-5 bg-white/10" />
                <input type="date" className="bg-transparent text-[10px] font-bold outline-none text-white" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
             </div>
             <button onClick={handleExportPDF} className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500"><Download size={14} /></button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-[11px] font-bold">{label}</span></div>;
}

function SummaryCard({ title, value, icon, onClick, color }: any) {
  const colors: any = { blue: 'text-blue-400', green: 'text-green-400', purple: 'text-purple-400', orange: 'text-orange-400' };
  return <div onClick={onClick} className="bg-white/5 border border-white/5 p-5 rounded-2xl cursor-pointer hover:border-white/10 transition-all group flex justify-between items-center"><div className="space-y-1"><p className="text-[9px] font-bold text-white/20 uppercase">{title}</p><p className="text-xl font-bold text-white">{value}</p></div><div className={`${colors[color]} bg-white/5 p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>{icon}</div></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onHistoryClick }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Gestión de Socios</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold">+ Nuevo Socio</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         {members.map((m: any) => (
           <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3"><div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-lg">{m.name[0]}</div><div><p className="font-bold text-white text-xs">{m.name}</p><p className="text-[9px] text-blue-400 uppercase font-black">{m.membership_type}</p></div></div>
               {m.status === 'ACTIVO' ? <CheckCircle className="text-green-500" size={14} /> : <XCircle className="text-red-500" size={14} />}
             </div>
             <div className="bg-black/20 p-2.5 rounded-xl text-[9px] font-bold text-white/20 uppercase space-y-1 mb-4">
                <p>Vence: {m.expiry_date}</p><p>DNI: {m.dni}</p>
             </div>
             <div className="grid grid-cols-2 gap-2">
               <button onClick={() => onPayClick(m)} className="p-2 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-bold hover:bg-green-500 transition-all">Cobrar</button>
               <button onClick={() => onHistoryClick(m)} className="p-2 bg-purple-500/10 text-purple-500 rounded-lg text-[9px] font-bold hover:bg-purple-500 transition-all">Historial</button>
               <button onClick={() => onEdit(m)} className="p-2 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold hover:bg-white/20 transition-all">Editar</button>
               <button onClick={() => onDelete(m.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold hover:bg-red-500 transition-all">Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function StaffModule({ staff, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Equipo de Trabajo</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold">+ Alta Staff</button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {staff.map((s: any) => (
           <div key={s.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 relative group">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-11 h-11 bg-indigo-600/20 rounded-xl flex items-center justify-center font-bold text-indigo-400">{s.name[0]}</div>
               <div><p className="font-bold text-white text-xs">{s.name}</p><p className="text-[9px] font-bold text-white/20 uppercase">{s.role}</p></div>
             </div>
             <div className="bg-black/20 p-2.5 rounded-xl text-[9px] font-medium text-white/30 uppercase mb-4">Turno: {s.shift}</div>
             <div className="flex gap-2">
                <button onClick={() => onEdit(s)} className="flex-1 p-2 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold hover:bg-white/20 transition-all">Perfil</button>
                <button onClick={() => onDelete(s.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold hover:bg-red-500 transition-all"><Trash2 size={12}/></button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans, onEdit, onAddClick }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="font-bold text-base">Configuración de Planes</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold">+ Crear Plan</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {plans.map((p: any) => (
           <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl group">
              <CreditCard size={20} className="text-blue-500 mb-4" />
              <h4 className="text-lg font-bold mb-1">{p.name}</h4>
              <p className="text-[10px] text-white/20 mb-4">{p.description}</p>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-2xl font-black">${p.price}</span><span className="text-[9px] text-white/20 uppercase">/ {p.duration}</span></div>
              <button onClick={() => onEdit(p)} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-600 transition-all">Configurar</button>
           </div>
         ))}
      </div>
    </div>
  );
}

function FinanceModule({ data, chartRef, pieChartRef }: any) {
  if (!data) return <p>Cargando...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div ref={chartRef} className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-xs uppercase tracking-widest text-white/30">Balance de Ingresos</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={9} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} /><Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }} /><Bar dataKey="ingresos" fill="#3b82f6" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </div>
        <div ref={pieChartRef} className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-xs uppercase tracking-widest text-white/30">Mix Comercial</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">{data.revenue_distribution.map((_: any, index: number) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px' }} /><Legend wrapperStyle={{ fontSize: '9px' }} /></PieChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, radarRef, growthRef }: any) {
  if (!data) return <p>Cargando...</p>;
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div ref={radarRef} className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-white/30"><Target size={14} /> Salud Operativa</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} isAnimationActive={false} /></RadarChart></ResponsiveContainer></div>
        </div>
        <div ref={growthRef} className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-white/30"><TrendingUp size={14} /> Evolución de Membresía</h3>
          <div className="h-60"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.member_growth}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={9} /><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px' }} /><Area type="monotone" dataKey="altas" stroke="#10b981" fill="#10b981" fillOpacity={0.15} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
}

function NoAccess() {
  return <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10"><Lock size={40} className="text-red-500 mb-4" /><h3 className="text-base font-bold text-white">Acceso Restringido</h3></div>;
}

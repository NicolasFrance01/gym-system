import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle, DollarSign, Activity, Lock, ShieldCheck, Briefcase, Download, Target, Flame, CheckCircle, XCircle, Search, FileText } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'operador'>('admin');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Resumen');
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [plans] = useState<any[]>([
    { id: 1, name: "Básico", price: 3500, duration: "30 días", description: "Acceso a musculación" },
    { id: 2, name: "Premium", price: 5500, duration: "30 días", description: "Musculación + Clases" },
    { id: 3, name: "Elite", price: 8500, duration: "30 días", description: "Personal Trainer + VIP" },
  ]);
  const [payments, setPayments] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ 
    name: '', dni: '', status: 'ACTIVO', membership_type: 'Premium',
    last_payment: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isExporting, setIsExporting] = useState(false);

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
      setLoginError(false);
    } else if (loginUser === 'operador' && loginPass === 'operador123') {
      setIsAuthenticated(true);
      setUserRole('operador');
      setActiveTab('Resumen');
      setLoginError(false);
    } else {
      setLoginError(true);
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

    setStaff([
      { id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" },
      { id: 102, name: "Elena Rojas", role: "Recepcionista", status: "ACTIVO", shift: "Tarde" },
    ]);

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
      attendance_heatmap: [
        {"day": "Lun", "morning": 85, "afternoon": 45, "evening": 120},
        {"day": "Mar", "morning": 90, "afternoon": 35, "evening": 110},
        {"day": "Mié", "morning": 75, "afternoon": 50, "evening": 95},
        {"day": "Jue", "morning": 80, "afternoon": 40, "evening": 130},
        {"day": "Vie", "morning": 60, "afternoon": 65, "evening": 80},
        {"day": "Sáb", "morning": 110, "afternoon": 90, "evening": 40},
        {"day": "Dom", "morning": 130, "afternoon": 60, "evening": 20},
      ],
      churn_factors: [
        {"factor": "Baja Asistencia", "impact": 55},
        {"factor": "Precio", "impact": 20},
        {"factor": "Entrenador", "impact": 15},
        {"factor": "Distancia", "impact": 10},
      ],
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
        { name: "Clark Kent", racha: 4, status: "En Peligro" },
        { name: "Sarah Connor", racha: 0, status: "Racha Perdida" },
      ],
      critical_risk_list: [
        { name: "Sarah Connor", risk: 89, reason: "Ausencia prolongada" },
        { name: "Bruce Wayne", risk: 95, reason: "Impago" },
      ]
    });
  };

  const handleSaveMember = () => {
    if (isEditMode) {
      setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...selectedMember } : m));
    } else {
      setMembers(prev => [...prev, { id: Date.now(), ...newMember }]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handlePayment = () => {
    const newPayment = {
      id: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      socio: selectedMember.name,
      socio_id: selectedMember.id,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(paymentAmount),
      method: "Efectivo",
      status: "Pagado"
    };
    setPayments(prev => [...prev, newPayment]);
    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, status: 'ACTIVO', expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } : m));
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text('GYM-ATLAS: REPORTE EJECUTIVO', 15, 20);
      
      autoTable(pdf, {
        startY: 40,
        head: [['Métrica', 'Valor']],
        body: [['Socios', members.length], ['Ingresos', `$${stats.total_revenue.toFixed(2)}`]],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] }
      });

      const charts = [chartRef1, chartRef2];
      for (const ref of charts) {
        if (ref.current) {
          const canvas = await html2canvas(ref.current, { scale: 1.5, backgroundColor: '#0a0a0a' });
          pdf.addPage();
          pdf.setTextColor(0,0,0);
          pdf.text("Detalle Analítico", 15, 15);
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, 190, 90);
        }
      }
      pdf.save(`Reporte_Atlas_${activeTab}.pdf`);
    } catch (e) { alert("Error PDF"); }
    finally { setIsExporting(false); }
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
            {loginError && <p className="text-red-400 text-xs text-center font-bold">Credenciales Inválidas</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white transition-all hover:bg-blue-500">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onEdit={(m: any) => { setSelectedMember(m); setIsEditMode(true); setIsModalOpen(true); }} onDelete={handleDeleteMember} onAddClick={() => { setIsEditMode(false); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedMember(m); setIsPaymentModalOpen(true); }} onHistoryClick={(m: any) => { setSelectedMember(m); setIsHistoryModalOpen(true); }} />;
      case 'Staff': return <StaffModule staff={staff} />;
      case 'Planes': return <PlansModule plans={plans} />;
      case 'Finanzas': return userRole === 'admin' ? <FinanceModule data={financeData} chartRef={chartRef1} pieChartRef={chartRef2} /> : <NoAccess />;
      case 'Analítica IA': return userRole === 'admin' ? <AIAnalyticsModule data={aiData} radarRef={chartRef1} growthRef={chartRef2} /> : <NoAccess />;
      default: return (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Socios" value={stats?.active_members} trend="+5%" delay="0s" />
            <StatCard title="Caja" value={`$${stats?.total_revenue?.toLocaleString()}`} trend="+12%" delay="0.05s" />
            <StatCard title="Vencen" value={stats?.por_vencer_count} trend="Alerta" caution delay="0.1s" />
            <StatCard title="Staff" value="2 Activos" trend="OK" delay="0.15s" />
          </div>
          <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mb-8 backdrop-blur-xl">
             <div className="flex items-center gap-2 mb-4 text-orange-400"><AlertTriangle size={18} /> <h4 className="font-bold">Centro de Alertas</h4></div>
             <div className="space-y-2">
                {stats?.alerts?.map((a: any, i: number) => (
                  <div key={i} className="text-sm text-white/60 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {a.message}</div>
                ))}
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[14px]">
      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-6">{isEditMode ? 'Editar' : 'Alta'} Socio</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" value={isEditMode ? selectedMember.name : newMember.name} onChange={e => isEditMode ? setSelectedMember({...selectedMember, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})} />
              <input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" value={isEditMode ? selectedMember.dni : newMember.dni} onChange={e => isEditMode ? setSelectedMember({...selectedMember, dni: e.target.value}) : setNewMember({...newMember, dni: e.target.value})} />
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" value={isEditMode ? selectedMember.membership_type : newMember.membership_type} onChange={e => isEditMode ? setSelectedMember({...selectedMember, membership_type: e.target.value}) : setNewMember({...newMember, membership_type: e.target.value})}>
                {plans.map(p => <option key={p.id} value={p.name} className="bg-neutral-900">{p.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-8"><button className="flex-1 py-3 text-white/40" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white" onClick={handleSaveMember}>Guardar</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Cobrar Abono</h2>
            <p className="text-sm text-white/40 mb-6">Socio: <span className="text-white">{selectedMember.name}</span></p>
            <input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-bold text-white outline-none" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
            <div className="flex gap-3 mt-8"><button className="flex-1 py-3 text-white/40" onClick={() => setIsPaymentModalOpen(false)}>Cerrar</button><button className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-white" onClick={handlePayment}>Pagar</button></div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">Historial</h2><button onClick={() => setIsHistoryModalOpen(false)} className="text-white/40">×</button></div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
               {payments.filter(p => p.socio_id === selectedMember.id).map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                    <div><p className="font-bold">{p.date}</p><p className="text-xs text-white/30">{p.id}</p></div>
                    <div className="flex items-center gap-4"><p className="font-bold text-green-400">${p.amount}</p><button onClick={() => generateInvoicePDF(p)} className="text-blue-400"><FileText size={16} /></button></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-5 shrink-0">
        <div className="flex items-center gap-3 mb-10"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Brain size={18} className="text-white" /></div><h1 className="text-lg font-bold tracking-tight">ATLAS</h1></div>
        <nav className="space-y-1.5 flex-1">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={16} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<CreditCard size={16} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Briefcase size={16} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="h-px bg-white/5 my-4" />
          <SidebarItem icon={<DollarSign size={16} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={16} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <div className="mt-auto border-t border-white/5 pt-4">
           <div className="flex items-center gap-2 mb-4 px-2"><div className="w-6 h-6 bg-blue-600 rounded-md text-[10px] flex items-center justify-center font-bold">{userRole[0].toUpperCase()}</div><p className="text-xs font-medium capitalize">{userRole}</p></div>
           <button onClick={() => setIsAuthenticated(false)} className="w-full p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 text-[10px] font-bold">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 z-10 relative">
        <header className="flex items-center justify-between mb-10">
          <div><h2 className="text-3xl font-bold text-white mb-1">{activeTab}</h2><p className="text-xs text-white/30">Gestión de Gimnasio Atlas.</p></div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-lg">
             <div className="flex items-center gap-3 px-3">
                <div className="flex flex-col"><span className="text-[8px] uppercase text-white/30 font-bold">Desde</span><input type="date" className="bg-transparent text-[10px] font-bold outline-none text-white" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col"><span className="text-[8px] uppercase text-white/30 font-bold">Hasta</span><input type="date" className="bg-transparent text-[10px] font-bold outline-none text-white" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
             </div>
            {(activeTab === 'Finanzas' || activeTab === 'Analítica IA') && (
              <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 shadow-lg active:scale-95 transition-all">
                {isExporting ? <Activity size={14} className="animate-spin" /> : <Download size={14} />} {isExporting ? 'Procesando...' : 'PDF'}
              </button>
            )}
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-xs font-bold">{label}</span></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onHistoryClick }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredMembers = members.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(m.dni).includes(searchTerm));
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Socios</h3>
        <div className="flex gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} /><input type="text" placeholder="Buscar..." className="bg-black/20 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-blue-500/50" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold">+ Alta</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         {filteredMembers.map((m: any) => (
           <div key={m.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group relative">
             <div className="absolute top-4 right-4">{m.status === 'ACTIVO' ? <CheckCircle className="text-green-500" size={16} /> : <XCircle className="text-red-500" size={16} />}</div>
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-xl">{m.name[0]}</div>
               <div><p className="font-bold text-white text-sm">{m.name}</p><p className="text-[10px] text-blue-400 uppercase font-black">{m.membership_type}</p></div>
             </div>
             <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4 space-y-1">
                <p className="text-[9px] text-white/20 uppercase font-bold">Vence: {m.expiry_date}</p>
                <p className="text-[9px] text-white/20 uppercase font-bold">DNI: {m.dni}</p>
             </div>
             <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all">
               <button onClick={() => onPayClick(m)} className="p-2 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-bold">Cobrar</button>
               <button onClick={() => onHistoryClick(m)} className="p-2 bg-purple-500/10 text-purple-500 rounded-lg text-[9px] font-bold">Historial</button>
               <button onClick={() => onEdit(m)} className="p-2 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold">Editar</button>
               <button onClick={() => onDelete(m.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold">Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {plans.map((p: any) => (
         <div key={p.id} className="p-8 bg-white/5 border border-white/5 rounded-3xl relative overflow-hidden group">
            <CreditCard size={24} className="text-blue-500 mb-6" />
            <h4 className="text-xl font-bold mb-2">{p.name}</h4>
            <p className="text-xs text-white/30 mb-6">{p.description}</p>
            <div className="flex items-baseline gap-1 mb-8"><span className="text-3xl font-black">${p.price}</span><span className="text-[10px] text-white/20 uppercase">/ {p.duration}</span></div>
            <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">Configurar</button>
         </div>
       ))}
    </div>
  );
}

function StaffModule({ staff }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       {staff.map((s: any) => (
         <div key={s.id} className="p-6 bg-white/5 rounded-2xl border border-white/5">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center font-bold text-indigo-400">{s.name[0]}</div>
             <div><p className="font-bold text-white text-sm">{s.name}</p><p className="text-[10px] font-bold text-white/20 uppercase">{s.role}</p></div>
           </div>
           <div className="bg-black/20 p-3 rounded-xl text-[10px] font-medium text-white/40 uppercase">Turno: {s.shift}</div>
         </div>
       ))}
    </div>
  );
}

function FinanceModule({ data, chartRef, pieChartRef }: any) {
  if (!data) return <p>Cargando...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
         <StatCard title="Bruto" value={`$${data.total_revenue.toLocaleString()}`} trend="+8%" delay="0s" />
         <StatCard title="ARPU" value={`$${data.arpu}`} trend="+4%" delay="0.1s" />
         <StatCard title="Margen" value={`${data.operating_margin}%`} trend="+2%" delay="0.2s" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div ref={chartRef} className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-sm">Flujo Económico</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }} /><Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={pieChartRef} className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 text-sm">Mix Planes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none" isAnimationActive={false}>{data.revenue_distribution.map((_: any, index: number) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px' }} /><Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
         <h3 className="font-bold mb-4 text-sm">Últimas Transacciones</h3>
         <div className="space-y-2">
            {data.recent_transactions.map((tx: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl text-xs">
                 <div className="flex gap-4 items-center">
                    <p className="font-bold w-32">{tx.socio}</p>
                    <p className="text-white/20">{tx.date}</p>
                 </div>
                 <p className="font-bold text-green-400">${tx.amount}</p>
              </div>
            ))}
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
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm"><Target size={16} /> Salud del Negocio</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} isAnimationActive={false} /><Radar name="Meta" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} isAnimationActive={false} /><Legend wrapperStyle={{ fontSize: '10px' }} /></RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={growthRef} className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm"><TrendingUp size={16} /> Retención</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.member_growth}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px' }} /><Area type="monotone" dataKey="altas" name="Altas" stroke="#10b981" fill="#10b981" fillOpacity={0.15} isAnimationActive={false} /><Area type="monotone" dataKey="bajas" name="Bajas" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} isAnimationActive={false} /><Legend wrapperStyle={{ fontSize: '10px' }} /></AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
           <h3 className="font-bold mb-6 flex items-center gap-2 text-sm"><Flame size={16} /> Monitor de Rachas</h3>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.streaks.map((s: any, i: number) => (
                <div key={i} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center">
                   <p className="text-[10px] font-bold text-white/30 uppercase mb-2">{s.name}</p>
                   <div className="text-2xl font-black text-orange-500 flex items-center gap-1">{s.racha} <Flame size={14} /></div>
                   <p className={`text-[8px] font-bold mt-2 ${s.status === 'Buena Racha' ? 'text-green-400' : 'text-yellow-400'}`}>{s.status}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
           <h3 className="font-bold mb-6 flex items-center gap-2 text-sm"><AlertTriangle size={16} /> Riesgo Crítico</h3>
           <div className="space-y-3">
              {data.critical_risk_list.map((risk: any, i: number) => (
                <div key={i} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                   <div><p className="font-bold text-white text-xs">{risk.name}</p><p className="text-[9px] text-white/30">{risk.reason}</p></div>
                   <p className="text-xl font-black text-red-500">{risk.risk}%</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return <div className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-xl group relative overflow-hidden animate-in fade-in zoom-in duration-500" style={{ animationDelay: delay }}><p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">{title}</p><div className="flex items-end justify-between"><h4 className="text-2xl font-bold text-white">{value}</h4><span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${caution ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>{trend}</span></div></div>;
}

function NoAccess() {
  return <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10"><Lock size={48} className="text-red-500 mb-4" /><h3 className="text-lg font-bold text-white">Acceso Restringido</h3></div>;
}

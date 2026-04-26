import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle, DollarSign, Activity, Lock, ShieldCheck, Briefcase, Calendar, Plus, Edit, Trash2, History, FileText, CheckCircle, XCircle, Search, Download, Target } from 'lucide-react';
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
    { id: 1, name: "Básico", price: 3500, duration: "30 días", description: "Acceso a sala de musculación" },
    { id: 2, name: "Premium", price: 5500, duration: "30 días", description: "Musculación + Clases grupales" },
    { id: 3, name: "Elite", price: 8500, duration: "30 días", description: "Todo incluido + Personal trainer" },
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
    name: '', 
    dni: '', 
    status: 'ACTIVO', 
    membership_type: 'Premium',
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
      por_vencer_count: members.filter(m => m.status === 'POR VENCER').length || 15,
      alerts: [
        {"type": "Vencimiento", "message": "12 socios vencen en las próximas 48hs. Enviar recordatorio."},
        {"type": "Acceso", "message": "4 intentos de acceso denegados hoy por falta de pago."}
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
      { id: 101, name: "Marcus Rossi", role: "Entrenador Principal", status: "ACTIVO", shift: "Mañana" },
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
      performance_radar: [
        { subject: 'Retención', A: 85, B: 65 },
        { subject: 'Asistencia', A: 78, B: 70 },
        { subject: 'Satisfacción', A: 95, B: 80 },
        { subject: 'Ingresos', A: 88, B: 60 },
      ],
      member_growth: [
        { month: 'Feb', altas: 65, bajas: 15 },
        { month: 'Mar', altas: 95, bajas: 18 },
        { month: 'Abr', altas: 110, bajas: 12 },
      ],
      streaks: [
        { name: "Neon Matrix", racha: 18, status: "Buena Racha" },
        { name: "John Wick", racha: 12, status: "Buena Racha" },
        { name: "Trinity Silva", racha: 8, status: "En Peligro" },
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
    doc.setFontSize(20);
    doc.text("RECIBO DE PAGO - GYM ATLAS", 15, 20);
    doc.setFontSize(12);
    doc.text(`Comprobante: ${payment.id}`, 15, 35);
    doc.text(`Fecha: ${payment.date}`, 15, 42);
    doc.text(`Cliente: ${payment.socio}`, 15, 55);
    doc.text(`Detalle: Abono Mensual Gym`, 15, 62);
    doc.text(`Monto: $${payment.amount}`, 15, 75);
    doc.text(`Estado: ${payment.status}`, 15, 82);
    doc.save(`Factura_${payment.id}.pdf`);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text('REPORTE EJECUTIVO GYM-ATLAS', 15, 25);
      pdf.setFontSize(10);
      pdf.text(`Generado por: ${userRole.toUpperCase()} | Fecha: ${new Date().toLocaleString()}`, 15, 33);
      
      autoTable(pdf, {
        startY: 50,
        head: [['Métrica', 'Valor']],
        body: [
          ['Socio Activos', stats?.active_members],
          ['Ingresos Totales', `$${stats?.total_revenue?.toFixed(2)}`],
          ['Filtro Aplicado', `${startDate} a ${endDate}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] }
      });

      if (chartRef1.current) {
        const canvas = await html2canvas(chartRef1.current, { scale: 1.5, backgroundColor: '#0a0a0a' });
        pdf.addPage();
        pdf.setTextColor(0,0,0);
        pdf.text("Análisis Gráfico", 15, 20);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 30, 180, 100);
      }

      pdf.save(`Reporte_Atlas_${activeTab}.pdf`);
    } catch (e) {
      alert("Error al exportar reporte.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl z-10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
              <ShieldCheck size={40} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-white tracking-tighter mb-4">Acceso Seguro</h2>
          <p className="text-white/40 text-center mb-10 font-medium">Panel de Control Administrativo</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
              </div>
            </div>
            {loginError && <p className="text-red-400 text-sm text-center font-bold animate-bounce">Credenciales Inválidas</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-500">Autenticar Sistema</button>
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
        <div className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Socios Activos" value={stats?.active_members} trend="+5%" delay="0s" />
            <StatCard title="Recaudación" value={`$${stats?.total_revenue?.toLocaleString()}`} trend="+12%" delay="0.1s" />
            <StatCard title="Por Vencer" value={stats?.por_vencer_count} trend="Crítico" caution delay="0.2s" />
            <StatCard title="Turno Staff" value="Mañana" trend="Ok" delay="0.3s" />
          </div>
          <div className="bg-black/40 border border-white/5 p-10 rounded-[40px] mb-12 backdrop-blur-xl group">
             <div className="flex items-center gap-4 mb-6"><AlertTriangle className="text-orange-400" /><h4 className="text-2xl font-bold">Alertas de Vencimiento y Pagos</h4></div>
             <div className="space-y-4">
                {stats?.alerts?.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> <p className="text-white/80">{a.message}</p></div>
                ))}
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden">
      {/* Modals */}
      {(isModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold mb-10">{isEditMode ? 'Editar Socio' : 'Alta de Socio'}</h2>
            <div className="space-y-6">
              <div><p className="text-[10px] uppercase text-white/40 font-bold mb-2 ml-1 tracking-widest">Nombre Completo</p><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" value={isEditMode ? selectedMember.name : newMember.name} onChange={e => isEditMode ? setSelectedMember({...selectedMember, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})} /></div>
              <div><p className="text-[10px] uppercase text-white/40 font-bold mb-2 ml-1 tracking-widest">DNI / Identificación</p><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" value={isEditMode ? selectedMember.dni : newMember.dni} onChange={e => isEditMode ? setSelectedMember({...selectedMember, dni: e.target.value}) : setNewMember({...newMember, dni: e.target.value})} /></div>
              <div><p className="text-[10px] uppercase text-white/40 font-bold mb-2 ml-1 tracking-widest">Plan Asignado</p>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none" value={isEditMode ? selectedMember.membership_type : newMember.membership_type} onChange={e => isEditMode ? setSelectedMember({...selectedMember, membership_type: e.target.value}) : setNewMember({...newMember, membership_type: e.target.value})}>
                  {plans.map(p => <option key={p.id} value={p.name} className="bg-neutral-900">{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40 font-bold" onClick={() => setIsModalOpen(false)}>Descartar</button><button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20" onClick={handleSaveMember}>{isEditMode ? 'Guardar' : 'Registrar'}</button></div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Cobro de Abono</h2>
            <p className="text-white/40 mb-10 font-medium">Registrando pago para: <span className="text-white font-bold">{selectedMember.name}</span></p>
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-green-400">$</span>
                <input type="number" placeholder="Monto total" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-10 pr-4 text-3xl font-black text-white outline-none focus:border-green-500/50" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40 font-bold" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-lg shadow-green-600/20" onClick={handlePayment}>Procesar Pago</button></div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Historial de Pagos</h2>
              <button className="text-white/40 hover:text-white" onClick={() => setIsHistoryModalOpen(false)}>Cerrar</button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
               {payments.filter(p => p.socio_id === selectedMember.id).length > 0 ? (
                 payments.filter(p => p.socio_id === selectedMember.id).map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                      <div><p className="text-xs text-white/30 font-bold mb-1">{p.id}</p><p className="font-bold text-lg">{p.date}</p></div>
                      <div className="text-right flex items-center gap-6">
                        <div><p className="text-xs text-white/30 font-bold mb-1">Monto</p><p className="font-bold text-green-400 text-lg">${p.amount}</p></div>
                        <button onClick={() => generateInvoicePDF(p)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-blue-400"><FileText size={20} /></button>
                      </div>
                   </div>
                 ))
               ) : <div className="text-center py-10 text-white/20 font-bold">Sin registros de pago previos.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-8 z-20 shrink-0">
        <div className="flex items-center gap-4 mb-14"><div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20"><Brain size={28} className="text-white" /></div><h1 className="text-2xl font-bold tracking-tighter">ATLAS <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-blue-400 uppercase tracking-widest block mt-1">Admin Panel</span></h1></div>
        <nav className="space-y-3 flex-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={20} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<CreditCard size={20} />} label="Planes / Abonos" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          <SidebarItem icon={<Briefcase size={20} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <div className="pt-8 mb-4 border-t border-white/5"><p className="text-[10px] uppercase text-white/20 font-bold tracking-widest ml-4">Empresa / Analítica</p></div>
          <SidebarItem icon={<DollarSign size={20} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Predicciones IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <div className="mt-auto bg-white/5 p-4 rounded-3xl border border-white/5">
           <p className="text-[10px] uppercase text-white/30 font-bold mb-2">Usuario Actual</p>
           <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">{userRole[0].toUpperCase()}</div><p className="text-sm font-bold capitalize">{userRole}</p></div>
           <button onClick={() => setIsAuthenticated(false)} className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-500 text-xs font-bold transition-all">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-black/10 z-10 relative">
        <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-16 gap-10">
          <div><h2 className="text-5xl font-bold text-white mb-3 tracking-tighter">{activeTab}</h2><p className="text-white/40 font-medium text-lg">Sistema Central de Gestión de Gimnasio Atlas.</p></div>
          
          <div className="flex flex-wrap items-center gap-6 bg-white/5 p-4 rounded-[36px] border border-white/10 shadow-2xl backdrop-blur-2xl">
             <div className="flex items-center gap-3 px-5 py-3 bg-black/40 rounded-3xl border border-white/5">
                <Calendar size={20} className="text-blue-400" />
                <div className="flex items-center gap-5">
                   <div className="flex flex-col"><span className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Periodo Inicial</span><input type="date" className="bg-transparent text-xs font-bold outline-none text-white cursor-pointer" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                   <div className="w-px h-8 bg-white/10" />
                   <div className="flex flex-col"><span className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Periodo Final</span><input type="date" className="bg-transparent text-xs font-bold outline-none text-white cursor-pointer" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                </div>
             </div>
            {(activeTab === 'Finanzas' || activeTab === 'Analítica IA' || activeTab === 'Resumen') && (
              <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-3 px-10 py-5 bg-blue-600 rounded-[30px] text-sm font-bold hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95 group">
                {isExporting ? <Activity className="animate-spin" /> : <Download size={20} className="group-hover:translate-y-1 transition-transform" />}
                {isExporting ? 'Procesando...' : 'Exportar Reporte'}
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
  return <div onClick={onClick} className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all cursor-pointer group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{icon}<span className="font-bold tracking-tight">{label}</span></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onHistoryClick }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredMembers = members.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(m.dni).includes(searchTerm));
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[50px] p-12 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <h3 className="text-3xl font-bold tracking-tighter">Administración de Socios</h3>
        <div className="flex gap-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-96 group"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} /><input type="text" placeholder="Buscar por Nombre, DNI..." className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500/50" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <button onClick={onAddClick} className="bg-blue-600 px-10 py-5 rounded-[20px] text-sm font-bold shadow-2xl shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-500">+ Alta Socio</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {filteredMembers.map((m: any) => (
           <div key={m.id} className="p-8 bg-white/5 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-6 right-6 flex flex-col items-center">
                {m.status === 'ACTIVO' ? <CheckCircle className="text-green-400" size={24} /> : <XCircle className="text-red-400" size={24} />}
                <p className={`text-[8px] font-bold uppercase mt-1 ${m.status === 'ACTIVO' ? 'text-green-400' : 'text-red-400'}`}>{m.status === 'ACTIVO' ? 'Acceso OK' : 'Denegado'}</p>
             </div>
             <div className="flex items-center gap-6 mb-10">
               <div className="w-20 h-20 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-[24px] flex items-center justify-center font-bold text-3xl shadow-2xl">{m.name[0]}</div>
               <div><p className="font-bold text-white text-xl mb-1">{m.name}</p><p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{m.membership_type}</p></div>
             </div>
             <div className="space-y-4 mb-8 bg-black/20 p-5 rounded-3xl border border-white/5">
                <div><p className="text-[8px] uppercase text-white/30 font-bold mb-1 tracking-[0.2em]">DNI</p><p className="text-sm font-mono text-white/70">{m.dni}</p></div>
                <div><p className="text-[8px] uppercase text-white/30 font-bold mb-1 tracking-[0.2em]">Vencimiento</p><p className="text-sm font-bold text-white/90">{m.expiry_date}</p></div>
             </div>
             <div className="grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
               <button onClick={() => onPayClick(m)} className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-2xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"><DollarSign size={14} /> Cobrar</button>
               <button onClick={() => onHistoryClick(m)} className="p-3 bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white rounded-2xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"><History size={14} /> Historial</button>
               <button onClick={() => onEdit(m)} className="p-3 bg-white/5 text-white/40 hover:bg-white/20 hover:text-white rounded-2xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"><Edit size={14} /> Editar</button>
               <button onClick={() => onDelete(m.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"><Trash2 size={14} /> Baja</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function PlansModule({ plans }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
       {plans.map((p: any) => (
         <div key={p.id} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[40px] backdrop-blur-xl relative group overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 shadow-xl shadow-blue-600/5"><CreditCard size={32} /></div>
            <h4 className="text-3xl font-bold text-white mb-2">{p.name}</h4>
            <p className="text-white/40 text-sm mb-8 font-medium">{p.description}</p>
            <div className="flex items-baseline gap-2 mb-10">
               <span className="text-5xl font-black text-white">${p.price}</span>
               <span className="text-white/30 text-sm font-bold uppercase tracking-widest">/ {p.duration}</span>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all">Editar Plan</button>
         </div>
       ))}
       <div className="p-10 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-white/20 hover:text-blue-500 hover:border-blue-500/50 transition-all cursor-pointer group">
          <Plus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-xl uppercase tracking-widest">Crear Nuevo Plan</p>
       </div>
    </div>
  );
}

function StaffModule({ staff }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
       {staff.map((s: any) => (
         <div key={s.id} className="p-10 bg-white/5 rounded-[40px] border border-white/5 hover:border-indigo-500/30 transition-all">
           <div className="flex items-center gap-6 mb-8">
             <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[28px] flex items-center justify-center font-bold text-3xl shadow-2xl">{s.name[0]}</div>
             <div><p className="font-bold text-white text-xl mb-1">{s.name}</p><p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">{s.role}</p></div>
           </div>
           <div className="bg-black/30 p-5 rounded-3xl border border-white/5"><p className="text-[10px] uppercase text-white/30 font-bold mb-2 tracking-widest">Turno Asignado</p><p className="text-lg text-white font-bold tracking-tight">{s.shift}</p></div>
         </div>
       ))}
    </div>
  );
}

function FinanceModule({ data, chartRef, pieChartRef }: any) {
  if (!data) return <p className="animate-pulse">Calculando balances...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatCard title="Facturación Bruta" value={`$${data.total_revenue.toLocaleString()}`} trend="+8.2%" delay="0s" />
         <StatCard title="ARPU (Promedio)" value={`$${data.arpu}`} trend="+4.1%" delay="0.1s" />
         <StatCard title="Margen Operativo" value={`${data.operating_margin}%`} trend="+2.5%" delay="0.2s" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div ref={chartRef} className="xl:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[50px] p-12">
          <h3 className="text-2xl font-bold mb-12 tracking-tighter">Evolución Económica vs Gastos</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} /><Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '30px' }} /><Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[8, 8, 0, 0]} /><Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[8, 8, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={pieChartRef} className="bg-[#0a0a0a] border border-white/5 rounded-[50px] p-12">
          <h3 className="text-2xl font-bold mb-12 tracking-tighter">Market Share Interno</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={10} dataKey="value" stroke="none" isAnimationActive={false}>{data.revenue_distribution.map((_: any, index: number) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '20px' }} /><Legend iconType="circle" verticalAlign="bottom" /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, radarRef, growthRef }: any) {
  if (!data) return <p className="animate-pulse">Ejecutando algoritmos predictivos...</p>;
  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div ref={radarRef} className="bg-[#0a0a0a] border border-white/5 rounded-[50px] p-12">
          <h3 className="text-2xl font-bold mb-12 flex items-center gap-4 tracking-tighter"><Target className="text-blue-500" /> Matriz de Salud de Empresa</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 'bold' }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Atlas IA" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} isAnimationActive={false} /><Radar name="Mercado" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} isAnimationActive={false} /><Legend wrapperStyle={{ paddingTop: '20px' }} /></RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={growthRef} className="bg-[#0a0a0a] border border-white/5 rounded-[50px] p-12">
          <h3 className="text-2xl font-bold mb-12 flex items-center gap-4 tracking-tighter"><TrendingUp className="text-green-500" /> Dinámica de Altas y Bajas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.member_growth}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '24px' }} /><Area type="monotone" dataKey="altas" name="Altas" stroke="#10b981" fill="#10b981" fillOpacity={0.2} isAnimationActive={false} /><Area type="monotone" dataKey="bajas" name="Bajas" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} isAnimationActive={false} /><Legend wrapperStyle={{ paddingTop: '20px' }} /></AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return <div className="bg-[#0a0a0a] border border-white/5 rounded-[45px] p-12 backdrop-blur-xl group relative overflow-hidden animate-in fade-in zoom-in duration-1000" style={{ animationDelay: delay }}><div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/5 to-transparent rounded-full translate-x-20 translate-y-[-20px]" /><p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-8">{title}</p><div className="flex items-end justify-between"><h4 className="text-6xl font-black tracking-tighter text-white">{value}</h4><span className={`text-[10px] font-black tracking-widest px-4 py-2 rounded-full uppercase border ${caution ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>{trend}</span></div></div>;
}

function NoAccess() {
  return (
    <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[50px] border border-white/10 backdrop-blur-xl">
       <Lock size={64} className="text-red-500 mb-6 animate-pulse" />
       <h3 className="text-3xl font-bold text-white mb-2">Acceso Restringido</h3>
       <p className="text-white/40 max-w-md">Esta sección es exclusiva para administradores. Por favor, contacte con el gerente de sistemas.</p>
    </div>
  );
}

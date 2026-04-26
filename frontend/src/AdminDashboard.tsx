import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle, DollarSign, Activity, Wallet, Target, UsersRound, Search, Download, Lock, ShieldCheck, Briefcase, Flame, Calendar } from 'lucide-react';
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
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Resumen');
  
  // Advanced Date Filters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Elite' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Refs for charts - Important: must be applied to stable containers
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated, startDate, endDate]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const refreshData = async () => {
    // Logic to simulate data changes based on dates
    const daysDiff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    const volumeScale = Math.max(0.1, Math.min(2, daysDiff / 180));

    // Stats Fallback
    setStats({
      active_members: 142,
      total_revenue: 18450.50 * volumeScale,
      churn_risk_count: 8,
      por_vencer_count: 15,
      alerts: [
        {"type": "abandono", "message": "8 socios muestran patrones de baja asistencia. Acción recomendada: Enviar promo de reactivación."},
        {"type": "ingresos", "message": "Aumento proyectado del 15% en ingresos este mes basado en tendencias históricas."}
      ]
    });

    // Members Fallback
    setMembers([
      { id: 1, name: "Neon Matrix", dni: "00110011", status: "ACTIVO", membership_type: "Elite" },
      { id: 2, name: "Sarah Connor", dni: "10101010", status: "DEUDA", membership_type: "Premium" },
      { id: 3, name: "John Wick", dni: "99999999", status: "ACTIVO", membership_type: "Basic" },
      { id: 4, name: "Trinity Silva", dni: "77777777", status: "POR VENCER", membership_type: "Elite" },
      { id: 5, name: "Bruce Wayne", dni: "55555555", status: "DEUDA", membership_type: "Elite" },
      { id: 6, name: "Clark Kent", dni: "22334455", status: "ACTIVO", membership_type: "Basic" },
    ]);

    // Staff Fallback
    setStaff([
      { id: 101, name: "Marcus Rossi", role: "Entrenador Principal", status: "ACTIVO", shift: "Mañana (06:00 - 14:00)" },
      { id: 102, name: "Elena Rojas", role: "Recepcionista", status: "ACTIVO", shift: "Tarde (14:00 - 22:00)" },
      { id: 103, name: "Dr. Selva", role: "Médico Deportivo", status: "ACTIVO", shift: "Por Turno" },
      { id: 104, name: "Julio M.", role: "Mantenimiento", status: "VACACIONES", shift: "Rotativo" }
    ]);

    // Finance Fallback
    const cashflow = [
      { month: "Nov", ingresos: 4200 * volumeScale, gastos: 2100 * volumeScale }, 
      { month: "Dic", ingresos: 5100 * volumeScale, gastos: 2800 * volumeScale },
      { month: "Ene", ingresos: 4800 * volumeScale, gastos: 2000 * volumeScale }, 
      { month: "Feb", ingresos: 6500 * volumeScale, gastos: 3100 * volumeScale },
      { month: "Mar", ingresos: 8900 * volumeScale, gastos: 4200 * volumeScale }, 
      { month: "Abr", ingresos: 12450 * volumeScale, gastos: 4800 * volumeScale }
    ];

    setFinanceData({
      cashflow_data: cashflow,
      revenue_distribution: [
        { name: "Basic", value: 3000 * volumeScale },
        { name: "Premium", value: 5500 * volumeScale },
        { name: "Elite", value: 3950 * volumeScale }
      ],
      recent_transactions: [
        { id: "TX-1001", socio: "Neon Matrix", date: endDate, amount: 99.99, method: "Tarjeta de Crédito", status: "Completado" },
        { id: "TX-1002", socio: "John Wick", date: endDate, amount: 49.99, method: "Transferencia", status: "Completado" },
      ],
      arpu: 87.67,
      operating_margin: 61.4,
      total_revenue: cashflow.reduce((acc, curr) => acc + curr.ingresos, 0)
    });

    // AI Analytics Fallback
    setAiData({
      attendance_heatmap: [
        {"day": "Lun", "morning": 85, "afternoon": 45, "evening": 120},
        {"day": "Mar", "morning": 90, "afternoon": 35, "evening": 110},
        {"day": "Mié", "morning": 75, "afternoon": 50, "evening": 95},
      ],
      performance_radar: [
        { subject: 'Retención', A: 85, B: 65, fullMark: 100 },
        { subject: 'Adquisición', A: 90, B: 75, fullMark: 100 },
        { subject: 'Asistencia', A: 78, B: 70, fullMark: 100 },
        { subject: 'Satisfacción', A: 95, B: 80, fullMark: 100 },
        { subject: 'Ingresos', A: 88, B: 60, fullMark: 100 },
      ],
      member_growth: [
        { month: 'Ene', altas: 80, bajas: 10 },
        { month: 'Feb', altas: 65, bajas: 15 },
        { month: 'Mar', altas: 95, bajas: 18 },
      ],
      critical_risk_list: [
        { name: "Sarah Connor", dni: "10101010", days_absent: 14, risk: 89, reason: "Baja Asistencia" },
        { name: "Bruce Wayne", dni: "55555555", days_absent: 21, risk: 95, reason: "Deuda Pendiente" },
      ],
      streaks: [
        { name: "Neon Matrix", dni: "00110011", racha: 18, status: "Buena Racha" },
        { name: "John Wick", dni: "99999999", racha: 12, status: "Buena Racha" },
        { name: "Trinity Silva", dni: "77777777", racha: 8, status: "Buena Racha" },
        { name: "Clark Kent", dni: "22334455", racha: 4, status: "En Peligro" },
        { name: "Peter Parker", dni: "44444444", racha: 2, status: "En Peligro" },
        { name: "Sarah Connor", dni: "10101010", racha: 0, status: "Racha Perdida" },
        { name: "Bruce Wayne", dni: "55555555", racha: 0, status: "Racha Perdida" },
      ]
    });

    setPricingData({ calculated_price: 64.99, demand_factor: 1.3 });
  };

  const handleAddMember = () => {
    setMembers(prev => [...prev, { id: Math.floor(Math.random() * 9000) + 1000, ...newMember }]);
    setIsModalOpen(false);
    setNewMember({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Elite' });
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handlePayment = () => {
    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, status: 'ACTIVO' } : m));
    setIsPaymentModalOpen(false);
    setSelectedMember(null);
    setPaymentAmount('');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const addHeader = (title: string) => {
        pdf.setFillColor(15, 15, 15);
        pdf.rect(0, 0, pageWidth, 45, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont("helvetica", "bold");
        pdf.text('GYM-ATLAS: REPORTE DE GESTIÓN', 15, 25);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Período: ${startDate} al ${endDate}`, 15, 35);
        pdf.text(title, pageWidth - 15, 35, { align: 'right' });
        pdf.setTextColor(0, 0, 0);
      };

      addHeader(`MÓDULO: ${activeTab.toUpperCase()}`);

      let currentY = 55;

      // KPI Table
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text('Resumen de Rendimiento', 15, currentY);
      currentY += 8;

      autoTable(pdf, {
        startY: currentY,
        head: [['Indicador Clave', 'Valor Obtenido']],
        body: [
          ['Socios Activos', stats?.active_members || '0'],
          ['Ingresos del Período', `$${stats?.total_revenue?.toFixed(2) || '0.00'}`],
          ['Alertas de Riesgo', stats?.churn_risk_count || '0'],
          ['Fecha de Reporte', new Date().toLocaleString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] }
      });

      currentY = (pdf as any).lastAutoTable.finalY + 15;

      // Data Tables
      if (activeTab === 'Finanzas' && financeData) {
        pdf.text('Historial de Transacciones', 15, currentY);
        autoTable(pdf, {
          startY: currentY + 5,
          head: [['Socio', 'Monto', 'Fecha', 'Método']],
          body: financeData.recent_transactions.map((tx: any) => [tx.socio, `$${tx.amount}`, tx.date, tx.method]),
          theme: 'grid'
        });
        currentY = (pdf as any).lastAutoTable.finalY + 15;
      } else if (activeTab === 'Analítica IA' && aiData) {
        pdf.text('Monitor de Rachas (Fidelización)', 15, currentY);
        autoTable(pdf, {
          startY: currentY + 5,
          head: [['Socio', 'Días Racha', 'Estado']],
          body: aiData.streaks.slice(0, 8).map((s: any) => [s.name, s.racha, s.status]),
          theme: 'grid'
        });
        currentY = (pdf as any).lastAutoTable.finalY + 15;
      }

      // Charts Capture - Improved with delay and direct ref check
      const chartsToCapture = [];
      if (chartRef1.current) chartsToCapture.push({ el: chartRef1.current, title: 'Análisis de Tendencias' });
      if (chartRef2.current) chartsToCapture.push({ el: chartRef2.current, title: 'Distribución de Datos' });

      for (const chart of chartsToCapture) {
        // Wait for animations
        await new Promise(r => setTimeout(r, 500));
        
        try {
          const canvas = await html2canvas(chart.el, { 
            scale: 2, 
            backgroundColor: '#0a0a0a',
            useCORS: true,
            logging: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 180;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (currentY + imgHeight + 20 > pageHeight) {
            pdf.addPage();
            currentY = 20;
          }

          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(chart.title, 15, currentY);
          pdf.addImage(imgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
          currentY += imgHeight + 20;
        } catch (err) {
          console.error("Capture error:", err);
        }
      }

      const filename = `Reporte_${activeTab}_${startDate}_a_${endDate}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Error al generar el reporte detallado.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl z-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white tracking-tighter mb-2">Acceso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            </div>
            {loginError && <p className="text-red-400 text-sm text-center font-bold">Credenciales incorrectas</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Ingresar al Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} onDelete={handleDeleteMember} onAddClick={() => setIsModalOpen(true)} onPayClick={(m: any) => { setSelectedMember(m); setIsPaymentModalOpen(true); }} />;
      case 'Staff': return <StaffModule staff={staff} />;
      case 'Finanzas': return <FinanceModule data={financeData} chartRef={chartRef1} pieChartRef={chartRef2} />;
      case 'Analítica IA': return <AIAnalyticsModule data={aiData} radarRef={chartRef1} growthRef={chartRef2} />;
      default: return (
        <div className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Socios Activos" value={stats?.active_members || '0'} trend="+4.5%" delay="0s" />
            <StatCard title="Ingresos Totales" value={`$${stats?.total_revenue?.toFixed(2) || '0'}`} trend="+12.2%" delay="0.1s" />
            <StatCard title="Riesgo de Abandono" value={stats?.churn_risk_count || '0'} trend="-2.1%" caution delay="0.2s" />
            <StatCard title="Próximos a Vencer" value={stats?.por_vencer_count || '0'} trend="Alerta" caution delay="0.3s" />
          </div>
          <div className="bg-black/40 border border-white/5 p-8 rounded-3xl mb-12 backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={100} className="text-green-400" /></div>
             <div className="flex items-center gap-3 mb-4"><Activity className="text-green-400" /><h4 className="text-xl font-bold">Motor de Precios Dinámicos</h4></div>
             <p className="text-white/50 mb-6 max-w-lg">Ajuste de tarifas basado en demanda horaria y estacionalidad detectada por IA.</p>
             <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5"><p className="text-xs text-white/30 uppercase mb-1">Factor</p><p className="text-2xl font-bold text-white">x{pricingData?.demand_factor || '1.0'}</p></div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5"><p className="text-xs text-white/30 uppercase mb-1">Tarifa Sugerida</p><p className="text-2xl font-bold text-green-400">${pricingData?.calculated_price || '0.00'}</p></div>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden">
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"><div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md"><h2 className="text-2xl font-bold mb-8">Nuevo Socio</h2><div className="space-y-6"><input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} /><input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={newMember.dni} onChange={e => setNewMember({...newMember, dni: e.target.value})} /></div><div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white" onClick={handleAddMember}>Crear</button></div></div></div>}
      {isPaymentModalOpen && selectedMember && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"><div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md"><h2 className="text-2xl font-bold mb-8">Registrar Pago</h2><p className="mb-4 text-white/50">Socio: {selectedMember.name}</p><input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} /><div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white" onClick={handlePayment}>Completar</button></div></div></div>}
      
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-6 z-20 shrink-0">
        <div className="flex items-center gap-3 mb-12"><div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Brain size={24} className="text-white" /></div><h1 className="text-xl font-bold tracking-tighter">GYM-ATLAS</h1></div>
        <nav className="space-y-2 flex-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={20} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<Briefcase size={20} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
          <SidebarItem icon={<CreditCard size={20} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-4 hover:bg-white/5 rounded-2xl text-white/50 text-sm font-bold border-t border-white/5 mt-6">Cerrar Sesión</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 bg-black/10 z-10 relative">
        <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-8">
          <div><h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{activeTab}</h2><p className="text-white/40 font-medium">Control total y análisis predictivo.</p></div>
          
          <div className="flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl">
             <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
                <Calendar size={18} className="text-blue-400" />
                <div className="flex items-center gap-3">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-white/40 font-bold">Desde</span>
                      <input type="date" className="bg-transparent text-xs font-bold outline-none text-white" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                   </div>
                   <div className="w-px h-6 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-white/40 font-bold">Hasta</span>
                      <input type="date" className="bg-transparent text-xs font-bold outline-none text-white" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                   </div>
                </div>
             </div>

            {(activeTab === 'Finanzas' || activeTab === 'Analítica IA') && (
              <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-[24px] text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
                {isExporting ? <Activity className="animate-spin text-white" /> : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />}
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
  return <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{icon}<span className="font-medium">{label}</span></div>;
}

function MembersModule({ members, onDelete, onAddClick, onPayClick }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredMembers = members.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(m.dni).includes(searchTerm));
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h3 className="text-2xl font-bold">Listado de Socios</h3>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} /><input type="text" placeholder="Buscar por Nombre o DNI..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <button onClick={onAddClick} className="bg-blue-600 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">+ Nuevo</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredMembers.map((m: any) => (
           <div key={m.id} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group">
             <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl">{m.name[0]}</div>
               <div><p className="font-bold text-white text-xl">{m.name}</p><p className={`text-xs font-bold uppercase tracking-widest ${m.status === 'ACTIVO' ? 'text-green-400' : 'text-red-400'}`}>{m.status}</p></div>
             </div>
             <div className="space-y-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
               {m.status !== 'ACTIVO' && <button onClick={() => onPayClick(m)} className="w-full py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-xs font-bold transition-all">Pagar Deuda</button>}
               <button onClick={() => onDelete(m.id)} className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all">Eliminar</button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function StaffModule({ staff }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {staff.map((s: any) => (
         <div key={s.id} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group">
           <div className="flex items-center gap-5 mb-8">
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl">{s.name[0]}</div>
             <div><p className="font-bold text-white text-xl">{s.name}</p><p className="text-xs font-bold text-purple-400 uppercase tracking-widest">{s.role}</p></div>
           </div>
           <div className="bg-black/30 p-4 rounded-2xl border border-white/5"><p className="text-xs text-white/30 uppercase tracking-widest mb-1 font-bold">Turno</p><p className="text-sm text-white/80 font-medium">{s.shift}</p></div>
         </div>
       ))}
    </div>
  );
}

function FinanceModule({ data, chartRef, pieChartRef }: any) {
  if (!data) return <p className="animate-pulse">Cargando datos financieros...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex items-center gap-6"><div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-lg shadow-green-500/10"><DollarSign size={28} /></div><div><p className="text-white/40 text-xs uppercase font-bold tracking-widest">Ingresos</p><h4 className="text-3xl font-bold">${data.total_revenue.toLocaleString()}</h4></div></div>
         <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex items-center gap-6"><div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10"><UsersRound size={28} /></div><div><p className="text-white/40 text-xs uppercase font-bold tracking-widest">ARPU</p><h4 className="text-3xl font-bold">${data.arpu}</h4></div></div>
         <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex items-center gap-6"><div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10"><Wallet size={28} /></div><div><p className="text-white/40 text-xs uppercase font-bold tracking-widest">Margen</p><h4 className="text-3xl font-bold">{data.operating_margin}%</h4></div></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div ref={chartRef} className="xl:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Evolución de Ingresos y Gastos</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} /><Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} /><Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} /><Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={pieChartRef} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Mix de Ventas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none" isAnimationActive={false}>{data.revenue_distribution.map((_: any, index: number) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '20px' }} /><Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, radarRef, growthRef }: any) {
  if (!data) return <p className="animate-pulse">Calculando predicciones...</p>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div ref={radarRef} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3 tracking-tight"><Target className="text-blue-500" /> Matriz de Rendimiento</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar} isAnimationActive={false}><PolarGrid stroke="rgba(255,255,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Actual" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} /><Radar name="Proyectado" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} /><Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} /></RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div ref={growthRef} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3 tracking-tight"><TrendingUp className="text-green-500" /> Tasa de Retención vs Bajas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.member_growth} isAnimationActive={false}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} /><YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '20px' }} /><Area type="monotone" dataKey="altas" name="Altas" stroke="#10b981" fill="#10b981" fillOpacity={0.15} /><Area type="monotone" dataKey="bajas" name="Bajas" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} /><Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} /></AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3 tracking-tight"><Flame className="text-orange-500" /> Monitor de Rachas</h3>
          <div className="space-y-4">
            {data.streaks.map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                <div><p className="font-bold text-white text-lg">{s.name}</p><p className={`text-[10px] font-bold uppercase tracking-widest ${s.status === 'Buena Racha' ? 'text-green-400' : s.status === 'En Peligro' ? 'text-yellow-400' : 'text-red-400'}`}>{s.status}</p></div>
                <div className="flex items-center gap-3 text-3xl font-black text-orange-500">{s.racha} <Flame size={24} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3 tracking-tight"><AlertTriangle className="text-red-500" /> Alertas de Abandono Detectadas</h3>
          <div className="space-y-5">
            {data.critical_risk_list.map((risk: any, i: number) => (
              <div key={i} className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between">
                <div><p className="font-bold text-white text-lg">{risk.name}</p><p className="text-xs text-white/50 font-medium">{risk.reason} • Ausente {risk.days_absent} días</p></div>
                <div className="text-right"><p className="text-3xl font-black text-red-500">{risk.risk}%</p><p className="text-[10px] font-bold uppercase text-red-400 tracking-widest">Nivel de Riesgo</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 backdrop-blur-xl group relative overflow-hidden animate-in fade-in zoom-in duration-700" style={{ animationDelay: delay }}><div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full translate-x-16 translate-y-[-16px]" /><p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-6">{title}</p><div className="flex items-end justify-between"><h4 className="text-5xl font-bold tracking-tighter text-white">{value}</h4><span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${caution ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>{trend}</span></div></div>;
}

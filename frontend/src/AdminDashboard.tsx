import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, Activity, Search, Download, ShieldCheck, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
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
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [members, setMembers] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Elite' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Direct IDs for capturing
  const CHART_ID_1 = "chart-container-primary";
  const CHART_ID_2 = "chart-container-secondary";

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
    const daysDiff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    const volumeScale = Math.max(0.1, Math.min(2, daysDiff / 180));

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

    setMembers([
      { id: 1, name: "Neon Matrix", dni: "00110011", status: "ACTIVO", membership_type: "Elite" },
      { id: 2, name: "Sarah Connor", dni: "10101010", status: "DEUDA", membership_type: "Premium" },
      { id: 3, name: "John Wick", dni: "99999999", status: "ACTIVO", membership_type: "Basic" },
      { id: 4, name: "Trinity Silva", dni: "77777777", status: "POR VENCER", membership_type: "Elite" },
      { id: 5, name: "Bruce Wayne", dni: "55555555", status: "DEUDA", membership_type: "Elite" },
    ]);

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

    setAiData({
      attendance_heatmap: [
        {"day": "Lun", "morning": 85, "afternoon": 45, "evening": 120},
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
    if (confirm('¿Estás seguro?')) setMembers(prev => prev.filter(m => m.id !== id));
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
        pdf.setFillColor(20, 20, 20);
        pdf.rect(0, 0, pageWidth, 45, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text('GYM-ATLAS: REPORTE ESTRATÉGICO', 15, 25);
        pdf.setFontSize(9);
        pdf.text(`Desde: ${startDate} Hasta: ${endDate}`, 15, 35);
        pdf.text(title, pageWidth - 15, 35, { align: 'right' });
        pdf.setTextColor(0, 0, 0);
      };

      addHeader(`MÓDULO: ${activeTab.toUpperCase()}`);

      let currentY = 55;

      // KPI Table
      pdf.setFontSize(14);
      pdf.text('Resumen Ejecutivo del Período', 15, currentY);
      currentY += 8;

      autoTable(pdf, {
        startY: currentY,
        head: [['KPI', 'Valor']],
        body: [
          ['Socios Activos', stats?.active_members || '0'],
          ['Ingresos Proyectados', `$${stats?.total_revenue?.toFixed(2) || '0.00'}`],
          ['Alertas Críticas', stats?.churn_risk_count || '0'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] }
      });

      currentY = (pdf as any).lastAutoTable.finalY + 15;

      // Specific Content
      if (activeTab === 'Finanzas' && financeData) {
        pdf.text('Transacciones Detalladas', 15, currentY);
        autoTable(pdf, {
          startY: currentY + 5,
          head: [['Socio', 'Monto', 'Fecha', 'Método']],
          body: financeData.recent_transactions.map((tx: any) => [tx.socio, `$${tx.amount}`, tx.date, tx.method]),
          theme: 'grid'
        });
        currentY = (pdf as any).lastAutoTable.finalY + 15;
      } else if (activeTab === 'Analítica IA' && aiData) {
        pdf.text('Monitor de Retención de Socios', 15, currentY);
        autoTable(pdf, {
          startY: currentY + 5,
          head: [['Socio', 'Racha', 'Estado']],
          body: aiData.streaks.slice(0, 8).map((s: any) => [s.name, s.racha, s.status]),
          theme: 'grid'
        });
        currentY = (pdf as any).lastAutoTable.finalY + 15;
      }

      // Chart Capture
      const ids = [CHART_ID_1, CHART_ID_2];
      const titles = ['Análisis de Tendencias', 'Distribución de Datos'];

      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el) {
          el.scrollIntoView();
          await new Promise(r => setTimeout(r, 800));
          try {
            const canvas = await html2canvas(el, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#0a0a0a',
              onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById(ids[i]);
                if (clonedEl) {
                  clonedEl.style.width = '800px';
                  clonedEl.style.height = '400px';
                  clonedEl.style.visibility = 'visible';
                }
              }
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (currentY + imgHeight + 20 > pageHeight) {
              pdf.addPage();
              currentY = 20;
            }

            pdf.setFontSize(14);
            pdf.text(titles[i], 15, currentY);
            pdf.addImage(imgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
            currentY += imgHeight + 20;
          } catch (e) {}
        }
      }

      pdf.save(`GymAtlas_Reporte_${activeTab}_${startDate}.pdf`);
    } catch (err) {} finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl z-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-tighter">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" placeholder="Usuario" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            {loginError && <p className="text-red-400 text-sm text-center font-bold">Error de acceso</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white active:scale-95 transition-all shadow-xl shadow-blue-600/20">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-6 z-20 shrink-0">
        <div className="flex items-center gap-3 mb-12"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Brain size={24} className="text-white" /></div><h1 className="text-xl font-bold tracking-tighter">GYM-ATLAS</h1></div>
        <nav className="space-y-2 flex-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<Users size={20} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<CreditCard size={20} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-4 hover:bg-white/5 rounded-2xl text-white/50 text-sm font-bold border-t border-white/5 mt-6 transition-colors">Salir</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 bg-black/10 z-10 relative">
        <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-8">
          <div><h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{activeTab}</h2><p className="text-white/40 font-medium">Gestión y Análisis Predictivo.</p></div>
          <div className="flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl">
             <div className="flex items-center gap-4 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
                <Calendar size={18} className="text-blue-400" />
                <input type="date" className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="text-white/20">|</span>
                <input type="date" className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
             </div>
            {(activeTab === 'Finanzas' || activeTab === 'Analítica IA') && (
              <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-[24px] text-sm font-bold hover:bg-blue-700 transition-all shadow-xl group">
                {isExporting ? <Activity className="animate-spin text-white" /> : <Download size={18} />}
                {isExporting ? 'Procesando...' : 'Descargar PDF'}
              </button>
            )}
          </div>
        </header>

        {activeTab === 'Resumen' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Socios Activos" value={stats?.active_members || '0'} trend="+4.5%" delay="0s" />
            <StatCard title="Ingresos" value={`$${stats?.total_revenue?.toFixed(2) || '0'}`} trend="+12.2%" delay="0.1s" />
            <StatCard title="Riesgo Bajas" value={stats?.churn_risk_count || '0'} trend="-2.1%" caution delay="0.2s" />
            <StatCard title="Tarifa IA" value={`$${pricingData?.calculated_price}`} trend="Sugerido" delay="0.3s" />
          </div>
        )}

        {activeTab === 'Socios' && <MembersModule members={members} onDelete={handleDeleteMember} onAddClick={() => setIsModalOpen(true)} onPayClick={(m: any) => { setSelectedMember(m); setIsPaymentModalOpen(true); }} />}
        {activeTab === 'Finanzas' && <FinanceModule data={financeData} id1={CHART_ID_1} id2={CHART_ID_2} />}
        {activeTab === 'Analítica IA' && <AIAnalyticsModule data={aiData} id1={CHART_ID_1} id2={CHART_ID_2} />}
      </main>

      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"><div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md"><h2 className="text-2xl font-bold mb-8">Nuevo Socio</h2><div className="space-y-6"><input type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} /><input type="text" placeholder="DNI" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={newMember.dni} onChange={e => setNewMember({...newMember, dni: e.target.value})} /></div><div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white" onClick={handleAddMember}>Crear</button></div></div></div>}
      {isPaymentModalOpen && selectedMember && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"><div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md"><h2 className="text-2xl font-bold mb-8">Pagar</h2><p className="mb-4 text-white/50 font-medium">Socio: {selectedMember.name}</p><input type="number" placeholder="Monto" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} /><div className="flex gap-4 mt-12"><button className="flex-1 py-4 text-white/40" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-xl shadow-green-600/10" onClick={handlePayment}>Pagar</button></div></div></div>}
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{icon}<span className="font-medium">{label}</span></div>;
}

function MembersModule({ members, onDelete, onAddClick, onPayClick }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredMembers = members.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-10 gap-6">
        <h3 className="text-2xl font-bold tracking-tight">Directorio de Socios</h3>
        <div className="flex gap-4"><div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" /><input type="text" placeholder="Buscar..." className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-blue-500 transition-colors" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><button onClick={onAddClick} className="bg-blue-600 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">+ Nuevo</button></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredMembers.map((m: any) => (
           <div key={m.id} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group">
             <div className="flex items-center gap-5 mb-8"><div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">{m.name[0]}</div><div><p className="font-bold text-white text-xl">{m.name}</p><p className={`text-[10px] font-black uppercase tracking-[0.2em] ${m.status === 'ACTIVO' ? 'text-green-400' : 'text-red-400'}`}>{m.status}</p></div></div>
             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onPayClick(m)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">Pagar</button><button onClick={() => onDelete(m.id)} className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all">Borrar</button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function FinanceModule({ data, id1, id2 }: any) {
  if (!data) return <p className="animate-pulse">Cargando datos...</p>;
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div id={id1} className="xl:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 min-h-[450px] shadow-2xl">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Balance de Ingresos y Gastos</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={12} axisLine={false} tickLine={false} /><YAxis stroke="#444" fontSize={12} axisLine={false} tickLine={false} /><Bar dataKey="ingresos" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive={false} /><Bar dataKey="gastos" fill="#f43f5e" radius={[6, 6, 0, 0]} isAnimationActive={false} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div id={id2} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 min-h-[450px] shadow-2xl">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Mix de Membresías</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={data.revenue_distribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="value" stroke="none" isAnimationActive={false}>{data.revenue_distribution.map((_: any, idx: number) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}</Pie></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data, id1, id2 }: any) {
  if (!data) return <p className="animate-pulse">Calculando analíticas...</p>;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id={id1} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 min-h-[450px] shadow-2xl">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Radar de Eficiencia Operativa</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.performance_radar}><PolarGrid stroke="#222" /><PolarAngleAxis dataKey="subject" tick={{fill:'#666', fontSize: 11}} /><Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} isAnimationActive={false} /></RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div id={id2} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 min-h-[450px] shadow-2xl">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Tasa de Crecimiento Neto</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.member_growth}><CartesianGrid stroke="#222" vertical={false} /><XAxis dataKey="month" stroke="#444" fontSize={12} axisLine={false} tickLine={false} /><Area type="monotone" dataKey="altas" stroke="#10b981" fill="#10b981" fillOpacity={0.2} isAnimationActive={false} /></AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden animate-in zoom-in duration-500" style={{ animationDelay: delay }}><p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">{title}</p><div className="flex items-end justify-between"><h4 className="text-5xl font-bold text-white tracking-tighter">{value}</h4><span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${caution ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>{trend}</span></div></div>;
}

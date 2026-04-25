import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle, DollarSign, Activity, Wallet, Target, UsersRound, Search, Filter, Download, Lock, ShieldCheck, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Resumen');
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

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated]);

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
    // Stats Fallback
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) setStats(await statsRes.json());
      else throw new Error('API failed');
    } catch {
      setStats({
        active_members: 142,
        total_revenue: 18450.50,
        churn_risk_count: 8,
        por_vencer_count: 15,
        alerts: [
          {"type": "abandono", "message": "8 socios muestran patrones de baja asistencia. Acción recomendada: Enviar promo de reactivación."},
          {"type": "ingresos", "message": "Aumento proyectado del 15% en ingresos este mes basado en tendencias históricas."}
        ]
      });
    }

    // Members Fallback
    try {
      const memRes = await fetch('/api/admin/members');
      if (memRes.ok) {
        const memData = await memRes.json();
        if (memData.length > 0) setMembers(memData);
        else throw new Error('Empty DB');
      } else throw new Error('API failed');
    } catch {
      setMembers([
        { id: 1, name: "Neon Matrix", dni: "00110011", status: "ACTIVO", membership_type: "Elite" },
        { id: 2, name: "Sarah Connor", dni: "10101010", status: "DEUDA", membership_type: "Premium" },
        { id: 3, name: "John Wick", dni: "99999999", status: "ACTIVO", membership_type: "Basic" },
        { id: 4, name: "Trinity Silva", dni: "77777777", status: "POR VENCER", membership_type: "Elite" },
        { id: 5, name: "Bruce Wayne", dni: "55555555", status: "DEUDA", membership_type: "Elite" },
        { id: 6, name: "Clark Kent", dni: "22334455", status: "ACTIVO", membership_type: "Basic" },
      ]);
    }

    // Staff Fallback
    setStaff([
      { id: 101, name: "Marcus Rossi", role: "Entrenador Principal", status: "ACTIVO", shift: "Mañana (06:00 - 14:00)" },
      { id: 102, name: "Elena Rojas", role: "Recepcionista", status: "ACTIVO", shift: "Tarde (14:00 - 22:00)" },
      { id: 103, name: "Dr. Selva", role: "Médico Deportivo", status: "ACTIVO", shift: "Por Turno" },
      { id: 104, name: "Julio M.", role: "Mantenimiento", status: "VACACIONES", shift: "Rotativo" }
    ]);

    // Finance Fallback
    try {
      const finRes = await fetch('/api/admin/finance/summary');
      if (finRes.ok) {
        const finData = await finRes.json();
        if (finData && finData.total_revenue > 0) setFinanceData(finData);
        else throw new Error('Empty DB');
      } else throw new Error('API failed');
    } catch {
      setFinanceData({
        cashflow_data: [
          { month: "Nov", ingresos: 4200, gastos: 2100 }, 
          { month: "Dic", ingresos: 5100, gastos: 2800 },
          { month: "Ene", ingresos: 4800, gastos: 2000 }, 
          { month: "Feb", ingresos: 6500, gastos: 3100 },
          { month: "Mar", ingresos: 8900, gastos: 4200 }, 
          { month: "Abr", ingresos: 12450, gastos: 4800 }
        ],
        revenue_distribution: [
          { name: "Basic", value: 3000 },
          { name: "Premium", value: 5500 },
          { name: "Elite", value: 3950 }
        ],
        recent_transactions: [
          { id: "TX-1001", socio: "Neon Matrix", date: new Date().toISOString().split('T')[0], amount: 99.99, method: "Tarjeta de Crédito", status: "Completado" },
          { id: "TX-1002", socio: "John Wick", date: new Date().toISOString().split('T')[0], amount: 49.99, method: "Transferencia", status: "Completado" },
          { id: "TX-1003", socio: "Sarah Connor", date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 79.99, method: "Efectivo", status: "Completado" },
          { id: "TX-1004", socio: "Trinity Silva", date: new Date(Date.now() - 86400000*2).toISOString().split('T')[0], amount: 99.99, method: "Tarjeta de Débito", status: "Pendiente" },
        ],
        arpu: 87.67,
        operating_margin: 61.4,
        total_revenue: 18450.50
      });
    }

    // AI Analytics Fallback
    try {
      const aiRes = await fetch('/api/admin/analytics/ai');
      if (aiRes.ok) {
        const aiDataRes = await aiRes.json();
        if (aiDataRes && aiDataRes.attendance_heatmap) setAiData(aiDataRes);
        else throw new Error('Empty DB');
      } else throw new Error('API failed');
    } catch {
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
          {"factor": "Baja Asistencia (<2x/sem)", "impact": 55},
          {"factor": "Sensibilidad al Precio", "impact": 20},
          {"factor": "Falta de Entrenador", "impact": 15},
          {"factor": "Distancia al Gimnasio", "impact": 10},
        ],
        performance_radar: [
          { subject: 'Retención', A: 85, B: 65, fullMark: 100 },
          { subject: 'Adquisición', A: 90, B: 75, fullMark: 100 },
          { subject: 'Asistencia', A: 78, B: 70, fullMark: 100 },
          { subject: 'Satisfacción', A: 95, B: 80, fullMark: 100 },
          { subject: 'Ingresos', A: 88, B: 60, fullMark: 100 },
        ],
        member_growth: [
          { month: 'Oct', altas: 15, bajas: 5 },
          { month: 'Nov', altas: 20, bajas: 8 },
          { month: 'Dic', altas: 45, bajas: 12 },
          { month: 'Ene', altas: 80, bajas: 10 },
          { month: 'Feb', altas: 65, bajas: 15 },
          { month: 'Mar', altas: 95, bajas: 18 },
        ],
        critical_risk_list: [
          { name: "Sarah Connor", dni: "10101010", days_absent: 14, risk: 89, reason: "Baja Asistencia" },
          { name: "Bruce Wayne", dni: "55555555", days_absent: 21, risk: 95, reason: "Deuda Pendiente" },
          { name: "Peter Parker", dni: "44444444", days_absent: 8, risk: 65, reason: "No usa beneficios Elite" },
        ]
      });
    }

    // Pricing Fallback
    try {
      const priceRes = await fetch('/api/admin/pricing/dynamic');
      if (priceRes.ok) setPricingData(await priceRes.json());
      else throw new Error('API failed');
    } catch {
      setPricingData({
        calculated_price: 64.99,
        demand_factor: 1.3
      });
    }
  };

  const handleAddMember = async () => {
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setNewMember({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Elite' });
        refreshData();
      } else {
        throw new Error('Fallback Local');
      }
    } catch (e) {
      // Fallback Vercel Local State
      setMembers(prev => [...prev, { id: Math.floor(Math.random() * 9000) + 1000, ...newMember }]);
      setIsModalOpen(false);
      setNewMember({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Elite' });
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      try {
        await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
      } catch (e) { }
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/members/${id}/status?status=${status}`, { method: 'PUT' });
    } catch(e) {}
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handlePayment = async () => {
    if (!selectedMember || !paymentAmount) return;
    try {
      await fetch(`/api/admin/payments?member_id=${selectedMember.id}&amount=${paymentAmount}`, { method: 'POST' });
    } catch(e) {}
    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, status: 'ACTIVO' } : m));
    setIsPaymentModalOpen(false);
    setSelectedMember(null);
    setPaymentAmount('');
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('export-content');
    if (!element) return;
    
    // Mostramos un mensaje temporal
    const originalStyle = element.style.cssText;
    element.style.background = '#050505';
    element.style.padding = '20px';

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#050505' });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Reporte_GymAtlas_${activeTab}.pdf`);
    
    element.style.cssText = originalStyle;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl z-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white tracking-tighter mb-2">Acceso Administrativo</h2>
          <p className="text-center text-white/50 mb-8">Ingresa tus credenciales para continuar</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input 
                  type="text" 
                  placeholder="Usuario" 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {loginError && <p className="text-red-400 text-sm text-center font-bold bg-red-500/10 py-2 rounded-lg">Credenciales incorrectas</p>}

            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios':
        return (
          <MembersModule 
            members={members} 
            onDelete={handleDeleteMember} 
            onAddClick={() => setIsModalOpen(true)} 
            onChangeStatus={handleStatusChange}
            onPayClick={(m: any) => { setSelectedMember(m); setIsPaymentModalOpen(true); }}
          />
        );
      case 'Staff':
        return <StaffModule staff={staff} />;
      case 'Finanzas':
        return <FinanceModule data={financeData} />;
      case 'Analítica IA':
        return <AIAnalyticsModule data={aiData} />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Socios Activos" value={stats?.active_members || '0'} trend="+4.5%" delay="0s" />
              <StatCard title="Ingresos Totales" value={`$${stats?.total_revenue?.toFixed(2) || '0'}`} trend="+12.2%" delay="0.1s" />
              <StatCard title="Riesgo de Abandono" value={stats?.churn_risk_count || '0'} trend="-2.1%" caution delay="0.2s" />
              <StatCard title="Próximos a Vencer" value={stats?.por_vencer_count || '0'} trend="Alerta" caution delay="0.3s" />
            </div>

            {/* AI Alerts Section */}
            <section className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl mb-12 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={120} className="text-blue-500" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-blue-500" />
                <h3 className="text-xl font-semibold text-white">Predicciones Inteligentes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats?.alerts?.map((alert: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group/item">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover/item:scale-110 transition-transform">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1 uppercase text-xs tracking-widest text-blue-400">Alerta de {alert.type}</h4>
                      <p className="text-white/70 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                )) || <p className="text-white/20 italic">Analizando datos para generar insights...</p>}
              </div>
            </section>

            {/* Dynamic Pricing Motor */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="text-green-400" />
                    <h4 className="text-xl font-bold">Motor de Precios Dinámicos</h4>
                  </div>
                  <p className="text-white/50 mb-6">Ajustes basados en ocupación en tiempo real y demanda en horas pico.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-6">
                      <p className="text-sm text-white/40 mb-2">Factor de Demanda</p>
                      <p className="text-3xl font-bold text-white">x{pricingData?.demand_factor || '1.0'}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6">
                      <p className="text-sm text-white/40 mb-2">Precio Sugerido</p>
                      <p className="text-3xl font-bold text-green-400">${pricingData?.calculated_price || '0.00'}</p>
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center">
                  <h4 className="text-xl font-bold mb-4 opacity-50">Optimizador de Personal</h4>
                  <p className="text-white/30 text-sm mb-4">Recomendaciones de turnos para el personal basadas en asistencia prevista.</p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-400 font-bold text-sm">Acción Sugerida:</p>
                    <p className="text-white/70 text-sm mt-1">Se requiere +1 Entrenador para el pico de hoy a las 18:00hs.</p>
                  </div>
               </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden flex">
      {/* Modal for Adding Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">Agregar Nuevo Socio</h2>
            <div className="space-y-6">
              <input 
                type="text" placeholder="Nombre Completo" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Número de DNI" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.dni} onChange={e => setNewMember({...newMember, dni: e.target.value})}
              />
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.membership_type} onChange={e => setNewMember({...newMember, membership_type: e.target.value})}
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
            <div className="flex gap-4 mt-12">
              <button className="flex-1 py-4 text-white/40 font-bold" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20" onClick={handleAddMember}>Crear Socio</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Payment */}
      {isPaymentModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-2">Registrar Pago</h2>
            <p className="text-white/50 mb-8">Para {selectedMember.name}</p>
            <div className="space-y-6">
              <input 
                type="number" placeholder="Monto ($)" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none"
                value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mt-12">
              <button className="flex-1 py-4 text-white/40 font-bold" onClick={() => { setIsPaymentModalOpen(false); setSelectedMember(null); }}>Cancelar</button>
              <button className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-lg shadow-green-600/20" onClick={handlePayment}>Registrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-6 z-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">GYM-ATLAS</h1>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
            <SidebarItem icon={<Users size={20} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
            <SidebarItem icon={<Briefcase size={20} />} label="Staff" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
            <SidebarItem icon={<CreditCard size={20} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
            <SidebarItem icon={<TrendingUp size={20} />} label="Analítica IA" active={activeTab === 'Analítica IA'} onClick={() => setActiveTab('Analítica IA')} />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <button onClick={() => setIsAuthenticated(false)} className="w-full p-4 hover:bg-white/5 rounded-2xl transition-colors text-white/50 hover:text-red-400 font-bold text-sm text-center">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10 bg-black/10 z-10 relative">
          <header className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                {activeTab === 'Resumen' ? 'Bienvenido de vuelta, Admin' : activeTab}
              </h2>
              <p className="text-white/40">
                {activeTab === 'Resumen' 
                  ? "Esto es lo que está pasando en Gym-Atlas hoy." 
                  : `Gestionando tu sección de ${activeTab.toLowerCase()} en tiempo real.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {(activeTab === 'Finanzas' || activeTab === 'Analítica IA') && (
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
                >
                  <Download size={16} />
                  Descargar Reporte PDF
                </button>
              )}
            </div>
          </header>

          <div id="export-content">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StaffModule({ staff }: any) {
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold">Gestión de Usuarios / Staff</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {staff.map((s: any) => (
             <div key={s.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">{s.name[0]}</div>
                   <div>
                     <p className="font-bold text-white text-lg">{s.name}</p>
                     <p className="text-xs font-bold text-purple-400 tracking-widest uppercase">{s.role}</p>
                   </div>
                 </div>
                 <div className="space-y-3 mb-4">
                   <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                     <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Turno Actual</p>
                     <p className="text-sm text-white/80">{s.shift}</p>
                   </div>
                 </div>
               </div>
               <div className="pt-4 border-t border-white/5 mt-4 flex justify-between items-center">
                 <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.status === 'ACTIVO' ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/50'}`}>
                   {s.status}
                 </span>
                 <button className="text-xs text-blue-400 hover:text-white font-bold transition-colors">Editar Perfil</button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function MembersModule({ members, onDelete, onAddClick, onChangeStatus, onPayClick }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPlan, setFilterPlan] = useState('ALL');

  const filteredMembers = members.filter((m: any) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(m.dni).includes(searchTerm);
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesPlan = filterPlan === 'ALL' || m.membership_type === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h3 className="text-xl font-bold">Directorio de Socios</h3>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por Nombre o DNI..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select 
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Cualquier Estado</option>
                <option value="ACTIVO">Activos</option>
                <option value="DEUDA">Con Deuda</option>
                <option value="POR VENCER">Por Vencer</option>
              </select>
              <select 
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
              >
                <option value="ALL">Cualquier Plan</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            <button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              + Nuevo Socio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredMembers.map((m: any) => (
             <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">{m.name[0]}</div>
                   <div>
                     <p className="font-bold text-white text-lg">{m.name}</p>
                     <p className={`text-xs font-bold tracking-widest ${m.status === 'ACTIVO' ? 'text-green-400' : m.status === 'DEUDA' ? 'text-red-400' : 'text-yellow-400'}`}>● {m.status}</p>
                   </div>
                 </div>
                 <div className="space-y-2 mb-8">
                   <p className="text-xs text-white/30 flex justify-between">DNI: <span className="text-white/70 font-mono">{m.dni}</span></p>
                   <p className="text-xs text-white/30 flex justify-between">Plan: <span className="text-white/70">{m.membership_type || 'Estándar'}</span></p>
                 </div>
               </div>
               
               <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {m.status !== 'ACTIVO' && (
                    <button 
                      onClick={() => onPayClick(m)}
                      className="w-full py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Registrar Pago
                    </button>
                 )}
                 <div className="flex gap-2">
                   <select 
                     value={m.status} 
                     onChange={(e) => onChangeStatus(m.id, e.target.value)}
                     className="flex-1 bg-white/10 text-xs rounded-xl px-2 py-2 outline-none border-none text-white/70"
                   >
                     <option value="ACTIVO">ACTIVO</option>
                     <option value="DEUDA">DEUDA</option>
                     <option value="POR VENCER">POR VENCER</option>
                   </select>
                   <button 
                     onClick={() => onDelete(m.id)}
                     className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                   >
                     Eliminar
                   </button>
                 </div>
               </div>
             </div>
           ))}
           {filteredMembers.length === 0 && (
             <div className="col-span-full py-12 text-center text-white/30">
               <Filter size={48} className="mx-auto mb-4 opacity-20" />
               <p>No se encontraron socios que coincidan con la búsqueda.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function FinanceModule({ data }: any) {
  if (!data) return <p className="text-white/50 animate-pulse">Cargando datos financieros...</p>;
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Finance Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400"><DollarSign /></div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Ingreso Total Mes</p>
            <h4 className="text-2xl font-bold text-white">${data.total_revenue}</h4>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400"><UsersRound /></div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">ARPU (Promedio x Usuario)</p>
            <h4 className="text-2xl font-bold text-white">${data.arpu}</h4>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400"><Wallet /></div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Margen Operativo</p>
            <h4 className="text-2xl font-bold text-white">{data.operating_margin}%</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Cash Flow Chart */}
        <div className="xl:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Flujo de Caja Anual</h3>
            <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-white/50 tracking-widest uppercase">Ingresos vs Gastos</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos Operativos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
          <h3 className="text-xl font-bold mb-8">Distribución por Membresía</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenue_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.revenue_distribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => `$${value}`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Transactions Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <h3 className="text-xl font-bold mb-6">Registro de Movimientos Financieros</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">ID Transacción</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Socio</th>
                <th className="p-4 font-semibold">Método</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_transactions.map((tx: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-white/50">{tx.id}</td>
                  <td className="p-4 text-sm text-white/70">{tx.date}</td>
                  <td className="p-4 font-medium">{tx.socio}</td>
                  <td className="p-4 text-sm text-white/70">{tx.method}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'Completado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-right text-green-400">${tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data }: any) {
  if (!data) return <p className="text-white/50 animate-pulse">Cargando analíticas...</p>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Radar */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <Target className="text-blue-500" />
            <h3 className="text-xl font-bold">Rendimiento Global del Gimnasio</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.performance_radar}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mes Actual" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Mes Anterior" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Growth Area */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-green-500" />
            <h3 className="text-xl font-bold">Crecimiento de Socios</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.member_growth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAltas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="altas" name="Nuevos Socios" stroke="#10b981" fillOpacity={1} fill="url(#colorAltas)" />
                <Area type="monotone" dataKey="bajas" name="Bajas" stroke="#f43f5e" fillOpacity={0.1} fill="#f43f5e" />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Attendance Prediction */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="text-purple-500" />
            <h3 className="text-xl font-bold">Asistencia Prevista por Día</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attendance_heatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Bar dataKey="morning" name="Mañana" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="afternoon" name="Tarde" stackId="a" fill="#ec4899" />
                <Bar dataKey="evening" name="Noche" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Risk List */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-red-500" />
            <h3 className="text-xl font-bold">Alerta: Riesgo Crítico de Abandono</h3>
          </div>
          <div className="flex-1 space-y-4">
            {data.critical_risk_list.map((risk: any, i: number) => (
              <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between hover:bg-red-500/10 transition-colors">
                <div>
                  <p className="font-bold text-white text-lg">{risk.name}</p>
                  <p className="text-xs text-white/50">{risk.reason} • {risk.days_absent} días ausente</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Probabilidad</p>
                  <p className="text-2xl font-black text-red-500">{risk.risk}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/20 transition-all group relative overflow-hidden" style={{ animationDelay: delay }}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full translate-x-12 translate-y-[-12px]" />
      <p className="text-sm font-semibold text-white/30 uppercase tracking-widest mb-4 group-hover:text-white/50 transition-colors">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-4xl font-bold tracking-tighter text-white">{value}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${caution ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

import { LayoutDashboard, Users, User, Brain, DollarSign, Lock, ShieldCheck, Briefcase, Download, CheckCircle, XCircle, Trash2, X, Settings, Receipt, CreditCard, Smartphone, Banknote, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'gerente' | 'administracion' | 'entrenador'>('gerente');
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [activeTab, setActiveTab] = useState('Socios');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split('T')[0]; });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([
    { id: 1, name: "Básico (3 Días)", price: 5000, daysPerWeek: 3, classes: [] },
    { id: 2, name: "Premium (Clases)", price: 8500, daysPerWeek: 5, classes: ["Yoga", "Zumba"] },
    { id: 3, name: "Elite (Libre)", price: 12000, daysPerWeek: 7, classes: ["Yoga", "CrossFit", "Spinning"] },
    { id: 4, name: "Boxeo", price: 7000, daysPerWeek: 3, classes: ["Boxeo"] },
  ]);
  const [financeData, setFinanceData] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'staff' | 'workout' | 'plan' | 'history'>('member');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => { if (isAuthenticated) refreshData(); }, [isAuthenticated, startDate, endDate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    
    // Cuenta maestra de respaldo (por si la BD está vacía)
    if (loginUser === 'master' && loginPass === 'admin123') { 
      setIsAuthenticated(true); setUserRole('gerente'); setLoggedUser({ name: 'Master', role: 'Gerente', id: 0 }); setActiveTab('Resumen'); 
      return; 
    }

    try {
      const res = await fetch(`${API_URL}/admin/staff`);
      if (res.ok) {
        const staffData = await res.json();
        const staffMember = staffData.find((s:any) => s.name.toLowerCase() === loginUser.toLowerCase());
        
        if (staffMember && loginPass === (staffMember.password || '1234')) {
          setIsAuthenticated(true);
          setLoggedUser(staffMember);
          const role = staffMember.role.toLowerCase() === 'administración' ? 'administracion' : staffMember.role.toLowerCase();
          setUserRole(role as any);
          if (role === 'entrenador') setActiveTab('Socios');
          else setActiveTab('Resumen');
          return;
        }
      }
      alert("Credenciales incorrectas. Verifique nombre de staff y contraseña.");
    } catch (err) {
      alert("Error de conexión al verificar staff.");
    }
  };

  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:8000" 
    : "/api";

  const refreshData = async () => {
    try {
      setError(null);
      // 1. Fetch Members
      const membersRes = await fetch(`${API_URL}/admin/members`);
      if (!membersRes.ok) throw new Error(`Error ${membersRes.status}: No se pudo obtener la lista de socios`);
      const membersData = await membersRes.json();
      setMembers(membersData);

      // 2. Fetch Stats
      const statsRes = await fetch(`${API_URL}/admin/stats`);
      if (!statsRes.ok) throw new Error("No se pudo conectar con el servidor (Estadísticas)");
      const stats = await statsRes.json();
      
      // Calculate real revenue from all members' history
      const allHistory = membersData.flatMap((m:any) => (m.billing_history || []));
      const totalRevenue = allHistory.reduce((acc:number, curr:any) => acc + curr.amount, 0);

      // Group history by month for cashflow
      const monthlyData: { [key: string]: number } = {};
      allHistory.forEach((h: any) => {
        const month = h.date.split('-').slice(0, 2).join('-'); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + h.amount;
      });

      const cashflow = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({
          month: new Date(month + '-01').toLocaleString('es-ES', { month: 'short' }),
          ingresos: amount,
          egresos: amount * 0.3 // Real estimate or mock egresos for now
        }))
        .slice(-4);

      setFinanceData((prev: any) => ({
        ...prev,
        total_revenue: totalRevenue,
        active_members: stats.active_members,
        churn_risk: stats.churn_risk_count,
        por_vencer: stats.por_vencer_count,
        total_expenses: totalRevenue * 0.3, // Real estimate or derived from egresos
        cashflow_data: cashflow.length > 0 ? cashflow : [
          { month: "Ene", ingresos: 0, egresos: 0 },
          { month: "Feb", ingresos: 0, egresos: 0 },
          { month: "Mar", ingresos: 0, egresos: 0 },
          { month: "Abr", ingresos: totalRevenue, egresos: totalRevenue * 0.3 }
        ],
        revenue_breakdown: [
          { name: "Musculación", value: (membersData.filter((m: any) => !m.membership_type || m.membership_type.includes("Básico")).length * 5000) || 0 },
          { name: "Premium", value: (membersData.filter((m: any) => m.membership_type?.includes("Premium")).length * 8500) || 0 },
          { name: "Elite", value: (membersData.filter((m: any) => m.membership_type?.includes("Elite")).length * 12000) || 0 }
        ],
        monthly_growth: stats.monthly_growth || [],
        arpu: membersData.length > 0 ? (totalRevenue / membersData.length).toFixed(0) : 0, 
        churn_rate: stats.active_members > 0 ? ((stats.churn_risk_count / stats.active_members) * 100).toFixed(1) : 0
      }));

      // Staff (Use real data from models if available)
      const staffRes = await fetch(`${API_URL}/admin/staff`); // Assuming this endpoint exists or I'll add it
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaff(staffData);
      } else if (staff.length === 0) {
        setStaff([{ id: 101, name: "Marcus Rossi", role: "Entrenador", status: "ACTIVO", shift: "Mañana" }]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "Error de conexión con la base de datos");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text('GYM ATLAS: REPORTE OFICIAL', 14, 22);
    doc.text('RESUMEN EJECUTIVO', 14, 45);
    autoTable(doc, { startY: 50, head: [['Métrica', 'Valor']], body: [['Ingresos', `$${financeData?.total_revenue || 0}`], ['Socios', members.length]] });
    doc.save(`Reporte_Atlas.pdf`);
  };

  const handleSavePlan = () => { if (isEditMode) setPlans(prev => prev.map(p => p.id === selectedItem.id ? { ...selectedItem } : p)); else setPlans(prev => [...prev, { id: Date.now(), ...selectedItem }]); setIsModalOpen(false); };
  const handleSaveMember = async () => {
    try {
      if (isEditMode) {
        const res = await fetch(`${API_URL}/admin/members/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...selectedItem,
            password: selectedItem.password || '123'
          })
        });
        if (res.ok) refreshData();
        else alert("Error al actualizar socio");
      } else {
        const res = await fetch(`${API_URL}/admin/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...selectedItem,
            password: '123',
            photo_url: `https://i.pravatar.cc/300?u=${selectedItem.dni}`
          })
        });
        if (res.ok) refreshData();
        else alert("Error al crear socio. Verifique si el DNI ya existe.");
      }
      setIsModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleSaveStaff = async () => {
    try {
      if (isEditMode) {
        const res = await fetch(`${API_URL}/admin/staff/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedItem)
        });
        if (res.ok) refreshData();
        else alert("Error al actualizar staff");
      } else {
        const res = await fetch(`${API_URL}/admin/staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedItem)
        });
        if (res.ok) refreshData();
        else alert("Error al crear staff");
      }
      setIsModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handlePayment = async (amount: number, method: string) => { 
    try {
      const res = await fetch(`${API_URL}/admin/payments?member_id=${selectedItem.id}&amount=${amount}&method=${method}`, {
        method: 'POST'
      });
      if (res.ok) {
        setIsPaymentModalOpen(false);
        refreshData();
      }
    } catch (e) { console.error(e); }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Socios': return <MembersModule members={members} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onHistory={(m:any)=>{setSelectedItem(m); setModalType('history'); setIsModalOpen(true);}} onEdit={(m: any) => { setSelectedItem(m); setIsEditMode(true); setModalType('member'); setIsModalOpen(true); }} onDelete={async (id: any) => { if(confirm("¿Dar de baja socio?")){ const res = await fetch(`${API_URL}/admin/members/${id}`, {method:'DELETE'}); if(res.ok) refreshData(); } }} onAddClick={() => { setSelectedItem({name:'', dni:'', phone:'', email:'', password:'1234', status:'ACTIVO', membership_type: plans[0]?.name || ''}); setIsEditMode(false); setModalType('member'); setIsModalOpen(true); }} onPayClick={(m: any) => { setSelectedItem(m); setIsPaymentModalOpen(true); }} />;
      case 'Planes': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType('plan'); setIsModalOpen(true);}} onDelete={(id:any)=>setPlans(p=>p.filter(x=>x.id!==id))} onAddClick={()=>{setSelectedItem({name:'', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType('plan'); setIsModalOpen(true);}} />;
      case 'Mi Perfil': return <ProfileModule user={loggedUser} onSave={async (newPassword: string) => { if(!newPassword)return; try{ const res=await fetch(`${API_URL}/admin/staff/${loggedUser.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...loggedUser, password: newPassword})}); if(res.ok){ alert('Contraseña actualizada'); setLoggedUser({...loggedUser, password: newPassword}); } }catch(e){console.error(e);} }} />;
      case 'Staff': return (userRole === 'gerente' || userRole === 'administracion') ? <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem({...s}); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={async (id: any) => { if(confirm("¿Eliminar empleado?")){ const res = await fetch(`${API_URL}/admin/staff/${id}`, {method:'DELETE'}); if(res.ok) refreshData(); } }} onAddClick={() => { setSelectedItem({name:'', role:'Entrenador', shift:'Mañana', password:'1234'}); setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} /> : <NoAccess />;
      case 'Finanzas': return userRole === 'gerente' ? <FinanceModule data={financeData} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} /> : <NoAccess />;
      case 'Facturación': return (userRole === 'gerente' || userRole === 'administracion') ? <BillingModule members={members} /> : <NoAccess />;
      default: return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard title="Socios Activos" value={members.length} icon={<Users size={16}/>} onClick={() => setActiveTab('Socios')} color="blue" />
            {(userRole === 'gerente' || userRole === 'administracion') && (
              <SummaryCard title="Facturas" value={members.flatMap((m:any) => (m.billing_history || [])).length} icon={<Receipt size={16}/>} onClick={() => setActiveTab('Facturación')} color="purple" />
            )}
            {userRole === 'gerente' && (
              <SummaryCard title="Caja Total" value={`$${financeData?.total_revenue?.toLocaleString()}`} icon={<DollarSign size={16}/>} onClick={() => setActiveTab('Finanzas')} color="green" />
            )}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/5 p-4 rounded-xl"><h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Balance de Caja</h3><div className="h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financeData?.cashflow_data}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/><XAxis dataKey="month" stroke="#444" fontSize={9}/><Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}}/><Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div>
             <div className="bg-white/5 border border-white/5 p-4 rounded-xl"><h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Actividad Facturación</h3><div className="flex flex-col justify-center h-40 space-y-2">{members.slice(0,3).map(m=>(<div key={m.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5"><span className="text-[10px] font-black uppercase">{m.name}</span><span className="text-green-500 font-black">$12,000</span></div>))}</div></div>
          </div>
        </div>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-[380px] bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-3xl shadow-2xl animate-in zoom-in duration-500">
          <div className="flex justify-center mb-8"><div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30"><ShieldCheck size={32} className="text-white" /></div></div>
          <h2 className="text-2xl font-black text-center text-white mb-8 tracking-tighter uppercase font-sans">Atlas Admin</h2>
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
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex overflow-hidden text-[9px]">
      {/* Portaled Modals (Centered in Viewport) */}
      {(isModalOpen || isPaymentModalOpen) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10 bg-black/90 backdrop-blur-md overflow-y-auto">
          {isModalOpen && (
            <div className={`bg-neutral-900 border border-white/10 p-8 rounded-[40px] w-full ${modalType === 'workout' || modalType === 'history' ? 'max-w-4xl' : 'max-w-md'} shadow-2xl animate-in zoom-in duration-300`}>
              <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-black uppercase tracking-widest text-blue-500">{modalType}</h2><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-white/20 hover:text-white transition-colors"/></button></div>
              <div className="space-y-3">
                {modalType === 'history' && (
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase text-white/40 mb-4">Historial de Pagos y Planes: {selectedItem.name}</h3>
                     <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedItem.billing_history?.length > 0 ? selectedItem.billing_history.map((h:any, i:number)=>(
                          <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><Receipt size={18}/></div>
                                <div><p className="font-black text-white uppercase text-[10px]">{h.plan}</p><p className="text-[8px] text-white/20 uppercase font-black">{h.date} • {h.method}</p></div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-green-500">${h.amount.toLocaleString()}</p>
                                <p className="text-[8px] font-black uppercase text-white/20">{h.status}</p>
                             </div>
                          </div>
                        )) : <p className="text-center text-white/10 uppercase font-black py-10">Sin historial registrado</p>}
                     </div>
                  </div>
                )}
                {modalType === 'member' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="Nombre Completo" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                       <input type="text" placeholder="DNI" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.dni} onChange={e => setSelectedItem({...selectedItem, dni: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="WhatsApp / Número" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.phone} onChange={e => setSelectedItem({...selectedItem, phone: e.target.value})} />
                       <input type="email" placeholder="Correo Electrónico" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.email} onChange={e => setSelectedItem({...selectedItem, email: e.target.value})} />
                    </div>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.membership_type} onChange={e => setSelectedItem({...selectedItem, membership_type: e.target.value})}>
                       {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                    <div className="space-y-1">
                      <label className="text-[8px] text-white/20 uppercase font-black ml-2">Contraseña de Acceso</label>
                      <input type="text" placeholder="Asignar Contraseña" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.password || ''} onChange={e => setSelectedItem({...selectedItem, password: e.target.value})} />
                    </div>
                  </div>
                )}
                {modalType === 'plan' && (
                  <div className="space-y-3">
                    <input type="text" placeholder="Plan" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                    <input type="number" placeholder="Precio" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.price} onChange={e => setSelectedItem({...selectedItem, price: parseInt(e.target.value) || 0})} />
                    <input type="number" placeholder="Días" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs" value={selectedItem?.daysPerWeek} onChange={e => setSelectedItem({...selectedItem, daysPerWeek: parseInt(e.target.value) || 0})} />
                  </div>
                )}
                {modalType === 'staff' && (
                  <div className="space-y-3">
                    <input type="text" placeholder="Nombre" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.role} onChange={e => setSelectedItem({...selectedItem, role: e.target.value})}>
                      <option value="Entrenador">Entrenador</option><option value="Administración">Administración</option><option value="Gerente">Gerente</option>
                    </select>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.shift} onChange={e => setSelectedItem({...selectedItem, shift: e.target.value})}>
                      <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option>
                    </select>
                    <div className="space-y-1 mt-2">
                       <label className="text-[8px] text-white/20 uppercase font-black ml-2">Contraseña de Acceso</label>
                       <input type="text" placeholder="Contraseña..." className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={selectedItem?.password || ''} onChange={e => setSelectedItem({...selectedItem, password: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
              {modalType !== 'history' && (
                <div className="flex gap-4 mt-8 border-t border-white/5 pt-6"><button className="flex-1 py-3 text-white/40 font-black uppercase text-[10px]" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20" onClick={() => { if(modalType==='plan') handleSavePlan(); else if(modalType==='member') handleSaveMember(); else if(modalType==='staff') handleSaveStaff(); }}>Guardar</button></div>
              )}
            </div>
          )}
          {isPaymentModalOpen && (
            <PaymentModal plans={plans} member={selectedItem} onPay={handlePayment} onClose={()=>setIsPaymentModalOpen(false)} />
          )}
        </div>
      )}

      <aside className="w-40 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8"><div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Brain size={16} className="text-white" /></div><h1 className="text-sm font-black tracking-tighter">ATLAS</h1></div>
        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
          <SidebarItem icon={<LayoutDashboard size={14} />} label="Resumen" active={activeTab === 'Resumen'} onClick={() => setActiveTab('Resumen')} />
          <SidebarItem icon={<User size={14} />} label="Mi Perfil" active={activeTab === 'Mi Perfil'} onClick={() => setActiveTab('Mi Perfil')} />
          <SidebarItem icon={<Users size={14} />} label="Socios" active={activeTab === 'Socios'} onClick={() => setActiveTab('Socios')} />
          <SidebarItem icon={<Settings size={14} />} label="Planes" active={activeTab === 'Planes'} onClick={() => setActiveTab('Planes')} />
          
          {(userRole === 'gerente' || userRole === 'administracion') && (
            <>
              <SidebarItem icon={<Receipt size={14} />} label="Facturación" active={activeTab === 'Facturación'} onClick={() => setActiveTab('Facturación')} />
              <SidebarItem icon={<Briefcase size={14} />} label="Personal" active={activeTab === 'Staff'} onClick={() => setActiveTab('Staff')} />
            </>
          )}

          {userRole === 'gerente' && (
            <>
              <div className="h-px bg-white/5 my-4" />
              <SidebarItem icon={<DollarSign size={14} />} label="Finanzas" active={activeTab === 'Finanzas'} onClick={() => setActiveTab('Finanzas')} />
            </>
          )}
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full p-2 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mt-4">Salir</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 relative bg-[#050505]">
        <header className="flex items-center justify-between mb-8 max-w-full">
          <div className="min-w-0"><h2 className="text-xl font-black text-white tracking-tighter uppercase truncate">{activeTab}</h2><p className="text-[7px] text-white/20 uppercase font-black tracking-[0.3em]">Management OS v2.0</p></div>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 font-black text-[8px] uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap"><Download size={14}/> Reporte Global</button>
        </header>
        <div className="max-w-full overflow-x-hidden">
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
            <strong>Error de Conexión:</strong> {error}. Verifique que la base de datos esté configurada correctamente en Vercel.
          </div>
        )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function PaymentModal({ plans, member, onPay, onClose }: any) {
  const [method, setMethod] = useState('Efectivo');
  // Buscar el plan por coincidencia parcial (ej: "Elite" entra en "Elite (Libre)")
  const planObj = plans.find((p:any) => member.membership_type && p.name.toLowerCase().includes(member.membership_type.toLowerCase())) || plans[0];
  const [amount, setAmount] = useState(planObj?.price || 0);

  return (
    <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md shadow-3xl animate-in zoom-in duration-300">
      <h2 className="text-xl font-black mb-2 uppercase tracking-widest text-green-500 text-center">Facturación en Recepción</h2>
      <p className="text-[10px] text-white/20 text-center uppercase font-black mb-8">Socio: {member.name}</p>
      
      <div className="space-y-6">
         <div className="space-y-2">
            <label className="text-[9px] text-white/20 uppercase font-black ml-4">Monto a Cobrar</label>
            <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-3xl font-black text-white text-center outline-none focus:border-green-500" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)} />
         </div>

         <div className="space-y-2">
            <label className="text-[9px] text-white/20 uppercase font-black ml-4">Método de Pago</label>
            <div className="grid grid-cols-2 gap-2">
               <PaymentBtn active={method === 'Efectivo'} onClick={()=>setMethod('Efectivo')} label="Efectivo" icon={<Banknote size={16}/>} />
               <PaymentBtn active={method === 'Tarjeta'} onClick={()=>setMethod('Tarjeta')} label="Tarjeta" icon={<CreditCard size={16}/>} />
               <PaymentBtn active={method === 'Transferencia'} onClick={()=>setMethod('Transferencia')} label="Transferencia" icon={<Smartphone size={16}/>} />
               <PaymentBtn active={method === 'QR'} onClick={()=>setMethod('QR')} label="QR" icon={<Smartphone size={16}/>} />
            </div>
         </div>

         <div className="flex gap-4 pt-4 border-t border-white/5"><button className="flex-1 py-4 text-white/40 font-black uppercase text-[10px]" onClick={onClose}>Cancelar</button><button className="flex-1 py-4 bg-green-600 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-green-600/20" onClick={()=>onPay(amount, method)}>Generar Pago</button></div>
      </div>
    </div>
  );
}

function PaymentBtn({ active, onClick, label, icon }: any) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${active ? 'bg-green-600 border-green-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'}`}>
       {icon}<span className="text-[10px] font-black uppercase">{label}</span>
    </button>
  );
}

function BillingModule({ members }: any) {
  const allHistory = members.flatMap((m:any) => (m.billing_history || []).map((h:any) => ({...h, userName: m.name})));
  const sorted = allHistory.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calcular estadísticas fieles a la lista
  const total = sorted.reduce((acc:number, curr:any)=>acc+curr.amount, 0);
  const methodCounts: any = sorted.reduce((acc:any, curr:any) => {
    acc[curr.method] = (acc[curr.method] || 0) + 1;
    return acc;
  }, {});
  const mostUsedMethod = Object.entries(methodCounts).sort((a:any, b:any) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[9px] font-black text-white/20 uppercase">Cobros Registrados</p><p className="text-xl font-black text-white">${total.toLocaleString()}</p></div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[9px] font-black text-white/20 uppercase">Más Usado</p><p className="text-xl font-black text-blue-500">{mostUsedMethod}</p></div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[9px] font-black text-white/20 uppercase">Facturas</p><p className="text-xl font-black text-white">{sorted.length}</p></div>
       </div>
       <div className="bg-white/5 border border-white/5 rounded-3xl overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-full table-fixed">
             <thead className="bg-white/5 border-b border-white/5 text-[8px] text-white/20 font-black uppercase tracking-widest"><tr ><th className="p-4 w-1/4">Socio</th><th className="p-4 w-1/5">Fecha</th><th className="p-4 w-1/5">Plan</th><th className="p-4 w-1/5">Método</th><th className="p-4 text-right w-1/5">Monto</th></tr></thead>
             <tbody className="divide-y divide-white/5">
                {sorted.map((h:any, i:number)=>(
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                     <td className="p-4 font-black uppercase text-white truncate">{h.userName}</td>
                     <td className="p-4 text-white/40 text-[9px]">{h.date}</td>
                     <td className="p-4 text-white/40 text-[9px] truncate">{h.plan}</td>
                     <td className="p-4"><span className="px-2 py-1 bg-white/5 rounded-lg text-[7px] font-black uppercase">{h.method}</span></td>
                     <td className="p-4 text-right font-black text-green-500">${h.amount.toLocaleString()}</td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/20 hover:text-white hover:bg-white/5'}`}>{icon}<span className="text-[9px] font-black uppercase tracking-widest">{label}</span></div>;
}

function SummaryCard({ title, value, icon, onClick, color }: any) {
  const colors: any = { blue: 'text-blue-400', green: 'text-green-400', orange: 'text-orange-400', purple: 'text-purple-400' };
  return <div onClick={onClick} className="bg-white/5 border border-white/5 p-4 rounded-xl cursor-pointer hover:border-blue-500/20 transition-all flex justify-between items-center"><div className="space-y-1"><p className="text-[7px] font-black text-white/20 uppercase tracking-widest">{title}</p><p className="text-lg font-black text-white">{value}</p></div><div className={`${colors[color]} bg-white/5 p-2 rounded-lg`}>{icon}</div></div>;
}

function MembersModule({ members, onEdit, onDelete, onAddClick, onPayClick, onHistory, searchQuery, setSearchQuery }: any) {
  const filteredMembers = members.filter((m: any) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.dni.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-black text-lg uppercase">Gestión de Socios</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text" 
              placeholder="Buscar por DNI o Nombre..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-[10px] outline-none focus:border-blue-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 whitespace-nowrap">+ Nuevo Socio</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
         {filteredMembers.map((m: any) => (
           <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/10 transition-all group overflow-hidden">
             <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center font-black text-blue-500 text-sm shrink-0">{m.name[0]}</div><div className="min-w-0"><p className="font-black text-white text-[10px] uppercase truncate">{m.name}</p><p className="text-[8px] text-white/20 uppercase font-black truncate">{m.membership_type}</p></div></div>{m.status === 'ACTIVO' ? <CheckCircle className="text-green-500 shrink-0" size={12} /> : <XCircle className="text-red-500 shrink-0" size={12} />}</div>
             <div className="grid grid-cols-2 gap-2">
               <button onClick={() => onPayClick(m)} className="col-span-2 py-2 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Cobrar</button>
               <button onClick={() => onEdit(m)} className="py-2 bg-white/5 text-white/40 rounded-lg text-[8px] font-black uppercase">Editar</button>
               <button onClick={() => onHistory(m)} className="py-2 bg-white/5 text-blue-400 rounded-lg text-[8px] font-black uppercase">Historial</button>
               <button onClick={() => onDelete(m.id)} className="col-span-2 py-2 bg-red-500/10 text-red-500 rounded-lg text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all">Dar de Baja</button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {plans.map((p: any) => (
           <div key={p.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative group">
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-2">{p.name}</p>
              <p className="text-2xl font-black mb-4">${p.price}<span className="text-[10px] text-white/20 font-black">/mes</span></p>
              <div className="space-y-1 mb-6">
                 <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold"><CheckCircle size={10} className="text-green-500"/> {p.daysPerWeek} días</div>
                 <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold truncate"><CheckCircle size={10} className="text-green-500"/> {p.classes.join(', ') || 'Musculación'}</div>
              </div>
              <div className="flex gap-2"><button onClick={()=>onEdit(p)} className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase">Editar</button><button onClick={()=>onDelete(p.id)} className="p-2 text-red-500/30 hover:text-red-500"><Trash2 size={14}/></button></div>
           </div>
         ))}
      </div>
    </div>
  );
}

function StaffModule({ staff, onEdit, onDelete, onAddClick }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="font-black text-lg uppercase">Personal</h3><button onClick={onAddClick} className="bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ Nuevo</button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {staff.map((s: any) => (
           <div key={s.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
             <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-lg font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">{s.name[0]}</div><div><p className="font-black text-white text-[11px] uppercase mb-1 truncate w-24">{s.name}</p><p className="text-[8px] text-white/20 uppercase font-black tracking-widest">{s.role}</p></div></div>
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
            <div className="h-40">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={data.revenue_breakdown} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                        {data.revenue_breakdown.map((_:any, index:number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                     <Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}} />
                     <Legend wrapperStyle={{fontSize:'8px', textTransform:'uppercase', fontWeight:'900'}} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Crecimiento de Ventas</h3>
            <div className="h-40">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_growth}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                     <XAxis dataKey="month" stroke="#444" fontSize={8} />
                     <YAxis stroke="#444" fontSize={8} />
                     <Tooltip contentStyle={{backgroundColor:'#111', border:'none', fontSize:'10px'}} />
                     <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={{r:3}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center">
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">ARPU</p>
            <p className="text-2xl font-black text-white mt-1">${data.arpu}</p>
            <div className="mt-4 flex justify-around"><div className="text-center"><p className="text-[7px] text-white/20 uppercase font-black">Facturado</p><p className="text-sm font-black text-green-500">${data.total_revenue}</p></div><div className="text-center"><p className="text-[7px] text-white/20 uppercase font-black">Gastos</p><p className="text-sm font-black text-red-500">${data.total_expenses}</p></div></div>
         </div>
      </div>
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
         <div className="flex items-center gap-4">
            <div className="space-y-1"><label className="text-[8px] text-white/20 uppercase font-black">Desde</label><input type="date" className="bg-black/40 border border-white/10 rounded-lg p-2 text-white text-[8px] outline-none" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div>
            <div className="space-y-1"><label className="text-[8px] text-white/20 uppercase font-black">Hasta</label><input type="date" className="bg-black/40 border border-white/10 rounded-lg p-2 text-white text-[8px] outline-none" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
         </div>
      </div>
    </div>
  );
}

function ProfileModule({ user, onSave }: any) {
  const [password, setPassword] = useState('');
  
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white/5 border border-white/5 p-8 rounded-3xl text-center space-y-4">
         <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
            <User size={32} />
         </div>
         <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">{user?.name}</h2>
            <p className="text-[10px] text-blue-400 font-black uppercase mt-1">{user?.role}</p>
         </div>
      </div>
      
      <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
         <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Seguridad de la Cuenta</h3>
         <div className="space-y-2">
            <label className="text-[9px] text-white/20 uppercase font-black px-2">Nueva Contraseña</label>
            <input type="text" placeholder="Ingresa tu nueva clave..." className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs" value={password} onChange={e=>setPassword(e.target.value)} />
         </div>
         <button className="w-full py-4 bg-blue-600 rounded-xl font-black text-white text-xs uppercase transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20 mt-4" onClick={() => onSave(password)}>Guardar Cambios</button>
      </div>
    </div>
  );
}

function NoAccess() {
  return <div className="h-40 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-2xl border border-white/10"><Lock size={24} className="text-red-500 mb-4" /><h3 className="text-xs font-black text-white uppercase tracking-widest">Acceso Restringido</h3></div>;
}

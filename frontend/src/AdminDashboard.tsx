import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [members, setMembers] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Gold' });
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
    fetch('/api/admin/members').then(res => res.json()).then(setMembers);
    fetch('/api/admin/finance/summary').then(res => res.json()).then(setFinanceData);
    fetch('/api/admin/analytics/ai').then(res => res.json()).then(setAiData);
    fetch('/api/admin/pricing/dynamic').then(res => res.json()).then(setPricingData);
  };

  const handleAddMember = async () => {
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    });
    
    if (res.ok) {
      setIsModalOpen(false);
      setNewMember({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Gold' });
      refreshData();
    } else {
      const errorData = await res.json();
      alert(`Error al crear socio: ${JSON.stringify(errorData.detail)}`);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
      refreshData();
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/admin/members/${id}/status?status=${status}`, { method: 'PUT' });
    refreshData();
  };

  const handlePayment = async () => {
    if (!selectedMember || !paymentAmount) return;
    await fetch(`/api/admin/payments?member_id=${selectedMember.id}&amount=${paymentAmount}`, { method: 'POST' });
    setIsPaymentModalOpen(false);
    setSelectedMember(null);
    setPaymentAmount('');
    refreshData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Members':
        return (
          <MembersModule 
            members={members} 
            onDelete={handleDeleteMember} 
            onAddClick={() => setIsModalOpen(true)} 
            onChangeStatus={handleStatusChange}
            onPayClick={(m: any) => { setSelectedMember(m); setIsPaymentModalOpen(true); }}
          />
        );
      case 'Finance':
        return <FinanceModule data={financeData} />;
      case 'AI Analytics':
        return <AIAnalyticsModule data={aiData} pricing={pricingData} />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Active Members" value={stats?.active_members || '0'} trend="+4.5%" delay="0s" />
              <StatCard title="Total Revenue" value={`$${stats?.total_revenue?.toFixed(2) || '0'}`} trend="+12.2%" delay="0.1s" />
              <StatCard title="Churn Risk" value={stats?.churn_risk_count || '0'} trend="-2.1%" caution delay="0.2s" />
              <StatCard title="Expiring Soon" value={stats?.por_vencer_count || '0'} trend="Alert" caution delay="0.3s" />
            </div>

            {/* AI Alerts Section */}
            <section className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl mb-12 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={120} className="text-blue-500" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-blue-500" />
                <h3 className="text-xl font-semibold text-white">AI Predictive Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats?.alerts?.map((alert: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group/item">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover/item:scale-110 transition-transform">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1 uppercase text-xs tracking-widest text-blue-400">{alert.type} Alert</h4>
                      <p className="text-white/70 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                )) || <p className="text-white/20 italic">Scanning data for insights...</p>}
              </div>
            </section>

            {/* Dynamic Pricing Motor */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="text-green-400" />
                    <h4 className="text-xl font-bold">Dynamic Pricing Motor</h4>
                  </div>
                  <p className="text-white/50 mb-6">Adjustments based on real-time gym occupancy and peak-hour demand.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-6">
                      <p className="text-sm text-white/40 mb-2">Demand Factor</p>
                      <p className="text-3xl font-bold text-white">x{pricingData?.demand_factor || '1.0'}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6">
                      <p className="text-sm text-white/40 mb-2">Suggested Price</p>
                      <p className="text-3xl font-bold text-green-400">${pricingData?.calculated_price || '0.00'}</p>
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center">
                  <h4 className="text-xl font-bold mb-4 opacity-50">Labor Optimizer</h4>
                  <p className="text-white/30 text-sm mb-4">Shift recommendations for staff based on predicted attendance.</p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-400 font-bold text-sm">Suggested Action:</p>
                    <p className="text-white/70 text-sm mt-1">+1 Trainer needed for today's 18:00 peak.</p>
                  </div>
               </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden">
      {/* Modal for Adding Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">Add New Member</h2>
            <div className="space-y-6">
              <input 
                type="text" placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})}
              />
              <input 
                type="text" placeholder="DNI Number" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.dni} onChange={e => setNewMember({...newMember, dni: e.target.value})}
              />
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}
              >
                <option value="ACTIVO">Activo</option>
                <option value="DEUDA">Deuda</option>
                <option value="POR VENCER">Por Vencer</option>
              </select>
            </div>
            <div className="flex gap-4 mt-12">
              <button className="flex-1 py-4 text-white/40 font-bold" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20" onClick={handleAddMember}>Create Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Payment */}
      {isPaymentModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-2">Record Payment</h2>
            <p className="text-white/50 mb-8">For {selectedMember.name}</p>
            <div className="space-y-6">
              <input 
                type="number" placeholder="Amount ($)" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none"
                value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mt-12">
              <button className="flex-1 py-4 text-white/40 font-bold" onClick={() => { setIsPaymentModalOpen(false); setSelectedMember(null); }}>Cancel</button>
              <button className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-lg shadow-green-600/20" onClick={handlePayment}>Record</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">GYM-ATLAS</h1>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
            <SidebarItem icon={<Users size={20} />} label="Members" active={activeTab === 'Members'} onClick={() => setActiveTab('Members')} />
            <SidebarItem icon={<CreditCard size={20} />} label="Finance" active={activeTab === 'Finance'} onClick={() => setActiveTab('Finance')} />
            <SidebarItem icon={<TrendingUp size={20} />} label="AI Analytics" active={activeTab === 'AI Analytics'} onClick={() => setActiveTab('AI Analytics')} />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
              <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-widest">SaaS Status</p>
              <p className="text-sm font-medium">Enterprise Plan</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10 bg-black/10">
          <header className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                {activeTab === 'Overview' ? 'Welcome Back, Admin' : activeTab}
              </h2>
              <p className="text-white/40">
                {activeTab === 'Overview' 
                  ? "Here's what's happening at Gym-Atlas today." 
                  : `Managing your ${activeTab.toLowerCase()} in real-time.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                Generate Report
              </div>
            </div>
          </header>

          {renderContent()}
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

function MembersModule({ members, onDelete, onAddClick, onChangeStatus, onPayClick }: any) {
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold">Member Database</h3>
          <button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Add Member</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {members.map((m: any) => (
             <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-2xl flex items-center justify-center font-bold text-xl">{m.name[0]}</div>
                   <div>
                     <p className="font-bold text-white text-lg">{m.name}</p>
                     <p className={`text-xs font-bold tracking-widest ${m.status === 'ACTIVO' ? 'text-green-400' : m.status === 'DEUDA' ? 'text-red-400' : 'text-yellow-400'}`}>● {m.status}</p>
                   </div>
                 </div>
                 <div className="space-y-2 mb-8">
                   <p className="text-xs text-white/30 flex justify-between">DNI: <span className="text-white/70 font-mono">{m.dni}</span></p>
                   <p className="text-xs text-white/30 flex justify-between">Plan: <span className="text-white/70">{m.membership_type || 'Standard'}</span></p>
                 </div>
               </div>
               
               <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {m.status !== 'ACTIVO' && (
                    <button 
                      onClick={() => onPayClick(m)}
                      className="w-full py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Record Payment
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
                     Del
                   </button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function FinanceModule({ data }: any) {
  if (!data) return <p>Loading finance data...</p>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Revenue Timeline</h3>
            <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-white/50 tracking-widest uppercase">Last 6 Months</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
          <h3 className="text-xl font-bold mb-8">Recent Transactions</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.recent_payments.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Member #{tx.member_id}</p>
                    <p className="text-xs text-white/40">{tx.date}</p>
                  </div>
                </div>
                <p className="font-bold text-green-400">+${tx.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAnalyticsModule({ data }: any) {
  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Prediction */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="text-purple-500" />
            <h3 className="text-xl font-bold">Predicted Attendance</h3>
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
                <Bar dataKey="morning" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="afternoon" stackId="a" fill="#ec4899" />
                <Bar dataKey="evening" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Analysis */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-yellow-500" />
            <h3 className="text-xl font-bold">Churn Drivers</h3>
          </div>
          <div className="space-y-6">
            {data.churn_factors.map((factor: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">{factor.factor}</span>
                  <span className="font-bold">{factor.impact}% Impact</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full" style={{ width: `${factor.impact}%` }}></div>
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

import { LayoutDashboard, Users, CreditCard, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Gold' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
    
    fetch('/api/admin/members')
      .then(res => res.json())
      .then(data => setMembers(data));
  };

  const handleAddMember = async () => {
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    });
    
    if (res.ok) {
      setIsModalOpen(false);
      setNewMember({ name: '', dni: '', status: 'ACTIVO', membership_type: 'Gold' }); // Reset
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

  const renderContent = () => {
    switch (activeTab) {
      case 'Members':
        return (
          <MembersModule 
            members={members} 
            onDelete={handleDeleteMember} 
            onAddClick={() => setIsModalOpen(true)} 
          />
        );
      case 'Finance':
        return <FinanceModule />;
      case 'AI Analytics':
        return <AIAnalyticsModule />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Active Members" value={stats?.active_members || '0'} trend="+4.5%" delay="0s" />
              <StatCard title="Total Revenue" value={`$${stats?.total_revenue || '0'}`} trend="+12.2%" delay="0.1s" />
              <StatCard title="Churn Risk" value={stats?.churn_risk_count || '0'} trend="-2.1%" caution delay="0.2s" />
              <StatCard title="AI Accuracy" value="99.2%" trend="Stable" delay="0.3s" />
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

            {/* Placeholder for Dynamic Pricing Table */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl h-96 flex flex-col justify-center px-12 border-dashed">
                  <h4 className="text-xl font-bold mb-4 opacity-50">Dynamic Pricing Motor</h4>
                  <p className="text-white/30 max-w-md">Adjustments based on real-time gym occupancy and peak-hour demand. Currently scaling with +15% demand factor.</p>
               </div>
               <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl h-96 flex flex-col justify-center px-10 border-dashed">
                  <h4 className="text-xl font-bold mb-4 opacity-50">Labor Optimizer</h4>
                  <p className="text-white/30">Shift recommendations for staff based on predicted attendance.</p>
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
              </select>
            </div>
            <div className="flex gap-4 mt-12">
              <button className="flex-1 py-4 text-white/40 font-bold" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/20" onClick={handleAddMember}>Create Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout as before ... */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar as before ... */}
        <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">GYM-ATLAS</h1>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="Overview" 
              active={activeTab === 'Overview'} 
              onClick={() => setActiveTab('Overview')} 
            />
            <SidebarItem 
              icon={<Users size={20} />} 
              label="Members" 
              active={activeTab === 'Members'} 
              onClick={() => setActiveTab('Members')} 
            />
            <SidebarItem 
              icon={<CreditCard size={20} />} 
              label="Finance" 
              active={activeTab === 'Finance'} 
              onClick={() => setActiveTab('Finance')} 
            />
            <SidebarItem 
              icon={<TrendingUp size={20} />} 
              label="AI Analytics" 
              active={activeTab === 'AI Analytics'} 
              onClick={() => setActiveTab('AI Analytics')} 
            />
          </nav>

          <div className="pt-6 border-t border-white/5">
            <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
              <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-widest">SaaS Status</p>
              <p className="text-sm font-medium">Enterprise Plan</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
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

function MembersModule({ members, onDelete, onAddClick }: any) {
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold">Member Database</h3>
          <button onClick={onAddClick} className="bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Add Member</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {members.map((m: any) => (
             <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-2xl flex items-center justify-center font-bold text-xl">{m.name[0]}</div>
                 <div>
                   <p className="font-bold text-white text-lg">{m.name}</p>
                   <p className={`text-xs font-bold tracking-widest ${m.status === 'ACTIVO' ? 'text-green-400' : 'text-red-400'}`}>● {m.status}</p>
                 </div>
               </div>
               <div className="space-y-2 mb-8">
                 <p className="text-xs text-white/30 flex justify-between">DNI: <span className="text-white/70 font-mono">{m.dni}</span></p>
                 <p className="text-xs text-white/30 flex justify-between">Plan: <span className="text-white/70">{m.plan || 'Standard'}</span></p>
               </div>
               <button 
                 onClick={() => onDelete(m.id)}
                 className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
               >
                 Remove Member
               </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function FinanceModule() {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center text-white/20 border-dashed animate-in zoom-in duration-500">
      <CreditCard size={48} className="mx-auto mb-4 opacity-10" />
      <p>Financial Control Module coming soon.</p>
    </div>
  );
}

function AIAnalyticsModule() {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center text-white/20 border-dashed animate-in zoom-in duration-500">
      <Brain size={48} className="mx-auto mb-4 opacity-10" />
      <p>Advanced AI Telemetry and Churn Prediction.</p>
    </div>
  );
}

function StatCard({ title, value, trend, delay, caution = false }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/20 transition-all group relative overflow-hidden" style={{ animationDelay: delay }}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full translate-x-12 translate-y-[-12px]" />
      <p className="text-sm font-semibold text-white/30 uppercase tracking-widest mb-4 group-hover:text-white/50 transition-colors uppercaseTracking">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-4xl font-bold tracking-tighter text-white">{value}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${caution ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

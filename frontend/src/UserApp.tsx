import { Heart, Calendar, ShoppingBag, User, Activity, Zap, ChevronRight, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserApp() {
  const [dni] = useState('1111'); // Default test DNI
  const [wellness, setWellness] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user/${dni}/wellness`)
      .then(res => res.json())
      .then(data => setWellness(data));
  }, [dni]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 mb-20 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <header className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5">
             <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">JD</div>
           </div>
           <div>
             <h2 className="text-xl font-bold tracking-tight">Nicolas France</h2>
             <span className="text-xs text-blue-400 font-mono tracking-widest uppercase">Elite Member</span>
           </div>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center relative">
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
          <Zap size={20} className="text-blue-500" />
        </div>
      </header>

      <main className="relative z-10 space-y-8 max-w-lg mx-auto">
        {/* Wellness Score Card */}
        <section className="bg-gradient-to-br from-neutral-900 to-black p-8 rounded-[40px] border border-white/10 shadow-3xl text-center group">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-white/40 mb-6 group-hover:text-blue-400 transition-colors uppercaseTracking">Wellness Score</p>
          <div className="relative inline-block mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * (wellness?.score || 0)) / 100} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black tracking-tighter">{wellness?.score || '0'}</span>
              <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Ready</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-sm text-white/80 leading-relaxed font-medium">
             {wellness?.suggestions?.[0] || 'Analyzing biosensors...'}
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-4">
           <MetricMini icon={<Heart className="text-red-500" />} label="HRV" value={`${wellness?.metrics?.hrv || 0} ms`} />
           <MetricMini icon={<Activity className="text-blue-500" />} label="Sleep" value={`${(wellness?.metrics?.sleep || 0) * 100}%`} />
        </section>

        {/* AI Trainer Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/40 uppercaseTracking">Autonomous Trainer</h3>
            <ChevronRight size={16} className="text-white/20" />
          </div>
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                <Brain size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white">Adaptive Push B</h4>
                <p className="text-xs text-white/40">Modified for 85% fatigue level</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white text-black font-bold rounded-2xl active:scale-95 transition-transform hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              Start Session
            </button>
          </div>
        </section>

        {/* Categories / Marketplace Header */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/40 uppercaseTracking">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ActionBtn icon={<Calendar size={20} />} label="Classes" color="bg-blue-500/10 text-blue-400" />
            <ActionBtn icon={<ShoppingBag size={20} />} label="Store" color="bg-green-500/10 text-green-400" />
            <ActionBtn icon={<User size={20} />} label="Profile" color="bg-purple-500/10 text-purple-400" />
          </div>
        </section>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-6 left-6 right-6 h-18 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[30px] z-50 flex items-center justify-around px-8 shadow-2xl">
        <NavIcon icon={<LayoutDashboard size={24} />} active />
        <NavIcon icon={<Activity size={24} />} />
        <NavIcon icon={<Calendar size={24} />} />
        <NavIcon icon={<ShoppingBag size={24} />} />
      </nav>
    </div>
  );
}

function MetricMini({ icon, label, value }: any) {
  return (
    <div className="bg-neutral-900 border border-white/5 p-4 rounded-[28px] flex items-center gap-3">
       <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center">{icon}</div>
       <div>
          <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase uppercaseTracking">{label}</p>
          <p className="text-lg font-bold tracking-tight">{value}</p>
       </div>
    </div>
  );
}

function ActionBtn({ icon, label, color }: any) {
  return (
    <div className={`p-4 rounded-[28px] border border-white/5 flex flex-col items-center gap-2 group cursor-pointer hover:border-white/20 transition-all`}>
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>{icon}</div>
       <span className="text-[11px] font-bold text-white/40 tracking-wider uppercase uppercaseTracking">{label}</span>
    </div>
  );
}

function NavIcon({ icon, active = false }: any) {
  return (
    <div className={`p-3 rounded-2xl transition-all cursor-pointer ${active ? 'text-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
      {icon}
    </div>
  );
}

function LayoutDashboard(props: any) {
  return <Zap {...props} /> // Using Zap as Home icon for now
}

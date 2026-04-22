import { Heart, Calendar, ShoppingBag, Activity, Zap, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserApp() {
  const [dni] = useState('1111'); // Default test DNI
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    // Streak and Profile data
  }, [dni]);

  const handleBooking = async (className: string) => {
    const res = await fetch(`/api/user/${dni}/book?class_name=${className}`, { method: 'POST' });
    const data = await res.json();
    if (data.status === 'success') {
      alert(`¡Clase de ${className} reservada con éxito!`);
    } else {
      alert(data.message || 'Error en la reserva');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Activity':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold px-2">Próximas Clases</h3>
            <ClassCard title="Yoga Flow" time="09:00 AM" coach="Ana" onBook={() => handleBooking('Yoga')} />
            <ClassCard title="CrossFit HIIT" time="11:30 AM" coach="Marcos" onBook={() => handleBooking('CrossFit')} />
            <ClassCard title="Powerlifting" time="06:00 PM" coach="Santi" onBook={() => handleBooking('Powerlifting')} />
          </div>
        );
      case 'Calendar':
        return (
          <div className="bg-neutral-900 border border-white/5 rounded-[40px] p-10 text-center py-20 animate-in zoom-in">
             <Calendar size={48} className="mx-auto mb-6 text-blue-500 opacity-20" />
             <h3 className="text-xl font-bold mb-2">Mi Calendario</h3>
             <p className="text-white/40">Aquí verás tus clases reservadas y eventos.</p>
          </div>
        );
      case 'Store':
        return (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
             <StoreItem name="Proteína ISO" price="$45.00" image="🥛" />
             <StoreItem name="Creatina 300g" price="$25.00" image="⚡" />
             <StoreItem name="Remera Atlas" price="$30.00" image="👕" />
             <StoreItem name="Shaker Pro" price="$12.00" image="🥤" />
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
               <div className="flex flex-col items-center mb-8">
                 <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">NF</div>
                 <h3 className="text-2xl font-bold text-white">Nicolas France</h3>
                 <p className="text-blue-400 font-mono text-xs tracking-widest uppercase">Elite Member</p>
               </div>
               <div className="space-y-4 border-t border-white/10 pt-6">
                 <div className="flex justify-between text-sm"><span className="text-white/40">DNI</span> <span>1111</span></div>
                 <div className="flex justify-between text-sm"><span className="text-white/40">Plan</span> <span>Black Atlas</span></div>
                 <div className="flex justify-between text-sm"><span className="text-white/40">Vencimiento</span> <span>25 Mayo 2026</span></div>
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Streak Card */}
            <section className="bg-gradient-to-br from-neutral-900 to-black p-10 rounded-[50px] border border-white/10 shadow-3xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
              <p className="text-xs uppercase tracking-[0.4em] font-black text-blue-500 mb-8 relative z-10">Días de Racha</p>
              
              <div className="relative z-10 flex items-center justify-center gap-4 mb-8">
                 <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 animate-bounce">
                    <Zap size={32} />
                 </div>
                 <span className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">14</span>
                 <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 animate-bounce" style={{animationDelay: '0.2s'}}>
                    <Zap size={32} />
                 </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-sm text-white/60 leading-relaxed font-medium relative z-10 mx-4">
                 ¡Increíble progreso! Estás en el top 5% de atletas este mes. Mantén el ritmo. 🚀
              </div>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-neutral-900 border border-white/5 rounded-[35px] flex flex-col gap-4 group cursor-pointer hover:border-indigo-500/30 transition-all">
                  <Heart className="text-red-500" />
                  <p className="font-bold text-lg">Rutina Hoy</p>
                  <p className="text-xs text-white/30">Empuje & Cardio</p>
               </div>
               <div className="p-6 bg-neutral-900 border border-white/5 rounded-[35px] flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
                  <Brain className="text-blue-500" />
                  <p className="font-bold text-lg">AI Tips</p>
                  <p className="text-xs text-white/30">Prioriza Proteína</p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 mb-24 overflow-x-hidden selection:bg-blue-500/30">
      <header className="relative z-10 flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('Profile')}>
           <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-900/20">
             <div className="w-full h-full bg-neutral-900 rounded-[22px] flex items-center justify-center text-lg font-black tracking-tighter">NF</div>
           </div>
           <div>
             <h2 className="text-2xl font-black tracking-tight text-white">Nicolas France</h2>
             <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-black">Elite Member</span>
           </div>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group active:scale-90 transition-transform">
          <Zap size={24} className="text-blue-500 group-hover:text-orange-500 transition-colors" />
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto">
        {renderTabContent()}
      </main>

      <nav className="fixed bottom-8 left-8 right-8 h-20 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[40px] z-50 flex items-center justify-around px-8 shadow-3xl">
        <NavIcon icon={<LayoutDashboard size={26} />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
        <NavIcon icon={<Activity size={26} />} active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')} />
        <NavIcon icon={<Calendar size={26} />} active={activeTab === 'Calendar'} onClick={() => setActiveTab('Calendar')} />
        <NavIcon icon={<ShoppingBag size={26} />} active={activeTab === 'Store'} onClick={() => setActiveTab('Store')} />
      </nav>
    </div>
  );
}

function ClassCard({ title, time, coach, onBook }: any) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[35px] flex items-center justify-between group hover:border-blue-500/30 transition-all">
       <div>
         <p className="text-xl font-bold text-white mb-1">{title}</p>
         <p className="text-xs text-white/40 font-medium">Coach: {coach} • {time}</p>
       </div>
       <button 
         onClick={onBook}
         className="px-6 py-3 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-90 transition-all"
       >
         Inscribirme
       </button>
    </div>
  );
}

function StoreItem({ name, price, image }: any) {
  return (
    <div className="bg-neutral-900 border border-white/5 p-6 rounded-[40px] text-center group cursor-pointer hover:border-green-500/30 transition-all">
       <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">{image}</div>
       <p className="font-bold text-white mb-1">{name}</p>
       <p className="text-sm text-green-400 font-black">{price}</p>
       <button className="mt-4 w-full py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Comprar</button>
    </div>
  );
}

function NavIcon({ icon, active = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all cursor-pointer group ${active ? 'text-blue-500 bg-blue-500/10' : 'text-white/20 hover:text-white/50'}`}
    >
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>{icon}</div>
    </div>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  );
}


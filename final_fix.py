import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

regex = re.compile(r"case 'Evolution':[\s\S]*?case 'Calendar':")

new_case = """case 'Evolution': {
        let filteredEvolution: any[] = userData.evolution || [];
        if (chartFilter === '7d') {
          const limitDate = new Date();
          limitDate.setDate(limitDate.getDate() - 7);
          filteredEvolution = filteredEvolution.filter((e: any) => new Date(e.date) >= limitDate);
        } else if (chartFilter === '30d') {
          const limitDate = new Date();
          limitDate.setDate(limitDate.getDate() - 30);
          filteredEvolution = filteredEvolution.filter((e: any) => new Date(e.date) >= limitDate);
        }

        let totalImprovement = 0;
        if (filteredEvolution && filteredEvolution.length > 1) {
          const first = filteredEvolution[0];
          const last = filteredEvolution[filteredEvolution.length - 1];
          const keys = Object.keys(last).filter(k => k !== 'date' && k !== 'name');
          keys.forEach(k => {
            const firstVal = first[k] || 0;
            const lastVal = last[k] || 0;
            if (lastVal > firstVal) totalImprovement += (lastVal - firstVal);
          });
        }
        const daysTrained = filteredEvolution.length;

        return (
          <div className="h-full flex flex-col min-h-0 justify-center animate-in slide-in-from-bottom-8 overflow-hidden max-h-[75vh]">
             <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 border-t-white/35 border-l-white/35 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between h-full min-h-0">
                <div className="flex justify-between items-center flex-shrink-0">
                  <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter"><TrendingUp className="text-orange-500" size={22}/> Mi Progreso</h3>
                  <div className="flex gap-2">
                     <button onClick={() => setChartFilter('7d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '7d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>7 Días</button>
                     <button onClick={() => setChartFilter('30d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '30d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>30 Días</button>
                     <button onClick={() => setChartFilter('all')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>Histórico</button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 my-4">
                   <ProgressChart data={filteredEvolution} />
                </div>
                <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                   <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl font-black text-white">+{totalImprovement}kg</p><p className="text-[9px] text-green-500 font-black mt-1 uppercase">Imparable</p></div>
                   <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl font-black text-white">{daysTrained}</p><p className="text-[9px] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>
                </div>
             </div>
          </div>
        );
      }
      case 'Calendar':"""

content = regex.sub(new_case, content)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Inject state for the filter
content = content.replace(
    'const [selectedClassIndex, setSelectedClassIndex] = useState(0);',
    "const [selectedClassIndex, setSelectedClassIndex] = useState(0);\n  const [chartFilter, setChartFilter] = useState<'7d'|'30d'|'all'>('all');"
)

# Now in the 'Evolution' case, I need to filter `userData.evolution`
# and recalculate "Mejoría Total" and "Días Entrenados" based on the filtered data.
evolution_calc_code = """
        return (
          <div className="h-full flex flex-col min-h-0 justify-center animate-in slide-in-from-bottom-8 overflow-hidden max-h-[75vh]">
"""

new_evolution_calc_code = """
        let filteredEvolution = userData.evolution || [];
        if (chartFilter === '7d') {
          const limitDate = new Date();
          limitDate.setDate(limitDate.getDate() - 7);
          filteredEvolution = filteredEvolution.filter(e => new Date(e.date) >= limitDate);
        } else if (chartFilter === '30d') {
          const limitDate = new Date();
          limitDate.setDate(limitDate.getDate() - 30);
          filteredEvolution = filteredEvolution.filter(e => new Date(e.date) >= limitDate);
        }

        let totalImprovement = 0;
        let daysTrained = filteredEvolution.length;
        if (filteredEvolution.length > 1) {
          const first = filteredEvolution[0];
          const last = filteredEvolution[filteredEvolution.length - 1];
          let firstTotal = 0; let lastTotal = 0;
          Object.keys(first).forEach(k => { if (k !== 'date' && typeof first[k] === 'number') firstTotal += first[k]; });
          Object.keys(last).forEach(k => { if (k !== 'date' && typeof last[k] === 'number') lastTotal += last[k]; });
          if (firstTotal > 0) totalImprovement = Math.round(((lastTotal - firstTotal) / firstTotal) * 100);
        }

        return (
          <div className="h-full flex flex-col min-h-0 justify-center animate-in slide-in-from-bottom-8 overflow-hidden max-h-[75vh]">
"""

content = content.replace(evolution_calc_code, new_evolution_calc_code)


stats_display = """                   <div className="flex justify-between gap-4">
                      <div className="flex-1 bg-[#141b29] border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Mejoría Total</p>
                         <p className="text-3xl font-black text-white flex items-baseline gap-1">
                           {(() => {
                             if (userData.evolution && userData.evolution.length > 1) {
                               const first = userData.evolution[0];
                               const last = userData.evolution[userData.evolution.length - 1];
                               let firstTotal = 0; let lastTotal = 0;
                               Object.keys(first).forEach(k => { if (k !== 'date' && typeof first[k] === 'number') firstTotal += first[k]; });
                               Object.keys(last).forEach(k => { if (k !== 'date' && typeof last[k] === 'number') lastTotal += last[k]; });
                               if (firstTotal > 0) return `+${Math.round(((lastTotal - firstTotal) / firstTotal) * 100)}%`;
                             }
                             return "0%";
                           })()}
                           <TrendingUp className="text-orange-500" size={14}/>
                         </p>
                      </div>
                      <div className="flex-1 bg-[#141b29] border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Días Entrenados</p>
                         <p className="text-3xl font-black text-white">{userData.evolution?.length || 0}</p>
                      </div>
                   </div>"""

new_stats_display = """                   <div className="flex justify-between gap-4">
                      <div className="flex-1 bg-[#141b29] border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Mejoría Total</p>
                         <p className="text-3xl font-black text-white flex items-baseline gap-1">
                           {totalImprovement > 0 ? `+${totalImprovement}%` : `${totalImprovement}%`}
                           <TrendingUp className="text-orange-500" size={14}/>
                         </p>
                      </div>
                      <div className="flex-1 bg-[#141b29] border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Días Entrenados</p>
                         <p className="text-3xl font-black text-white">{daysTrained}</p>
                      </div>
                   </div>"""

content = content.replace(stats_display, new_stats_display)

# Now we need to pass `filteredEvolution` to `ProgressChart`
content = content.replace('<ProgressChart data={userData.evolution} />', '<ProgressChart data={filteredEvolution} />')

# And add the filter buttons right above the chart!
chart_wrapper_start = """                <div className="flex-1 bg-[#141b29] rounded-2xl border border-white/5 p-4 flex flex-col min-h-[300px]">
                   <h4 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4">Cargas (KG) a lo largo del tiempo</h4>"""
chart_wrapper_start_new = """                <div className="flex-1 bg-[#141b29] rounded-2xl border border-white/5 p-4 flex flex-col min-h-[300px]">
                   <div className="flex justify-between items-center mb-4">
                     <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Cargas (KG)</h4>
                     <div className="flex gap-2">
                       <button onClick={() => setChartFilter('7d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '7d' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>7 Días</button>
                       <button onClick={() => setChartFilter('30d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '30d' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>30 Días</button>
                       <button onClick={() => setChartFilter('all')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>Histórico</button>
                     </div>
                   </div>"""

content = content.replace(chart_wrapper_start, chart_wrapper_start_new)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

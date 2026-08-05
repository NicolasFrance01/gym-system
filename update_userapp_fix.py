import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add the buttons to the chart header
chart_header = """<h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter flex-shrink-0"><TrendingUp className="text-orange-500" size={22}/> Mi Progreso</h3>
                <div className="flex-1 min-h-0 my-4">"""

new_chart_header = """<div className="flex justify-between items-center flex-shrink-0">
                  <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter"><TrendingUp className="text-orange-500" size={22}/> Mi Progreso</h3>
                  <div className="flex gap-2">
                     <button onClick={() => setChartFilter('7d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '7d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>7 Días</button>
                     <button onClick={() => setChartFilter('30d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '30d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>30 Días</button>
                     <button onClick={() => setChartFilter('all')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/40'}`}>Histórico</button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 my-4">"""
content = content.replace(chart_header, new_chart_header)

# Now the actual stat block
old_stat_block = r'let totalImprovement = 0;[\s\S]*?const daysTrained = userData\?\.attendanceHistory \? userData\.attendanceHistory\.filter\(\(h: any\) => h\.type !== "Tótem"\)\.length : 0;[\s\S]*?return \([\s\S]*?<>[\s\S]*?<div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-\[8px\] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl font-black text-white">\+\{totalImprovement\}kg</p><p className="text-\[9px\] text-green-500 font-black mt-1 uppercase">Imparable</p></div>[\s\S]*?<div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-\[8px\] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl font-black text-white">\{daysTrained\}</p><p className="text-\[9px\] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>[\s\S]*?</>[\s\S]*?\);'

new_stat_block = """let totalImprovement = 0;
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
                       <>
                         <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl font-black text-white">+{totalImprovement}kg</p><p className="text-[9px] text-green-500 font-black mt-1 uppercase">Imparable</p></div>
                         <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl font-black text-white">{daysTrained}</p><p className="text-[9px] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>
                       </>
                     );"""

content = re.sub(old_stat_block, new_stat_block, content)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Inject chartFilter state
content = content.replace(
    "const [progressData, setProgressData] = useState<any>(null);",
    "const [progressData, setProgressData] = useState<any>(null);\n  const [chartFilter, setChartFilter] = useState<'7d'|'30d'|'all'>('all');"
)

# Calculate filtered data and stats for the 'progreso' tab
progreso_tab_start = """          {activeTab === 'progreso' && (
            <div className="space-y-6">"""

new_progreso_tab_start = """          {activeTab === 'progreso' && (
            <div className="space-y-6">
              {(() => {
                let filteredEvolution = progressData?.chart_data || [];
                if (chartFilter === '7d') {
                  const limitDate = new Date();
                  limitDate.setDate(limitDate.getDate() - 7);
                  filteredEvolution = filteredEvolution.filter((e:any) => new Date(e.date) >= limitDate);
                } else if (chartFilter === '30d') {
                  const limitDate = new Date();
                  limitDate.setDate(limitDate.getDate() - 30);
                  filteredEvolution = filteredEvolution.filter((e:any) => new Date(e.date) >= limitDate);
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
                  <>
"""
content = content.replace(progreso_tab_start, new_progreso_tab_start)

# Now we need to update the stats display and the chart
stats_and_chart = """              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#141b29] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Mejoría Total</p>
                   <p className="text-3xl font-black text-white flex items-baseline gap-1">
                     {(() => {
                       if (progressData?.chart_data && progressData.chart_data.length > 1) {
                         const first = progressData.chart_data[0];
                         const last = progressData.chart_data[progressData.chart_data.length - 1];
                         let firstTotal = 0; let lastTotal = 0;
                         Object.keys(first).forEach(k => { if (k !== 'date' && typeof first[k] === 'number') firstTotal += first[k]; });
                         Object.keys(last).forEach(k => { if (k !== 'date' && typeof last[k] === 'number') lastTotal += last[k]; });
                         if (firstTotal > 0) return `+${Math.round(((lastTotal - firstTotal) / firstTotal) * 100)}%`;
                       }
                       return "0%";
                     })()}
                   </p>
                </div>
                <div className="bg-[#141b29] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Días Entrenados</p>
                   <p className="text-3xl font-black text-white">{progressData?.chart_data?.length || 0}</p>
                </div>
              </div>

              <div className="bg-[#141b29] rounded-2xl border border-white/5 p-4 flex flex-col min-h-[300px]">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4">Cargas (KG) a lo largo del tiempo</h4>
                <ProgressChart data={progressData?.chart_data || []} />
              </div>"""

new_stats_and_chart = """              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#141b29] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Mejoría Total</p>
                   <p className="text-3xl font-black text-white flex items-baseline gap-1">
                     {totalImprovement > 0 ? `+${totalImprovement}%` : `${totalImprovement}%`}
                   </p>
                </div>
                <div className="bg-[#141b29] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Días Entrenados</p>
                   <p className="text-3xl font-black text-white">{daysTrained}</p>
                </div>
              </div>

              <div className="bg-[#141b29] rounded-2xl border border-white/5 p-4 flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Cargas (KG)</h4>
                  <div className="flex gap-2">
                    <button onClick={() => setChartFilter('7d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '7d' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>7 Días</button>
                    <button onClick={() => setChartFilter('30d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '30d' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>30 Días</button>
                    <button onClick={() => setChartFilter('all')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>Histórico</button>
                  </div>
                </div>
                <ProgressChart data={filteredEvolution} />
              </div>
                  </>
                );
              })()}"""

content = content.replace(stats_and_chart, new_stats_and_chart)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

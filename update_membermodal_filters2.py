import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the progreso tab
progreso_tab_start = """          {activeTab === 'progreso' && (
            <div className="w-full h-full flex flex-col gap-6">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-black uppercase mb-4 text-black dark:text-white">Gráfico de Cargas</h3>
                <ProgressChart data={progressData?.chart_data || []} />
              </div>"""

new_progreso_tab = """          {activeTab === 'progreso' && (
            <div className="w-full h-full flex flex-col gap-6">
              {(() => {
                let filteredEvolution: any[] = progressData?.chart_data || [];
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <p className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 tracking-widest mb-1">Mejoría Total</p>
                         <p className="text-3xl font-black text-black dark:text-white flex items-baseline gap-1">
                           {totalImprovement > 0 ? `+${totalImprovement}%` : `${totalImprovement}%`}
                         </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
                         <p className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 tracking-widest mb-1">Días Entrenados</p>
                         <p className="text-3xl font-black text-black dark:text-white">{daysTrained}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10 flex flex-col min-h-[300px]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black uppercase text-black dark:text-white">Gráfico de Cargas</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setChartFilter('7d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '7d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500 dark:text-white/40'}`}>7 Días</button>
                          <button onClick={() => setChartFilter('30d')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === '30d' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500 dark:text-white/40'}`}>30 Días</button>
                          <button onClick={() => setChartFilter('all')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-colors ${chartFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500 dark:text-white/40'}`}>Histórico</button>
                        </div>
                      </div>
                      <ProgressChart data={filteredEvolution} />
                    </div>
                  </>
                );
              })()}"""

content = content.replace(progreso_tab_start, new_progreso_tab)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove + CARGA MASIVA from Agenda header
# The button is:
# <button onClick={() => setIsMassClassModalOpen(true)} className="bg-purple-600 ...">
#   + CARGA MASIVA
# </button>
content = re.sub(r'<button[^>]*?onClick=\{\(\) => setIsMassClassModalOpen\(true\)\}[^>]*?>\s*.*?\+\s*CARGA MASIVA\s*</button>\s*', '', content, flags=re.DOTALL)

# 2. Add ACTIVIDADES legend before isHolidayModalOpen
legend_str = """
      <div className="mt-8 text-center border-t border-gray-200 dark:border-white/5 pt-8">
        <h4 className="text-[10px] font-black uppercase text-gray-500 dark:text-white/20 tracking-[0.2em] mb-4">Actividades</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {allActivities.map((act: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: act.color }}></span>
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: act.color }}>
                {act.name} ({act.code})
              </span>
            </div>
          ))}
        </div>
      </div>
"""
content = content.replace('      {isHolidayModalOpen && (', legend_str + '\n      {isHolidayModalOpen && (')


# 3. Add + Nueva button beside select Activity in isClassModalOpen
old_select_block = """                  <select 
                    className="flex-1 bg-[#141b29]/40 dark:bg-black/40 border border-white/10 rounded-xl p-3 text-black dark:text-white text-xs outline-none focus:border-orange-500" 
                    value={newClassData.name} 
                    onChange={e => {
                      const selected = allActivities.find((act: any) => act.name === e.target.value);
                      if (selected) {
                        setNewClassData(prev => ({
                          ...prev,
                          name: selected.name,
                          code: selected.code,
                          color: selected.color
                        }));
                      }
                    }}>
                    <option value="">-- Seleccionar Actividad --</option>
                    
                  </select>
                  
                </div>"""

new_select_block = """                  <select 
                    className="flex-1 bg-[#141b29]/40 dark:bg-black/40 border border-white/10 rounded-xl p-3 text-black dark:text-white text-xs outline-none focus:border-orange-500" 
                    value={newClassData.name} 
                    onChange={e => {
                      const selected = allActivities.find((act: any) => act.name === e.target.value);
                      if (selected) {
                        setNewClassData(prev => ({
                          ...prev,
                          name: selected.name,
                          code: selected.code,
                          color: selected.color
                        }));
                      }
                    }}>
                    <option value="">-- Seleccionar Actividad --</option>
                    {allActivities.map((act: any, i: number) => <option key={i} value={act.name}>{act.name}</option>)}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => { setIsClassModalOpen(false); setIsNewActivityModalOpen(true); }} 
                    className="px-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl text-[9px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap">
                    + Nueva
                  </button>
                </div>"""

content = content.replace(old_select_block, new_select_block)

# 4. Add Carga Masiva button at the bottom of isClassModalOpen
old_buttons = """              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsClassModalOpen(false)} className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400">Cancelar</button>
                <button onClick={handleSaveClass} className="flex-1 py-3 bg-[#0a0a0a] text-white rounded-xl text-[9px] font-black uppercase border border-[#F38E26]">Guardar</button>
              </div>"""

new_buttons = """              <div className="pt-4 space-y-3">
                <button onClick={() => { setIsClassModalOpen(false); setIsMassClassModalOpen(true); }} className="w-full py-2 bg-purple-600/10 text-purple-500 border border-purple-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                  ⚡ Carga Masiva (Repetitivas)
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setIsClassModalOpen(false)} className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400">Cancelar</button>
                  <button onClick={handleSaveClass} className="flex-1 py-3 bg-[#0a0a0a] text-white rounded-xl text-[9px] font-black uppercase border border-[#F38E26]">Guardar</button>
                </div>
              </div>"""

content = content.replace(old_buttons, new_buttons)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

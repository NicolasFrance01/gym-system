import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the Actividades legend from the bottom
legend_pattern = r'\s*<div className="mt-8 text-center border-t border-gray-200 dark:border-white/5 pt-8">\s*<h4[^>]*>Actividades</h4>\s*<div className="flex flex-wrap justify-center gap-4">\s*\{allActivities\.map.*?\s*</div>\s*</div>'
content = re.sub(legend_pattern, '', content, flags=re.DOTALL)


# 2. Modify isNewActivityModalOpen to include the list of activities
old_modal_start = """      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1b2435] border border-gray-200 dark:border-white/10 p-8 rounded-[35px] w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black uppercase text-orange-500">Nueva Actividad</h4>
              <button onClick={() => setIsNewActivityModalOpen(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>"""

new_modal_start = """      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1b2435] border border-gray-200 dark:border-white/10 p-8 rounded-[35px] w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black uppercase text-orange-500">Gestionar Actividades</h4>
              <button onClick={() => setIsNewActivityModalOpen(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>
            
            {/* List of existing activities */}
            <div className="mb-6 space-y-2 max-h-40 overflow-y-auto custom-scrollbar bg-black/5 dark:bg-black/20 rounded-2xl p-4">
              {allActivities.map((act: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color }}></span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-black dark:text-white">
                      {act.name} ({act.code})
                    </span>
                  </div>
                  {act.id && (
                    <button onClick={() => handleDeleteActivity(act.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors" title="Eliminar Actividad">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-white/10 pt-4 mb-4">
              <h5 className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 tracking-wider">Crear Nueva Actividad</h5>
            </div>"""

content = content.replace(old_modal_start, new_modal_start)

# In case the title is already "Gestionar Actividades" (preventing double replace)
if new_modal_start not in content:
    print("Warning: Modal replace failed. Content might have slightly different formatting.")


with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

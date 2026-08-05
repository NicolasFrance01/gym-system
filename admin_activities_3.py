import re

def modify_admin_dashboard_3():
    with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Modals
    modals = """
      {isMassClassModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1b2435] border border-gray-200 dark:border-white/10 p-8 rounded-[35px] w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black uppercase text-orange-500">Carga Masiva de Clases</h4>
              <button onClick={() => setIsMassClassModalOpen(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Seleccionar Actividad</label>
                <select value={massClassData.activity_name} onChange={e => setMassClassData({...massClassData, activity_name: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] uppercase font-black text-black dark:text-white outline-none">
                  {allActivities.map((act, i) => <option key={i} value={act.name}>{act.name} ({act.code})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Días de la semana</label>
                <div className="flex gap-2 justify-between">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <button key={i} onClick={() => setMassClassData(prev => ({...prev, days: prev.days.includes(i) ? prev.days.filter(d => d !== i) : [...prev.days, i]}))} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${massClassData.days.includes(i) ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Hora de Inicio (0-23)</label>
                  <input type="number" min="0" max="23" value={massClassData.start_hour} onChange={e => setMassClassData({...massClassData, start_hour: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Hora de Fin (0-24)</label>
                  <input type="number" min="0" max="24" value={massClassData.end_hour} onChange={e => setMassClassData({...massClassData, end_hour: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Intervalo (Horas)</label>
                  <input type="number" min="1" max="12" value={massClassData.interval_hours} onChange={e => setMassClassData({...massClassData, interval_hours: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Capacidad por clase</label>
                  <input type="number" min="1" value={massClassData.capacity} onChange={e => setMassClassData({...massClassData, capacity: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsMassClassModalOpen(false)} className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400">Cancelar</button>
                <button onClick={handleMassClassSubmit} disabled={massClassData.days.length === 0} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase disabled:opacity-50">Generar Clases</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1b2435] border border-gray-200 dark:border-white/10 p-8 rounded-[35px] w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black uppercase text-orange-500">Nueva Actividad</h4>
              <button onClick={() => setIsNewActivityModalOpen(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Nombre</label>
                <input type="text" value={newActivityData.name} onChange={e => setNewActivityData({...newActivityData, name: e.target.value})} placeholder="Ej. Pilates Funcional" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Código (2 letras)</label>
                <input type="text" maxLength={2} value={newActivityData.code} onChange={e => setNewActivityData({...newActivityData, code: e.target.value})} placeholder="PF" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none uppercase text-center" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Color HEX</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={newActivityData.color} onChange={e => setNewActivityData({...newActivityData, color: e.target.value})} className="w-12 h-12 rounded-xl cursor-pointer" />
                  <input type="text" value={newActivityData.color} onChange={e => setNewActivityData({...newActivityData, color: e.target.value})} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsNewActivityModalOpen(false)} className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400">Cancelar</button>
                <button onClick={handleNewActivitySubmit} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase">Crear Actividad</button>
              </div>
            </div>
          </div>
        </div>
      )}
"""
    if "{isMassClassModalOpen && (" not in content:
        content = content.replace('      {isClassModalOpen && (', modals + '\n      {isClassModalOpen && (')
        
    # Add Mass Class Button in Agenda Title row
    # Let's search for "Agenda de Clases"
    agenda_title_row = """        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Agenda de Clases</h3>
          <div className="flex gap-3">
            <button onClick={() => setIsHolidayModalOpen(true)} className="bg-red-500 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
              <AlertTriangle size={12}/> Feriado
            </button>
            <button onClick={() => { setIsEditingClass(false); setIsClassModalOpen(true); }} className="bg-orange-500 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2">
              <span className="text-base leading-none">+</span> NUEVA CLASE
            </button>
          </div>
        </div>"""
        
    new_agenda_title_row = """        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Agenda de Clases</h3>
          <div className="flex gap-3 flex-wrap justify-end">
            <button onClick={() => setIsMassClassModalOpen(true)} className="bg-purple-600 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
              + CARGA MASIVA
            </button>
            <button onClick={() => setIsHolidayModalOpen(true)} className="bg-red-500 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
              <AlertTriangle size={12}/> Feriado
            </button>
            <button onClick={() => { setIsEditingClass(false); setIsClassModalOpen(true); }} className="bg-orange-500 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2">
              <span className="text-base leading-none">+</span> NUEVA CLASE
            </button>
          </div>
        </div>"""
        
    if "CARGA MASIVA" not in content and agenda_title_row in content:
        content = content.replace(agenda_title_row, new_agenda_title_row)

    with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

modify_admin_dashboard_3()

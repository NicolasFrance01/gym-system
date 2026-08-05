import re

def modify_admin_dashboard_2():
    with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add handlers for mass class and new activity
    handlers = """
  const handleMassClassSubmit = async () => {
    try {
      const activity = allActivities.find(a => a.name === massClassData.activity_name);
      if (!activity) return;
      
      const payload = {
        days: massClassData.days,
        start_hour: massClassData.start_hour,
        end_hour: massClassData.end_hour,
        interval_hours: massClassData.interval_hours,
        capacity: massClassData.capacity,
        name: activity.name,
        code: activity.code,
        color: activity.color
      };
      
      const res = await fetch(`${API_URL}/admin/class_schedules/mass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsMassClassModalOpen(false);
        fetchDashboard();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewActivitySubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivityData)
      });
      if (res.ok) {
        setIsNewActivityModalOpen(false);
        fetchActivities();
        setNewActivityData({ name: '', code: '', color: '#ffffff' });
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const handleDeleteActivity = async (id: number) => {
    showConfirm("Eliminar Actividad", "¿Estás seguro de eliminar esta actividad personalizada?", async () => {
      await fetch(`${API_URL}/admin/activities/${id}`, { method: 'DELETE' });
      fetchActivities();
    });
  };
"""
    if "const handleMassClassSubmit" not in content:
        content = content.replace('  const handleSaveClass = async () => {', handlers + '\n  const handleSaveClass = async () => {')

    # 2. Modify legend to map `allActivities` and add a button for "Nueva Actividad Personalizada"
    # Wait, let's find the legend in content
    legend_block = """            {/* Actividades Leyenda */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/5 text-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-white/20 block mb-3">Actividades</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[8px] font-black uppercase">
                <span className="text-[#3b82f6]">● Entrenamiento Funcional (EF)</span>
                <span className="text-[#f97316]">● Pilates en Suelo (PS)</span>
                <span className="text-[#ec4899]">● Entrenamiento Personalizado (EP)</span>
                <span className="text-[#eab308]">● Salsa y Bachata (SB)</span>
                <span className="text-[#ef4444]">● Zumba (ZB)</span>
                <span className="text-[#06b6d4]">● Reguetón Juvenil (RJ)</span>
              </div>
            </div>"""
    
    new_legend = """            {/* Actividades Leyenda */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/5 text-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-white/20 block mb-3">Actividades</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center text-[8px] font-black uppercase">
                {allActivities.map((act, i) => (
                  <span key={i} className="flex items-center gap-1 group relative" style={{ color: act.color }}>
                    ● {act.name} ({act.code})
                    {act.id && (
                      <button onClick={() => handleDeleteActivity(act.id)} className="hidden group-hover:block absolute -top-4 -right-2 bg-red-500 text-white p-0.5 rounded-full z-10"><X size={10}/></button>
                    )}
                  </span>
                ))}
                <button onClick={() => setIsNewActivityModalOpen(true)} className="ml-4 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 dark:text-white/40 border border-white/10">+ Nueva Actividad Personalizada</button>
              </div>
            </div>"""
    
    if legend_block in content:
        content = content.replace(legend_block, new_legend)
        
    # 3. Add Collapsible toggles for Morning/Evening
    # find Clases por la Mañana block
    morning_header = '<div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl">'
    new_morning_header = '<div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl flex items-center justify-center cursor-pointer relative" onClick={() => setShowMorning(!showMorning)}>\n                <span>Clases por la Mañana</span>\n                <span className="absolute right-4">{showMorning ? "▲" : "▼"}</span>\n              </div>'
    
    evening_header = '<div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl">\n                Clases por la Tarde/Noche\n              </div>'
    new_evening_header = '<div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl flex items-center justify-center cursor-pointer relative" onClick={() => setShowEvening(!showEvening)}>\n                <span>Clases por la Tarde/Noche</span>\n                <span className="absolute right-4">{showEvening ? "▲" : "▼"}</span>\n              </div>'

    if morning_header in content:
        content = content.replace(morning_header + '\n                Clases por la Mañana\n              </div>', new_morning_header)
        
    if evening_header in content:
        content = content.replace(evening_header, new_evening_header)
        
    # Now wrap the tables in {showMorning && ( ... )}
    table_pattern_m = """              <div className="overflow-x-auto border-x border-b border-gray-200 dark:border-white/5 rounded-b-2xl">
                <table className="w-full border-collapse text-left table-fixed">
                  <thead>
                    <tr className="bg-[#F38E26]/5 text-gray-400 dark:text-white/20 border-b border-gray-200 dark:border-white/5 text-[7px] sm:text-[8px] uppercase tracking-wider font-black">
                      <th className="p-1 sm:p-3 text-center w-14 sm:w-24 text-[7px] sm:text-[8px]">Hora</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">L</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">M</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">MI</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">J</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">V</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">S</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderSlotRows(morningSlots)}
                  </tbody>
                </table>
              </div>"""
              
    table_pattern_m_new = """              {showMorning && <div className="overflow-x-auto border-x border-b border-gray-200 dark:border-white/5 rounded-b-2xl">
                <table className="w-full border-collapse text-left table-fixed">
                  <thead>
                    <tr className="bg-[#F38E26]/5 text-gray-400 dark:text-white/20 border-b border-gray-200 dark:border-white/5 text-[7px] sm:text-[8px] uppercase tracking-wider font-black">
                      <th className="p-1 sm:p-3 text-center w-14 sm:w-24 text-[7px] sm:text-[8px]">Hora</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">L</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">M</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">MI</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">J</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">V</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">S</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderSlotRows(morningSlots)}
                  </tbody>
                </table>
              </div>}"""
              
    if table_pattern_m in content:
        content = content.replace(table_pattern_m, table_pattern_m_new)

    table_pattern_e = """              <div className="overflow-x-auto border-x border-b border-gray-200 dark:border-white/5 rounded-b-2xl">
                <table className="w-full border-collapse text-left table-fixed">
                  <thead>
                    <tr className="bg-[#F38E26]/5 text-gray-400 dark:text-white/20 border-b border-gray-200 dark:border-white/5 text-[7px] sm:text-[8px] uppercase tracking-wider font-black">
                      <th className="p-1 sm:p-3 text-center w-14 sm:w-24 text-[7px] sm:text-[8px]">Hora</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">L</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">M</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">MI</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">J</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">V</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">S</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderSlotRows(eveningSlots)}
                  </tbody>
                </table>
              </div>"""
              
    table_pattern_e_new = """              {showEvening && <div className="overflow-x-auto border-x border-b border-gray-200 dark:border-white/5 rounded-b-2xl">
                <table className="w-full border-collapse text-left table-fixed">
                  <thead>
                    <tr className="bg-[#F38E26]/5 text-gray-400 dark:text-white/20 border-b border-gray-200 dark:border-white/5 text-[7px] sm:text-[8px] uppercase tracking-wider font-black">
                      <th className="p-1 sm:p-3 text-center w-14 sm:w-24 text-[7px] sm:text-[8px]">Hora</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">L</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">M</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">MI</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">J</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">V</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">S</th>
                      <th className="p-1 sm:p-3 text-center text-[7px] sm:text-[8px]">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderSlotRows(eveningSlots)}
                  </tbody>
                </table>
              </div>}"""
              
    if table_pattern_e in content:
        content = content.replace(table_pattern_e, table_pattern_e_new)

    with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

modify_admin_dashboard_2()

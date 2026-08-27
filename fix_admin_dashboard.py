import re
import os

file_path = r"c:\Users\Nicolas France\claude-projects\gym-recognition\frontend\src\AdminDashboard.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update state
old_state = """  const [massClassData, setMassClassData] = useState({
    days: [] as number[],
    start_hour: 7,
    end_hour: 23,
    interval_hours: 1,
    capacity: 20,
    activity_name: 'Entrenamiento Funcional'
  });"""

new_state = """  const [massClassData, setMassClassData] = useState({
    days: [] as number[],
    start_hour: 7,
    end_hour: 23,
    interval_hours: 1,
    capacity: 20,
    activity_name: '',
    mode: 'global' as 'global' | 'per_day',
    perDayConfigs: {} as Record<number, {start_hour: number, end_hour: number, interval_hours: number}>
  });"""

content = content.replace(old_state, new_state)

# 2. Update handleMassClassSubmit
old_submit = """  const handleMassClassSubmit = async () => {
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
        fetchSchedules();
      }
    } catch (e) {
      console.error(e);
    }
  };"""

new_submit = """  const handleMassClassSubmit = async () => {
    try {
      const actName = massClassData.activity_name || (allActivities.length > 0 ? allActivities[0].name : "");
      const activity = allActivities.find(a => a.name === actName);
      if (!activity) return;
      
      const configs = massClassData.mode === 'global'
        ? massClassData.days.map(d => ({
            day: d,
            start_hour: massClassData.start_hour,
            end_hour: massClassData.end_hour,
            interval_hours: massClassData.interval_hours
          }))
        : massClassData.days.map(d => ({
            day: d,
            start_hour: massClassData.perDayConfigs[d]?.start_hour ?? 7,
            end_hour: massClassData.perDayConfigs[d]?.end_hour ?? 23,
            interval_hours: massClassData.perDayConfigs[d]?.interval_hours ?? 1
          }));

      const payload = {
        configs,
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
        fetchSchedules();
      }
    } catch (e) {
      console.error(e);
    }
  };"""

content = content.replace(old_submit, new_submit)

# 3. Update Modal UI
old_modal = """              <div className="grid grid-cols-2 gap-4">
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
              </div>"""

new_modal = """              {/* Toggles */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                <button 
                  onClick={() => setMassClassData({...massClassData, mode: 'global'})} 
                  className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${massClassData.mode === 'global' ? 'bg-white dark:bg-[#1b2435] shadow text-orange-500' : 'text-gray-400'}`}>
                  Mismo Horario
                </button>
                <button 
                  onClick={() => setMassClassData({...massClassData, mode: 'per_day'})} 
                  className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${massClassData.mode === 'per_day' ? 'bg-white dark:bg-[#1b2435] shadow text-orange-500' : 'text-gray-400'}`}>
                  Por Día
                </button>
              </div>

              {massClassData.mode === 'global' ? (
                <>
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
                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Intervalo (Horas)</label>
                    <input type="number" min="1" max="12" value={massClassData.interval_hours} onChange={e => setMassClassData({...massClassData, interval_hours: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                  </div>
                </>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {massClassData.days.length === 0 ? (
                    <p className="text-center text-[9px] uppercase font-black text-gray-400 py-4">Selecciona días para configurar</p>
                  ) : (
                    massClassData.days.map(d => {
                      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                      const conf = massClassData.perDayConfigs[d] || { start_hour: 7, end_hour: 23, interval_hours: 1 };
                      
                      const updateDayConf = (field: string, val: number) => {
                        setMassClassData(prev => ({
                          ...prev,
                          perDayConfigs: {
                            ...prev.perDayConfigs,
                            [d]: { ...conf, [field]: val }
                          }
                        }));
                      };

                      return (
                        <div key={d} className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl space-y-2">
                          <p className="text-[10px] font-black uppercase text-orange-500">{dayNames[d]}</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Inicio</label>
                              <input type="number" min="0" max="23" value={conf.start_hour} onChange={e => updateDayConf('start_hour', parseInt(e.target.value))} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-2 rounded-xl text-[9px] font-black text-center text-black dark:text-white" />
                            </div>
                            <div>
                              <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Fin</label>
                              <input type="number" min="0" max="24" value={conf.end_hour} onChange={e => updateDayConf('end_hour', parseInt(e.target.value))} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-2 rounded-xl text-[9px] font-black text-center text-black dark:text-white" />
                            </div>
                            <div>
                              <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Int (h)</label>
                              <input type="number" min="1" max="12" value={conf.interval_hours} onChange={e => updateDayConf('interval_hours', parseInt(e.target.value))} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-2 rounded-xl text-[9px] font-black text-center text-black dark:text-white" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Capacidad por clase</label>
                <input type="number" min="1" value={massClassData.capacity} onChange={e => setMassClassData({...massClassData, capacity: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
              </div>"""

content = content.replace(old_modal, new_modal)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AdminDashboard.tsx")

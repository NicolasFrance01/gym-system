import re
import os

filepath = os.path.join(os.path.dirname(__file__), 'frontend', 'src', 'AdminDashboard.tsx')

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update State
old_state = """  const [massClassData, setMassClassData] = useState({
    days: [] as number[],
    start_hour: 7,
    end_hour: 23,
    interval_hours: 1,
    capacity: 20,
    activity_name: '',
    mode: 'global' as 'global' | 'per_day',
    perDayConfigs: {} as Record<number, {start_hour: number, end_hour: number, interval_hours: number}>
  });"""

new_state = """  const [massClassData, setMassClassData] = useState({
    days: [] as number[],
    start_time: '07:00',
    end_time: '23:00',
    interval_minutes: 60,
    capacity: 20,
    activity_name: '',
    mode: 'global' as 'global' | 'per_day',
    perDayConfigs: {} as Record<number, Array<{start_time: string, end_time: string, interval_minutes: number}>>
  });"""

content = content.replace(old_state, new_state)

# 2. Update handleMassClassSubmit
old_submit = """      const configs = massClassData.mode === 'global'
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
          }));"""

new_submit = """      const configs: any[] = [];
      if (massClassData.mode === 'global') {
        massClassData.days.forEach(d => {
          configs.push({
            day: d,
            start_time: massClassData.start_time,
            end_time: massClassData.end_time,
            interval_minutes: massClassData.interval_minutes
          });
        });
      } else {
        massClassData.days.forEach(d => {
          const blocks = massClassData.perDayConfigs[d] || [{ start_time: '07:00', end_time: '23:00', interval_minutes: 60 }];
          blocks.forEach(b => {
            configs.push({
              day: d,
              start_time: b.start_time,
              end_time: b.end_time,
              interval_minutes: b.interval_minutes
            });
          });
        });
      }"""

content = content.replace(old_submit, new_submit)

# 3. Update Modal UI
old_modal = """              {massClassData.mode === 'global' ? (
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
              )}"""

new_modal = """              {massClassData.mode === 'global' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Hora de Inicio (HH:MM)</label>
                      <input type="time" value={massClassData.start_time} onChange={e => setMassClassData({...massClassData, start_time: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Hora de Fin (HH:MM)</label>
                      <input type="time" value={massClassData.end_time} onChange={e => setMassClassData({...massClassData, end_time: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Intervalo o Duración (Minutos)</label>
                    <input type="number" min="1" value={massClassData.interval_minutes} onChange={e => setMassClassData({...massClassData, interval_minutes: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-3 rounded-2xl text-[10px] font-black text-black dark:text-white outline-none text-center" />
                  </div>
                </>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {massClassData.days.length === 0 ? (
                    <p className="text-center text-[9px] uppercase font-black text-gray-400 py-4">Selecciona días para configurar</p>
                  ) : (
                    massClassData.days.map(d => {
                      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                      const blocks = massClassData.perDayConfigs[d] || [{ start_time: '07:00', end_time: '23:00', interval_minutes: 60 }];
                      
                      const updateBlock = (index: number, field: string, val: string | number) => {
                        const newBlocks = [...blocks];
                        newBlocks[index] = { ...newBlocks[index], [field]: val };
                        setMassClassData(prev => ({
                          ...prev,
                          perDayConfigs: {
                            ...prev.perDayConfigs,
                            [d]: newBlocks
                          }
                        }));
                      };

                      const addBlock = () => {
                        setMassClassData(prev => ({
                          ...prev,
                          perDayConfigs: {
                            ...prev.perDayConfigs,
                            [d]: [...blocks, { start_time: '07:00', end_time: '23:00', interval_minutes: 60 }]
                          }
                        }));
                      };
                      
                      const removeBlock = (index: number) => {
                        const newBlocks = blocks.filter((_, i) => i !== index);
                        setMassClassData(prev => ({
                          ...prev,
                          perDayConfigs: {
                            ...prev.perDayConfigs,
                            [d]: newBlocks
                          }
                        }));
                      };

                      return (
                        <div key={d} className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl space-y-2 relative">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase text-orange-500">{dayNames[d]}</p>
                            <button onClick={addBlock} className="w-5 h-5 bg-orange-500 text-white rounded-md flex items-center justify-center font-black text-xs hover:bg-orange-600 transition-colors">+</button>
                          </div>
                          
                          {blocks.map((b, i) => (
                            <div key={i} className="flex gap-2 items-end bg-white dark:bg-black/40 p-2 rounded-xl relative group border border-transparent dark:border-white/5">
                              <div className="flex-1">
                                <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Inicio</label>
                                <input type="time" value={b.start_time} onChange={e => updateBlock(i, 'start_time', e.target.value)} className="w-full bg-transparent border border-gray-200 dark:border-white/10 p-2 rounded-lg text-[9px] font-black text-center text-black dark:text-white" />
                              </div>
                              <div className="flex-1">
                                <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Fin</label>
                                <input type="time" value={b.end_time} onChange={e => updateBlock(i, 'end_time', e.target.value)} className="w-full bg-transparent border border-gray-200 dark:border-white/10 p-2 rounded-lg text-[9px] font-black text-center text-black dark:text-white" />
                              </div>
                              <div className="flex-1">
                                <label className="text-[7px] text-gray-400 uppercase font-black block text-center mb-1">Int (m)</label>
                                <input type="number" min="1" value={b.interval_minutes} onChange={e => updateBlock(i, 'interval_minutes', parseInt(e.target.value))} className="w-full bg-transparent border border-gray-200 dark:border-white/10 p-2 rounded-lg text-[9px] font-black text-center text-black dark:text-white" />
                              </div>
                              {blocks.length > 1 && (
                                <button onClick={() => removeBlock(i)} className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity z-10">✕</button>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              )}"""

content = content.replace(old_modal, new_modal)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AdminDashboard.tsx")

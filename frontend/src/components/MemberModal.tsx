import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function MemberModal({ member, plans, API_URL, onSave, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'datos' | 'entrenamiento'>('datos');
  const [formData, setFormData] = useState(member);
  
  // Entrenamiento State
  const [routine, setRoutine] = useState<any[]>(member?.routine || []);
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newClassMode, setNewClassMode] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(0);

  useEffect(() => {
    fetch(`${API_URL}/admin/exercises`)
      .then(r => r.json())
      .then(data => setExercises(data))
      .catch(e => console.error(e));
  }, [API_URL]);

  const handleAddClass = () => {
    if(!newClassName) return;
    setRoutine([...routine, { class_name: newClassName, exercises: [] }]);
    setNewClassName('');
    setNewClassMode(false);
    setSelectedClassIndex(routine.length);
  };

  const handleAddExercise = (ex: any) => {
    const updated = [...routine];
    if(!updated[selectedClassIndex]) return;
    updated[selectedClassIndex].exercises.push({
      exercise_id: ex.id,
      name: ex.name,
      sets: 4,
      reps: 10,
      kg: 0
    });
    setRoutine(updated);
  };

  const handleUpdateExercise = (cIdx: number, eIdx: number, field: string, value: any) => {
    const updated = [...routine];
    updated[cIdx].exercises[eIdx][field] = value;
    setRoutine(updated);
  };

  const handleRemoveExercise = (cIdx: number, eIdx: number) => {
    const updated = [...routine];
    updated[cIdx].exercises.splice(eIdx, 1);
    setRoutine(updated);
  };

  const handleSaveInternal = () => {
    onSave({ ...formData, routine });
  };

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.muscle_group && e.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 p-8 rounded-[40px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-widest">
            {member.id ? 'Editar Socio' : 'Nuevo Socio'}
          </h2>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors" /></button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10 pb-2">
          <button onClick={() => setActiveTab('datos')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'datos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Datos Personales</button>
          <button onClick={() => setActiveTab('entrenamiento')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'entrenamiento' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Entrenamiento y Progreso</button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'datos' && (
            <div className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="Nombre Completo" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                 <input type="text" placeholder="DNI" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.dni || ''} onChange={e => setFormData({...formData, dni: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="WhatsApp / Número" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                 <input type="email" placeholder="Correo Electrónico" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <select className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs font-bold uppercase" value={formData?.membership_type || plans[0]?.name || ''} onChange={e => setFormData({...formData, membership_type: e.target.value})}>
                 {plans.map((p:any) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Fecha de Inicio del Plan</label>
                <input type="date" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.joined_at ? formData.joined_at.split('T')[0] : ''} onChange={e => setFormData({...formData, joined_at: e.target.value ? e.target.value + 'T00:00:00' : null})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 dark:text-white/20 uppercase font-black ml-2">Contraseña de Acceso</label>
                <input type="text" placeholder="Asignar Contraseña" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white text-xs" value={formData?.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'entrenamiento' && (
            <div className="flex flex-col md:flex-row gap-6 h-full">
              {/* Creador de Rutinas */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-gray-400">Días de Entrenamiento</h3>
                  {!newClassMode ? (
                    <button onClick={() => setNewClassMode(true)} className="text-[9px] bg-white/10 text-white px-2 py-1 rounded-md font-bold">+ Agregar Día</button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input type="text" autoFocus placeholder="Ej: Día 1..." className="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-xs text-white" value={newClassName} onChange={e=>setNewClassName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddClass()} />
                      <button onClick={handleAddClass} className="text-[9px] bg-orange-500 text-black px-2 py-1 rounded-md font-bold">OK</button>
                      <button onClick={() => setNewClassMode(false)} className="text-[9px] text-red-500 font-bold">X</button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {routine.map((c, idx) => (
                    <button key={idx} onClick={() => setSelectedClassIndex(idx)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors ${selectedClassIndex === idx ? 'bg-orange-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                      {c.class_name}
                    </button>
                  ))}
                  {routine.length === 0 && <p className="text-[9px] text-gray-500">No hay días creados. Agrega un día para comenzar.</p>}
                </div>

                {routine.length > 0 && routine[selectedClassIndex] && (
                  <div className="space-y-2 mt-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
                    <h4 className="text-[10px] font-black uppercase text-black dark:text-white mb-2">Ejercicios - {routine[selectedClassIndex].class_name}</h4>
                    {routine[selectedClassIndex].exercises.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No hay ejercicios asignados.</p>
                    ) : (
                      routine[selectedClassIndex].exercises.map((ex: any, eIdx: number) => (
                        <div key={eIdx} className="flex items-center justify-between gap-4 bg-white dark:bg-black/40 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                          <span className="text-xs font-bold text-black dark:text-white truncate flex-1">{ex.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <input type="number" value={ex.sets} onChange={(e) => handleUpdateExercise(selectedClassIndex, eIdx, 'sets', parseInt(e.target.value))} className="w-12 bg-gray-100 dark:bg-white/10 border-none rounded-md text-xs text-center py-1 font-bold text-black dark:text-white" title="Sets" />
                            <span className="text-[10px] text-gray-400">x</span>
                            <input type="number" value={ex.reps} onChange={(e) => handleUpdateExercise(selectedClassIndex, eIdx, 'reps', parseInt(e.target.value))} className="w-12 bg-gray-100 dark:bg-white/10 border-none rounded-md text-xs text-center py-1 font-bold text-black dark:text-white" title="Reps" />
                            <span className="text-[10px] text-gray-400">|</span>
                            <span className="text-xs text-orange-500 font-bold">{ex.kg}kg</span>
                            <button onClick={() => handleRemoveExercise(selectedClassIndex, eIdx)} className="text-red-500 ml-2"><X size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Buscador de Ejercicios */}
              {routine.length > 0 && (
                <div className="w-full md:w-64 flex flex-col border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-xs font-black uppercase text-gray-400 mb-2">Agregar Ejercicio</h3>
                  <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-2 text-[10px] text-black dark:text-white mb-4" />
                  
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-64 custom-scrollbar pr-1">
                    {filteredExercises.map(ex => (
                      <button key={ex.id} onClick={() => handleAddExercise(ex)} className="w-full text-left bg-gray-50 dark:bg-white/5 hover:bg-orange-500/10 p-2 rounded-lg border border-transparent hover:border-orange-500/30 transition-colors group">
                        <div className="text-[10px] font-bold text-black dark:text-white group-hover:text-orange-500">{ex.name}</div>
                        <div className="text-[8px] text-gray-400">{ex.muscle_group}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-black uppercase text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancelar</button>
          <button onClick={handleSaveInternal} className="px-8 py-3 bg-orange-500 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Save size={16} /> Guardar Socio
          </button>
        </div>
        
      </div>
    </div>
  );
}

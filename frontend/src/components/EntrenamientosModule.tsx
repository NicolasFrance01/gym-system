import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, X, Target, Activity } from 'lucide-react';

export default function EntrenamientosModule({ API_URL }: any) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    segment: 'Tren superior',
    zone: 'Pecho',
    muscle_group: ''
  });

  const loadExercises = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/exercises`);
      if (res.ok) {
        setExercises(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleSave = async () => {
    if(!formData.name) return;
    try {
      const res = await fetch(`${API_URL}/admin/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', segment: 'Tren superior', zone: 'Pecho', muscle_group: '' });
        loadExercises();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm("¿Eliminar ejercicio?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/exercises/${id}`, { method: 'DELETE' });
      if(res.ok) {
        loadExercises();
      }
    } catch(e) {
      console.error(e);
    }
  };

  const filtered = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.muscle_group && e.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-black text-lg uppercase text-black dark:text-white">Biblioteca de Ejercicios</h3>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg hover:bg-orange-600 transition-all">
          + Nuevo Ejercicio
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="BUSCAR POR NOMBRE O MÚSCULO..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-black dark:text-white uppercase"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(ex => (
            <div key={ex.id} className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-4 rounded-2xl relative group">
              <h4 className="font-black text-black dark:text-white text-sm uppercase mb-1">{ex.name}</h4>
              <p className="text-[10px] text-orange-500 font-bold uppercase mb-2">{ex.muscle_group}</p>
              <div className="flex items-center gap-2 mt-4 text-[9px] text-gray-500 dark:text-gray-400 font-black uppercase">
                <span className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md">{ex.segment}</span>
                <span className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md">{ex.zone}</span>
              </div>
              <button onClick={() => handleDelete(ex.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 p-8 rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg uppercase text-black dark:text-white">Nuevo Ejercicio</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Nombre del Ejercicio</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Segmento Corporal</label>
                <select className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-black dark:text-white uppercase" value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})}>
                  <option>Tren superior</option>
                  <option>Tren medio / core</option>
                  <option>Tren inferior</option>
                  <option>Cuerpo completo</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Zona Corporal</label>
                <input type="text" placeholder="Ej: Pecho, Espalda, Cuádriceps..." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Grupo Muscular Principal</label>
                <input type="text" placeholder="Ej: Pectoral mayor" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.muscle_group} onChange={e => setFormData({...formData, muscle_group: e.target.value})} />
              </div>

              <button onClick={handleSave} className="w-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl mt-4">
                Guardar Ejercicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

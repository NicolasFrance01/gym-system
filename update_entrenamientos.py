import re

with open('frontend/src/components/EntrenamientosModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports to include Edit2
content = content.replace("import { Search, Trash2, X } from 'lucide-react';", "import { Search, Trash2, X, Edit2 } from 'lucide-react';")

# 2. Add an editingId state and update formData initial state
new_state = """  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = {
    name: '',
    segment: 'Tren superior',
    zone: 'Pecho',
    muscle_group: '',
    mechanics: '',
    equipment: '',
    video_url: '',
    instructions: '',
    rpe: '',
    rir: ''
  };
  const [formData, setFormData] = useState<any>(initialForm);"""

content = re.sub(r"  const \[selectedZone, setSelectedZone\] = useState<string>\('Todas'\);\s*const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);", new_state, content)

# 3. Update handleSave logic
old_save = """  const handleSave = async () => {
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
  };"""

new_save = """  const handleSave = async () => {
    if(!formData.name) return;
    try {
      const url = editingId ? `${API_URL}/admin/exercises/${editingId}` : `${API_URL}/admin/exercises`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialForm);
        loadExercises();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (ex: any) => {
    setFormData(ex);
    setEditingId(ex.id);
    setIsModalOpen(true);
  };"""

content = content.replace(old_save, new_save)

# 4. Modify button to reset state when opening for New Exercise
old_new_btn = """<button onClick={() => setIsModalOpen(true)} className="bg-orange-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg hover:bg-orange-600 transition-all">
          + Nuevo Ejercicio
        </button>"""
new_new_btn = """<button onClick={() => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); }} className="bg-orange-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg hover:bg-orange-600 transition-all">
          + Nuevo Ejercicio
        </button>"""
content = content.replace(old_new_btn, new_new_btn)

# 5. Add a divider between segments and zones
old_zones_ui = """        {selectedSegment !== 'Todos' && availableZones.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">"""
new_zones_ui = """        {selectedSegment !== 'Todos' && availableZones.length > 0 && (
          <>
            <hr className="border-gray-200 dark:border-white/10 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">"""
content = content.replace(old_zones_ui, new_zones_ui)
content = content.replace("              </button>\n            ))}\n          </div>\n        )}", "              </button>\n            ))}\n          </div>\n          </>\n        )}")

# 6. Add Edit button to card
old_card_btns = """              <button onClick={() => handleDelete(ex.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>"""
new_card_btns = """              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(ex)} className="text-gray-400 hover:text-white transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(ex.id)} className="text-red-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>"""
content = content.replace(old_card_btns, new_card_btns)

# 7. Update Modal UI
old_modal_content = """            <div className="space-y-4">
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
            </div>"""

new_modal_content = """            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Nombre del Ejercicio</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Segmento Corporal</label>
                  <select className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-black dark:text-white uppercase" value={formData.segment || ''} onChange={e => setFormData({...formData, segment: e.target.value})}>
                    <option>Tren superior</option>
                    <option>Tren medio / core</option>
                    <option>Tren inferior</option>
                    <option>Cuerpo completo</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Zona Corporal</label>
                  <input type="text" placeholder="Ej: Pecho, Espalda..." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.zone || ''} onChange={e => setFormData({...formData, zone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Grupo Muscular</label>
                  <input type="text" placeholder="Ej: Pectoral mayor" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.muscle_group || ''} onChange={e => setFormData({...formData, muscle_group: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Mecánica</label>
                  <input type="text" placeholder="Ej: Compuesto" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.mechanics || ''} onChange={e => setFormData({...formData, mechanics: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Equipamiento</label>
                  <input type="text" placeholder="Ej: Barra" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.equipment || ''} onChange={e => setFormData({...formData, equipment: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">Video URL (Opcional)</label>
                  <input type="text" placeholder="https://..." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">RIR Sugerido</label>
                  <input type="text" placeholder="Ej: 1-3" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.rir || ''} onChange={e => setFormData({...formData, rir: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 px-2">RPE Sugerido</label>
                  <input type="text" placeholder="Ej: 7-9" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white" value={formData.rpe || ''} onChange={e => setFormData({...formData, rpe: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 px-2">Instrucciones / Tips Técnicos</label>
                <textarea rows={3} placeholder="Detalles de ejecución..." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-black dark:text-white resize-none" value={formData.instructions || ''} onChange={e => setFormData({...formData, instructions: e.target.value})} />
              </div>

              <button onClick={handleSave} className="w-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl mt-4">
                {editingId ? 'Guardar Cambios' : 'Crear Ejercicio'}
              </button>
            </div>"""

content = content.replace(old_modal_content, new_modal_content)
content = content.replace('Nuevo Ejercicio</h3>', '{editingId ? "Editar Ejercicio" : "Nuevo Ejercicio"}</h3>')

with open('frontend/src/components/EntrenamientosModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

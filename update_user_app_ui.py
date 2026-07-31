import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Info button
old_info_btn = """                                     <button onClick={() => {
                                       const fullEx = globalExercises.find(ge => ge.id === ex.exercise_id || ge.name === ex.name);
                                       setSelectedExerciseInfo(fullEx || ex);
                                       setIsExerciseInfoOpen(true);
                                     }} className="text-white/20 hover:text-white transition-colors">
                                       <Info size={14} />
                                     </button>"""

new_info_btn = """                                     <button onClick={() => {
                                       const fullEx = globalExercises.find(ge => ge.id === ex.exercise_id || ge.name === ex.name);
                                       setSelectedExerciseInfo(fullEx || ex);
                                       setIsExerciseInfoOpen(true);
                                     }} className="ml-2 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md flex items-center gap-1 text-[8px] uppercase tracking-widest text-white/50 transition-colors">
                                       <Info size={10} /> Más Info
                                     </button>"""
content = content.replace(old_info_btn, new_info_btn)


# 2. Add coach notes above Carga Actual
old_carga = """                           <div className="flex items-center gap-3 bg-black/40 rounded-2xl p-3 border border-white/5">
                              <TrendingUp size={14} className="text-orange-500" />
                              <span className="text-[9px] font-black text-white/20 uppercase mr-auto">Carga Actual:</span>"""

new_carga = """                           {ex.coach_notes && (
                             <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-2">
                               <p className="text-[8px] font-black text-orange-500/70 uppercase tracking-widest mb-1">Nota del Entrenador:</p>
                               <p className="text-xs text-white/80 italic">{ex.coach_notes}</p>
                             </div>
                           )}
                           <div className="flex items-center gap-3 bg-black/40 rounded-2xl p-3 border border-white/5">
                              <TrendingUp size={14} className="text-orange-500" />
                              <span className="text-[9px] font-black text-white/20 uppercase mr-auto">Carga Actual:</span>"""
content = content.replace(old_carga, new_carga)

# 3. Update Modal HTML
old_modal = """              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Mecánica</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.mechanics || '-'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Equipamiento</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.equipment || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">RIR Sugerido</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.rir || '-'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">RPE Sugerido</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.rpe || '-'}</p>
                </div>
              </div>

              {selectedExerciseInfo.instructions && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-2">Instrucciones y Técnica</p>
                  <p className="text-xs text-white/80 whitespace-pre-wrap">{selectedExerciseInfo.instructions}</p>
                </div>
              )}"""

new_modal = """              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Segmento Corporal</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.segment || '-'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Zona Corporal</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.zone || '-'}</p>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Grupo Muscular</p>
                <p className="text-xs text-white font-bold">{selectedExerciseInfo.muscle_group || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Mecánica</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.mechanics || '-'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Equipamiento</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.equipment || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">RIR Sugerido</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.rir || '-'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">RPE Sugerido</p>
                  <p className="text-xs text-white font-bold">{selectedExerciseInfo.rpe || '-'}</p>
                </div>
              </div>

              {selectedExerciseInfo.instructions && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-2">Instrucciones y Técnica</p>
                  <p className="text-xs text-white/80 whitespace-pre-wrap">{selectedExerciseInfo.instructions}</p>
                </div>
              )}"""

content = content.replace(old_modal, new_modal)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

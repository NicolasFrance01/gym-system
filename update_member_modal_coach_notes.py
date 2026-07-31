import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleAddExercise to include coach_notes
old_handle_add = """    updated[selectedClassIndex].exercises.push({
      exercise_id: ex.id,
      name: ex.name,
      sets: 4,
      reps: 10,
      kg: 0
    });"""

new_handle_add = """    updated[selectedClassIndex].exercises.push({
      exercise_id: ex.id,
      name: ex.name,
      sets: 4,
      reps: 10,
      kg: 0,
      coach_notes: ''
    });"""

content = content.replace(old_handle_add, new_handle_add)

# Update the render block for exercises
old_render = """                      routine[selectedClassIndex].exercises.map((ex: any, eIdx: number) => (
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
                      ))"""

new_render = """                      routine[selectedClassIndex].exercises.map((ex: any, eIdx: number) => (
                        <div key={eIdx} className="flex flex-col gap-2 bg-white dark:bg-black/40 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-black dark:text-white truncate flex-1">{ex.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <input type="number" value={ex.sets} onChange={(e) => handleUpdateExercise(selectedClassIndex, eIdx, 'sets', parseInt(e.target.value))} className="w-12 bg-gray-100 dark:bg-white/10 border-none rounded-md text-xs text-center py-1 font-bold text-black dark:text-white" title="Sets" />
                              <span className="text-[10px] text-gray-400">x</span>
                              <input type="number" value={ex.reps} onChange={(e) => handleUpdateExercise(selectedClassIndex, eIdx, 'reps', parseInt(e.target.value))} className="w-12 bg-gray-100 dark:bg-white/10 border-none rounded-md text-xs text-center py-1 font-bold text-black dark:text-white" title="Reps" />
                              <span className="text-[10px] text-gray-400">|</span>
                              <span className="text-xs text-orange-500 font-bold">{ex.kg || 0}kg</span>
                              <button onClick={() => handleRemoveExercise(selectedClassIndex, eIdx)} className="text-red-500 ml-2"><X size={14} /></button>
                            </div>
                          </div>
                          <input type="text" placeholder="Instrucciones del entrenador para este ejercicio..." value={ex.coach_notes || ''} onChange={(e) => handleUpdateExercise(selectedClassIndex, eIdx, 'coach_notes', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-[10px] text-black dark:text-white italic outline-none focus:border-orange-500/50" />
                        </div>
                      ))"""

content = content.replace(old_render, new_render)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

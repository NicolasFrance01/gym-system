const fs = require('fs');
let content = fs.readFileSync('frontend/src/UserApp.tsx', 'utf8');

// Replace state
content = content.replace(
  `currentRoutine: [
      { id: 1, name: "Press de Banca", sets: "4", reps: "10", weight: 0, completed: false },
      { id: 2, name: "Sentadillas", sets: "3", reps: "12", weight: 0, completed: false },
      { id: 3, name: "Jalón al Pecho", sets: "4", reps: "10", weight: 0, completed: false }
    ]`,
  `routine: []`
);

// Add selectedClassIndex state
if (!content.includes('const [selectedClassIndex')) {
  content = content.replace(
    'const [isLoading, setIsLoading] = useState(false);',
    'const [isLoading, setIsLoading] = useState(false);\n  const [selectedClassIndex, setSelectedClassIndex] = useState(0);'
  );
}

// Update handleLogin
content = content.replace(
  /const loadedRoutine = Array\.isArray\(data\.member\.routine\)[\s\S]*?\];/g,
  `const loadedRoutine = Array.isArray(data.member.routine) ? data.member.routine : [];`
);

content = content.replace(
  /currentRoutine: loadedRoutine,/g,
  `routine: loadedRoutine,`
);

// Update toggles and weights
content = content.replace(
  /const toggleExercise = \(id: number\) => \{[\s\S]*?\};/g,
  `const toggleExercise = (cIdx: number, eIdx: number) => {
    setUserData(prev => {
      const updated = [...(prev.routine || [])];
      if (updated[cIdx] && updated[cIdx].exercises[eIdx]) {
        updated[cIdx].exercises[eIdx].completed = !updated[cIdx].exercises[eIdx].completed;
      }
      return { ...prev, routine: updated };
    });
  };`
);

content = content.replace(
  /const updateWeight = \(id: number, newWeight: number\) => \{[\s\S]*?\};/g,
  `const updateWeight = (cIdx: number, eIdx: number, newWeight: number) => {
    setUserData(prev => {
      const updated = [...(prev.routine || [])];
      if (updated[cIdx] && updated[cIdx].exercises[eIdx]) {
        updated[cIdx].exercises[eIdx].kg = newWeight;
      }
      return { ...prev, routine: updated };
    });
  };`
);

// Update save workout
const handleSaveRegex = /const handleSaveWorkout = async \(\) => \{[\s\S]*?setIsLoading\(false\);\n    \}\n  \};/g;
const newSave = `const handleSaveWorkout = async () => {
    if (!todayBooking) {
      alert("Debes tener una reserva confirmada para hoy para registrar tus ejercicios.");
      return;
    }
    setIsLoading(true);
    try {
      // Guardar permanentemente la rutina (actualiza pesos)
      await fetch(\`\${API_URL}/user/\${userData.dni}/routine\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine: userData.routine })
      });
      // Guardar el log de la clase de hoy
      const res = await fetch(\`\${API_URL}/user/bookings/\${todayBooking.id}/workout\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises: userData.routine })
      });
      if (res.ok) {
        alert("Entrenamiento registrado y pesos actualizados.");
        fetchUserBookings(userData.dni);
      } else {
        alert("Error al guardar entrenamiento");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };`;
content = content.replace(handleSaveRegex, newSave);

// Update UI (Plan del Día section)
const planRegex = /<div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar min-h-0">[\s\S]*?<\/div>\s*<div className="flex-shrink-0 pt-2 pb-6">/g;

const newPlan = `<div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar min-h-0">
                {(!userData.routine || userData.routine.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <Dumbbell size={32} className="text-white/20 mb-4" />
                    <p className="text-sm font-black text-white/50 uppercase">Tu entrenador aún no te ha asignado una rutina.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {userData.routine.map((c: any, idx: number) => (
                        <button key={idx} onClick={() => setSelectedClassIndex(idx)} className={\`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors \${selectedClassIndex === idx ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}\`}>
                          {c.class_name}
                        </button>
                      ))}
                    </div>
                    
                    {userData.routine[selectedClassIndex]?.exercises.length === 0 ? (
                      <p className="text-xs text-white/30 italic text-center mt-4">No hay ejercicios para este día.</p>
                    ) : (
                      userData.routine[selectedClassIndex]?.exercises.map((ex: any, eIdx: number) => (
                        <div key={eIdx} className={\`p-4 rounded-3xl border transition-all \${ex.completed ? 'bg-green-500/10 border-green-500/20 shadow-lg shadow-green-500/5' : 'bg-[#141b29] border-white/5'} space-y-3\`}>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div onClick={()=>toggleExercise(selectedClassIndex, eIdx)} className={\`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all \${ex.completed ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}\`}>
                                    {ex.completed ? <Check size={16} strokeWidth={4}/> : <Play size={16}/>}
                                 </div>
                                 <div><p className="font-black text-sm text-white uppercase leading-none mb-1">{ex.name}</p><p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{ex.sets} Sets × {ex.reps} Reps</p></div>
                              </div>
                              <button onClick={()=>toggleExercise(selectedClassIndex, eIdx)} className={\`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase \${ex.completed ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40'}\`}>{ex.completed ? 'Hecho' : 'Completar'}</button>
                           </div>
                           <div className="flex items-center gap-3 bg-black/40 rounded-2xl p-3 border border-white/5">
                              <TrendingUp size={14} className="text-orange-500" />
                              <span className="text-[9px] font-black text-white/20 uppercase mr-auto">Carga Actual:</span>
                              <input type="number" className="bg-transparent text-white font-black text-lg w-12 outline-none text-right" value={ex.kg || 0} onChange={e=>updateWeight(selectedClassIndex, eIdx, parseInt(e.target.value) || 0)} />
                              <span className="text-xs font-black text-white/40">KG</span>
                            </div>
                        </div>
                      ))
                    )}
                  </>
                )}
             </div>
             <div className="flex-shrink-0 pt-2 pb-6">`;

content = content.replace(planRegex, newPlan);

fs.writeFileSync('frontend/src/UserApp.tsx', content);
console.log('UserApp.tsx updated.');

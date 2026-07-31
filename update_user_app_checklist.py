import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for checklist
old_states = """  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<any>(null);"""
new_states = """  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<any>(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [uncompletedExercises, setUncompletedExercises] = useState<any[]>([]);
  const [checklistResponses, setChecklistResponses] = useState<any>({});"""
if "showChecklistModal" not in content:
    content = content.replace(old_states, new_states)


# Modify handleSaveWorkout
old_handle_save = """  const handleSaveWorkout = async () => {
    if (!todayBooking) {
      alert("Debes tener una reserva confirmada para hoy para registrar tus ejercicios.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/bookings/${todayBooking.id}/workout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises: userData.routine })
      });
      if (res.ok) {
        alert("Entrenamiento registrado en tu historial.");
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
  };"""

new_handle_save = """  const handleSaveWorkout = async () => {
    if (!todayBooking) {
      alert("Debes tener una reserva confirmada para hoy para registrar tus ejercicios.");
      return;
    }
    
    // Check for uncompleted exercises
    let uncompleted: any[] = [];
    if (userData.routine && userData.routine.length > 0) {
      userData.routine.forEach((day: any, dIdx: number) => {
        day.exercises.forEach((ex: any, eIdx: number) => {
          if (!ex.completed) {
            uncompleted.push({ ...ex, dIdx, eIdx });
          }
        });
      });
    }

    if (uncompleted.length > 0) {
      setUncompletedExercises(uncompleted);
      setShowChecklistModal(true);
      return;
    }

    submitWorkout(userData.routine);
  };

  const submitWorkout = async (routineToSave: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/bookings/${todayBooking?.id}/workout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises: routineToSave })
      });
      if (res.ok) {
        alert("Entrenamiento registrado en tu historial.");
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
  };

  const handleChecklistSubmit = () => {
    const routineCopy = JSON.parse(JSON.stringify(userData.routine));
    uncompletedExercises.forEach(ue => {
      const response = checklistResponses[`${ue.dIdx}-${ue.eIdx}`] || {};
      routineCopy[ue.dIdx].exercises[ue.eIdx].uncompleted_reason = response.reason || 'Sin especificar';
      if (response.reason === 'Otro' && response.customReason) {
        routineCopy[ue.dIdx].exercises[ue.eIdx].uncompleted_reason = response.customReason;
      }
    });
    setShowChecklistModal(false);
    submitWorkout(routineCopy);
  };
"""
if "submitWorkout" not in content:
    content = content.replace(old_handle_save, new_handle_save)

# Add Modal JSX just before final </div> of UserApp
modal_jsx = """
      {/* Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#141b29] border border-white/10 p-6 rounded-[30px] w-full max-w-md shadow-2xl relative max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 text-orange-500">¡Espera!</h3>
            <p className="text-sm text-white/70 mb-4">Te faltó hacer {uncompletedExercises.length} ejercicio(s). Puedes continuar sin guardar ese progreso o volver para marcarlos.</p>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-4">
              {uncompletedExercises.map((ue, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs font-bold text-white mb-2">{ue.name}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">¿Por qué no pudiste hacerlo? (Opcional)</p>
                  <div className="space-y-2">
                    {['No tuve tiempo', 'Muchas personas en la máquina', 'Otro'].map(reason => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" 
                          name={`reason-${ue.dIdx}-${ue.eIdx}`} 
                          value={reason} 
                          checked={checklistResponses[`${ue.dIdx}-${ue.eIdx}`]?.reason === reason}
                          onChange={() => setChecklistResponses(prev => ({
                            ...prev, 
                            [`${ue.dIdx}-${ue.eIdx}`]: { ...prev[`${ue.dIdx}-${ue.eIdx}`], reason }
                          }))}
                          className="accent-orange-500"
                        />
                        <span className="text-xs text-white/80">{reason}</span>
                      </label>
                    ))}
                    {checklistResponses[`${ue.dIdx}-${ue.eIdx}`]?.reason === 'Otro' && (
                      <input 
                        type="text" 
                        placeholder="Especificar..." 
                        value={checklistResponses[`${ue.dIdx}-${ue.eIdx}`]?.customReason || ''}
                        onChange={(e) => setChecklistResponses(prev => ({
                          ...prev, 
                          [`${ue.dIdx}-${ue.eIdx}`]: { ...prev[`${ue.dIdx}-${ue.eIdx}`], customReason: e.target.value }
                        }))}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white mt-2 outline-none focus:border-orange-500/50"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={handleChecklistSubmit} className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest text-xs py-3 rounded-2xl transition-colors">
                Continuar y Guardar
              </button>
              <button onClick={() => setShowChecklistModal(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs py-3 rounded-2xl transition-colors">
                Volver para Marcar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

content = content.replace("    </div>\n  );\n}", modal_jsx)


with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

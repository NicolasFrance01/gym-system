import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for progress
old_states = """  const [routine, setRoutine] = useState<any[]>(member?.routine || []);"""
new_states = """  const [routine, setRoutine] = useState<any[]>(member?.routine || []);
  const [progressData, setProgressData] = useState<any>(null);"""
if "progressData" not in content:
    content = content.replace(old_states, new_states)

# Fetch progress inside useEffect
old_use_effect = """  useEffect(() => {
    fetch(`${API_URL}/admin/exercises`)
      .then(r => r.json())
      .then(data => setExercises(data))
      .catch(e => console.error(e));
  }, [API_URL]);"""

new_use_effect = """  useEffect(() => {
    fetch(`${API_URL}/admin/exercises`)
      .then(r => r.json())
      .then(data => setExercises(data))
      .catch(e => console.error(e));
      
    if (member?.dni) {
      fetch(`${API_URL}/user/${member.dni}/progress`)
        .then(r => r.json())
        .then(data => setProgressData(data))
        .catch(e => console.error("Error fetching progress", e));
    }
  }, [API_URL, member]);"""
if "fetch(`${API_URL}/user/${member.dni}/progress`)" not in content:
    content = content.replace(old_use_effect, new_use_effect)

# Update the Progress Tab skeleton
old_prog = """          {activeTab === 'progreso' && (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="text-gray-500 italic">Gráficos de progreso estarán aquí...</p>
            </div>
          )}"""

new_prog = """          {activeTab === 'progreso' && (
            <div className="w-full h-full flex flex-col gap-6">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-black uppercase mb-4 text-black dark:text-white">Gráfico de Cargas</h3>
                <ProgressChart data={progressData?.chart_data || []} />
              </div>
              
              {progressData?.uncompleted_history && progressData.uncompleted_history.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-3xl">
                  <h3 className="text-sm font-black uppercase mb-4 text-orange-500">Historial de Incompletos</h3>
                  <div className="space-y-2">
                    {progressData.uncompleted_history.map((uh: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white">{uh.exercise}</p>
                          <p className="text-[10px] text-white/50">{new Date(uh.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-xs font-bold text-orange-400 italic">"{uh.reason}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}"""
content = content.replace(old_prog, new_prog)

# Add ProgressChart import
import_idx = content.find("import {")
if "ProgressChart" not in content:
    content = content[:import_idx] + "import ProgressChart from './ProgressChart';\n" + content[import_idx:]


with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

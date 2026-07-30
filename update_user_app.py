import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Info to imports
content = content.replace("import { Zap, Dumbbell, Clock, Check, Play, LayoutDashboard, User, TrendingUp, ArrowUpRight, X, Lock, AlertTriangle } from 'lucide-react';", "import { Zap, Dumbbell, Clock, Check, Play, LayoutDashboard, User, TrendingUp, ArrowUpRight, X, Lock, AlertTriangle, Info } from 'lucide-react';")

# 2. Add states for Exercises
state_injection = """  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [globalExercises, setGlobalExercises] = useState<any[]>([]);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<any | null>(null);
  const [isExerciseInfoOpen, setIsExerciseInfoOpen] = useState(false);"""
content = content.replace("  const [isChangingPassword, setIsChangingPassword] = useState(false);", state_injection)

# 3. Fetch global exercises on authenticate
auth_injection = """      const userRes = await fetch(`${API_URL}/members/${dni}`);
      if (userRes.ok) {
        const uData = await userRes.json();
        setUserData(uData);
        
        // Fetch all exercises to have the details for the info modal
        try {
          const exRes = await fetch(`${API_URL}/admin/exercises`);
          if (exRes.ok) {
            setGlobalExercises(await exRes.json());
          }
        } catch (e) { console.error("Error fetching exercises", e); }
        
        setIsAuthenticated(true);"""
content = content.replace("""      const userRes = await fetch(`${API_URL}/members/${dni}`);
      if (userRes.ok) {
        setUserData(await userRes.json());
        setIsAuthenticated(true);""", auth_injection)

# 4. Add Info button in exercise card
ex_card_old = """                                 <div><p className="font-black text-sm text-white uppercase leading-none mb-1">{ex.name}</p><p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{ex.sets} Sets × {ex.reps} Reps</p></div>"""
ex_card_new = """                                 <div>
                                   <div className="flex items-center gap-2 mb-1">
                                     <p className="font-black text-sm text-white uppercase leading-none">{ex.name}</p>
                                     <button onClick={() => {
                                       const fullEx = globalExercises.find(ge => ge.id === ex.exercise_id || ge.name === ex.name);
                                       setSelectedExerciseInfo(fullEx || ex);
                                       setIsExerciseInfoOpen(true);
                                     }} className="text-white/20 hover:text-white transition-colors">
                                       <Info size={14} />
                                     </button>
                                   </div>
                                   <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{ex.sets} Sets × {ex.reps} Reps</p>
                                 </div>"""
content = content.replace(ex_card_old, ex_card_new)

# 5. Add Modal HTML before the final closing div
modal_html = """
      {/* Exercise Info Modal */}
      {isExerciseInfoOpen && selectedExerciseInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#141b29] border border-white/10 p-6 rounded-[30px] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsExerciseInfoOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 pr-6">{selectedExerciseInfo.name}</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {selectedExerciseInfo.video_url && (
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 mb-4 aspect-video">
                  {selectedExerciseInfo.video_url.includes("youtube.com") || selectedExerciseInfo.video_url.includes("youtu.be") ? (
                    <iframe 
                      className="w-full h-full" 
                      src={selectedExerciseInfo.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  ) : (
                    <a href={selectedExerciseInfo.video_url} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center text-orange-500 hover:text-orange-400 transition-colors p-4 text-center">
                      <Play size={32} className="mb-2" />
                      <span className="text-xs font-black uppercase tracking-widest">Ver Video Tutorial</span>
                    </a>
                  )}
                </div>
              )}
              
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""
content = content.replace("    </div>\n  );\n}", modal_html)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

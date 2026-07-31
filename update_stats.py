import re

def update_user_app():
    with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the rendering block for Evolution
    find_str = """                   <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl font-black text-white">+25kg</p><p className="text-[9px] text-green-500 font-black mt-1 uppercase">Imparable</p></div>
                   <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl font-black text-white">48</p><p className="text-[9px] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>"""
    
    replace_str = """                   {(() => {
                     let totalImprovement = 0;
                     if (userData.evolution && userData.evolution.length > 1) {
                       const first = userData.evolution[0];
                       const last = userData.evolution[userData.evolution.length - 1];
                       const keys = Object.keys(last).filter(k => k !== 'date' && k !== 'name');
                       keys.forEach(k => {
                         const firstVal = first[k] || 0;
                         const lastVal = last[k] || 0;
                         if (lastVal > firstVal) totalImprovement += (lastVal - firstVal);
                       });
                     }
                     const daysTrained = attendanceHistory ? attendanceHistory.filter(h => h.type !== "Tótem").length : 0;
                     return (
                       <>
                         <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Mejoría Total</p><p className="text-xl font-black text-white">+{totalImprovement}kg</p><p className="text-[9px] text-green-500 font-black mt-1 uppercase">Imparable</p></div>
                         <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><p className="text-[8px] text-white/20 font-black uppercase mb-1">Días Entrenados</p><p className="text-xl font-black text-white">{daysTrained}</p><p className="text-[9px] text-orange-500 font-black mt-1 uppercase">Consistencia</p></div>
                       </>
                     );
                   })()}"""

    if find_str in content:
        content = content.replace(find_str, replace_str)
    else:
        print("Could not find hardcoded stats in UserApp")

    with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_user_app()

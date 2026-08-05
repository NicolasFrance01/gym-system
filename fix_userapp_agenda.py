import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject States
states = """  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);
  const [dbActivities, setDbActivities] = useState<any[]>([]);
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/activities`);
      if (res.ok) {
        const data = await res.json();
        setDbActivities(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchActivities();
  }, []);
"""
if "const [showMorning" not in content:
    content = content.replace('  const [selectedClassIndex, setSelectedClassIndex] = useState(0);', '  const [selectedClassIndex, setSelectedClassIndex] = useState(0);\n' + states)

# 2. Modify morning header
morning_header = """                            <div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl">
                              Clases por la Mañana
                            </div>"""
new_morning_header = """                            <div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl flex items-center justify-center cursor-pointer relative" onClick={() => setShowMorning(!showMorning)}>
                              <span>Clases por la Mañana</span>
                              <span className="absolute right-4">{showMorning ? "▲" : "▼"}</span>
                            </div>"""
if morning_header in content:
    content = content.replace(morning_header, new_morning_header)

# 3. Modify evening header
evening_header = """                            <div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl">
                              Clases por la Tarde/Noche
                            </div>"""
new_evening_header = """                            <div className="bg-[#F38E26] text-white font-black text-center py-2.5 uppercase tracking-widest text-[9px] rounded-t-2xl flex items-center justify-center cursor-pointer relative" onClick={() => setShowEvening(!showEvening)}>
                              <span>Clases por la Tarde/Noche</span>
                              <span className="absolute right-4">{showEvening ? "▲" : "▼"}</span>
                            </div>"""
if evening_header in content:
    content = content.replace(evening_header, new_evening_header)

# 4. Wrap morning table
table_morning = """                            <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-2xl scrollbar-thin">
                              <table className="w-full border-collapse text-left table-fixed">
                                <thead>
                                  <tr className="bg-[#F38E26]/5 text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                    <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {morningSlots.map((slot, rowIndex) => ("""
new_table_morning = """                            {showMorning && <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-2xl scrollbar-thin">
                              <table className="w-full border-collapse text-left table-fixed">
                                <thead>
                                  <tr className="bg-[#F38E26]/5 text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                    <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {morningSlots.map((slot, rowIndex) => ("""
if table_morning in content:
    content = content.replace(table_morning, new_table_morning)

# Let's fix the closing div of morning table
content = content.replace("                                </tbody>\n                              </table>\n                            </div>\n\n                          </div>", "                                </tbody>\n                              </table>\n                            </div>}\n\n                          </div>")

# 5. Wrap evening table
table_evening = """                            <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-2xl scrollbar-thin">
                              <table className="w-full border-collapse text-left table-fixed">
                                <thead>
                                  <tr className="bg-[#F38E26]/5 text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                    <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {eveningSlots.map((slot, rowIndex) => ("""
new_table_evening = """                            {showEvening && <div className="overflow-x-auto border-x border-b border-white/5 rounded-b-2xl scrollbar-thin">
                              <table className="w-full border-collapse text-left table-fixed">
                                <thead>
                                  <tr className="bg-[#F38E26]/5 text-white/20 border-b border-white/5 text-[7px] uppercase tracking-wider font-black">
                                    <th className="p-1 sm:p-3 text-center w-14 sm:w-20 text-[7px]">Hora</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">L</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">M</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">MI</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">J</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">V</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">S</th>
                                    <th className="p-1 sm:p-3 text-center text-[7px]">D</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {eveningSlots.map((slot, rowIndex) => ("""
if table_evening in content:
    content = content.replace(table_evening, new_table_evening)

# and its closing div. It's followed by `                          </div>\n                       </div>\n\n                     </div>` probably?
# Let's write a regex for closing evening div
content = re.sub(r'                                </tbody>\n                              </table>\n                            </div>\n\n                          </div>\n                       </div>\n\n                     </div>', r'                                </tbody>\n                              </table>\n                            </div>}\n\n                          </div>\n                       </div>\n\n                     </div>', content)

# 6. Inject the legend at the end of Grilla Semanal. 
# Grilla Semanal ends with: `                       </div>\n\n                     </div>\n        )`
# Let's insert the legend before `                       </div>\n\n                     </div>`
legend_injection = """
                            {/* Actividades Leyenda */}
                            <div className="pt-4 border-t border-white/10 text-center mt-4">
                              <span className="text-[9px] font-black uppercase tracking-wider text-white/20 block mb-3">Actividades</span>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center text-[8px] font-black uppercase">
                                {dbActivities.map((act, i) => (
                                  <span key={i} className="flex items-center gap-1 group relative" style={{ color: act.color }}>
                                    ● {act.name} ({act.code})
                                  </span>
                                ))}
                              </div>
                            </div>
"""
content = content.replace('                          </div>\n                       </div>\n\n                     </div>\n        )', '                          </div>\n' + legend_injection + '                       </div>\n\n                     </div>\n        )')


with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

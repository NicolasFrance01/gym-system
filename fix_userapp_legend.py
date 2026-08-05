import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

legend = """
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

content = re.sub(r'(<\/table>\n\s*<\/div>\}\n\s*<\/div>\n)(\s*<\/div>\n\s*<\/div>\n\s*\)\})', r'\1' + legend + r'\2', content)

# ensure dbActivities is used!
with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

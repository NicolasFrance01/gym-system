import re

with open('frontend/src/TotemPlan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

cargaHtml = """<span className="text-[9px] font-black text-white/20 uppercase mr-auto">
                                <span className="block">Carga Actual:</span>
                                {memberData.last_weights && memberData.last_weights[ex.name] ? (
                                  <span className="block text-[7px] text-orange-500/80">Último peso: {memberData.last_weights[ex.name]}kg</span>
                                ) : null}
                              </span>"""

content = content.replace('<span className="text-[9px] font-black text-white/20 uppercase mr-auto">Carga Actual:</span>', cargaHtml)

with open('frontend/src/TotemPlan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleMassClassSubmit to fetch schedules
old_mass = """      if (res.ok) {
        setIsMassClassModalOpen(false);
        
      }"""
new_mass = """      if (res.ok) {
        setIsMassClassModalOpen(false);
        fetchSchedules();
      }"""
content = content.replace(old_mass, new_mass)

# 2. Add text-shadow to agenda blocks
# style={{ backgroundColor: s.color }}
old_style = "style={{ backgroundColor: s.color }}"
new_style = "style={{ backgroundColor: s.color, textShadow: '0px 1px 3px rgba(0,0,0,0.9)' }}"
content = content.replace(old_style, new_style)

# 3. Add text-shadow to the legend text
# style={{ color: act.color }}
old_legend_style = "style={{ color: act.color }}"
new_legend_style = "style={{ color: act.color, textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}"
content = content.replace(old_legend_style, new_legend_style)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

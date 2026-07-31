import re

with open('frontend/src/TotemPlan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("labelFormatter={d => new Date(d).toLocaleDateString", "labelFormatter={d => new Date(d as any).toLocaleDateString")

with open('frontend/src/TotemPlan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

# 1. AdminDashboard.tsx - Replace Activity icon with muscle emoji
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('icon={<Activity size={14} />} label="Entrenamientos"', 'icon={<span className="text-sm leading-none -mt-[2px]">💪🏻</span>} label="Entrenamientos"')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("AdminDashboard updated.")

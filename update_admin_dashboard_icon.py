import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_item = '<SidebarItem icon={<span className="text-sm leading-none -mt-[2px]">💪🏻</span>} label="Ejercicios"'
new_item = '<SidebarItem icon={<img src="/musculos.png" alt="Ejercicios" className="w-4 h-4 opacity-50 dark:invert" />} label="Ejercicios"'

content = content.replace(old_item, new_item)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

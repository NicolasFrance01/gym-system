import re

# 1. Fix AdminDashboard.tsx label
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = admin_content.replace('label="Entrenamientos"', 'label="Ejercicios"')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)

# 2. Fix index.html favicon
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = index_content.replace('<link rel="icon" type="image/png" href="/fusion_fitness.ico" />', '<link rel="icon" type="image/png" href="/logo_B.png" />')

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)

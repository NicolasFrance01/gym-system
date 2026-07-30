import re

# Fix AdminDashboard.tsx
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()
    
admin_content = re.sub(r"Activity,\s*", "", admin_content)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)

# Fix MemberModal.tsx
with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    modal_content = f.read()

modal_content = modal_content.replace('availableExercises.filter', 'exercises.filter')

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_content)

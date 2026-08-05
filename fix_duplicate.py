with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, l in enumerate(lines):
    if l.strip().startswith('const handleDeleteActivity = async') and i < 250:
        skip = True
    
    if skip:
        if l.strip() == '};' and lines[i+1].strip() == 'const fetchActivities = async () => {':
            skip = False
        continue
    
    new_lines.append(l)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const daysTrained = attendanceHistory ? attendanceHistory.filter(h => h.type !== "Tótem").length : 0;', 'const daysTrained = userData?.attendanceHistory ? userData.attendanceHistory.filter((h: any) => h.type !== "Tótem").length : 0;')

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

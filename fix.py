import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove handleAddNewActivity
content = re.sub(r'  const handleAddNewActivity = \(\) => \{.*?setIsAddingNewActivity\(false\);\n  \};\n', '', content, flags=re.DOTALL)

# 2. Fix the select section
content = content.replace('activities.find(act =>', 'allActivities.find((act: any) =>')

# Remove the button that toggles isAddingNewActivity
content = re.sub(r'<button[^>]*?onClick=\{\(\) => setIsAddingNewActivity\(!isAddingNewActivity\)\}[^>]*?>\s*\{isAddingNewActivity \? "Cerrar" : "\+ Nueva"\}\s*</button>', '', content, flags=re.DOTALL)

# Remove the old panel for new activity (which used isAddingNewActivity and handleAddNewActivity)
content = re.sub(r'\{isAddingNewActivity && \(\s*<div[^>]*?>.*?Guardar Actividad</button>\s*</div>\s*\)\}', '', content, flags=re.DOTALL)

# Check for any remaining activities map
content = content.replace('activities.map', 'allActivities.map')

# In case there are other isAddingNewActivity references
content = re.sub(r'isAddingNewActivity', 'false', content)

# Check for TS error "Parameter 'act' implicitly has an 'any' type." in activities.map
content = content.replace('allActivities.map((act, i)', 'allActivities.map((act: any, i: number)')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

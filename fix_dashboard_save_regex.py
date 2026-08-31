import re

with open("frontend/src/AdminDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r"(\s+setDeletedSlotKeys\(prev => \{\s+const next = new Set\(prev\);\s+next\.add\(`\$\{start\}-\$\{end\}`\);\s+)(return next;\s+\}\);)", re.MULTILINE)

new_content = pattern.sub(r"\1fetch(`${API_URL}/admin/configs/hidden_slots`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: Array.from(next) }) }).catch(console.error);\n            \2", content)

if content != new_content:
    with open("frontend/src/AdminDashboard.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Success: Replaced using regex!")
else:
    print("Error: Regex didn't match!")

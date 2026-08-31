import re

with open("frontend/src/AdminDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_block = """          setDeletedSlotKeys(prev => {
            const next = new Set(prev);
            next.add(`${start}-${end}`);
            return next;
          });"""

new_block = """          setDeletedSlotKeys(prev => {
            const next = new Set(prev);
            next.add(`${start}-${end}`);
            
            // Save to backend
            fetch(`${API_URL}/admin/configs/hidden_slots`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: Array.from(next) })
            }).catch(console.error);
            
            return next;
          });"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("frontend/src/AdminDashboard.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success: Replaced!")
else:
    print("Error: Block not found!")

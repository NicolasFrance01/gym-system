import re

# 1. Update admin_routes.py
with open('frontend/api/admin_routes.py', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = admin_content.replace('c.checkin_at.isoformat() + "Z"', 'c.checkin_at.isoformat()')
admin_content = admin_content.replace('b.start_time.isoformat() + "Z"', 'b.start_time.isoformat()')

with open('frontend/api/admin_routes.py', 'w', encoding='utf-8') as f:
    f.write(admin_content)

# 2. Update user_routes.py
with open('frontend/api/user_routes.py', 'r', encoding='utf-8') as f:
    user_content = f.read()

user_content = user_content.replace('b.start_time.isoformat() + "Z"', 'b.start_time.isoformat()')

with open('frontend/api/user_routes.py', 'w', encoding='utf-8') as f:
    f.write(user_content)

# 3. Update MemberModal.tsx frontend parsing
with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    modal_content = f.read()

modal_content = modal_content.replace(
    "const dt = new Date(c.checkin_at.replace(/\\.\\d+Z$/, 'Z'));",
    "const dt = new Date(c.checkin_at.replace('Z', '').replace(/\\.\\d+$/, ''));"
)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_content)

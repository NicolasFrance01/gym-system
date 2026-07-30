with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("} , Activity } from 'lucide-react';", ", Activity } from 'lucide-react';")
with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

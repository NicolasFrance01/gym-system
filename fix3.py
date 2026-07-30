with open('frontend/src/components/EntrenamientosModule.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("import { Search, Plus, Trash2, Edit2, X, Target, Activity } from 'lucide-react';", "import { Search, Trash2, X } from 'lucide-react';")

with open('frontend/src/components/EntrenamientosModule.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

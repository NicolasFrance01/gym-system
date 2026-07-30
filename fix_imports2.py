import re

with open('frontend/src/components/EntrenamientosModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"import\s*\{\s*Search,\s*Plus,\s*Edit2,\s*Trash2,\s*Target,\s*Activity,\s*X\s*\}\s*from 'lucide-react';", "import { Search, Trash2, X } from 'lucide-react';", content)

with open('frontend/src/components/EntrenamientosModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

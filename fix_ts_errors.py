import re

def fix_admin_dashboard():
    with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix handleSaveMember
    content = content.replace("const handleSaveMember = async (formData = formData) => {", "const handleSaveMember = async (formData: any = selectedItem) => {")
    content = content.replace("const handleSaveMember = async (formData = selectedItem) => {", "const handleSaveMember = async (formData: any = selectedItem) => {")
    
    with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_user_app():
    with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix routine type
    content = content.replace("routine: [],", "routine: [] as any[],")
    
    with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_imports(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "EntrenamientosModule.tsx" in file_path:
        content = re.sub(r"import React\s*,\s*\{\s*useState\s*,\s*useEffect\s*\}\s*from 'react';", "import { useState, useEffect } from 'react';", content)
        content = re.sub(r"import\s*\{\s*Search,\s*Plus,\s*Edit2,\s*Trash2,\s*Target,\s*Activity,\s*X\s*\}\s*from 'lucide-react';", "import { Search, Trash2, X } from 'lucide-react';", content)
    
    if "MemberModal.tsx" in file_path:
        content = re.sub(r"import React\s*,\s*\{\s*useState\s*,\s*useEffect\s*\}\s*from 'react';", "import { useState, useEffect } from 'react';", content)
        content = re.sub(r"import\s*\{\s*X,\s*Save,\s*Activity,\s*Target\s*\}\s*from 'lucide-react';", "import { X, Save } from 'lucide-react';", content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_admin_dashboard()
fix_user_app()
fix_imports('frontend/src/components/EntrenamientosModule.tsx')
fix_imports('frontend/src/components/MemberModal.tsx')

import re

# Fix AdminDashboard.tsx icon
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = admin_content.replace('src="/musculos.png"', 'src="/ejercicio.png"')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)


# Fix MemberModal.tsx Tabs and Data width
with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    modal_content = f.read()

# 1. Update Tabs State & Buttons
modal_content = modal_content.replace(
    "const [activeTab, setActiveTab] = useState<'datos' | 'entrenamiento'>('datos');",
    "const [activeTab, setActiveTab] = useState<'datos' | 'entrenamiento' | 'progreso'>('datos');"
)

old_tabs = """        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10 pb-2">
          <button onClick={() => setActiveTab('datos')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'datos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Datos Personales</button>
          <button onClick={() => setActiveTab('entrenamiento')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'entrenamiento' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Entrenamiento y Progreso</button>
        </div>"""
new_tabs = """        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10 pb-2">
          <button onClick={() => setActiveTab('datos')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'datos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Datos Personales</button>
          <button onClick={() => setActiveTab('entrenamiento')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'entrenamiento' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Entrenamiento</button>
          <button onClick={() => setActiveTab('progreso')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${activeTab === 'progreso' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Progreso</button>
        </div>"""
modal_content = modal_content.replace(old_tabs, new_tabs)

# 2. Update Datos Personales width
modal_content = modal_content.replace(
    '<div className="space-y-4 max-w-md">',
    '<div className="space-y-4 w-full">'
)

# 3. Add Progreso Tab skeleton
modal_content = modal_content.replace(
    "{activeTab === 'entrenamiento' && (",
    "{activeTab === 'progreso' && (\n            <div className=\"flex flex-col items-center justify-center p-12\">\n              <p className=\"text-gray-500 italic\">Gráficos de progreso estarán aquí...</p>\n            </div>\n          )}\n          {activeTab === 'entrenamiento' && ("
)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_content)

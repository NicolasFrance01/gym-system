import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables below searchQuery
state_injection = """  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('Todos');
  const [selectedZone, setSelectedZone] = useState<string>('Todas');

  const segments = ['Todos', 'Tren superior', 'Tren medio / core', 'Tren inferior', 'Cuerpo completo'];
  const availableZones = selectedSegment === 'Todos' ? [] : Array.from(new Set(availableExercises.filter((e:any) => e.segment === selectedSegment).map((e:any) => e.zone)));

  useEffect(() => {
    setSelectedZone('Todas');
  }, [selectedSegment]);
"""
content = re.sub(r"  const \[searchQuery,\s*setSearchQuery\]\s*=\s*useState\(''\);", state_injection, content)

# 2. Update filteredExercises logic
filtered_old = """  const filteredExercises = availableExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ex.muscle_group && ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );"""

filtered_new = """  const filteredExercises = availableExercises.filter((e:any) => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (e.muscle_group && e.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSegment = selectedSegment === 'Todos' || e.segment === selectedSegment;
    const matchZone = selectedZone === 'Todas' || e.zone === selectedZone;
    return matchSearch && matchSegment && matchZone;
  });"""

content = content.replace(filtered_old, filtered_new)

# 3. Update the UI to include pills below search input
ui_old = """                  <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-2 text-[10px] text-black dark:text-white mb-4" />"""

ui_new = """                  <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-2 text-[10px] text-black dark:text-white mb-2" />
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {segments.map(seg => (
                      <button key={seg} onClick={() => setSelectedSegment(seg)} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase transition-all ${selectedSegment === seg ? 'bg-orange-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200'}`}>
                        {seg}
                      </button>
                    ))}
                  </div>

                  {selectedSegment !== 'Todos' && availableZones.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      <button onClick={() => setSelectedZone('Todas')} className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase transition-all ${selectedZone === 'Todas' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200'}`}>
                        Todas las Zonas
                      </button>
                      {availableZones.map((z: any) => (
                        <button key={z} onClick={() => setSelectedZone(z)} className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase transition-all ${selectedZone === z ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200'}`}>
                          {z}
                        </button>
                      ))}
                    </div>
                  )}"""

content = content.replace(ui_old, ui_new)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("MemberModal updated.")

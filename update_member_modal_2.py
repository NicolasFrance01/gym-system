import re

with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_filter = """  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.muscle_group && e.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );"""

new_filter = """  const filteredExercises = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (e.muscle_group && e.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSegment = selectedSegment === 'Todos' || e.segment === selectedSegment;
    const matchZone = selectedZone === 'Todas' || e.zone === selectedZone;
    return matchSearch && matchSegment && matchZone;
  });"""

content = content.replace(old_filter, new_filter)

old_zones_ui = """                  {selectedSegment !== 'Todos' && availableZones.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">"""

new_zones_ui = """                  {selectedSegment !== 'Todos' && availableZones.length > 0 && (
                    <>
                      <hr className="border-gray-200 dark:border-white/10 mb-2" />
                      <div className="flex flex-wrap gap-1 mb-4">"""

content = content.replace(old_zones_ui, new_zones_ui)
content = content.replace("                      </button>\n                    ))}\n                  </div>\n                )}", "                      </button>\n                    ))}\n                  </div>\n                  </>\n                )}")

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

# 1. Update AdminDashboard.tsx
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()

# Add handleDeleteRow function after handleDeleteActivity
delete_row_func = """  const handleDeleteRow = async (start: string, end: string) => {
    showConfirm("Eliminar Fila Completa", `¿Seguro que deseas eliminar TODAS las clases del horario ${start} - ${end} de esta semana?`, async () => {
      const rowSchedules = schedules.filter(s => s.start_time === start && s.end_time === end);
      try {
        await Promise.all(rowSchedules.map(s => fetch(`${API_URL}/admin/class_schedules/${s.id}`, { method: 'DELETE' })));
        fetchSchedules();
      } catch (e) {
        console.error(e);
      }
    });
  };
"""
admin_content = admin_content.replace('const handleMassClassSubmit = async () => {', delete_row_func + '\n  const handleMassClassSubmit = async () => {')

# Modify renderSlotRows time cell
old_time_cell = """          <td className="p-1 sm:p-3 text-center w-14 sm:w-24">
            <span className="inline-block px-1.5 sm:px-3 py-1 sm:py-1.5 bg-[#F38E26]/10 text-gray-700 dark:text-gray-300 font-black rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 text-[7px] sm:text-[9px] uppercase tracking-tight">
              {slot.start} - {slot.end}
            </span>
          </td>"""

new_time_cell = """          <td className="p-1 sm:p-3 text-center w-14 sm:w-24 relative group">
            <span className="inline-block px-1.5 sm:px-3 py-1 sm:py-1.5 bg-[#F38E26]/10 text-gray-700 dark:text-gray-300 font-black rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 text-[7px] sm:text-[9px] uppercase tracking-tight">
              {slot.start} - {slot.end}
            </span>
            <button onClick={() => handleDeleteRow(slot.start, slot.end)} className="absolute top-1 left-1 sm:top-2 sm:left-2 text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all bg-white dark:bg-[#1b2435] border border-red-500/30 rounded-full p-0.5 shadow-md z-10" title="Eliminar fila completa">
              <X size={10} strokeWidth={4} />
            </button>
          </td>"""
admin_content = admin_content.replace(old_time_cell, new_time_cell)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)

# 2. Update UserApp.tsx
with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    user_content = f.read()

# Replace all style={{ backgroundColor: s.color }} in UserApp with textShadow included
old_style = "style={{ backgroundColor: s.color }}"
new_style = "style={{ backgroundColor: s.color, textShadow: '0px 1px 3px rgba(0,0,0,0.9)' }}"
user_content = user_content.replace(old_style, new_style)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(user_content)

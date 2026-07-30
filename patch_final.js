const fs = require('fs');

const prodCode = fs.readFileSync('frontend/src/AdminDashboard.tsx', 'utf-8');

// 1. Extract AgendaModule
const agendaModule = fs.readFileSync('agenda_module_fixed.txt', 'utf-8');

// Patching PROD code
let newCode = prodCode;

// Inject Calendar icon
newCode = newCode.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, (match, p1) => {
  let imports = p1;
  if(!imports.includes('Calendar')) imports += ', Calendar';
  if(!imports.includes('AlertTriangle')) imports += ', AlertTriangle';
  if(!imports.includes('Clock')) imports += ', Clock';
  return 'import {' + imports + '} from \'lucide-react\';';
});

// Inject AgendaModule definition
newCode = newCode.replace('export default function AdminDashboard', agendaModule + '\n\nexport default function AdminDashboard');

// Inject Sidebar Item
newCode = newCode.replace(/<SidebarItem icon=\{<Settings size=\{14\} \/>\} label="Planes" active=\{activeTab === 'Planes'\} onClick=\{\(\) => setActiveTab\('Planes'\)\} \/>/, 
  '<SidebarItem icon={<Settings size={14} />} label="Planes" active={activeTab === \'Planes\'} onClick={() => setActiveTab(\'Planes\')} />\n          <SidebarItem icon={<Calendar size={14} />} label="Agenda" active={activeTab === \'Agenda\'} onClick={() => setActiveTab(\'Agenda\')} />');

// Inject renderContent case
newCode = newCode.replace(/case 'Planes': return <PlansModule[\s\S]*?\/>;/, 
  'case \'Planes\': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType(\'plan\'); setIsModalOpen(true);}} onDelete={async (id:any)=>{ if(!confirm(\'¿Eliminar plan?\')) return; const res = await fetch(`${API_URL}/admin/plans/${id}`,{method:\'DELETE\'}); if(res.ok) refreshData(); }} onAddClick={()=>{setSelectedItem({name:\'\', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType(\'plan\'); setIsModalOpen(true);}} />;\n      case \'Agenda\': return <AgendaModule members={members} API_URL={API_URL} setConfirmModal={setConfirmModal} />;');

fs.writeFileSync('frontend/src/AdminDashboard.tsx', newCode);
console.log('AdminDashboard Patched without duplicating confirmModal!');

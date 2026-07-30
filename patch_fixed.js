const fs = require('fs');

const prodCode = fs.readFileSync('frontend/src/AdminDashboard.tsx', 'utf-8');
const testCode = fs.readFileSync('frontend/src/AdminDashboard_TEST.tsx', 'utf-8');

// 1. Extract AgendaModule
const agendaModule = fs.readFileSync('agenda_module_fixed.txt', 'utf-8');

// 2. Extract confirmModal State
const confirmModalMatch = testCode.match(/const \[confirmModal[\s\S]*?\}\);/);
const confirmState = confirmModalMatch ? confirmModalMatch[0] : '';

// 3. Extract confirmModal overlay
const overlayStart = testCode.indexOf('{/* Custom confirm modal overlay in AgendaModule */}');
const overlayEnd = testCode.indexOf('{isNewMemberOpen &&', overlayStart);
const overlayStr = overlayStart !== -1 ? testCode.substring(overlayStart, overlayEnd !== -1 ? overlayEnd : testCode.indexOf('</div>\n  );\n}')) : '';

// Patching PROD code
let newCode = prodCode;

// Inject Calendar icon
newCode = newCode.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, (match, p1) => {
  let imports = p1;
  if(!imports.includes('Calendar')) imports += ', Calendar';
  if(!imports.includes('AlertTriangle')) imports += ', AlertTriangle';
  if(!imports.includes('CheckSquare')) imports += ', CheckSquare';
  return 'import {' + imports + '} from \'lucide-react\';';
});

// Inject AgendaModule definition
newCode = newCode.replace('export default function AdminDashboard', agendaModule + '\n\nexport default function AdminDashboard');

// Inject confirmModal state
newCode = newCode.replace('const [searchQuery, setSearchQuery] = useState(\'\');', 'const [searchQuery, setSearchQuery] = useState(\'\');\n  ' + confirmState);

// Inject Sidebar Item
newCode = newCode.replace(/<SidebarItem icon=\{<Settings size=\{14\} \/>\} label="Planes" active=\{activeTab === 'Planes'\} onClick=\{\(\) => setActiveTab\('Planes'\)\} \/>/, 
  '<SidebarItem icon={<Settings size={14} />} label="Planes" active={activeTab === \'Planes\'} onClick={() => setActiveTab(\'Planes\')} />\n          <SidebarItem icon={<Calendar size={14} />} label="Agenda" active={activeTab === \'Agenda\'} onClick={() => setActiveTab(\'Agenda\')} />');

// Inject renderContent case
newCode = newCode.replace(/case 'Planes': return <PlansModule[\s\S]*?\/>;/, 
  'case \'Planes\': return <PlansModule plans={plans} onEdit={(p:any)=>{setSelectedItem(p); setIsEditMode(true); setModalType(\'plan\'); setIsModalOpen(true);}} onDelete={async (id:any)=>{ if(!confirm(\'¿Eliminar plan?\')) return; const res = await fetch(`${API_URL}/admin/plans/${id}`,{method:\'DELETE\'}); if(res.ok) refreshData(); }} onAddClick={()=>{setSelectedItem({name:\'\', price:0, daysPerWeek:3, classes:[]}); setIsEditMode(false); setModalType(\'plan\'); setIsModalOpen(true);}} />;\n      case \'Agenda\': return <AgendaModule members={members} API_URL={API_URL} setConfirmModal={setConfirmModal} />;');

// Inject confirmModal overlay
newCode = newCode.replace(/<\/div>\n  \);\n\}/, '\n      ' + overlayStr + '\n    </div>\n  );\n}');

fs.writeFileSync('frontend/src/AdminDashboard.tsx', newCode);
console.log('AdminDashboard Patched with fixed agenda module!');

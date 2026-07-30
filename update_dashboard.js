const fs = require('fs');
let lines = fs.readFileSync('frontend/src/AdminDashboard.tsx', 'utf8').split('\n');

// 1. Add import
if (!lines.some(l => l.includes('EntrenamientosModule'))) {
    lines.splice(6, 0, "import EntrenamientosModule from './components/EntrenamientosModule';");
}

// 2. Add Activity icon to the lucide-react import
const iconImportIdx = lines.findIndex(l => l.includes("from 'lucide-react'"));
if (iconImportIdx > -1) {
    if (!lines[iconImportIdx].includes('Activity')) {
        lines[iconImportIdx] = lines[iconImportIdx].replace("from 'lucide-react'", ", Activity } from 'lucide-react'");
    }
}

// 3. Add case 'Entrenamientos' to switch
const switchIdx = lines.findIndex(l => l.includes("case 'Planes': return <PlansModule"));
if (switchIdx > -1 && !lines.some(l => l.includes("case 'Entrenamientos': return <EntrenamientosModule"))) {
    lines.splice(switchIdx + 1, 0, "      case 'Entrenamientos': return <EntrenamientosModule API_URL={API_URL} />;");
}

// 4. Add SidebarItem
const planesSidebarIdx = lines.findIndex(l => l.includes('label="Planes"'));
if (planesSidebarIdx > -1 && !lines.some(l => l.includes('label="Entrenamientos"'))) {
    lines.splice(planesSidebarIdx + 1, 0, "          <SidebarItem icon={<Activity size={14} />} label=\"Entrenamientos\" active={activeTab === 'Entrenamientos'} onClick={() => setActiveTab('Entrenamientos')} />");
}

fs.writeFileSync('frontend/src/AdminDashboard.tsx', lines.join('\n'));
console.log('Modified AdminDashboard.tsx successfully');

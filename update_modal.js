const fs = require('fs');
let content = fs.readFileSync('frontend/src/AdminDashboard.tsx', 'utf8');

// 1. Add import
if (!content.includes('import MemberModal')) {
    content = content.replace('import EntrenamientosModule', 'import MemberModal from "./components/MemberModal";\nimport EntrenamientosModule');
}

// 2. Replace the modal code
const modalStart = "{modalType === 'member' && (";
const modalEnd = "                )}";
const startIdx = content.indexOf(modalStart);
if (startIdx > -1) {
    const nextEndIdx = content.indexOf(modalEnd, startIdx);
    const endIdx = nextEndIdx + modalEnd.length;
    
    // Check to ensure we are replacing the right block and it's not already replaced
    const block = content.slice(startIdx, endIdx);
    if (block.includes("input type=\"email\"") && !block.includes("<MemberModal")) {
        const replacement = `{modalType === 'member' && (
                  <MemberModal 
                    member={selectedItem} 
                    plans={plans} 
                    API_URL={API_URL} 
                    onSave={handleSaveMember} 
                    onClose={() => setIsModalOpen(false)} 
                  />
                )}`;
        content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
        console.log('Modal replaced successfully.');
    } else {
        console.log('Modal block not found or already replaced.');
    }
}

// 3. One more thing: The handleSaveMember in AdminDashboard needs to be updated to accept the formData from the modal
content = content.replace("const handleSaveMember = async () => {", "const handleSaveMember = async (formData = selectedItem) => {");
// and replace references of selectedItem inside handleSaveMember to formData
// Wait, a simpler way is to just let the modal update selectedItem via onChange, OR
// let the handleSaveMember accept an argument.
const saveStart = "const handleSaveMember = async (formData = selectedItem) => {";
const saveEnd = "setIsModalOpen(false);";
const s1 = content.indexOf(saveStart);
if (s1 > -1) {
    let saveBlock = content.slice(s1, content.indexOf(saveEnd, s1) + saveEnd.length);
    saveBlock = saveBlock.replace(/selectedItem/g, 'formData');
    content = content.slice(0, s1) + saveBlock + content.slice(s1 + saveBlock.length);
}


fs.writeFileSync('frontend/src/AdminDashboard.tsx', content);

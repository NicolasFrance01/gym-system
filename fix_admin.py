import re

with open("frontend/src/AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Remove SystemNoticeModal from AgendaModule
    if "<SystemNoticeModal announcement={systemAnnouncement} />" in line and i < 1100:
        i += 1
        continue
        
    # Fix await fetch inside useEffect
    if "const annRes = await fetch(`${API_URL}/admin/configs/system_announcement`);" in line:
        out.append("      fetch(`${API_URL}/admin/configs/system_announcement`).then(async (annRes) => {\n")
        out.append("        if (annRes.ok) {\n")
        out.append("          const annData = await annRes.json();\n")
        out.append("          setSystemAnnouncement(annData.value);\n")
        out.append("        }\n")
        out.append("      });\n")
        i += 5 # skip the old 5 lines
        continue
        
    # Inject SystemModule case
    if "case 'Staff': return (userRole ===" in line:
        out.append(line)
        out.append("      case 'Sistema': return loggedUser?.id === 0 ? <SystemModule API_URL={API_URL} licenseInfo={licenseInfo} onRenewLicense={() => {}} /> : null;\n")
        i += 1
        continue
        
    # Inject SystemNoticeModal at the end of the file
    if "export default AdminDashboard;" in line:
        # Find the last closing tag before this line
        # We will inject it manually here
        pass
        
    out.append(line)
    i += 1

content = "".join(out)

# Inject SystemNoticeModal at the end of the return statement of AdminDashboard
pattern = re.compile(r"      \{/\* Custom confirm modal overlay \*/\}\n      \{confirmModal\.isOpen && \(\n", re.DOTALL)
if "<SystemNoticeModal announcement={systemAnnouncement} />" not in content[1500:]:
    content = content.replace("      {/* Custom confirm modal overlay */}\n      {confirmModal.isOpen && (\n", "      <SystemNoticeModal announcement={systemAnnouncement} />\n      {/* Custom confirm modal overlay */}\n      {confirmModal.isOpen && (\n")


with open("frontend/src/AdminDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

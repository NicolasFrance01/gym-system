import re

with open("frontend/src/AdminDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
import_insert = """import SystemNoticeModal from './components/SystemNoticeModal';
import SystemModule from './components/SystemModule';
"""
if "import SystemNoticeModal" not in content:
    content = content.replace("import MemberModal", import_insert + "import MemberModal")

# 2. Add state
state_insert = """  const [systemAnnouncement, setSystemAnnouncement] = useState<any>(null);
"""
if "const [systemAnnouncement, setSystemAnnouncement]" not in content:
    content = content.replace("  const [licenseInfo, setLicenseInfo] = useState", state_insert + "  const [licenseInfo, setLicenseInfo] = useState")


# 3. Add fetch to refreshData
fetch_insert = """      // Fetch announcement
      const annRes = await fetch(`${API_URL}/admin/configs/system_announcement`);
      if (annRes.ok) {
        const annData = await annRes.json();
        setSystemAnnouncement(annData.value);
      }
"""
if "const annRes = await fetch" not in content:
    content = content.replace("fetchLicenseStatus();", "fetchLicenseStatus();\n" + fetch_insert)


# 4. Modify renderLicenseBanner
# Wait, let's just append the yellow text to all cases if systemAnnouncement.active is true
banner_mod = """    const renderLicenseBanner = (size: 'login' | 'sidebar' | 'header') => {
    if (!licenseInfo) return null;
    const { status } = licenseInfo;

    let bgClass = "bg-green-50 dark:bg-green-950/40 border border-green-300 dark:border-green-700/60 text-green-700 dark:text-green-400";
    let badgeClass = "text-green-600 dark:text-green-300 font-bold";
    let Icon = CheckCircle;

    if (status === 'POR VENCER') {
      bgClass = "bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-400";
      badgeClass = "text-amber-600 dark:text-amber-300 font-bold";
      Icon = AlertTriangle;
    } else if (status === 'VENCIDA') {
      bgClass = "bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-700/60 text-red-700 dark:text-red-400";
      badgeClass = "text-red-600 dark:text-red-300 font-bold";
      Icon = XCircle;
    }

    const isMaster = loggedUser?.id === 0;

    const handleRenew = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      showConfirm(
        "Confirmar Renovación",
        "¿Desea marcar la licencia como AL DIA para el mes en curso?",
        async () => {
          try {
            const res = await fetch(`${API_URL}/admin/license-status`, {
              method: 'POST'
            });
            if (res.ok) {
              const data = await res.json();
              setLicenseInfo(data);
            } else {
              alert("Error al renovar la licencia");
            }
          } catch (err) {
            console.error("Error updating license status:", err);
          }
        }
      );
    };

    const extraNotice = systemAnnouncement?.active ? (
      <div className="mt-2 pt-2 border-t border-amber-500/20">
        <p className="text-[7px] font-black uppercase text-amber-600 dark:text-amber-400 leading-snug">
          Actualización del sistema · {systemAnnouncement.version_from} → {systemAnnouncement.version_to} · {systemAnnouncement.date_start}–{systemAnnouncement.date_end}
        </p>
        <p className="text-[6.5px] font-bold text-amber-600/80 dark:text-amber-400/80 mt-0.5">
          Disponible {systemAnnouncement.version_to} productiva el {systemAnnouncement.date_productive}
        </p>
      </div>
    ) : null;

    if (size === 'login') {
      return (
        <div className={`flex flex-col p-3 border rounded-xl animate-in fade-in duration-500 ${bgClass}`}>
          <div className="flex items-start gap-2">
            <Icon size={14} className="flex-shrink-0 mt-0.5" />
            <p className="text-[8px] font-black uppercase leading-relaxed">
              Suscripción de Licencia en Atlascore <span className={badgeClass}>{status}</span>
            </p>
          </div>
          {extraNotice}
        </div>
      );
    }

    if (size === 'sidebar') {
      return (
        <div className={`flex flex-col gap-1.5 p-2 border rounded-xl mt-1 ${bgClass}`}>
          <div className="flex items-start gap-1.5">
            <Icon size={10} className="flex-shrink-0 mt-0.5" />
            <p className="text-[7px] font-black uppercase leading-snug">
              Licencia en Atlascore <span className={badgeClass}>{status}</span>
            </p>
          </div>
          {isMaster && status !== 'AL DIA' && (
            <button
              onClick={handleRenew}
              className="mt-1 w-full py-1 bg-orange-500 hover:bg-orange-600 text-black dark:text-white font-black text-[7px] uppercase tracking-wider rounded transition-colors"
            >
              Marcar AL DIA
            </button>
          )}
          {extraNotice}
        </div>
      );
    }

    // header banner
    return (
      <div className={`flex flex-col px-3 py-2 border rounded-xl flex-1 max-w-xs animate-in fade-in duration-700 ${bgClass}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon size={12} className="flex-shrink-0" />
            <p className="text-[7px] font-black uppercase leading-snug">
              Suscripción de Licencia en Atlascore <span className={badgeClass}>{status}</span>
            </p>
          </div>
          {isMaster && status !== 'AL DIA' && (
            <button
              onClick={handleRenew}
              className="px-2 py-0.5 bg-orange-500 hover:bg-orange-600 text-black dark:text-white font-black text-[7px] uppercase tracking-wider rounded transition-colors whitespace-nowrap"
            >
              Marcar AL DIA
            </button>
          )}
        </div>
        {extraNotice}
      </div>
    );
  };"""

# Replace the whole renderLicenseBanner function
pattern = re.compile(r"    const renderLicenseBanner = \(size: 'login' \| 'sidebar' \| 'header'\) => \{.*?    \};\n", re.DOTALL)
if "const extraNotice =" not in content:
    content = pattern.sub(banner_mod + "\n", content)


# 5. Add SidebarItem for Sistema
sidebar_mod = """              </>
            )}
            
            {loggedUser?.id === 0 && (
              <SidebarItem icon={<Settings size={14} />} label="Sistema" active={activeTab === 'Sistema'} onClick={() => setActiveTab('Sistema')} />
            )}
          </nav>"""
if "label=\"Sistema\"" not in content:
    content = content.replace("              </>\n            )}\n          </nav>", sidebar_mod)


# 6. Add render case for Sistema
render_mod = """      case 'Staff': return (userRole === 'gerente' || userRole === 'administracion') ? <StaffModule staff={staff} onEdit={(s: any) => { setSelectedItem({...s}); setIsEditMode(true); setModalType('staff'); setIsModalOpen(true); }} onDelete={(id: any) => { showConfirm("¿Eliminar empleado?", "¿Estás seguro de que deseas eliminar este empleado?", async () => { const res = await fetch(`${API_URL}/admin/staff/${id}`, {method:'DELETE'}); if(res.ok) refreshData(); }); }} onAddClick={() => { setSelectedItem({name:'', role:'Entrenador', status:'ACTIVO', shift:'Mañana'}); setIsEditMode(false); setModalType('staff'); setIsModalOpen(true); }} /> : null;
      case 'Sistema': return loggedUser?.id === 0 ? <SystemModule API_URL={API_URL} licenseInfo={licenseInfo} onRenewLicense={() => {}} /> : null;
"""
# Replace the staff line and append the Sistema line
staff_pattern = re.compile(r"      case 'Staff': return \(userRole === 'gerente' \|\| userRole === 'administracion'\) \? <StaffModule.*?\/> : null;")
if "case 'Sistema':" not in content:
    match = staff_pattern.search(content)
    if match:
        content = content[:match.start()] + render_mod + content[match.end():]


# 7. Add SystemNoticeModal
modal_mod = """      <SystemNoticeModal announcement={systemAnnouncement} />
      
      {/* Custom confirm modal overlay */}"""
if "<SystemNoticeModal" not in content:
    content = content.replace("      {/* Custom confirm modal overlay", modal_mod)

with open("frontend/src/AdminDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

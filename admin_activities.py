import re

def modify_admin_dashboard():
    with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add states
    state_injection = """
  const [dbActivities, setDbActivities] = useState<any[]>([]);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);
  const [isMassClassModalOpen, setIsMassClassModalOpen] = useState(false);
  const [massClassData, setMassClassData] = useState({
    days: [] as number[],
    start_hour: 7,
    end_hour: 23,
    interval_hours: 1,
    capacity: 20,
    activity_name: 'Entrenamiento Funcional'
  });
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [newActivityData, setNewActivityData] = useState({ name: '', code: '', color: '#ffffff' });
"""
    if "const [dbActivities" not in content:
        content = content.replace('  const [isEditingClass, setIsEditingClass] = useState(false);', '  const [isEditingClass, setIsEditingClass] = useState(false);\n' + state_injection)
        
    # 2. Fetch activities
    fetch_func = """
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/activities`);
      if (res.ok) {
        const data = await res.json();
        setDbActivities(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
"""
    if "const fetchActivities" not in content:
        # inject before fetchDashboard
        content = content.replace('  const fetchDashboard = async () => {', fetch_func + '\n  const fetchDashboard = async () => {')
        
    # inject fetchActivities into useEffect
    if "fetchActivities();" not in content:
        content = content.replace('fetchDashboard();', 'fetchDashboard();\n    fetchActivities();')

    # 3. Modify defaultActivities handling
    # Let's combine dbActivities and defaultActivities (if default is not in db)
    # Actually, we can just use an array that merges them, but we want to display `dbActivities` if it has elements, else default.
    # We will compute `allActivities`:
    all_activities_logic = """
  const allActivities = dbActivities.length > 0 ? dbActivities : defaultActivities;
"""
    if "const allActivities" not in content:
        content = content.replace('const defaultActivities = [', all_activities_logic + '\n  const defaultActivities = [')

    with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

modify_admin_dashboard()

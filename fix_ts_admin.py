import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove duplicate newActivityData
content = re.sub(r'  const \[isAddingNewActivity, setIsAddingNewActivity\] = useState\(false\);\n  const \[newActivityData, setNewActivityData\] = useState\(\{ name: \'\', code: \'\', color: \'#3b82f6\' \}\);\n', '', content)

# 2. Remove duplicate activities state
activities_state = """  const [activities, setActivities] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('gym_activities');
      return stored ? JSON.parse(stored) : defaultActivities;
    } catch {
      return defaultActivities;
    }
  });"""
content = content.replace(activities_state, '')

# 3. Move defaultActivities above allActivities
def_activities = """  const defaultActivities = [
    { name: 'Entrenamiento Funcional', code: 'EF', color: '#3b82f6' },
    { name: 'Pilates en Suelo', code: 'PS', color: '#f97316' },
    { name: 'Entrenamiento Personalizado', code: 'EP', color: '#ec4899' },
    { name: 'Salsa y Bachata', code: 'SB', color: '#eab308' },
    { name: 'Zumba', code: 'ZB', color: '#ef4444' },
    { name: 'Reguetón Juvenil', code: 'RJ', color: '#06b6d4' }
  ];"""
content = content.replace(def_activities, '')
content = content.replace('  const allActivities = dbActivities.length > 0 ? dbActivities : defaultActivities;', def_activities + '\n  const allActivities = dbActivities.length > 0 ? dbActivities : defaultActivities;')

# 4. Remove setDbActivities unused warning by ensuring it's used if it wasn't.
# Wait, setDbActivities is used in fetchActivities. Is fetchActivities missing?
# The error said: "Cannot find name 'fetchActivities'." and "Cannot find name 'fetchDashboard'."
# Let's fix that.
if "const fetchActivities =" not in content:
    # Maybe my previous script failed to inject fetchActivities?
    # Let's check where fetchDashboard is.
    fetch_funcs = """  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentCheckins(data.recent_checkins);
        setPayments(data.recent_payments);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
  };"""
    content = content.replace('  const fetchDashboard = async () => {', fetch_funcs + '\n  const fetchDashboard = async () => {')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

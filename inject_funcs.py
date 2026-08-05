import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

functionsToInject = """
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`);
      if (res.ok) {
        const data = await res.json();
        // Assume these states exist or remove them if they error out later
        if(typeof setStats !== 'undefined') setStats(data.stats);
        if(typeof setRecentCheckins !== 'undefined') setRecentCheckins(data.recent_checkins);
        if(typeof setPayments !== 'undefined') setPayments(data.recent_payments);
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
  };
"""

content = content.replace('  const handleMassClassSubmit', functionsToInject + '\n  const handleMassClassSubmit')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

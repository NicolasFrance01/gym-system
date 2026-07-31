import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded evolution in useState
old_evolution_state = """    evolution: [
      { date: "Ene", "Press de Banca": 40, "Sentadillas": 60, "Jalón al Pecho": 35 },
      { date: "Feb", "Press de Banca": 45, "Sentadillas": 70, "Jalón al Pecho": 45 },
      { date: "Mar", "Press de Banca": 55, "Sentadillas": 85, "Jalón al Pecho": 50 },
      { date: "Abr", "Press de Banca": 60, "Sentadillas": 95, "Jalón al Pecho": 55 }
    ],"""
new_evolution_state = """    evolution: [],"""
content = content.replace(old_evolution_state, new_evolution_state)

# Replace fetchUser call to also fetch progress
old_fetch = """        fetchUserBookings(data.member.dni);
        fetchHolidays();
      } else {"""
new_fetch = """        fetchUserBookings(data.member.dni);
        fetchHolidays();
        fetchUserProgress(data.member.dni);
      } else {"""
if "fetchUserProgress(" not in content:
    content = content.replace(old_fetch, new_fetch)

# Add fetchUserProgress function
fetch_progress_func = """
  const fetchUserProgress = async (dni: string) => {
    try {
      const res = await fetch(`${API_URL}/user/${dni}/progress`);
      if (res.ok) {
        const data = await res.json();
        setUserData(prev => ({ ...prev, evolution: data.chart_data || [] }));
      }
    } catch (e) {
      console.error("Error fetching progress", e);
    }
  };
"""
if "fetchUserProgress = async" not in content:
    idx = content.find("const fetchUserBookings =")
    content = content[:idx] + fetch_progress_func + content[idx:]

# Replace import line to include ProgressChart
import_idx = content.find("import {")
if "ProgressChart" not in content:
    content = content[:import_idx] + "import ProgressChart from './components/ProgressChart';\n" + content[import_idx:]

# Replace the hardcoded LineChart with ProgressChart
old_chart = """                   <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={userData.evolution}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                           <XAxis dataKey="date" stroke="#666" fontSize={8} />
                           <YAxis stroke="#666" fontSize={8} />
                           <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'20px', padding:'10px'}} />
                           <Legend wrapperStyle={{fontSize:'8px', textTransform:'uppercase', fontWeight:'900', marginTop:'10px'}} />
                           <Line type="monotone" dataKey="Press de Banca" stroke="#3b82f6" strokeWidth={3} dot={{r:4, fill:'#3b82f6'}} activeDot={{r:8}} />
                           <Line type="monotone" dataKey="Sentadillas" stroke="#10b981" strokeWidth={3} dot={{r:4, fill:'#10b981'}} />
                           <Line type="monotone" dataKey="Jalón al Pecho" stroke="#f59e0b" strokeWidth={3} dot={{r:4, fill:'#f59e0b'}} />
                       </LineChart>
                   </ResponsiveContainer>"""
new_chart = """                   <ProgressChart data={userData.evolution} />"""
content = content.replace(old_chart, new_chart)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

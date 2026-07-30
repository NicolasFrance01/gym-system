import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert the fetch after setIsAuthenticated(true);
fetch_code = """        setIsAuthenticated(true);
        // Fetch global exercises
        try {
          const exRes = await fetch(`${API_URL}/admin/exercises`);
          if (exRes.ok) {
            setGlobalExercises(await exRes.json());
          }
        } catch (e) { console.error("Error fetching exercises", e); }"""

content = content.replace("        setIsAuthenticated(true);", fetch_code)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix fetchDashboard and fetchActivities not being found
# The problem is that fetchDashboard is defined inside handleLogin maybe? Or inside the component but my replace put it somewhere else.
# Let's completely remove my previous fetch injection and re-inject it properly.
# Actually I'll use regex to find and replace everything that uses `activities` or `isAddingNewActivity`.

# 2. Fix old handleAddNewActivity
old_handle_add = """  const handleAddNewActivity = () => {
    if (!newActivityData.name || !newActivityData.code) {
      alert("Por favor completa el nombre y código de la actividad.");
      return;
    }
    const codeUpper = newActivityData.code.substring(0, 2).toUpperCase();
    const updated = [...activities, { name: newActivityData.name, code: codeUpper, color: newActivityData.color }];
    setActivities(updated);
    localStorage.setItem('gym_activities', JSON.stringify(updated));
    setNewActivityData({ name: '', code: '', color: '#3b82f6' });
    setIsAddingNewActivity(false);
  };"""
content = content.replace(old_handle_add, "")

# 3. Fix lines 783-807 which are probably the old UI for adding activities
# Look for `{isAddingNewActivity` or `activities.map(` at the end of the file? No, wait! There was another place where activities were listed?
# Let's remove the block containing `isAddingNewActivity` in the UI.
content = re.sub(r'\{isAddingNewActivity \? \(.*?\) : \(\s*<button onClick=\{\(\) => setIsAddingNewActivity\(true\)\}.*?</button>\s*\)\}', '', content, flags=re.DOTALL)
content = re.sub(r'<div className="mt-8">.*?<h4 className="text-\[10px\].*?Actividades Personalizadas.*?</div>\s*</div>', '', content, flags=re.DOTALL)
# Actually, it's safer to just remove all occurrences of `activities.map` that use `isAddingNewActivity`
content = re.sub(r'\{activities\.map\(\(act, i\) => \(.*?\)\)\}', '', content, flags=re.DOTALL)

# 4. Fix fetchActivities and fetchDashboard scoping issue.
# The error says "Cannot find name 'fetchDashboard'" on line 282. This means fetchDashboard is defined AFTER line 282. 
# Javascript hoisting works for function declarations `function fetchDashboard()`, but not for arrow functions `const fetchDashboard = async () =>`.
content = content.replace('const fetchDashboard = async () => {', 'async function fetchDashboard() {')
content = content.replace('const fetchActivities = async () => {', 'async function fetchActivities() {')

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

# 1. Fix UserApp.tsx states
with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    user_content = f.read()

# I need to find where to put the states. Let's just put them right after API_URL definition.
api_url_block = """  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:8000" 
    : "/api";"""

new_states_block = """  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:8000" 
    : "/api";

  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [uncompletedExercises, setUncompletedExercises] = useState<any[]>([]);
  const [checklistResponses, setChecklistResponses] = useState<any>({});
"""

if "const [showChecklistModal" not in user_content:
    user_content = user_content.replace(api_url_block, new_states_block)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(user_content)

# 2. Fix MemberModal.tsx import
with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    modal_content = f.read()

import_block = "import { X, Save } from 'lucide-react';"
new_import = "import { X, Save } from 'lucide-react';\nimport ProgressChart from './ProgressChart';"

if "ProgressChart from" not in modal_content:
    modal_content = modal_content.replace(import_block, new_import)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_content)


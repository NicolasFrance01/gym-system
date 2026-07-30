import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the states
state_injection = """  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  const [globalExercises, setGlobalExercises] = useState<any[]>([]);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<any | null>(null);
  const [isExerciseInfoOpen, setIsExerciseInfoOpen] = useState(false);"""
content = content.replace("  const [selectedClassIndex, setSelectedClassIndex] = useState(0);", state_injection)

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

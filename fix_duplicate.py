with open('frontend/src/components/MemberModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "const [selectedSegment, setSelectedSegment] = useState<string>('Todos');" in line:
        if any("const [selectedSegment" in l for l in new_lines):
            skip = True
    
    if skip:
        if "}, [selectedSegment]);" in line:
            skip = False
        continue
        
    new_lines.append(line)

with open('frontend/src/components/MemberModal.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

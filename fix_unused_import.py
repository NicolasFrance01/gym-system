import re

with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';", "")

with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

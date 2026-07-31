import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: any[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-gray-400 dark:text-white/40 italic text-sm">Aún no hay datos históricos registrados.</p>
        <p className="text-gray-400 dark:text-white/40 italic text-xs mt-2">Comienza a registrar tus entrenamientos para ver tu progreso aquí.</p>
      </div>
    );
  }

  // Extract unique exercise names from data (excluding 'date')
  const exercises = new Set<string>();
  data.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== 'date') exercises.add(key);
    });
  });

  const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#eab308"];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#ffffff50', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fill: '#ffffff50', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#141b29', borderColor: '#ffffff20', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#ffffff50', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          
          {Array.from(exercises).map((ex, index) => (
            <Line 
              key={ex}
              type="monotone" 
              dataKey={ex} 
              stroke={colors[index % colors.length]} 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PFC } from '../types';

interface PfcChartProps {
  data: PFC;
}

const PfcChart: React.FC<PfcChartProps> = ({ data }) => {
  const chartData = [
    { name: 'タンパク質', value: data.protein },
    { name: '脂質', value: data.fat },
    { name: '炭水化物', value: data.carbs },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}g`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PfcChart;

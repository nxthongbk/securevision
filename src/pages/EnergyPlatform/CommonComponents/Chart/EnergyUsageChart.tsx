import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 24 }, (_, i) => ({
  hour: i.toString().padStart(2, '0'),
  value: Math.floor(Math.random() * 10) + 1,
}));

export const EnergyUsageChart = () => (
  <div className=" text-white w-full h-64">
    <ResponsiveContainer width="100%" height="80%">
      <BarChart data={data}>
        <XAxis dataKey="hour" tick={{ fill: '#fff' }} />
        <YAxis tick={{ fill: '#fff' }} />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

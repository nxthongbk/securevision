import React from 'react';

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg?: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, bg = 'bg-white/10' }) => (
  <div className="flex items-center gap-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 min-h-[110px]">
    <div className={`p-3 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
    <div>
      <div className="text-white font-bold text-2xl">{value}</div>
      <div className="text-white/80 text-sm">{label}</div>
    </div>
  </div>
);

export default StatCard;

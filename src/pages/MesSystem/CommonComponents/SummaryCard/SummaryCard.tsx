import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, colorClass }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-2xl font-bold text-gray-900 ${colorClass || ''}`}>{value}</p>
      </div>
    </div>
  </div>
);

export default SummaryCard;

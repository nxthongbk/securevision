import React from 'react';

interface AnalyticStatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subLabel: string;
  trend?: {
    value: string;
    color: string;
    icon: React.ReactNode;
  };
}

const AnalyticStatCard: React.FC<AnalyticStatCardProps> = ({
  icon,
  value,
  label,
  subLabel,
  trend,
}) => (
  <div className="bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col h-[182px] backdrop-blur-md hover:bg-white/15 min-h-[170px] transition-all duration-200 hover:scale-[1.03] hover:shadow-xl ">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/10 rounded-lg text-emerald-400 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 font-semibold text-sm ${trend.color}`}>
          {trend.icon}
          {trend.value}
        </div>
      )}
    </div>
    <div className="text-xl font-bold text-white/90 space-y-1">{value}</div>
    <div className="text-white/80 font-semibold text-sm mb-1">{label}</div>
    <div className="text-white/70 text-xs">{subLabel}</div>
  </div>
);

export default AnalyticStatCard;

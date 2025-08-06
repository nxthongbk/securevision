import { ChartLineDown, ChartLineUp } from '@phosphor-icons/react';

const iconBgMap: Record<string, string> = {
  'Current Usage': 'bg-blue-500/10',
  'Monthly Cost': 'bg-emerald-500/10',
  'Efficiency Score': 'bg-emerald-500/10',
  'CO₂ Saved': 'bg-emerald-500/10',
};

type Props = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeColor?: string;
};

export const SummaryCard = ({ title, value, change, icon, changeColor }: Props) => {
  const isPositive = change.trim().startsWith('+');
  const isNegative = change.trim().startsWith('-');
  const iconBg = iconBgMap[title] || 'bg-white/10';

  return (
    <div className="p-6 rounded-xl text-white w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 min-h-[170px] transition-all duration-200 hover:scale-[1.03] hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconBg}  p-3 rounded-lg`}>{icon}</div>
        <span className={`${changeColor} text-sm font-semibold flex items-center relative pb-1`}>
          {isPositive && <ChartLineUp className="w-5 h-5 mr-1 text-green-400" />}
          {isNegative && <ChartLineDown className="w-5 h-5 mr-1 text-red-400" />}
          {change}
        </span>
      </div>
      <h2 className="text-2xl font-bold mt-4 mb-1 break-words flex items-center gap-2">{value}</h2>
      <p className="text-white/80 font-medium text-sm break-words">{title}</p>
    </div>
  );
};

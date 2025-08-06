import {
  CurrencyDollar,
  ChartLineUp,
  CalendarBlank,
  BatteryFull,
  ChartPieSlice,
  WarningCircle,
} from '@phosphor-icons/react';
import StatCard from '../CommonComponents/Card/StatCard';
import { useMemo } from 'react';

const costStats = [
  {
    icon: <CurrencyDollar size={28} className="text-emerald-400" />,
    value: '$284.50',
    label: 'Current Bill',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <ChartLineUp size={28} className="text-blue-400" />,
    value: '$325.80',
    label: 'Projected Total',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <BatteryFull size={28} className="text-violet-400" />,
    value: '1247',
    label: 'kWh Used',
    bg: 'bg-violet-500/10',
  },
  {
    icon: <CalendarBlank size={28} className="text-orange-400" />,
    value: '12',
    label: 'Days Left',
    bg: 'bg-orange-500/10',
  },
];

const lastMonth = 312.45;
const projectedMonth = 325.8;
const difference = projectedMonth - lastMonth;
const differencePercent = ((difference / lastMonth) * 100).toFixed(1);
const isNegative = difference < 0;

const rateInfo = [
  { label: 'Peak Rate (4-9 PM)', value: '$0.18/kWh' },
  { label: 'Off-Peak Rate', value: '$0.08/kWh' },
  { label: 'Average Rate', value: '$0.12/kWh' },
];

const monthlyHistory = [
  { month: 'Jan', value: 298 },
  { month: 'Feb', value: 287 },
  { month: 'Mar', value: 302 },
  { month: 'Apr', value: 276 },
  { month: 'May', value: 312 },
  { month: 'Jun', value: 285 },
];

const costBreakDownValues = [
  { label: 'HVAC', value: 127.8, color: 'bg-red-500' },
  { label: 'Water Heatering', value: 51.21, color: 'bg-orange-400' },
  { label: 'Lighting', value: 34.14, color: 'bg-yellow-400' },
  { label: 'Refrigerator', value: 28.45, color: 'bg-green-400' },
  { label: 'Electronics', value: 25.65, color: 'bg-blue-400' },
  { label: 'Other', value: 17.25, color: 'bg-purple-400' },
];

const alerts = [
  {
    icon: (
      <span className="flex items-center justify-center rounded-full bg-yellow-400/20 w-8 h-8">
        <WarningCircle size={22} className="text-yellow-400" />
      </span>
    ),
    title: 'High Usage Alert',
    description: 'Your usage is 15% higher than usual this week',
  },
  {
    icon: (
      <span className="flex items-center justify-center rounded-full bg-blue-400/20 w-8 h-8">
        <ChartLineUp size={22} className="text-blue-400" />
      </span>
    ),
    title: 'Peak Hours',
    description: 'Peak rate hours start in 2 hours (4-9 PM)',
  },
];

export default function CostsPage() {
  const diffDisplay = useMemo(() => {
    const absDiff = Math.abs(difference).toFixed(2);
    const sign = difference > 0 ? '+' : difference < 0 ? '-' : '';
    return `${sign}$${absDiff}`;
  }, [difference]);

  const diffPercentDisplay = useMemo(() => {
    const sign = difference > 0 ? '-' : difference < 0 ? '+' : '';
    return `${sign}${Math.abs(Number(differencePercent)).toFixed(1)}%`;
  }, [differencePercent, difference]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col miniLaptop:flex-row miniLaptop:items-center miniLaptop:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cost Tracker</h1>
          <p className="text-gray-300">Monitor your energy costs and billing information</p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarBlank size={22} className="text-white/70" />
          <select
            className="bg-white/10 backdrop-blur-md border text-md border-white/20 rounded-lg px-4 py-2 text-white/90 focus:outline-none"
            style={{
              colorScheme: 'dark',
            }}
          >
            <option className="bg-[#344f8f] text-white text-md">Current Period</option>
            <option className="bg-[#344f8f] text-white text-md">Last Period</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 miniLaptop:grid-cols-4 gap-6">
        {costStats.map(stat => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            bg={stat.bg}
          />
        ))}
      </div>

      <div className="bg-white/10 border backdrop-blur-md border-white/20 rounded-xl p-8 mt-4">
        <div className="flex flex-col miniLaptop:flex-row miniLaptop:items-center miniLaptop:justify-between mb-4">
          <span className="text-white font-bold text-lg mb-4 miniLaptop:mb-0">
            Savings Comparison
          </span>
          <span
            className={`flex items-center gap-2 font-semibold text-lg ${isNegative ? 'text-emerald-400' : 'text-red-400'}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isNegative ? (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 7-7 7 7" />
                  <path d="M12 19V5"></path>
                </>
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 7-7 7 7" />
                  <path d="M12 19V5"></path>
                </>
              )}
            </svg>
            {`${Math.abs(difference).toFixed(2)} (${diffPercentDisplay})`}
          </span>
        </div>
        <div className="flex flex-col miniLaptop:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-md">Last Month</span>
              <span className="text-white font-semibold text-md">${lastMonth.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-md">Projected This Month</span>
              <span className="text-white font-semibold text-md">${projectedMonth.toFixed(2)}</span>
            </div>
            <hr className="border-white/20" />
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-md">Difference</span>
              <span
                className={`${isNegative ? 'text-emerald-400' : 'text-red-400'} font-semibold text-md`}
              >
                {diffDisplay}
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-3 miniLaptop:pl-8 ">
            <div className="text-white font-semibold text-md">Rate Information</div>
            {rateInfo.map(rate => (
              <div className="flex justify-between items-center" key={rate.label}>
                <span className="text-white/80 text-sm">{rate.label}</span>
                <span className="text-white/90 font-medium">{rate.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 miniLaptop:grid-cols-2 gap-8">
        <div className="bg-white/10 border backdrop-blur-md border-white/20 rounded-xl p-6">
          <div className="text-white font-semibold text-lg mb-4">Monthly History</div>
          <div className="flex items-end gap-4 h-60 w-full">
            {monthlyHistory.map((d, idx) => {
              const max = Math.max(...monthlyHistory.map(m => m.value));
              const isCurrent = idx === monthlyHistory.length - 1;
              return (
                <div key={d.month} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-16 rounded-t-sm ${
                      isCurrent ? 'bg-emerald-400' : 'bg-gradient-to-b from-blue-400 to-blue-500'
                    } transition-all duration-300`}
                    style={{
                      height: `${(d.value / max) * 120}px`,
                      minHeight: '20px',
                    }}
                  ></div>
                  <div className="mt-4 text-white/80 text-sm">{d.month}</div>
                  <div className="text-white text-md">${d.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartPieSlice size={22} className="text-emerald-400" />
            <span className="text-white font-semibold text-lg">Cost Breakdown</span>
          </div>
          <div className="space-y-4">
            {costBreakDownValues.map(d => {
              // Use $300 as the 100% reference
              const maxReference = 300;
              const widthPercent = ((d.value / maxReference) * 100).toFixed(1) + '%';
              return (
                <div key={d.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{d.label}</span>
                    <span className="text-gray-300 text-sm">${d.value}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/20">
                    <div
                      className={`h-2.5 rounded-full ${d.color}`}
                      style={{ width: widthPercent }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
        <div className="text-lg font-semibold text-white mb-4">Alerts & Notifications</div>
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
              {alert.icon}
              <div>
                <div className="text-white font-medium text-sm">{alert.title}</div>
                <div className="text-gray-300 text-sm">{alert.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

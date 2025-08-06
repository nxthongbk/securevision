import {
  ChartBar,
  CalendarBlank,
  ArrowUpRight,
  ArrowDownRight,
  Pulse,
  ChartPieSlice,
} from '@phosphor-icons/react';
import AnalyticStatCard from './AnalyticStatCard';
import EnergyTrendsCard from './EnergyTrendCard';

const weeklyUsage = [
  { day: 'Mon', value: 25.2 },
  { day: 'Tue', value: 22.8 },
  { day: 'Wed', value: 28.1 },
  { day: 'Thu', value: 31.5 },
  { day: 'Fri', value: 29.8 },
  { day: 'Sat', value: 35.2 },
  { day: 'Sun', value: 27.4 },
];

const deviceDistribution = [
  { label: 'HVAC System', percent: 45, color: 'bg-red-500' },
  { label: 'Water Heater', percent: 18, color: 'bg-orange-400' },
  { label: 'Lighting', percent: 12, color: 'bg-yellow-400' },
  { label: 'Refrigerator', percent: 8, color: 'bg-green-400' },
  { label: 'Electronics', percent: 10, color: 'bg-blue-400' },
  { label: 'Other', percent: 7, color: 'bg-purple-400' },
];

export default function AnalyticPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-300">Detailed insights into your energy consumption</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarBlank size={22} className="text-white/70" />
          <select
            className="bg-white/10 backdrop-blur-md border text-md border-white/20 rounded-lg px-4 py-2 text-white/90 focus:outline-none"
            style={{
              colorScheme: 'dark',
            }}
          >
            <option className="bg-[#344f8f] text-white text-md">Today</option>
            <option className="bg-[#344f8f] text-white text-md">This Week</option>
            <option className="bg-[#344f8f] text-white text-md">This Month</option>
            <option className="bg-[#344f8f] text-white text-md">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 miniLaptop:grid-cols-4 gap-6">
        <AnalyticStatCard
          icon={<Pulse size={28} />}
          value="7-9 PM"
          label="Peak Usage Hours"
          subLabel="Highest energy consumption period"
          trend={{
            value: '+15%',
            color: 'text-emerald-400',
            icon: <ArrowUpRight size={16} />,
          }}
        />
        <AnalyticStatCard
          icon={<Pulse size={28} />}
          value="Tuesday"
          label="Most Efficient Day"
          subLabel="Best energy efficiency this week"
          trend={{
            value: '+8%',
            color: 'text-emerald-400',
            icon: <ArrowUpRight size={16} />,
          }}
        />
        <AnalyticStatCard
          icon={<Pulse size={28} />}
          value="28.5 kWh"
          label="Average Daily Usage"
          subLabel="Compared to last week"
          trend={{
            value: '-3%',
            color: 'text-red-400',
            icon: <ArrowDownRight size={16} />,
          }}
        />
        <AnalyticStatCard
          icon={<Pulse size={28} />}
          value="$0.12"
          label="Cost per kWh"
          subLabel="Current electricity rate"
          trend={{
            value: '+2%',
            color: 'text-emerald-400',
            icon: <ArrowUpRight size={16} />,
          }}
        />
      </div>

      <div className="grid grid-cols-1 miniLaptop:grid-cols-2 gap-8">
        <div className="bg-white/10 border backdrop-blur-md border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartBar size={22} className="text-emerald-400" />
            <div className="text-white font-semibold text-lg">Weekly Usage</div>
          </div>
          <div className="flex items-end gap-4 h-52 w-full">
            {weeklyUsage.map(d => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <div
                  className="w-16 rounded-t-sm bg-gradient-to-b from-emerald-400 to-emerald-500"
                  style={{ height: `${d.value * 3}px` }}
                ></div>
                <div className="mt-2 text-white/80 text-sm">{d.day}</div>
                <div className="text-white text-sm">{d.value} kWh</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartPieSlice size={22} className="text-emerald-400" />
            <span className="text-white font-semibold text-lg">Device Usage Distribution</span>
          </div>
          <div className="space-y-4">
            {deviceDistribution.map(d => (
              <div key={d.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">{d.label}</span>
                  <span className="text-gray-300 text-sm">{d.percent}%</span>
                </div>
                <div className="w-full h-2 rounded bg-white/10">
                  <div
                    className={`h-2 rounded ${d.color}`}
                    style={{ width: `${d.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EnergyTrendsCard />
    </div>
  );
}

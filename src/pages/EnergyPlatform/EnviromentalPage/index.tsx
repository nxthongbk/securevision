import {
  ChartLineUp,
  CalendarBlank,
  ChartPieSlice,
  TreeEvergreen,
  GlobeSimple,
  Leaf,
  Lightning,
  Medal,
  RadioButton,
  Plant,
} from '@phosphor-icons/react';
import StatCard from '../CommonComponents/Card/StatCard';

const environmentalStats = [
  {
    icon: <Leaf size={28} className="text-emerald-400" />,
    value: '124 kg',
    label: 'CO₂ Saved',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <TreeEvergreen size={28} className="text-emerald-400" />,
    value: '5.8',
    label: 'Trees Equivalent',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <GlobeSimple size={28} className="text-blue-400" />,
    value: '312',
    label: 'Miles Offset',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <Lightning size={28} className="text-orange-400" />,
    value: '35%',
    label: 'Renewable Energy',
    bg: 'bg-orange-500/10',
  },
];

const environmentalGoals = [
  {
    icon: <ChartPieSlice size={22} className="text-emerald-400" />,
    label: 'Carbon Neutral by 2025',
    percent: 68,
    achievedLabel: '68% achieved',
    targetLabel: '100% carbon neutral',
    barColor: 'bg-emerald-400',
  },
  {
    icon: <ChartLineUp size={22} className="text-blue-400" />,
    label: 'Reduce Usage by 25%',
    percent: 84,
    achievedLabel: '21% achieved',
    targetLabel: '25% reduction',
    barColor: 'bg-blue-400',
  },
  {
    icon: <Lightning size={22} className="text-emerald-400" />,
    label: '50% Renewable Energy',
    percent: 70,
    achievedLabel: '35% achieved',
    targetLabel: '50% renewable',
    barColor: 'bg-emerald-400',
  },
];

const monthlyCarbonSavings = [
  { month: 'Jan', value: 95 },
  { month: 'Feb', value: 87 },
  { month: 'Mar', value: 112 },
  { month: 'Apr', value: 105 },
  { month: 'May', value: 134 },
  { month: 'Jun', value: 124 },
];

const achievements = [
  {
    icon: <Medal size={38} className="text-emerald-400 bg-emerald-500/20 p-2 rounded-lg" />,
    title: 'Eco Warrior',
    description: (
      <>
        Saved over 1000 kg of CO<sub>2</sub> this year
      </>
    ),
    date: '2 months ago',
    completed: true,
  },
  {
    icon: <ChartLineUp size={38} className="text-emerald-400 bg-emerald-500/20 p-2 rounded-lg" />,
    title: 'Energy Saver',
    description: 'Reduced energy usage by 20% from last year',
    date: '1 month ago',
    completed: true,
  },
  {
    icon: <TreeEvergreen size={38} className="text-emerald-400 bg-emerald-500/20 p-2 rounded-lg" />,
    title: 'Green Champion',
    description: 'Offset equivalent of 50 trees planted',
    date: '3 weeks ago',
    completed: true,
  },
  {
    icon: <RadioButton size={38} className="text-gray-400 bg-white/10 p-2 rounded-lg" />,
    title: 'Carbon Crusher',
    description: 'Achieve 75% carbon reduction goal',
    date: '7% to go',
    completed: false,
  },
];

const greenTips = [
  {
    icon: <Lightning size={36} className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg" />,
    title: 'Switch to Renewable Energy',
    description: 'Consider solar panels or green energy plans',
    priority: 'High',
  },
  {
    icon: <Medal size={36} className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg" />,
    title: 'Energy Efficient Appliances',
    description: 'Upgrade to ENERGY STAR certified appliances',
    priority: 'High',
  },
  {
    icon: <TreeEvergreen size={36} className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg" />,
    title: 'Plant Trees',
    description: 'Offset your carbon footprint by planting trees',
    priority: 'Medium',
  },
  {
    icon: <GlobeSimple size={36} className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg" />,
    title: 'Green Transportation',
    description: 'Walk, bike, or use public transport when possible',
    priority: 'Medium',
  },
];

export default function EnviromentalPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col miniLaptop:flex-row miniLaptop:items-center miniLaptop:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Environmental Impact</h1>
          <p className="text-gray-300">
            Track your carbon footprint and environmental contributions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarBlank size={22} className="text-white/70" />
          <select
            className="bg-white/10 backdrop-blur-md border text-md border-white/20 rounded-lg px-4 py-2 text-white/90 focus:outline-none"
            style={{
              colorScheme: 'dark',
            }}
          >
            <option className="bg-[#344f8f] text-white text-md">This Month</option>
            <option className="bg-[#344f8f] text-white text-md">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 miniLaptop:grid-cols-4 gap-6">
        {environmentalStats.map(stat => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            bg={stat.bg}
          />
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-emerald-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
          <span className="text-lg font-semibold text-white">Environmental Goals</span>
        </div>
        <div className="flex flex-col miniLaptop:flex-row gap-8">
          {environmentalGoals.map(goal => (
            <div key={goal.label} className="flex-1 min-w-[220px] space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium">{goal.label}</span>
                <span className="text-gray-300 text-sm">{goal.percent}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${goal.barColor}`}
                  style={{ width: `${goal.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>{goal.achievedLabel}</span>
                <span>{goal.targetLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 miniLaptop:grid-cols-2 gap-8">
        <div className="bg-white/10 border backdrop-blur-md border-white/20 rounded-xl p-6 min-h-[520px] flex flex-col justify-between">
          <div className="text-white font-semibold text-lg mb-6">Monthly Carbon Savings</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-end gap-8 w-full max-w-4xl mx-auto">
              {(() => {
                const max = Math.max(...monthlyCarbonSavings.map(m => m.value));
                return monthlyCarbonSavings.map(d => (
                  <div key={d.month} className="flex flex-col items-center flex-1 max-w-[110px]">
                    <div
                      className="w-16 rounded-t-lg bg-gradient-to-b from-emerald-300 to-emerald-400 transition-all duration-300"
                      style={{
                        height: `${(d.value / max) * 120}px`,
                        minHeight: '40px',
                      }}
                    ></div>
                    <div className="mt-2 text-white/80 text-sm">{d.month}</div>
                    <div className="text-white text-sm">{d.value} kg</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal size={22} className="text-emerald-400" />
            <span className="text-white font-semibold text-lg">Achievements</span>
          </div>

          <div className="space-y-4">
            {achievements.map(ach => (
              <div
                key={ach.title}
                className={`flex items-start gap-4 p-5 rounded-xl ${
                  ach.completed ? 'bg-emerald-500/20 border border-emerald-400/10' : 'bg-white/5'
                }`}
              >
                <span>{ach.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-300">{ach.title}</span>
                    {ach.completed && (
                      <svg
                        className="w-4 h-4 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                    )}
                  </div>
                  <div className="text-gray-300 text-sm">{ach.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{ach.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plant size={22} className="text-emerald-400" />
          <span className="text-lg font-semibold text-white">Green Tips</span>
        </div>
        <div className="grid grid-cols-1 miniLaptop:grid-cols-2 gap-6">
          {greenTips.map(tip => (
            <div
              key={tip.title}
              className="flex items-center bg-white/5 rounded-xl px-6 py-5 relative"
            >
              <span className="mr-4">{tip.icon}</span>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{tip.title}</div>
                <div className="text-gray-300 text-sm">{tip.description}</div>
              </div>
              <span
                className={`absolute right-6 top-6 px-3 py-1 rounded-full text-xs ${
                  tip.priority === 'High'
                    ? 'bg-red-400/20 text-red-300'
                    : 'bg-yellow-400/20 text-yellow-300'
                }`}
              >
                {tip.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

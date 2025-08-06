import {
  CurrencyDollar,
  ChartLineUp,
  Leaf as LeafIcon,
  Lightbulb,
  GearSix,
  ChartLineDown,
  Clock,
  WarningCircle,
} from '@phosphor-icons/react';
import RecommendationCard from './RecommendationCard';

const summary = [
  {
    icon: <CurrencyDollar size={28} className="text-emerald-400" />,
    value: '$113',
    label: 'Potential Monthly Savings',
  },
  {
    icon: <ChartLineUp size={28} className="text-blue-400" />,
    value: '32%',
    label: 'Efficiency Improvement',
  },
  {
    icon: <LeafIcon size={28} className="text-green-400" />,
    value: '245 kg',
    label: 'CO₂ Reduction/Year',
  },
];

const recommendations = [
  {
    icon: <GearSix size={32} className="text-rose-400" />,
    title: 'Optimize HVAC Schedule',
    description:
      'Adjust your thermostat to save 15% on heating costs. Set temperature to 68°F during day and 62°F at night.',
    impact: 'High',
    effort: 'Low',
    impactColor: 'bg-rose-500/80',
    effortColor: 'bg-emerald-500/80',
    savings: '$45/month',
  },
  {
    icon: <ChartLineDown size={32} className="text-blue-400" />,
    title: 'Upgrade Water Heater Insulation',
    description:
      'Add insulation blanket to water heater and pipes. This simple upgrade can reduce heat loss by 25-45%.',
    impact: 'Medium',
    effort: 'Medium',
    impactColor: 'bg-yellow-500/80',
    effortColor: 'bg-yellow-500/80',
    savings: '$12/month',
  },
  {
    icon: <Lightbulb size={32} className="text-amber-400" />,
    title: 'Switch to LED Lighting',
    description:
      'Replace 8 incandescent bulbs with LED equivalents. LEDs use 75% less energy and last 25 times longer.',
    impact: 'Medium',
    effort: 'Low',
    impactColor: 'bg-yellow-500/80',
    effortColor: 'bg-emerald-500/80',
    savings: '$18/month',
  },
  {
    icon: <GearSix size={32} className="text-violet-400" />,
    title: 'Install Smart Power Strips',
    description:
      'Eliminate phantom loads from electronics. Smart strips can reduce standby power consumption by up to 10%.',
    impact: 'Low',
    effort: 'Low',
    impactColor: 'bg-emerald-500/80',
    effortColor: 'bg-emerald-500/80',
    savings: '$8/month',
  },
  {
    icon: <GearSix size={32} className="text-emerald-400" />,
    title: 'Seal Air Leaks',
    description:
      'Caulk and weatherstrip around windows and doors. This can reduce energy costs by 5-10%.',
    impact: 'High',
    effort: 'High',
    impactColor: 'bg-rose-500/80',
    effortColor: 'bg-rose-500/80',
    savings: '$25/month',
  },
  {
    icon: <ChartLineDown size={32} className="text-blue-400" />,
    title: 'Use Cold Water for Laundry',
    description:
      'Wash clothes in cold water when possible. This can save up to $63 per year on your energy bill.',
    impact: 'Low',
    effort: 'Low',
    impactColor: 'bg-emerald-500/80',
    effortColor: 'bg-emerald-500/80',
    savings: '$5/month',
  },
];

const quickTips = [
  {
    icon: <WarningCircle size={22} className="text-emerald-400" />,
    title: 'Unplug Electronics',
    desc: 'Unplug chargers and electronics when not in use',
  },
  {
    icon: <Lightbulb size={22} className="text-emerald-400" />,
    title: 'Use Natural Light',
    desc: 'Open curtains and use daylight during the day',
  },
  {
    icon: <GearSix size={22} className="text-emerald-400" />,
    title: 'Regular Maintenance',
    desc: 'Clean HVAC filters monthly for optimal efficiency',
  },
  {
    icon: <Clock size={22} className="text-emerald-400" />,
    title: 'Smart Scheduling',
    desc: 'Run dishwasher and laundry during off-peak hours',
  },
];

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Energy Recommendations</h1>
        <p className="text-gray-300">Personalized tips to help you save energy and reduce costs.</p>
      </div>

      <div className="grid grid-cols-1 miniLaptop:grid-cols-3 gap-6 mb-10">
        {summary.map(item => (
          <div
            key={item.label}
            className="flex items-center gap-4 bg-white/10 border backdrop-blur-md border-white/15 rounded-xl p-6 min-h-[100px]"
          >
            <div className="p-3 rounded-lg bg-white/10 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <div className="text-white font-bold text-2xl">{item.value}</div>
              <div className="text-white/70 text-md">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 miniLaptop:grid-cols-2 gap-8">
        {recommendations.map(rec => (
          <RecommendationCard key={rec.title} recommendation={rec} />
        ))}
      </div>

      <div className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={22} className="text-emerald-400" />
          <span className="text-white font-semibold text-lg">Quick Energy Tips</span>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 miniLaptop:grid-cols-4 gap-4">
          {quickTips.map(tip => (
            <div
              key={tip.title}
              className="bg-white/10 rounded-lg p-4 flex flex-col gap-2 min-h-[90px]"
            >
              <div className="flex items-center gap-2">
                {tip.icon}
                <span className="text-white font-semibold">{tip.title}</span>
              </div>
              <span className="text-white/80 text-sm">{tip.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

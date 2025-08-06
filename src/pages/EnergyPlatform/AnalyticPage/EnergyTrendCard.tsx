import { ArrowUpRight } from '@phosphor-icons/react';

const usagePatterns = [
  { label: 'Morning (6-12 PM)', value: '8.2 kWh' },
  { label: 'Afternoon (12-6 PM)', value: '6.1 kWh' },
  { label: 'Evening (6-12 AM)', value: '10.8 kWh' },
  { label: 'Night (12-6 AM)', value: '3.4 kWh' },
];

const efficiencyMetrics = [
  { label: 'Peak Efficiency', value: '94%' },
  { label: 'Average Efficiency', value: '87%' },
  { label: 'Standby Power', value: '2.1 kW' },
  { label: 'Power Factor', value: '0.92' },
];

const costAnalysis = [
  { label: 'Daily Average', value: '$3.42' },
  { label: 'Monthly Projection', value: '$103.20' },
  { label: 'Peak Rate Hours', value: '$0.18/kWh' },
  { label: 'Off-Peak Rate', value: '$0.08/kWh' },
];

const EnergyTrendsCard = () => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-8">
    <div className="flex items-center gap-2 mb-4">
      <ArrowUpRight size={22} className="text-emerald-400" />
      <span className="text-white font-semibold text-lg">Energy Trends</span>
    </div>
    <div className="grid grid-cols-1 miniLaptop:grid-cols-3 gap-8">
      <div className="space-y-4">
        <div className="text-white font-semibold mb-2">Usage Patterns</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-white/90">
          {usagePatterns.map(item => (
            <>
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className="text-white text-sm text-right">{item.value}</span>
            </>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-white font-semibold mb-2">Efficiency Metrics</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-white/90">
          {efficiencyMetrics.map(item => (
            <>
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className="text-white text-sm text-right">{item.value}</span>
            </>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-white font-semibold mb-2">Cost Analysis</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-white/90">
          {costAnalysis.map(item => (
            <>
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className="text-white text-sm text-right">{item.value}</span>
            </>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default EnergyTrendsCard;

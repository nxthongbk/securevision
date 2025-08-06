import React from 'react';

type Recommendation = {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
  effort: string;
  impactColor?: string;
  effortColor?: string;
  savings: string;
};

type Props = {
  recommendation: Recommendation;
};

const impactStyleMap: Record<string, string> = {
  High: 'bg-red-400/10 text-red-400',
  Medium: 'bg-yellow-400/10 text-yellow-400',
  Low: 'bg-emerald-400/10 text-emerald-400',
};

const effortStyleMap: Record<string, string> = {
  High: 'bg-red-400/10 text-red-400',
  Medium: 'bg-yellow-400/10 text-yellow-400',
  Low: 'bg-emerald-400/10 text-emerald-400',
};

const iconBgMap: Record<string, string> = {
  High: 'bg-red-400/10',
  Medium: 'bg-yellow-400/10',
  Low: 'bg-emerald-400/10',
};

const iconTextMap: Record<string, string> = {
  High: 'text-red-400',
  Medium: 'text-yellow-400',
  Low: 'text-emerald-400',
};

const RecommendationCard: React.FC<Props> = ({ recommendation: rec }) => (
  <div className="relative flex flex-col miniLaptop:flex-row items-start gap-4 bg-white/10 border backdrop-blur-md border-white/15 rounded-xl p-6 hover:bg-white/15 transition">
    <div
      className={`p-3 rounded-lg flex items-center justify-center mb-2 miniLaptop:mb-0 
        ${iconBgMap[rec.impact] || 'bg-white/10'}`}
    >
      {React.isValidElement(rec.icon)
        ? React.cloneElement(rec.icon as React.ReactElement, {
            className: `${(rec.icon as any).props.className ?? ''} ${iconTextMap[rec.impact] || 'text-white'}`,
          })
        : rec.icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div className="text-white font-semibold text-lg mb-1">{rec.title}</div>
        <div className="text-emerald-400 font-bold">{rec.savings}</div>
      </div>
      <div className="text-gray-300 text-sm mb-4">{rec.description}</div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Impact:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${impactStyleMap[rec.impact] || 'bg-white/10 text-white'}`}
          >
            {rec.impact}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/60 text-sm">Effort:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${effortStyleMap[rec.effort] || 'bg-white/10 text-white'}`}
          >
            {rec.effort}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
          Implement
        </button>
        <button className="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors text-sm">
          Learn More
        </button>
      </div>
    </div>
  </div>
);

export default RecommendationCard;

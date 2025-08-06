import React from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

export interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  color = '#1976d2',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendDown size={16} className="text-red-600 rotate-180" />;
      default:
        return (
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
            className="lucide lucide-minus h-4 w-4 text-gray-400"
          >
            <path d="M5 12h14"></path>
          </svg>
        );
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'text-blue-600':
        return 'bg-blue-50 text-blue-900';
      case 'text-green-600':
        return 'bg-green-50 text-green-900';
      case 'text-orange-600':
        return 'bg-orange-50 text-orange-900';
      case 'text-purple-600':
        return 'bg-purple-50 text-purple-900';
      case 'text-teal-600':
        return 'bg-teal-50 text-teal-900';
      default:
        return 'bg-blue-50 text-blue-900';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-3 ${getColorClasses()}`}>{icon}</div>
        {change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>{change}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <span
            className={`text-2xl font-bold ${getColorClasses()
              .split(' ')
              .find(cls => cls.startsWith('text-'))}`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <span className="ml-2 text-sm text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

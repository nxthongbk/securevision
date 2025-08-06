import React from 'react';
import { Clock } from '@phosphor-icons/react';

export interface ProcessCardProps {
  name: string;
  code: string;
  progress: number;
  status: string;
  remaining: string;
  numberOfEmployees: number;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  name,
  code,
  progress,
  status,
  remaining,
  numberOfEmployees,
}) => {
  const getStatusColorClasses = () => {
    if (progress >= 90) return 'bg-yellow-100 text-yellow-800';
    if (progress >= 60) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getProgressBarColor = () => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {progress < 60 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-git-branch h-5 w-5 text-gray-600"
            >
              <line x1="6" x2="6" y1="3" y2="15"></line>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M18 9a9 9 0 0 1-9 9"></path>
            </svg>
          ) : (
            <Clock
              size={20}
              className={`${getStatusColorClasses()
                .split(' ')
                .find(cls => cls.startsWith('text-'))}`}
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600">{code}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColorClasses()}`}>
          {status}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Tiến độ</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{numberOfEmployees} công nhân</span>
        <span>Còn lại: {remaining}</span>
      </div>
    </div>
  );
};

export default ProcessCard;

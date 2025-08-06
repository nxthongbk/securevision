import React from 'react';
export interface HourlyChartData {
  time: string;
  target: number;
  actual: number;
  efficiency: number;
}

export interface HourlyChartProps {
  data: HourlyChartData[];
}

const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.target, d.actual)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
            className="lucide lucide-bar-chart3 h-5 w-5 text-blue-600 mr-2"
          >
            <path d="M3 3v18h18"></path>
            <path d="M18 17V9"></path>
            <path d="M13 17V5"></path>
            <path d="M8 17v-3"></path>
          </svg>
          Sản Lượng Theo Giờ
        </h3>
        <p className="text-sm text-gray-600 mt-1">So sánh sản lượng thực tế và mục tiêu</p>
      </div>

      <div className="p-6">
        <div className="flex items-end space-x-2 h-64">
          {data.map((item, index) => {
            const prev = index > 0 ? data[index - 1] : null;
            const isDecrease = prev && item.efficiency > 0 && item.efficiency < prev.efficiency;
            let efficiencyColor = '';
            if (item.efficiency > 100) efficiencyColor = 'text-green-600';
            else if (isDecrease) efficiencyColor = 'text-red-600';
            else if (item.efficiency > 0) efficiencyColor = 'text-blue-600';
            else efficiencyColor = 'text-gray-400';

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end justify-center w-full h-full gap-1">
                  <div
                    className={`w-3 rounded-t ${item.efficiency > 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{
                      height: maxValue > 0 ? `${(item.actual / maxValue) * 160}px` : '0',
                      minHeight: item.actual > 0 ? '8px' : '0',
                    }}
                  />

                  <div
                    className="w-3 bg-gray-300 rounded-t"
                    style={{
                      height: maxValue > 0 ? `${(item.target / maxValue) * 160}px` : '0',
                      minHeight: item.target > 0 ? '8px' : '0',
                    }}
                  />
                </div>
                <span className="mt-2 text-xs text-gray-700 text-center font-semibold">
                  {item.time}
                </span>
                <span className="mt-2 text-xs text-gray-600 text-center">
                  {item.actual}/{item.target}
                </span>
                <span className={`text-xs font-semibold ${efficiencyColor}`}>
                  {item.efficiency > 0 ? `${item.efficiency}%` : '0%'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-sm mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Mục tiêu</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Thực tế</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Vượt mục tiêu</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyChart;

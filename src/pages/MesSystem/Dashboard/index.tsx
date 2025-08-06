import React from 'react';
import { CalendarBlank, Users, CheckCircle, Pulse } from '@phosphor-icons/react';

import MetricCard from '../CommonComponents/MetricCard/MetricCard';
import ProcessCard from '../CommonComponents/ProcessCard/ProcessCard';
import HourlyChart from '../CommonComponents/HourlyChart/HourlyChart';

const mockData = {
  productionToday: {
    current: 1245,
    target: 1200,
    unit: 'sản phẩm',
    change: '+12.5%',
    trend: 'up' as const,
  },
  efficiency: {
    current: 87.3,
    unit: '%',
    change: '-2.1%',
    trend: 'down' as const,
  },
  activeEmployees: {
    current: 156,
    unit: 'người',
    change: '0%',
    trend: 'stable' as const,
  },
  completedOrders: {
    current: 23,
    unit: 'đơn',
    change: '+8.7%',
    trend: 'up' as const,
  },
  hourlyProduction: [
    { time: '07:00', actual: 1650, target: 1800, efficiency: 92 },
    { time: '08:00', actual: 1751, target: 1800, efficiency: 97 },
    { time: '09:00', actual: 1824, target: 1800, efficiency: 101 },
    { time: '10:00', actual: 1781, target: 1800, efficiency: 99 },
    { time: '11:00', actual: 1557, target: 1800, efficiency: 86 },
    { time: '12:00', actual: 0, target: 0, efficiency: 0 },
    { time: '13:00', actual: 1704, target: 1800, efficiency: 94 },
    { time: '14:00', actual: 1856, target: 1800, efficiency: 103 },
    { time: '15:00', actual: 0, target: 1800, efficiency: 0 },
  ],
  processStatus: [
    {
      id: 'Type 1',
      name: 'Áo sơ mi nam',
      code: '#DH2024001',
      progress: 85,
      status: 'Cắt vải',
      step: 'Cắt vải',
      workers: 12,
      remaining: '2h 30m',
      numberOfEmployees: 12,
    },
    {
      id: 'Type 2',
      name: 'Quần jean nữ',
      code: '#DH2024002',
      progress: 60,
      status: 'May chính',
      step: 'May chính',
      workers: 8,
      remaining: '4h 15m',
      numberOfEmployees: 8,
    },
    {
      id: 'Type 3',
      name: 'Áo thun trẻ em',
      code: '#DH2024003',
      progress: 95,
      status: 'Hoàn thiện',
      step: 'Hoàn thiện',
      workers: 6,
      remaining: '30m',
      numberOfEmployees: 6,
    },
    {
      id: 'Type 4',
      name: 'Váy dạ hội',
      code: '#DH2024004',
      progress: 25,
      status: 'Thiết kế',
      step: 'Thiết kế',
      workers: 2,
      remaining: '1 ngày',
      numberOfEmployees: 2,
    },
  ],
  alertData: [
    {
      color: 'yellow',
      title: 'Máy may #15 cần bảo trì',
      time: '10 phút trước',
    },
    {
      color: 'red',
      title: 'Thiếu vải cho đơn hàng #DH2024001',
      time: '25 phút trước',
    },
    {
      color: 'blue',
      title: 'Ca chiều bắt đầu trong 30 phút',
      time: '30 phút trước',
    },
  ],
};

const MesDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Sản Xuất</h1>
          <p className="text-gray-600">Tổng quan tình hình sản xuất hôm nay</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <CalendarBlank size={20} />
          <span className="text-sm font-medium text-gray-700">Thứ Hai, 28 tháng 7, 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-6">
        <MetricCard
          title="Sản lượng hôm nay"
          value={mockData.productionToday.current}
          unit={mockData.productionToday.unit}
          change={mockData.productionToday.change}
          trend={mockData.productionToday.trend}
          icon={
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
              className="w-6 h-6 text-blue-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          }
          color="text-blue-600"
        />
        <MetricCard
          title="Hiệu suất máy"
          value={mockData.efficiency.current}
          unit={mockData.efficiency.unit}
          change={mockData.efficiency.change}
          trend={mockData.efficiency.trend}
          icon={<Pulse size={24} />}
          color="text-green-600"
        />
        <MetricCard
          title="Nhân viên làm việc"
          value={mockData.activeEmployees.current}
          unit={mockData.activeEmployees.unit}
          change={mockData.activeEmployees.change}
          trend={mockData.activeEmployees.trend}
          icon={<Users size={24} />}
          color="text-purple-600"
        />
        <MetricCard
          title="Đơn hàng hoàn thành"
          value={mockData.completedOrders.current}
          unit={mockData.completedOrders.unit}
          change={mockData.completedOrders.change}
          trend={mockData.completedOrders.trend}
          icon={<CheckCircle size={24} />}
          color="text-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 smallLaptop:grid-cols-3 gap-6">
        <div className="smallLaptop:col-span-2">
          <HourlyChart data={mockData.hourlyProduction} />
        </div>

        <div>
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
                  className="lucide lucide-git-branch h-5 w-5 text-purple-800 mr-2"
                >
                  <line x1="6" x2="6" y1="3" y2="15"></line>
                  <circle cx="18" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M18 9a9 9 0 0 1-9 9"></path>
                </svg>
                Trạng Thái Quy Trình
              </h3>
              <p className="text-sm text-gray-600 mt-1">Theo dõi tiến độ các đơn hàng</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {mockData.processStatus.map((process, index) => (
                  <ProcessCard
                    key={index}
                    name={process.name}
                    code={process.code}
                    progress={process.progress}
                    status={process.status}
                    remaining={process.remaining}
                    numberOfEmployees={process.numberOfEmployees}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="lucide lucide-alert-triangle h-5 w-5 text-orange-500 mr-2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            Cảnh báo & Thông báo
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockData.alertData.map((alert, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 p-4 rounded-lg bg-${alert.color}-50 border border-${alert.color}-200`}
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 bg-${alert.color}-500`}
                ></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium text-${alert.color}-800`}>{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesDashboard;

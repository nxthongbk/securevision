import {
  TrendUp,
  DownloadSimple,
  Factory,
  Package,
  Users,
  FileText,
} from '@phosphor-icons/react';
import { useState } from 'react';
import BarChart3Icon from '../CommonComponents/CustomIcons/BarChart3Icon';
import SummaryCard from '../CommonComponents/SummaryCard/SummaryCard';

const reportTabs = [
  {
    label: 'Báo cáo sản xuất',
    icon: <Factory size={44} mirrored className="text-blue-600 bg-blue-100 p-2 rounded-md" />,
    activeColor: 'bg-blue-50 border-b-2 border-blue-600',
    activeText: 'text-blue-600',
  },
  {
    label: 'Báo cáo chất lượng',
    icon: <BarChart3Icon className="text-green-600 bg-green-100 rounded-md h-10 w-10 p-2" />,

    activeColor: 'bg-blue-50 border-b-2 border-blue-600',
    activeText: 'text-blue-600',
  },
  {
    label: 'Báo cáo nguyên liệu',
    icon: <Package size={44} className="text-orange-600 bg-orange-100 p-2 rounded-md" />,

    activeColor: 'bg-blue-50 border-b-2 border-blue-600',
    activeText: 'text-blue-600',
  },
  {
    label: 'Báo cáo nhân sự',
    icon: <Users size={44} className="text-purple-600 bg-purple-100 p-2 rounded-md" />,

    activeColor: 'bg-blue-50 border-b-2 border-blue-600',
    activeText: 'text-blue-600',
  },
];

const summaryData = [
  {
    label: 'Tổng đơn hàng',
    value: 45,
    icon: <Factory mirrored size={32} className="text-blue-600" />,
  },
  {
    label: 'Hoàn thành',
    value: 32,
    icon: <TrendUp size={32} className="text-green-600" />,
  },
  {
    label: 'Sản phẩm',
    value: '12,450',
    icon: <Package size={32} className="text-orange-600" />,
  },
  {
    label: 'Hiệu suất',
    value: '87.5%',
    icon: <BarChart3Icon className="text-purple-600 h-6 w-6" />,
  },
];

const orderStatus = [
  { label: 'Hoàn thành', value: 32, color: 'bg-green-500' },
  { label: 'Đang thực hiện', value: 10, color: 'bg-blue-500' },
  { label: 'Trễ hạn', value: 3, color: 'bg-red-500' },
];

const performanceMetrics = [
  { label: 'Tỷ lệ lỗi', value: '2.3%', percent: 2.3, color: 'bg-red-500' },
  { label: 'Hiệu suất sản xuất', value: '87.5%', percent: 87.5, color: 'bg-green-500' },
  { label: 'Tỷ lệ sử dụng máy', value: '92.1%', percent: 92.1, color: 'bg-blue-500' },
];

const qualitySummaryData = [
  { label: 'Tổng kiểm tra', value: 156, icon: <BarChart3Icon className="text-blue-600 h-6 w-6" /> },
  { label: 'Đạt chuẩn', value: 142, icon: <TrendUp size={32} className="text-green-600" /> },
  { label: 'Không đạt', value: 8, icon: <Package size={32} className="text-red-600" /> },
  { label: 'Tỷ lệ đạt', value: '91%', icon: <BarChart3Icon className="text-purple-600 h-6 w-6" /> },
];
const commonQualityErrors = [
  {
    label: 'Đường may không thẳng',
    count: 15,
  },
  {
    label: 'Thiếu nút áo',
    count: 8,
  },
  {
    label: 'Vải phai màu',
    count: 6,
  },
];
const materialSummaryData = [
  {
    label: 'Tổng vật liệu',
    value: 156,
    icon: <Package size={32} className="text-blue-600" />,
  },
  {
    label: 'Sắp hết',
    value: 12,
    icon: <TrendUp size={32} className="text-orange-600" />,
  },
  {
    label: 'Hết hàng',
    value: 3,
    icon: <Package size={32} className="text-red-600" />,
  },
  {
    label: 'Giá trị kho',
    value: '2.5B',
    icon: <BarChart3Icon className="text-green-600 h-6 w-6" />,
  },
];

const topMaterials = [
  { name: 'Vải cotton trắng', value: '450 mét', percent: 45 },
  { name: 'Chỉ may đen', value: '280 ống', percent: 28 },
  { name: 'Nút áo nhựa', value: '15,000 cái', percent: 100 },
];

const hrSummaryData = [
  { label: 'Tổng nhân viên', value: 156, icon: <Users size={32} className="text-blue-600" /> },
  { label: 'Đang làm việc', value: 142, icon: <TrendUp size={32} className="text-green-600" /> },
  {
    label: 'Tổng giờ làm',
    value: '24,560',
    icon: <Package size={32} className="text-orange-600" />,
  },
  {
    label: 'Hiệu suất TB',
    value: '87.5%',
    icon: <BarChart3Icon className="text-purple-600 h-6 w-6" />,
  },
];
const topEmployees = [
  { name: 'Lê Thị Mai', percent: 98 },
  { name: 'Nguyễn Thị Hoa', percent: 95 },
  { name: 'Trần Văn Nam', percent: 92 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customRange, setCustomRange] = useState({ from: '', to: '' });

  const handleTimeRangeChange = e => {
    const value = e.target.value;
    setTimeRange(value);
    setShowCustomRange(value === 'Tùy chỉnh');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo & Thống Kê</h1>
          <p className="text-gray-600">Phân tích dữ liệu và báo cáo chi tiết</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <DownloadSimple size={20} /> Xuất báo cáo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 smallLaptop:grid-cols-4 divide-x divide-gray-200">
          {reportTabs.map((tab, idx) => (
            <button
              key={tab.label}
              className={`p-6 text-center hover:bg-gray-50 transition-colors ${activeTab === idx ? 'bg-blue-50' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3">
                {tab.icon}
              </div>
              <h3 className={`font-medium${activeTab === idx ? tab.activeText : 'text-gray-700'}`}>
                {tab.label}
              </h3>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-3 w-full">
        <span className="flex items-center gap-2 text-gray-700">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <rect x="3" y="4" width="14" height="14" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h14" />
          </svg>
          Khoảng thời gian:
        </span>
        <select
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
        >
          <option>Hôm nay</option>
          <option>Hôm qua</option>
          <option>Tuần này</option>
          <option>Tuần trước</option>
          <option>Tháng này</option>
          <option>Tháng trước</option>
          <option>Năm này</option>
          <option>Tùy chỉnh</option>
        </select>
        {showCustomRange && (
          <div className="flex items-center gap-2 ">
            <label className="text-sm text-gray-700">Từ</label>
            <input
              type="date"
              value={customRange.from}
              onChange={e => setCustomRange({ ...customRange, from: e.target.value })}
              className="border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
            <label className="text-sm text-gray-700">Đến</label>
            <input
              type="date"
              value={customRange.to}
              onChange={e => setCustomRange({ ...customRange, to: e.target.value })}
              className="border border-gray-300 rounded-lg p-1.5  focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === 0
              ? 'Báo cáo sản xuất'
              : activeTab === 1
                ? 'Báo cáo chất lượng'
                : activeTab === 2
                  ? 'Báo cáo nguyên liệu'
                  : 'Báo cáo nhân sự'}
          </h2>

          <div className="flex items-center space-x-2">
            <FileText size={20} className="text-gray-500" />
            <span className="text-sm text-gray-500">Dữ liệu từ {timeRange}</span>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 0 && (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-4">
                {summaryData.map(card => (
                  <SummaryCard icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>
              <div className="grid grid-cols-1 smallLaptop:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng đơn hàng</h3>
                  <div className="space-y-4">
                    {orderStatus.map(status => (
                      <div key={status.label}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{status.label}</span>
                          <span className="font-medium">{status.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${status.color} h-2 rounded-full`}
                            style={{ width: `${(status.value / 45) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉ số hiệu suất</h3>
                  <div className="space-y-4">
                    {performanceMetrics.map(metric => (
                      <div key={metric.label}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{metric.label}</span>

                          <span className="font-medium">{metric.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${metric.color} h-2 rounded-full`}
                            style={{ width: `${metric.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 1 && (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-4">
                {qualitySummaryData.map(card => (
                  <SummaryCard icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lỗi thường gặp</h3>
                <div className="space-y-3">
                  {commonQualityErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700">{err.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(err.count / 20) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{err.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === 2 && (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-4">
                {materialSummaryData.map(card => (
                  <SummaryCard icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vật liệu tiêu thụ nhiều nhất
                </h3>
                <div className="space-y-3">
                  {topMaterials.map(mat => (
                    <div key={mat.name} className="flex items-center justify-between">
                      <span className=" text-gray-700">{mat.name}</span>
                      <div className="flex items-center gap-2 w-48">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: mat.percent + '%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-nowrap">{mat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === 3 && (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-4">
                {hrSummaryData.map(card => (
                  <SummaryCard icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhân viên xuất sắc</h3>
                <div className="space-y-3">
                  {topEmployees.map(emp => (
                    <div key={emp.name} className="flex items-center justify-between">
                      <span className=" text-gray-700">{emp.name}</span>
                      <div className="flex items-center gap-2 w-48">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: emp.percent + '%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{emp.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

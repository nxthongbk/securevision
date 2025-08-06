import { Warning, XCircle, Shield, Eye, TrendUp } from '@phosphor-icons/react';
import SummaryCard from '../CommonComponents/SummaryCard/SummaryCard';
import { useState } from 'react';

const qualityChecks = [
  {
    code: '#QC001',
    batch: 'B001-240120',
    order: '#DH2024001',
    product: 'Áo sơ mi nam dài tay',
    step: 'Cắt vải',
    statusIcon: 'check',
    statusColor: 'green',
    status: 'Đạt chuẩn',
    sample: '50/50',
    samplePercent: 100,
    checker: 'Hoàng Thị Lan',
    date: '20/1/2024',
  },
  {
    code: '#QC002',
    batch: 'B001-240120',
    order: '#DH2024001',
    product: 'Áo sơ mi nam dài tay',
    step: 'May',
    statusIcon: 'alert',
    statusColor: 'yellow',
    status: 'Cần sửa lại',
    sample: '30/50',
    samplePercent: 60,
    checker: 'Nguyễn Văn Hùng',
    date: '21/1/2024',
  },
  {
    code: '#QC003',
    batch: 'B002-240118',
    order: '#DH2024002',
    product: 'Quần jean nữ',
    step: 'Hoàn thiện',
    statusIcon: 'check',
    statusColor: 'green',
    status: 'Đạt chuẩn',
    sample: '25/30',
    samplePercent: 83.33,
    checker: 'Lê Thị Mai',
    date: '22/1/2024',
  },
  {
    code: '#QC004',
    batch: 'B003-240115',
    order: '#DH2024003',
    product: 'Áo thun trẻ em',
    step: 'Kiểm tra cuối',
    statusIcon: 'x',
    statusColor: 'red',
    status: 'Không đạt',
    sample: '40/50',
    samplePercent: 80,
    checker: 'Trần Văn Nam',
    date: '23/1/2024',
  },
  {
    code: '#QC005',
    batch: 'B004-240119',
    order: '#DH2024004',
    product: 'Váy dạ hội',
    step: 'May',
    statusIcon: 'eye',
    statusColor: 'gray',
    status: 'Chờ kiểm tra',
    sample: '0/20',
    samplePercent: 0,
    checker: 'Hoàng Thị Lan',
    date: '24/1/2024',
  },
];

const commonErrors = [
  { name: 'Đường may không thẳng', percent: 20, count: 1 },
  { name: 'Thiếu nút áo', percent: 20, count: 1 },
  { name: 'Vải phai màu', percent: 20, count: 1 },
  { name: 'Kích thước không đúng spec', percent: 20, count: 1 },
  { name: 'Chỉ may không chắc', percent: 20, count: 1 },
];

const stepQuality = [
  { name: 'Cắt vải', percent: 100, passed: 1, total: 1 },
  { name: 'May', percent: 0, passed: 0, total: 2 },
  { name: 'Hoàn thiện', percent: 100, passed: 1, total: 1 },
  { name: 'Kiểm tra cuối', percent: 0, passed: 0, total: 1 },
];

export default function QualityManagementPage() {
  const [checkedList] = useState(qualityChecks);
  const [category, setCategory] = useState('Tất cả công đoạn');
  const [status, setStatus] = useState('Tất cả trạng thái');

  const categoryOptions = ['Tất cả công đoạn', 'Cắt vải', 'May', 'Hoàn thiện', 'Kiểm tra cuối'];
  const statusOptions = [
    'Tất cả trạng thái',
    'Đạt chuẩn',
    'Cần sửa lại',
    'Không đạt',
    'Chờ kiểm tra',
  ];

  const summary = {
    totalChecked: checkedList.length,
    checked: checkedList.filter(e => e.status === 'Đạt chuẩn').length,
    unchecked: checkedList.filter(e => e.status === 'Không đạt').length,
    totalErrors: commonErrors.reduce((sum, e) => sum + e.count, 0),
    needToRepair: checkedList.filter(e => e.status === 'Cần sửa lại').length,
  };

  const filteredItems = checkedList.filter(item => {
    const matchCategory = category === 'Tất cả công đoạn' || item.step === category;
    const matchStatus = status === 'Tất cả trạng thái' || item.status === status;
    return matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kiểm Soát Chất Lượng</h1>
          <p className="text-gray-600">Theo dõi và quản lý chất lượng sản phẩm qua các công đoạn</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Shield size={20} /> Tạo phiếu kiểm tra
        </button>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-5 gap-4">
        <SummaryCard
          icon={<Shield mirrored size={32} className="text-blue-600" />}
          label="Tổng kiểm tra"
          value={summary.totalChecked}
        />
        <SummaryCard
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
              className="lucide lucide-check-circle h-7 w-7 text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <path d="m9 11 3 3L22 4"></path>
            </svg>
          }
          label="Đạt chuẩn"
          value={summary.checked}
        />
        <SummaryCard
          icon={<Warning size={32} className="text-yellow-600" />}
          label="Cần sửa"
          value={summary.needToRepair}
        />
        <SummaryCard
          icon={<XCircle size={32} className="text-red-600" />}
          label="Không đạt"
          value={summary.unchecked}
        />
        <SummaryCard
          icon={<TrendUp size={32} className="text-purple-600" />}
          label="Tỉ lệ đạt"
          value={
            summary.totalChecked
              ? Math.round((summary.checked / summary.totalChecked) * 100) + '%'
              : '0%'
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col tablet:flex-row space-y-4 tablet:space-y-0 tablet:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none "
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Phiếu Kiểm Tra Chất Lượng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã kiểm tra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công đoạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mẫu kiểm tra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kiểm tra viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày kiểm tra
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((qc, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{qc.code}</div>
                    <div className="text-sm text-gray-500">{qc.batch}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {qc.step}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {qc.statusIcon === 'check' && (
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
                          className="lucide lucide-check-circle h-5 w-5 text-green-600"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <path d="m9 11 3 3L22 4"></path>
                        </svg>
                      )}
                      {qc.statusIcon === 'alert' && (
                        <Warning size={22} className="text-yellow-600 " />
                      )}
                      {qc.statusIcon === 'x' && <XCircle size={22} className="text-red-600 " />}
                      {qc.statusIcon === 'eye' && <Eye size={20} className="text-gray-600 " />}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          qc.statusColor === 'green'
                            ? 'bg-green-100 text-green-800'
                            : qc.statusColor === 'yellow'
                              ? 'bg-yellow-100 text-yellow-800'
                              : qc.statusColor === 'red'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {qc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.sample}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: qc.samplePercent + '%' }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.checker}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 smallLaptop:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lỗi Thường Gặp</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {commonErrors.map(error => (
                <div key={error.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{error.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: error.percent + '%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{error.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Chất Lượng Theo Công Đoạn</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stepQuality.map(step => (
                <div key={step.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{step.name}</span>
                    <span
                      className={`text-sm font-bold ${step.percent === 100 ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {step.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={
                        step.percent === 100
                          ? 'bg-green-500 h-3 rounded-full'
                          : 'bg-gray-300 h-3 rounded-full'
                      }
                      style={{ width: step.percent + '%' }}
                    ></div>
                  </div>
                  <div className="text-sm mt-1 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {step.passed}/{step.total} đạt chuẩn
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

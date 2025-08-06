import { Plus, SealCheck, Factory, GearSix, Warning, Package } from '@phosphor-icons/react';
import SummaryCard from '../CommonComponents/SummaryCard/SummaryCard';
import { useState } from 'react';
import SearchFilterBar from '../CommonComponents/SearchBar/SearchFilterBar';

export default function DevicesManagementPage() {
  const deviceData = [
    {
      icon: <Factory mirrored size={34} className="text-blue-600 p-1 rounded-md bg-blue-100" />,
      name: 'Máy may công nghiệp Singer',
      code: 'EQ001',
      type: 'Máy may',
      brand: 'Singer S-8700',
      location: 'Dây chuyền A1',
      operator: 'Nguyễn Thị Hoa',
      hours: 2450,
      efficiency: 95,
      status: 'Hoạt động',
      maintenance: 100,
      last: '10/1/2024',
      next: '10/4/2024',
      note: 'Hoạt động tốt',
    },
    {
      icon: <Factory mirrored size={34} className="text-purple-600 p-1 rounded-md bg-purple-100" />,
      name: 'Máy cắt vải tự động',
      code: 'EQ002',
      type: 'Máy cắt',
      brand: 'Eastman EC-1200',
      location: 'Khu cắt vải',
      operator: 'Trần Văn Nam',
      hours: 1850,
      efficiency: 92,
      status: 'Hoạt động',
      maintenance: 100,
      last: '15/1/2024',
      next: '15/4/2024',
      note: 'Lưỡi cắt mới thay',
    },
    {
      icon: <Factory mirrored size={34} className="text-green-600 p-1 rounded-md bg-green-100" />,
      name: 'Máy may overlock Brother',
      code: 'EQ003',
      type: 'Máy vắt sổ',
      brand: 'Brother OL-2340',
      location: 'Dây chuyền B2',
      operator: 'Lê Thị Mai',
      hours: 1200,
      efficiency: 88,
      status: 'Bảo trì',
      maintenance: 60,
      last: '20/1/2024',
      next: '25/1/2024',
      note: 'Đang bảo trì định kỳ',
    },
    {
      icon: <Factory mirrored size={34} className="text-orange-600 p-1 rounded-md bg-orange-100" />,
      name: 'Bàn là hơi nước công nghiệp',
      code: 'EQ004',
      type: 'Máy là',
      brand: 'Pony PI-4000',
      location: 'Khu hoàn thiện',
      operator: 'Phạm Văn Đức',
      hours: 1680,
      efficiency: 90,
      status: 'Hoạt động',
      maintenance: 100,
      last: '8/1/2024',
      next: '8/4/2024',
      note: 'Nhiệt độ ổn định',
    },
    {
      icon: <Factory mirrored size={34} className="text-yellow-600 p-1 rounded-md bg-yellow-100" />,
      name: 'Máy khuy áo tự động',
      code: 'EQ005',
      type: 'Máy khuy',
      brand: 'Juki JK-B500',
      location: 'Dây chuyền C3',
      operator: 'Chưa phân công',
      hours: 980,
      efficiency: 75,
      status: 'Sửa chữa',
      maintenance: 20,
      last: '15/12/2023',
      next: '1/2/2024',
      note: 'Lỗi motor, đang chờ linh kiện',
    },
  ];

  const [search, setSearch] = useState('');
  const [deviceList] = useState(deviceData);
  const [category, setCategory] = useState('Tất cả loại');
  const [status, setStatus] = useState('Tất cả trạng thái');
  const categoryOptions = [
    'Tất cả loại',
    'Máy may',
    'Máy cắt',
    'Máy vắt sổ',
    'Máy là',
    'Máy khuy',
    'Khác',
  ];
  const statusOptions = ['Tất cả trạng thái', 'Hoạt động', 'Bảo trì', 'Sửa chữa'];

  const summary = {
    totalDevices: deviceList.length,
    activeDevices: deviceList.filter(e => e.status === 'Hoạt động').length,
    maintenanceDevices:
      deviceList.filter(e => e.status === 'Bảo trì').length +
      deviceList.filter(e => e.status === 'Sửa chữa').length,
    avgEfficiency: deviceList.length
      ? Math.round(deviceList.reduce((sum, e) => sum + e.efficiency, 0) / deviceList.length) + '%'
      : '0%',
  };

  const filteredDevices = deviceList.filter(device => {
    const matchSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.code.toLowerCase().includes(search.toLowerCase()) ||
      device.type.toLowerCase().includes(search.toLowerCase()) ||
      device.brand.toLowerCase().includes(search.toLowerCase()) ||
      device.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Tất cả loại' || device.type === category;
    const matchStatus = status === 'Tất cả trạng thái' || device.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const iconMap = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return <SealCheck size={20} className="text-green-600" />;
      case 'Bảo trì':
        return <GearSix size={20} className="text-yellow-600" />;
      case 'Sửa chữa':
        return <Warning size={20} className="text-red-600" />;
      default:
        return <Package size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Thiết Bị</h1>
          <p className="text-gray-600">Theo dõi và quản lý máy móc thiết bị sản xuất</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} /> Thêm thiết bị
        </button>
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Factory mirrored size={32} className="text-blue-600" />}
          label="Tổng thiết bị"
          value={summary.totalDevices}
        />
        <SummaryCard
          icon={<SealCheck size={32} className="text-green-600" />}
          label="Đang hoạt động"
          value={summary.activeDevices}
        />
        <SummaryCard
          icon={<GearSix size={32} className="text-yellow-600" />}
          label="Bảo trì/Sửa chữa"
          value={summary.maintenanceDevices}
        />
        <SummaryCard
          icon={<Warning size={32} className="text-purple-600" />}
          label="Hiệu suất TB"
          value={summary.avgEfficiency}
        />
      </div>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        placeholder="Tìm kiếm theo tên, loại, vị trí, mã thiết bị..."
      />

      <div className="grid grid-cols-1 smallLaptop:grid-cols-2 miniLaptop:grid-cols-3 gap-6">
        {filteredDevices.map((device, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg">{device.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-600">#{device.code}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {iconMap(device.status)}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.status === 'Hoạt động'
                      ? 'bg-green-100 text-green-800'
                      : device.status === 'Bảo trì'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {device.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Loại:</span>
                <span className="font-medium ">{device.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Thương hiệu:</span>
                <span className="font-medium ">{device.brand}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Vị trí:</span>
                <span className="font-medium ">{device.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Người vận hành:</span>
                <span className="font-medium ">{device.operator}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Thời gian hoạt động:</span>
                <span className="font-medium ">{device.hours.toLocaleString()}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hiệu suất:</span>
                <span
                  className={`font-medium ${
                    device.status === 'Hoạt động'
                      ? 'text-green-600'
                      : device.status === 'Bảo trì'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {device.efficiency}%
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tiến trình bảo trì:</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: device.maintenance + '%',
                      background:
                        device.status === 'Hoạt động'
                          ? '#22C55E'
                          : device.status === 'Bảo trì'
                            ? '#EAB308'
                            : '#EF4444',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{device.last}</span>
                  <span>{device.next}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{device.note}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Câp nhật
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Bảo trì
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Warning size={24} className="text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Cảnh báo tồn kho</h3>
            <p className="text-sm text-red-700 mt-1">
              Có 2 vật liệu cần được nhập thêm hoặc đã hết hàng. Hãy liên hệ nhà cung cấp để đặt
              hàng bổ sung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

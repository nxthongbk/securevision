import React from 'react';
import { Warning, TrendUp, TrendDown } from '@phosphor-icons/react';

interface MaterialCardProps {
  icon: React.ReactNode;
  name: string;
  code: string;
  category: string;
  price: string;
  supplier: string;
  stock: number;
  unit: string;
  min: number;
  max: number;
  lastImport: string;
  value: string;
  status: string;
}

const statusMap = {
  'Đủ hàng': { color: 'green', label: 'Đủ hàng' },
  'Sắp hết': { color: 'yellow', label: 'Sắp hết' },
  'Hết hàng': { color: 'red', label: 'Hết hàng' },
  'Dư thừa': { color: 'blue', label: 'Dư thừa' },
};

const iconMap = (status: string) => {
  switch (status) {
    case 'Sắp hết':
      return <Warning size={18} className="text-yellow-600 " />;
    case 'Hết hàng':
      return <TrendDown size={18} className="text-red-600 " />;
    case 'Đủ hàng':
    case 'Dư thừa':
      return <TrendUp size={18} className="text-green-600 " />;
    default:
      return null;
  }
};

const MaterialCard: React.FC<MaterialCardProps> = ({
  icon,
  name,
  code,
  category,
  price,
  supplier,
  stock,
  unit,
  min,
  max,
  lastImport,
  value,
  status,
}) => {
  const statusInfo = statusMap[status];
  const percent = Math.max(0, Math.min(100, ((stock - min) / (max - min)) * 100));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg">{icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">#{code}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
        >
          {statusInfo.label}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Danh mục:</span>
          <span className="font-medium">{category}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Giá:</span>
          <span className="font-medium">{price}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Nhà cung cấp:</span>
          <span className="font-medium">{supplier}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Tồn kho:</span>
            <div className="flex items-center space-x-1">
              <span>{iconMap(status)}</span>
              <span
                className={`font-bold ${status === 'Hết hàng' ? 'text-red-600' : status === 'Sắp hết' ? 'text-yellow-600' : 'text-green-600'}`}
              >
                {stock > 0 ? `${stock} ${unit}` : `0 ${unit}`}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full transition-all duration-300  ${status === 'Hết hàng' ? 'bg-red-400' : status === 'Sắp hết' ? 'bg-yellow-400' : 'bg-green-500'}`}
              style={{ width: `${percent}% ` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Min: {min}</span>
            <span>Max: {max}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Ngày nhập kho:</span>
          <span className="font-medium">{lastImport}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Giá trị tồn:</span>
          <span className="font-bold text-blue-600">{value}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Nhập kho
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Xuất kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;

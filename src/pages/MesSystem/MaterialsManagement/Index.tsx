import { Plus, Package, TrendUp, Warning } from '@phosphor-icons/react';
import SummaryCard from '../CommonComponents/SummaryCard/SummaryCard';
import MaterialCard from './MaterialCard';
import { useState } from 'react';
import SearchFilterBar from '../CommonComponents/SearchBar/SearchFilterBar';

const materialData = [
  {
    icon: <Package size={34} className="text-blue-600 bg-blue-100 p-1 rounded-md" />,
    name: 'Vải cotton trắng',
    code: 'MAT001',
    category: 'Vải',
    price: '85,000đ/mét',
    supplier: 'Công ty Dệt May ABC',
    stock: 150,
    unit: 'mét',
    min: 50,
    max: 300,
    lastImport: '10/1/2024',
    value: '12,750,000đ',
    status: 'Đủ hàng',
  },
  {
    icon: <Package size={34} className="text-blue-600 bg-blue-100 p-1 rounded-md" />,
    name: 'Vải jean xanh',
    code: 'MAT002',
    category: 'Vải',
    price: '120,000đ/mét',
    supplier: 'Công ty Dệt May XYZ',
    stock: 25,
    unit: 'mét',
    min: 40,
    max: 200,
    lastImport: '5/1/2024',
    value: '3,000,000đ',
    status: 'Sắp hết',
  },
  {
    icon: <Package size={34} className="text-purple-600 bg-purple-100 p-1 rounded-md" />,
    name: 'Chỉ may màu đen',
    code: 'MAT003',
    category: 'Chỉ may',
    price: '15,000đ/ống',
    supplier: 'Công ty Phụ liệu DEF',
    stock: 200,
    unit: 'ống',
    min: 100,
    max: 500,
    lastImport: '15/1/2024',
    value: '3,000,000đ',
    status: 'Đủ hàng',
  },
  {
    icon: <Package size={34} className="text-green-600 bg-green-100 p-1 rounded-md" />,
    name: 'Nút áo nhựa trắng',
    code: 'MAT004',
    category: 'Nút',
    price: '500đ/cái',
    supplier: 'Công ty Phụ liệu GHI',
    stock: 5000,
    unit: 'cái',
    min: 1000,
    max: 10000,
    lastImport: '12/1/2024',
    value: '2,500,000đ',
    status: 'Đủ hàng',
  },
  {
    icon: <Package size={34} className="text-yellow-600 bg-yellow-100 p-1 rounded-md" />,
    name: 'Khóa kéo kim loại',
    code: 'MAT005',
    category: 'Khóa kéo',
    price: '8,000đ/cái',
    supplier: 'Công ty Phụ liệu JKL',
    stock: 0,
    unit: 'cái',
    min: 200,
    max: 1000,
    lastImport: '20/12/2023',
    value: '0đ',
    status: 'Hết hàng',
  },
  {
    icon: <Package size={34} className="text-blue-600 bg-blue-100 p-1 rounded-md" />,
    name: 'Vải lót áo',
    code: 'MAT006',
    category: 'Vải',
    price: '45,000đ/mét',
    supplier: 'Công ty Dệt May MNO',
    stock: 400,
    unit: 'mét',
    min: 100,
    max: 300,
    lastImport: '18/1/2024',
    value: '18,000,000đ',
    status: 'Dư thừa',
  },
];

export default function MaterialsManagementPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả danh mục');
  const [status, setStatus] = useState('Tất cả trạng thái');
  const [materialList] = useState(materialData);

  const summary = {
    totalMaterials: materialList.length,
    needToImport:
      materialList.filter(e => e.status === 'Sắp hết').length +
      materialList.filter(e => e.status === 'Hết hàng').length,
    inventoryCost:
      materialList
        .reduce((sum, e) => {
          const num = Number(e.value.replace(/[^\d]/g, ''));
          return sum + num;
        }, 0)
        .toLocaleString('vi-VN') + 'đ',
    avgInventoryLevel:
      (
        (materialList.reduce((sum, e) => sum + e.stock / e.max, 0) / materialList.length) *
        100
      ).toFixed(0) + '%',
  };

  const filtered = materialList.filter(e => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.supplier.toLowerCase().includes(search.toLowerCase()) ||
      e.status.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Tất cả danh mục' || e.category === category;
    const matchStatus = status === 'Tất cả trạng thái' || e.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Nguyên Vật Liệu</h1>
          <p className="text-gray-600">Theo dõi và quản lý kho nguyên vật liệu sản xuất</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} /> Thêm vật liệu
        </button>
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Package size={32} className="text-blue-600" />}
          label="Tổng vật liệu"
          value={summary.totalMaterials}
        />
        <SummaryCard
          icon={<Warning size={32} className="text-yellow-600" />}
          label="Cần nhập thêm"
          value={summary.needToImport}
        />
        <SummaryCard
          icon={<TrendUp size={32} className="text-green-600" />}
          label="Giá trị kho"
          value={summary.inventoryCost}
        />
        <SummaryCard
          icon={<TrendUp size={32} className="text-purple-600" />}
          label="Mức tồn kho TB"
          value={summary.avgInventoryLevel}
        />
      </div>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        categoryOptions={[
          'Tất cả danh mục',
          'Vải',
          'Chỉ may',
          'Nút',
          'Khóa kéo',
          'Phụ liệu',
          'Khác',
        ]}
        statusOptions={['Tất cả trạng thái', 'Đủ hàng', 'Sắp hết', 'Hết hàng', 'Dư thừa']}
        placeholder="Tìm kiếm theo tên vật liệu, trạng thái"
      />

      <div className="grid grid-cols-1 smallLaptop:grid-cols-2 miniLaptop:grid-cols-3 gap-6">
        {filtered.map((material, index) => (
          <MaterialCard key={index} {...material} />
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Warning size={24} className="text-yellow-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Cảnh báo tồn kho</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Có 2 vật liệu cần được nhập thêm hoặc đã hết hàng. Hãy liên hệ nhà cung cấp để đặt
              hàng bổ sung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

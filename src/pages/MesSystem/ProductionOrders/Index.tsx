import { useState } from 'react';
import { MagnifyingGlass, Eye, PencilSimple, Trash, Plus, Funnel } from '@phosphor-icons/react';

const initialOrders = [
  {
    id: '#DH2024001',
    date: '2024-01-15',
    customer: 'Công ty TNHH Nike',
    product: 'Áo sơ mi nam dài tay',
    quantity: 500,
    status: 'Đang sản xuất',
    priority: 'Cao',
    progress: 75,
    due: '2024-01-25',
  },
  {
    id: '#DH2024002',
    date: '2024-01-18',
    customer: 'Công ty TNHH Con Cưng',
    product: 'Quần jean nữ',
    quantity: 300,
    status: 'Đang sản xuất',
    priority: 'Trung bình',
    progress: 45,
    due: '2024-01-28',
  },
  {
    id: '#DH2024003',
    date: '2024-01-10',
    customer: 'Cửa hàng Kids Fashion',
    product: 'Áo thun trẻ em',
    quantity: 800,
    status: 'Hoàn thành',
    priority: 'Thấp',
    progress: 100,
    due: '2024-01-20',
  },
  {
    id: '#DH2024004',
    date: '2024-01-20',
    customer: 'Công ty Richard',
    product: 'Váy dạ hội',
    quantity: 200,
    status: 'Chờ xử lý',
    priority: 'Cao',
    progress: 0,
    due: '2024-02-05',
  },
];

const statusMap = {
  'Đang sản xuất': 'bg-blue-50 text-blue-800 border-blue-200',
  'Hoàn thành': 'bg-green-50 text-green-800 border-green-200',
  'Chờ xử lý': 'bg-yellow-50 text-yellow-800 border-yellow-200',
};
const statusTextMap = {
  'Đang sản xuất': 'Đang sản xuất',
  'Hoàn thành': 'Hoàn thành',
  'Chờ xử lý': 'Chờ xử lý',
};
const priorityMap = {
  Cao: 'bg-red-50 text-red-800 border-red-200',
  'Trung bình': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  Thấp: 'bg-green-50 text-green-800 border-green-200',
};

import AddEditProductModal from '../CommonComponents/Modals/AddEditProductModal';

export default function ProductionOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
    setConfirmDeleteId(null);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng Sản Xuất</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng sản xuất</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={20} className="mr-2" /> Tạo đơn hàng mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className='className="flex items-center gap-3"'>
          <div className="flex flex-col tablet:flex-row space-y-4 tablet:space-y-0 tablet:space-x-4">
            <div className="relative flex-1">
              <MagnifyingGlass
                className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                size={18}
              />
              <input
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Tìm kiếm theo khách hàng, sản phẩm, mã đơn hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Funnel size={18} className="lucide lucide-filter h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang sản xuất</option>
                <option value="completed">Hoàn thành</option>
                <option value="delayed">Trễ hạn</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ĐƠN HÀNG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KHÁCH HÀNG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SẢN PHẨM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SỐ LƯỢNG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ƯU TIÊN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TIẾN ĐỘ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HẠN HOÀN THÀNH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusMap[order.status]}`}
                    >
                      {statusTextMap[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityMap[order.priority]}`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{order.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${order.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900"> {order.due}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-purple-600 hover:text-indigo-900"
                        onClick={() => {
                          setEditOrder(order);
                          setOpenModal(true);
                        }}
                      >
                        <PencilSimple size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setConfirmDeleteId(order.id)}
                        title="Xóa đơn hàng"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {openModal && (
        <AddEditProductModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditOrder(null);
          }}
          order={editOrder}
        />
      )}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa đơn hàng</h3>
            <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa đơn hàng này không?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setConfirmDeleteId(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDeleteOrder(confirmDeleteId)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

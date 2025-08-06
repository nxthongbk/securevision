import React from 'react';

interface AddEditProductModalProps {
  open: boolean;
  onClose: () => void;
  order?: any | null;
}

const statusOptions = [
  { value: 'Chờ xử lý', label: 'Chờ xử lý' },
  { value: 'Đang sản xuất', label: 'Đang sản xuất' },
  { value: 'Hoàn thành', label: 'Hoàn thành' },
];
const priorityOptions = [
  { value: 'Cao', label: 'Cao' },
  { value: 'Trung bình', label: 'Trung bình' },
  { value: 'Thấp', label: 'Thấp' },
];

export default function AddEditProductModal({ open, onClose, order }: AddEditProductModalProps) {
  if (!open) return null;
  const isEdit = !!order;
  // Controlled form state for edit/add
  const [customer, setCustomer] = React.useState(order?.customer || '');
  const [product, setProduct] = React.useState(order?.product || '');
  const [quantity, setQuantity] = React.useState(order?.quantity?.toString() || '0');
  const [status, setStatus] = React.useState(order?.status || statusOptions[0].value);
  const [priority, setPriority] = React.useState(order?.priority || priorityOptions[1].value);
  const [startDate, setStartDate] = React.useState(
    order?.date || new Date().toISOString().slice(0, 10)
  );
  const [due, setDue] = React.useState(order?.due || new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    if (order) {
      setCustomer(order.customer || '');
      setProduct(order.product || '');
      setQuantity(order.quantity?.toString() || '0');
      setStatus(order.status || statusOptions[0].value);
      setPriority(order.priority || priorityOptions[1].value);
      setStartDate(order.date || new Date().toISOString().slice(0, 10));
      setDue(order.due || new Date().toISOString().slice(0, 10));
    } else {
      setCustomer('');
      setProduct('');
      setQuantity('0');
      setStatus(statusOptions[0].value);
      setPriority(priorityOptions[1].value);
      setStartDate(new Date().toISOString().slice(0, 10));
      setDue(new Date().toISOString().slice(0, 10));
    }
  }, [order, open]);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors text-3xl"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form className="space-y-4">
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={customer}
                  onChange={e => setCustomer(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức độ ưu tiên
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  {priorityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  value={due}
                  onChange={e => setDue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

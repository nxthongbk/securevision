import React from 'react';

export interface AddEditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function AddEditEmployeeModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: AddEditEmployeeModalProps) {
  const [form, setForm] = React.useState({
    name: initialData?.name || '',
    position: initialData?.position || '',
    department: initialData?.department || 'Sản xuất',
    experience: initialData?.experience || 0,
    wage: initialData?.wage || 0,
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    shift: initialData?.shift || 'Ca sáng (7:00-15:00)',
    status: initialData?.status || 'Đang làm việc',
    startDate: initialData?.startDate || new Date().toISOString().slice(0, 10),
    efficiency: initialData?.efficiency || 80,
    skills: initialData?.skills ? initialData.skills.join(', ') : '',
  });

  React.useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        position: initialData.position || '',
        department: initialData.department || 'Sản xuất',
        experience: initialData.experience || 0,
        wage: initialData.wage || 0,
        phone: initialData.phone || '',
        email: initialData.email || '',
        shift: initialData.shift || 'Ca sáng (7:00-15:00)',
        status: initialData.status || 'Đang làm việc',
        startDate: initialData.startDate || new Date().toISOString().slice(0, 10),
        efficiency: initialData.efficiency || 80,
        skills: initialData.skills ? initialData.skills.join(', ') : '',
      });
    }
  }, [initialData, open]);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      experience: Number(form.experience),
      wage: Number(form.wage),
      efficiency: Number(form.efficiency),
      skills: form.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-8 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          {initialData ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vị trí</label>
              <input
                name="position"
                value={form.position}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bộ phận</label>
              <select
                name="department"
                value={form.department}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option>Sản xuất</option>
                <option>Kiểm định</option>
                <option>Kho vận</option>
                <option>Bảo trì</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kinh nghiệm (năm)</label>
              <input
                name="experience"
                type="number"
                value={form.experience}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lương theo giờ (VNĐ)</label>
              <input
                name="wage"
                type="number"
                value={form.wage}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ca làm việc</label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option>Ca sáng (7:00-15:00)</option>
                <option>Ca chiều (15:00-23:00)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option>Đang làm việc</option>
                <option>Đang nghỉ phép</option>
                <option>Nghỉ việc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày vào làm</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Điểm hiệu suất (%)</label>
              <input
                name="efficiency"
                type="number"
                value={form.efficiency}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="tablet:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Kỹ năng (phân cách bằng dấu phẩy)
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="May công nghiệp, May tay, Hoàn thiện"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {initialData ? 'Lưu' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

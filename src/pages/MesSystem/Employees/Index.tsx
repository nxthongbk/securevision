import { useState } from 'react';
import {
  Plus,
  Users,
  Clock,
  Medal,
  NotePencil,
  Trash,
  Phone,
  EnvelopeSimple,
} from '@phosphor-icons/react';
import SummaryCard from '../CommonComponents/SummaryCard/SummaryCard';
import AddEditEmployeeModal from '../CommonComponents/Modals/AddEditEmployeeModal';
import SearchFilterBar from '../CommonComponents/SearchBar/SearchFilterBar';

const employeesData = [
  {
    id: 'EMP001',
    name: 'Nguyễn Thị Hoa',
    position: 'Thợ may chính',
    department: 'Sản xuất',
    experience: 8,
    wage: 85000,
    efficiency: 95,
    status: 'Đang làm việc',
    shift: 'Ca sáng (7:00-15:00)',
    skills: ['May công nghiệp', 'May tay', 'Hoàn thiện'],
    phone: '0901234567',
    email: 'hoa.nguyen@company.com',
    color: 'blue',
  },
  {
    id: 'EMP002',
    name: 'Trần Văn Nam',
    position: 'Thợ cắt vải',
    department: 'Sản xuất',
    experience: 12,
    wage: 95000,
    efficiency: 92,
    status: 'Đang làm việc',
    shift: 'Ca sáng (7:00-15:00)',
    skills: ['Cắt vải', 'Đọc rập', 'Kiểm tra CL'],
    phone: '0901234568',
    email: 'nam.tran@company.com',
    color: 'indigo',
  },
  {
    id: 'EMP003',
    name: 'Lê Thị Mai',
    position: 'Tổ trưởng',
    department: 'Sản xuất',
    experience: 15,
    wage: 120000,
    efficiency: 98,
    status: 'Đang làm việc',
    shift: 'Ca sáng (7:00-15:00)',
    skills: ['Quản lý tổ', 'May công nghiệp', 'Kiểm tra CL', '+1'],
    phone: '0901234569',
    email: 'mail.le@company.com',
    color: 'purple',
  },
  {
    id: 'EMP004',
    name: 'Phạm Văn Đức',
    position: 'Thợ may',
    department: 'Sản xuất',
    experience: 3,
    wage: 65000,
    efficiency: 78,
    status: 'Đang làm việc',
    shift: 'Ca chiều (15:00-23:00)',
    skills: ['May cơ bản', 'Sơ chế'],
    phone: '0901234570',
    email: 'duc.pham@company.com',
    color: 'yellow',
  },
  {
    id: 'EMP005',
    name: 'Hoàng Thị Lan',
    position: 'Kiểm tra chất lượng',
    department: 'Kiểm tra',
    experience: 6,
    wage: 75000,
    efficiency: 88,
    status: 'Đang nghỉ phép',
    shift: 'Ca sáng (7:00-15:00)',
    skills: ['Kiểm tra CL', 'Đo lường', 'Báo cáo'],
    phone: '0901234571',
    email: 'lan.hoang@company.com',
    color: 'pink',
  },
];

export default function EmployeesManagementPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('Tất cả bộ phận');
  const [status, setStatus] = useState('Tất cả trạng thái');
  const [employeeList, setEmployeeList] = useState(employeesData);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteEmployee = (id: string) => {
    setEmployeeList(prev => prev.filter(employee => employee.id !== id));
    setConfirmDeleteId(null);
  };

  const summary = {
    total: employeeList.length,
    working: employeeList.filter(e => e.status === 'Đang làm việc').length,
    leave: employeeList.filter(e => e.status === 'Nghỉ phép').length,
    avgScore: employeeList.length
      ? Math.round(
          employeeList.reduce((sum, e) => sum + (e.efficiency || 0), 0) / employeeList.length
        )
      : 0,
  };

  const filtered = employeeList.filter(e => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = !department || department === 'Tất cả bộ phận' || e.department === department;
    const matchStatus = !status || status === 'Tất cả trạng thái' || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  function handleAdd() {
    setEditEmployee(null);
    setShowModal(true);
  }

  function handleEdit(emp) {
    setEditEmployee(emp);
    setShowModal(true);
  }

  function handleSubmit(data) {
    if (editEmployee) {
      setEmployeeList(list => list.map(e => (e.id === editEmployee.id ? { ...e, ...data } : e)));
    } else {
      const newEmp = {
        id: 'EMP' + String(employeeList.length + 1).padStart(3, '0'),
        ...data,
        color: 'blue',
      };
      setEmployeeList(list => [...list, newEmp]);
    }
    setShowModal(false);
    setEditEmployee(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Nhân Viên</h1>
          <p className="text-gray-600">Quản lý thông tin và phân công nhân viên</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus size={20} /> Thêm nhân viên
        </button>
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Users size={32} className="text-blue-600" />}
          label="Tổng nhân viên"
          value={summary.total}
        />
        <SummaryCard
          icon={<Medal size={32} className="text-green-600" />}
          label="Đang làm việc"
          value={summary.working}
        />
        <SummaryCard
          icon={<Clock size={32} className="text-yellow-600" />}
          label="Nghỉ phép"
          value={summary.leave}
        />
        <SummaryCard
          icon={<Medal size={32} className="text-purple-600" />}
          label="Điểm TB"
          value={summary.avgScore}
        />
      </div>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={department}
        setCategory={setDepartment}
        status={status}
        setStatus={setStatus}
        categoryOptions={['Tất cả bộ phận', 'Sản xuất', 'Kiểm định', 'Kho vận', 'Bảo trì']}
        statusOptions={['Tất cả trạng thái', 'Đang làm việc', 'Nghỉ phép', 'Nghỉ việc']}
        placeholder="Tìm kiếm theo tên, vị trí, má nhân viên..."
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-3 gap-6">
        {filtered.map(emp => (
          <div
            key={emp.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow "
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white bg-${emp.color}-600`}
                >
                  {emp.name
                    .split(' ')
                    .map(w => w[0])
                    .join('')}
                </span>
                <div>
                  <div className="font-semibold text-gray-900">{emp.name}</div>
                  <div className="text-sm text-gray-600">#{emp.id}</div>
                </div>
              </div>

              {emp.status === 'Đang làm việc' && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Đang làm việc
                </span>
              )}
              {emp.status === 'Đang nghỉ phép' && (
                <span className="px-2 py-1 rounded-full text-xs font-medium  bg-yellow-100 text-yellow-800">
                  Đang nghỉ phép
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{emp.position}</div>
                <div className="text-sm text-gray-600">{emp.department}</div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Kinh nghiệm:</span>
                <span className="font-medium">{emp.experience} năm</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Lương/giờ:</span>{' '}
                <span className="font-medium">{emp.wage.toLocaleString()}đ</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hiệu suất:</span>
                <span
                  className={`font-medium ${
                    emp.efficiency > 90
                      ? 'text-green-600'
                      : emp.efficiency > 80
                        ? 'text-blue-600'
                        : emp.efficiency > 70
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                  }`}
                >
                  {emp.efficiency}%
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ca làm việc:</p>
                <p className="text-sm font-medium">{emp.shift}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Kỹ năng:</p>
                <div className="flex flex-wrap gap-1">
                  {emp.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{emp.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <EnvelopeSimple className="h-4 w-4" />
                <span className="truncate">{emp.email}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button
                className="text-blue-600 hover:text-blue-900 p-1"
                onClick={() => handleEdit(emp)}
              >
                <NotePencil size={20} className="text-blue-600" />
              </button>
              <button
                className="text-red-600 hover:text-red-900 p-1"
                onClick={() => setConfirmDeleteId(emp.id)}
              >
                <Trash size={20} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Employee Modal */}
      <AddEditEmployeeModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditEmployee(null);
        }}
        onSubmit={handleSubmit}
        initialData={editEmployee}
      />

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa nhân viên</h3>
            <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa nhân viên này không?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setConfirmDeleteId(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDeleteEmployee(confirmDeleteId)}
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

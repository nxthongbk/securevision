import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, Factory, ClipboardText, GitBranch, Shield } from '@phosphor-icons/react';
import BarChart3Icon from '~/pages/MesSystem/CommonComponents/CustomIcons/BarChart3Icon';

const navItems = [
  {
    label: 'Dashboard',
    icon: (
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
        className="lucide lucide-layout-dashboard h-5 w-5 text-blue-600"
      >
        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
      </svg>
    ),
    to: '/dashboard',
  },
  {
    label: 'Đơn hàng SX',
    icon: <ClipboardText size={24} className="text-green-600" />,
    to: '/orders',
  },
  {
    label: 'Quy trình SX',
    icon: <GitBranch size={24} className="text-purple-600" />,
    to: '/processing',
  },
  {
    label: 'Nhân viên',
    icon: <Users size={24} className="text-indigo-600" />,
    to: '/employees',
  },
  {
    label: 'Nguyên liệu',
    icon: <Package size={24} className="text-orange-600" />,
    to: '/materials',
  },
  {
    label: 'Thiết bị',
    icon: <Factory mirrored size={24} className="text-gray-600" />,
    to: '/devices',
  },
  {
    label: 'Kiểm tra CL',
    icon: <Shield size={24} className="text-red-600" />,
    to: '/quality-control',
  },
  {
    label: 'Báo cáo',
    icon: <BarChart3Icon className="text-teal-600 h-6 w-6" />,
    to: '/reports',
  },
];

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && open) {
        // Optionally, you can handle responsive logic elsewhere
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}
    >
      <div
        className={`flex items-center py-5 border-b border-gray-100 transition-all duration-300 ${open ? 'px-6 gap-2' : 'px-0 justify-center'}`}
      >
        <div className={`w-9 h-9}`}>
          <Factory mirrored size={34} className={`text-blue-600 `} />
        </div>

        {open && (
          <div className="ml-2">
            <div className="text-lg font-bold text-gray-900leading-tight">MES</div>
            <div className="text-sm text-gray-500">Poseidon</div>
          </div>
        )}
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 font-mediumtransition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${open ? '' : 'justify-center px-0'}`
                }
                end
              >
                <span className={open ? '' : 'w-6 h-6 '}>{item.icon}</span>
                {open && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

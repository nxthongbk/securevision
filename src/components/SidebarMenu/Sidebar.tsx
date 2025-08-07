import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, Factory, ClipboardText, GitBranch, Shield, Bird } from '@phosphor-icons/react';

const navItems = [
  {
    label: 'Cameras',
    icon: <ClipboardText size={20} className="" />,
    to: '/cameras',
  },
  { label: 'Birdseye', icon: <GitBranch size={20} />, to: '/birdseye' },
  { label: 'Events', icon: <Shield size={20} />, to: '/events' },
  { label: 'Exports', icon: <Package size={20} />, to: '/exports' },
  { label: 'Storage', icon: <Factory size={20} />, to: '/storage' },
  { label: 'System', icon: <Users size={20} />, to: '/system' },
  { label: 'Config', icon: <ClipboardText size={20} />, to: '/config' },
  { label: 'Logs', icon: <GitBranch size={20} />, to: '/logs' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-56 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center h-16 px-4 border-b border-gray-100">
          <Bird size={32} className="text-blue-900 mr-2" />
          <span className="text-lg font-bold tracking-wide text-blue-900">FRIGATE</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="px-4 pb-4 text-sm text-gray-500 space-y-1">
        <a href="#" className="block hover:underline">
          Documentation
        </a>
        <a href="#" className="block hover:underline">
          GitHub
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;

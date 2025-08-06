import './style.scss';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/components/SidebarMenu/Sidebar';
import Header from '~/components/Header/Header';

const MesSystemMain = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mes-system h-screen bg-gray-50 flex">
      <div
        className={`fixed left-0 top-0 h-full border-r border-gray-200 bg-white shadow-lg z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}
      >
        <Sidebar open={sidebarOpen} />
      </div>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MesSystemMain;

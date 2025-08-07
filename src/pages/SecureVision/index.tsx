import './style.scss';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/components/SidebarMenu/Sidebar';
import Header from '~/components/Header/Header';

const SecureSystemMain = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className="h-screen bg-gray-50 flex secure-system">
      <div className="hidden smallLaptop:block fixed left-0 top-0 h-full border-r border-gray-200 bg-white shadow-lg z-40 w-56">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="smallLaptop:hidden fixed inset-0 z-50 flex">
          <div className="w-56 h-full bg-white border-r border-gray-200 shadow-lg">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}
      <div className="flex-1 flex flex-col smallLaptop:ml-56">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SecureSystemMain;

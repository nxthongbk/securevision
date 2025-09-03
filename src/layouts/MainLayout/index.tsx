import HeaderAccessTenant from './components/HeaderAccessTenant';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { Outlet, useLocation } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  return (
    <>
      {tenantCode && <HeaderAccessTenant />}
      <div className={`flex flex-col min-h-screen ${tenantCode ? ' pt-14' : ''}`}>
        <TopBar />
        {/* Main content */}
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>

        {/* Sidebar at the bottom */}
        <SideBar/>
      </div>
    </>
  );
}

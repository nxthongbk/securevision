import HeaderAccessTenant from './components/HeaderAccessTenant';
import SideBar from './components/SideBar';
import { Outlet, useLocation } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  return (
    <>
      {tenantCode && <HeaderAccessTenant />}
      <div className={`miniLaptop:flex  ${tenantCode ? ' pt-14' : ''}`}>
        <SideBar />
        <div className='flex-1 overflow-hidden '>
          <Outlet />
        </div>
      </div>
    </>
  );
}

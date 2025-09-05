import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { ReactNode, useContext, useMemo } from 'react';
import { AppContext } from '~/contexts/app.context';
import { useSidebarOptions } from './useSidebarOptions';
import SidebarLine  from '~/assets/sidebar/sidebar-line.svg';

interface IMenuItemProps {
  icon: ReactNode;
  path: string;
  title: string;
  bindActive?: boolean;
}

const MenuItem = ({ path, title, bindActive = false }: IMenuItemProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  const isActive = path === location.pathname || bindActive;
  const baseClass =
    'relative px-4 py-2 font-semibold text-sm transition-colors flex flex-col items-center text-white hover:text-[#7CD4FD]';
  const activeClass =
    'text-[#7CD4FD] ' +
    'before:content-[""] before:absolute before:left-1/2 before:-translate-x-1/2 ' +
    'before:-bottom-3 before:w-8 before:h-3 before:rounded-full ' +
    'before:bg-[#7CD4FD] before:opacity-80 before:blur-md ' +
    'pulsate';




  return (
    <Link to={tenantCode ? `${path}?tenantCode=${tenantCode}` : path}>
      <span className={classNames(baseClass, isActive ? activeClass : '')}>
        {title.split(' ')[0].toUpperCase()}
      </span>
    </Link>
  );
};

export default function SideBar() {
  const { userInfo } = useContext(AppContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  const userRole = userInfo?.roles?.[0];
  const { sysAdminSidebar, tenantSidebar } = useSidebarOptions();

  const sidebarOptions = useMemo(() => {
    if (userRole === 'SYSADMIN' && !tenantCode) {
      return sysAdminSidebar;
    } else {
      return tenantSidebar;
    }
  }, [sysAdminSidebar, tenantCode, tenantSidebar, userRole]);

  return (
    <div className="relative w-full">
      {/* SVG is the navbar background */}
      <img
        src={SidebarLine}
        alt="navbar decorative line"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[110%] max-w-none 
                  pointer-events-none select-none z-40"
      />

      {/* Navbar items (no background or border) */}
      <div
        className="fixed bottom-0.5 left-1/2 -translate-x-1/2 
                  px-6 py-2 z-50
                  flex flex-row items-center gap-6"
      >
        {sidebarOptions.map((option) => (
          <MenuItem
            key={option.id}
            title={option.title}
            icon={option.icon}
            path={option.path}
          />
        ))}
      </div>
    </div>

  );
}

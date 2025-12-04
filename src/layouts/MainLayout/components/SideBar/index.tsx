import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { ReactNode, useContext, useMemo } from 'react';
import { AppContext } from '~/contexts/app.context';
import { useSidebarOptions } from './useSidebarOptions';
import SidebarLine from '~/assets/sidebar/sidebar-line.svg';
import { useTranslation } from "react-i18next";

interface IMenuItemProps {
  icon?: ReactNode; // optional since you removed icons
  path: string;
  itemKey: string;
  bindActive?: boolean;
}

const MenuItem = ({ path, itemKey, bindActive = false }: IMenuItemProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  const isActive = path === location.pathname || bindActive;
  const { i18n } = useTranslation();
  const { LABELS } = useSidebarOptions(); // pull labels here

  // Outer wrapper must be `relative` so the activeClass before-pseudo works
  const wrapperClass =
    'relative px-2 py-2 font-semibold transition-colors text-white hover:text-[#7CD4FD]';

  const activeClass =
    'text-[#7CD4FD] ' +
    'before:content-[""] before:absolute before:left-1/2 before:-translate-x-1/2 ' +
    'before:-bottom-3 before:w-8 before:h-3 before:rounded-full ' +
    'before:bg-[#7CD4FD] before:opacity-80 before:blur-md ' +
    'pulsate';

  // Centered content box that reserves vertical space for up to 2 lines
  const contentBoxClass = classNames(
    // widths slightly larger as you requested
    "w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px]",
    // reserve vertical space (min-height so lines won't change layout)
    "min-h-[40px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[52px]",
    // center text vertically + horizontally
    "flex items-center justify-center",
    // text sizing and wrapping
    "text-xs sm:text-sm md:text-base lg:text-lg text-center break-words leading-snug"
  );

  const displayTitle = LABELS[itemKey]?.[i18n.language] ?? LABELS[itemKey]?.en ?? '';

  return (
    <Link to={tenantCode ? `${path}?tenantCode=${tenantCode}` : path}>
      <div className={classNames(wrapperClass, isActive ? activeClass : '')}>
        <div className={contentBoxClass}>
          <span>{displayTitle}</span>
        </div>
      </div>
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

      {/* Navbar items */}
      <div
        className="fixed -bottom-2 left-1/2 -translate-x-1/2 
                  px-6 py-2 z-50
                  flex flex-row items-center gap-6"
      >
        {sidebarOptions.map((option) => (
          <MenuItem
            key={option.id}
            itemKey={option.key}
            path={option.path}
          />
        ))}
      </div>
    </div>
  );
}

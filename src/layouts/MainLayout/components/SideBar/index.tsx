import { IconButton, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ReactNode, useContext, useMemo } from 'react';
import { AppContext } from '~/contexts/app.context';
import AvatarPopper from './AvatarPopper';
import { useSidebarOptions } from './useSidebarOptions';
import IconImg from '~/assets/images/svg/Icon.svg';

interface IMenuItemProps {
  icon: ReactNode;
  path: string;
  title: string;
  bindActive?: boolean;
}

const MenuItem = ({ icon, path, title, bindActive = false }: IMenuItemProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  const buttonClassName = classNames('w-10 h-10 !rounded-md', {
    '!bg-[var(--primary)] !text-[white]': path === location.pathname || bindActive
  });

  return (
    <Link to={tenantCode ? `${path}?tenantCode=${tenantCode}` : path}>
      <Tooltip title={title} placement='right' arrow>
        <IconButton className={buttonClassName}>{icon}</IconButton>
      </Tooltip>
    </Link>
  );
};

export default function SideBar() {
  const { userInfo } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
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
    <div
      className={`min-w-[64px] border border-b border-[var(--border-color)] miniLaptop:flex hidden miniLaptop:flex-col justify-between px-4 ${tenantCode ? ' min-h-[calc(100vh-56px)] ' : ' miniLaptop:min-h-screen '}`}
    >
      <div className='flex items-center justify-center mt-6 miniLaptop:flex-col'>
        <img
          src={IconImg}
          className='w-[40px] h-[40px] mb-4 cursor-pointer'
          onClick={() => {
            navigate('/');
          }}
        />
        <div className='flex-col items-center hidden gap-1 miniLaptop:flex'>
          {sidebarOptions.map((option) => (
            <MenuItem key={option.id} title={option.title} icon={option.icon} path={option.path} />
          ))}
        </div>
      </div>

      <AvatarPopper />
    </div>
  );
}

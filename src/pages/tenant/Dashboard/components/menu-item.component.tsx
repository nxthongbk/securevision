import { useState } from 'react';
import { Typography, Menu } from '@mui/material';
import classNames from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';
import PopupRemoveDashboard from './remove-dashboard.component';
import AvatarTableRow from '~/components/AvatarTableRow';
import EditDashboard from './edit-dashboard.component';

export function MenuItem(props: {
  img?: string;
  icon?: ReactNode;
  title: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  data?: any;
  tenantCode?: string;
}) {
  const { img, icon, title, active, onClick, data, tenantCode } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const classDiv = classNames(
    'flex p-[10px] justify-between gap-2 items-center max-w-[228px] miniLaptop:rounded-md cursor-pointer',
    {
      'miniLaptop:text-[#FFFFFF] miniLaptop:bg-[#007EF5] border-b-2 text-primary border-primary': active,
      'text-[#3A3D41] hover:bg-[#D9E1E8]': !active
    }
  );

  return (
    <div onClick={onClick} className={classDiv}>
      <div className='flex items-center justify-start gap-2'>
        <AvatarTableRow sx={{ width: '32px', height: '32px', borderRadius: '4px !important' }} avatarUrl={img} />

        <Typography className='hidden miniLaptop:block' variant='body3'>
          {title}
        </Typography>
      </div>

      <div className='flex justify-end' onClick={handleIconClick}>
        {icon}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {/* Thêm các item của menu ở đây */}
        <EditDashboard dataDefault={data} dashboardId={data.id} tenantCode={tenantCode} />
        <PopupRemoveDashboard dashboardId={data.id} />
      </Menu>
    </div>
  );
}

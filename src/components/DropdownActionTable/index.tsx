import { Divider, IconButton, Menu } from '@mui/material';
import { DotsThree } from '@phosphor-icons/react';
import { ReactNode, useState } from 'react';
import IconPhosphor from '~/assets/iconPhosphor';

type ItemChild = {
  key: string;
  component: ReactNode;
};
type PropsDropdown = {
  childrent?: (onChildClose?: (isClose: boolean) => void) => ItemChild[];
  mainBtn: ReactNode;
  showMenuOptions?: boolean;
};

export default function DropDownActionTable(props: PropsDropdown) {
  const { childrent, mainBtn, showMenuOptions = true } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDropdown = (isClose: boolean) => {
    if (isClose) {
      setAnchorEl(null);
    }
  };

  return (
    <>
      <div className='h-8 w-fit justify-center rounded items-center hover:bg-[var(--grey-primary-100)] hidden miniLaptop:flex text-[#00BCFF]'>

        <div className='px-3 cursor-pointer'>{mainBtn}</div>
        {showMenuOptions && <Divider orientation='vertical' variant='middle' flexItem />}
        {showMenuOptions && (
          <IconButton
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <IconPhosphor iconName='CaretDown' size={18} />
          </IconButton>
        )}


      </div>
      <div className='block miniLaptop:hidden'>
        <IconButton onClick={handleClick}>
          <DotsThree />
        </IconButton>
      </div>
      {Boolean(childrent) && (
        <Menu
          anchorEl={anchorEl}
          id='account-menu'
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1,
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                borderRadius: '4px',
                padding: '8px 12px'
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {childrent(handleCloseDropdown)?.length > 0 &&
            childrent(handleCloseDropdown)?.map((item: ItemChild) => <div key={item.key}>{item.component}</div>)}
          {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconPhosphor iconName='' size={20} />
          </ListItemIcon>
          Add another
        </MenuItem> */}
        </Menu>
      )}
    </>
  );
}

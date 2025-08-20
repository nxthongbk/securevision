import { Menu, MenuItem, MenuList, MenuProps } from '@mui/material';
import { Children, PropsWithChildren, ReactElement, isValidElement } from 'react';

export function MenuItemAutoClose({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export default function MenuAutoClose(props: MenuProps) {
  const { children, open, anchorEl, onClose } = props;

  const handleClick = () => {
    onClose?.({}, "escapeKeyDown");
  };

  const renderMenuItem = (element: ReactElement) => {
    if (!isValidElement(element)) return undefined

    if (element.type === MenuItemAutoClose) {
      return (
        <MenuItem onClick={handleClick}>
          {element}
        </MenuItem>
      );
    }
    return <MenuItem>{element}</MenuItem>;
  };

  return (
    <Menu
      id="device-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'menu-button',
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          borderRadius: '8px',
          '& .MuiMenuItem-root': {
            borderRadius: '4px',
            padding: "0px",
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuList>
        {Children.map(children, renderMenuItem)}
      </MenuList>
    </Menu>
  );
}

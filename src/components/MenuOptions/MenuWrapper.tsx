import { MenuProps } from '@mui/material';
import {
  cloneElement,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useContext,
  useState
} from 'react';

interface MenuContextType {
  open: boolean;
  anchorEl: HTMLElement;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement>>;
  handleClose: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within MenuContext.Provider');
  }

  return context;
}

export default function MenuWrapper({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MenuContext.Provider value={{ open, anchorEl, setOpen, setAnchorEl, handleClose }}>
      {children}
    </MenuContext.Provider>
  );
}

MenuWrapper.Trigger = function ({ children }: { children: ReactElement }) {
  const { setOpen, setAnchorEl } = useMenu();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  return children ? cloneElement(children, { onClick: handleClick }) : undefined;
};

MenuWrapper.Main = function ({ children }: { children: ReactElement<MenuProps> }) {
  const { open, anchorEl, handleClose } = useMenu();

  return children ? cloneElement(children, { open, anchorEl, onClose: handleClose }) : undefined;
};

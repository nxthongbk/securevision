import { DrawerProps } from '@mui/material';
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

interface DrawerContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within DrawerContext.Provider');
  }

  return context;
}

export default function DrawerWrapper({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  return <DrawerContext.Provider value={{ open, setOpen, handleClose }}>{children}</DrawerContext.Provider>;
}

DrawerWrapper.Trigger = function ({ children }: { children: ReactElement }) {
  const { setOpen } = useDrawer();

  const handleClick = () => {
    setOpen(true);
  };

  return children ? cloneElement(children, { onClick: handleClick }) : undefined;
};

DrawerWrapper.Main = function ({ children }: { children: ReactElement<DrawerProps> }) {
  const { open, handleClose } = useDrawer();

  return children ? cloneElement(children, { open, onClose: handleClose }) : undefined;
};

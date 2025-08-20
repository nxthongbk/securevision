import { DrawerProps } from '@mui/material';
import DrawerCustom from './DrawerCustom';

interface DrawerViewDetails extends DrawerProps {}

export default function DrawerViewDetails(props: DrawerViewDetails) {
  const { children, ...rest } = props;

  return (
    <DrawerCustom className='h-screen' {...rest}>
      <DrawerCustom.Body>
        {children}
      </DrawerCustom.Body>
    </DrawerCustom>
  );
}

import { FormEventHandler, ReactNode, useEffect } from 'react';
import { Box, Button, DrawerProps } from '@mui/material';
import { translation } from '~/utils/translate';
import DrawerCustom from './DrawerCustom';

export interface DrawerUpdateProps extends DrawerProps {
  children: ReactNode;
  actionLabel?: string;
  isValid: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: FormEventHandler;
}

export default function DrawerUpdate(props: DrawerUpdateProps) {
  const { children, actionLabel, isValid, isLoading, isSuccess, onClose, onSubmit, ...rest } = props;

  useEffect(() => {
    if (isSuccess) {
      onClose({}, 'escapeKeyDown');
    }
  }, [isSuccess]);

  return (
    <DrawerCustom className='h-[100vh]' onClose={onClose} {...rest}>
      <DrawerCustom.Body>
        {children}
      </DrawerCustom.Body>
      <DrawerCustom.Action>
        <Box sx={{ padding: 2, textAlign: 'center' }} >
          <Button fullWidth variant='contained' color='primary' onClick={onSubmit} disabled={!isValid || isLoading}>
            {actionLabel || translation('Lưu')}
          </Button>
        </Box>
      </DrawerCustom.Action>
    </DrawerCustom>
  );
}

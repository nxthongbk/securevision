import { Drawer, Box, Typography, Divider, DrawerProps, Stack } from '@mui/material';
import { X } from '@phosphor-icons/react';
import { Children, PropsWithChildren, isValidElement } from 'react';

export interface DrawerCustomProps extends DrawerProps {}

export default function DrawerCustom(props: DrawerCustomProps) {
  const { children, title, className, onClose, ...rest } = props;

  const handleCloseClick = () => {
    onClose({}, 'escapeKeyDown');
  };

  const body = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === DrawerCustom.Body) {
      return child;
    }
    return null;
  });

  const action = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === DrawerCustom.Action) {
      return child;
    }
    return null;
  });

  return (
    <Drawer anchor='bottom' onClose={onClose} {...rest}>
      <Stack className={className}>
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>{title}</Typography>
          <X className='ml-auto hover:cursor-pointer size-[15px]' fill='#737982' onClick={handleCloseClick} />
        </Box>
        <Divider />
        {body}
        {!!action.length && (
          <>          
            <Divider />
            {action}
          </>
        )}
      </Stack>
    </Drawer>
  );
}

DrawerCustom.Body = function ({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        padding: 2,
        overflowY: 'auto',
        flexGrow: 1,
      }}
    >
      {children}
    </Box>
  );
};

DrawerCustom.Action = function ({ children }: PropsWithChildren) {
  return <Box sx={{ padding: 2 }}>{children}</Box>;
};

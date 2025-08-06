import { Box, Dialog, DialogContent, Divider, IconButton, ListItemIcon, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import IconPhosphor from '~/assets/iconPhosphor';
import { PropsPopupcover } from './CoverModal';
import theme from '~/assets/theme';
import { translationCapitalFirst } from '~/utils/translate';

type Props = Pick<PropsPopupcover, 'title' | 'childrent' | 'sx'> & {
  btnComponent?: ReactNode;
  footerBtn?: ReactNode;
  openOver?: boolean;
};

// Create and update allocation config in one popup to avoid redundant code. Don't separate it
const PopupInfoCover = ({ childrent, btnComponent, title, footerBtn, openOver, ...rest }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [reopen, setreOpen] = useState<boolean>(false);
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setreOpen(true);
  };

  useEffect(() => {
    if (openOver) {
      handleClose();
    }
    if (!openOver && reopen) {
      handleOpen();
    }
  }, [openOver]);

  return (
    <>
      <div className='w-full h-full cursor-pointer' onClick={handleOpen}>
        {btnComponent || (
          <MenuItem>
            <div className='flex items-center justify-start w-full'>
              <ListItemIcon>
                <IconPhosphor iconName='Info' size={20} />
              </ListItemIcon>
              <Typography variant='body3'>{translationCapitalFirst('show-infos')}</Typography>
            </div>
          </MenuItem>
        )}
      </div>
      <Dialog
        {...rest}
        open={open}
        onClose={handleClose}
        sx={
          rest.sx || {
            '& .MuiPaper-root': {
              borderRadius: '8px',
              width: '600px',
              maxHeight: isTablet ? '100vh' : '80vh'
            }
          }
        }
        disableRestoreFocus
        fullScreen={isTablet}
      >
        <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
          <Box className='flex flex-col '>
            <Box className='flex items-center justify-between p-4 h-14'>
              <Typography color='var(--text-primary)' variant='h6'>
                {translationCapitalFirst(title)}
              </Typography>
              <IconButton aria-label='close' onClick={handleClose}>
                <IconPhosphor iconName='X' size={20} />
              </IconButton>
            </Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Box className='flex-1  p-4 !important max-h-[calc(90vh-70px)] tablet:max-h-[calc(80vh-140px)] overflow-y-auto'>{childrent}</Box>
            {Boolean(footerBtn) && (
              <>
                <Divider
                  sx={{
                    borderBottom: '1px solid var(--border-color)',
                    width: '100%'
                  }}
                />
                <Box className='flex items-center justify-end gap-3 p-4'>{footerBtn}</Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupInfoCover;

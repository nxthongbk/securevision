import { Box, Dialog, DialogContent, DialogProps, Divider, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

import ButtonCustom from '../ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { ReactNode } from 'react';
import { translationCapitalFirst } from '~/utils/translate';

export interface PropsPopupcover extends DialogProps {
  btnOpen: ReactNode;
  handleClose: () => void;
  open: boolean;
  childrent: ReactNode;
  title: string;
  handleSubmit: () => void;
  isValid?: boolean;
  isLoading?: boolean;
  handleOpen?: () => void;
}

// Create and update allocation config in one popup to avoid redundant code. Don't separate it
const PopupCover = ({
  btnOpen,
  handleClose,
  open,
  childrent,
  title,
  handleSubmit,
  isLoading,
  isValid,
  ...rest
}: PropsPopupcover) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <>
      {btnOpen}
      <Dialog
        fullScreen={isTablet}
        {...rest}
        open={open}
        onClose={handleClose}
        sx={
          rest.sx || {
            '& .MuiPaper-root': {
              borderRadius: '8px',
              width: '600px',
              maxHeight: '100vh'
            }
          }
        }
        disableRestoreFocus
      >
        <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
          <form onSubmit={handleSubmit}>
            <Box className='flex flex-col '>
              <Box className='flex justify-between items-center p-4 h-[56px]'>
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
              <Box className='flex-1  p-4 !important max-h-[calc(100vh-140px)] tablet:max-h-[calc(80vh-140px)] overflow-y-auto'>{childrent}</Box>
              <Divider
                sx={{
                  borderBottom: '1px solid var(--border-color)',
                  width: '100%'
                }}
              />
              <Box className='flex justify-end items-center p-4 gap-3'>
                <div className='hidden tablet:block'>
                  <ButtonCustom
                    variant='outlined'
                    onClick={handleClose}
                    startIcon={<IconPhosphor iconName='X' size={18} />}
                  >
                    <Typography variant='button3' fontWeight={600}>
                      {translationCapitalFirst('cancel')}
                    </Typography>
                  </ButtonCustom>
                </div>
                <div className='w-full tablet:w-fit'>
                  <ButtonCustom
                    variant='contained'
                    color='primary'
                    type='submit'
                    // onClick={handleSubmit}
                    startIcon={<IconPhosphor iconName='Check' size={18} />}
                    disabled={!isValid}
                    isLoading={isLoading}
                    fullWidth
                  >
                    <Typography variant='button3' fontWeight={600}>
                      {translationCapitalFirst('save')}
                    </Typography>
                  </ButtonCustom>
                </div>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupCover;

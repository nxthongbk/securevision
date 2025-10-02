import { Box, Dialog, DialogContent, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import ButtonCustom from '../ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';

type Props = {
  message: string;
  title: string;
  handleSubmit: () => void;
  isLoading?: boolean;
  isSuccess: boolean;
  btnComponent?: ReactNode;
  customGroupActionButton?: (onClose: () => void) => JSX.Element;
  handleClosePopup?: () => void;
};

const PopupCoverDelete = ({
  message,
  title,
  handleSubmit,
  isLoading,
  isSuccess,
  btnComponent,
  customGroupActionButton,
  handleClosePopup
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    if (handleClosePopup) {
      handleClosePopup();
    }
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [isSuccess]);
  return (
    <>
      <div className='cursor-pointer w-full justify-start' onClick={handleOpen}>
        {btnComponent || (
          <MenuItem>
            <div className='flex justify-start items-center'>
              <ListItemIcon>
                <IconPhosphor iconName='TrashSimple' size={20} />
              </ListItemIcon>
              <Typography variant='body3'>{translationCapitalFirst('delete')}</Typography>
            </div>
          </MenuItem>
        )}
      </div>
      <Dialog
        open={open}
        maxWidth={'desktop'}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '0px',
            minWidth: '340px',
            maxWidth: '400px',
            maxHeight: '80vh',
            backgroundColor: 'var(--bg)'
          }
        }}
      >
        <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
          <Box className='flex flex-col '>
            <Box className='flex flex-col justify-start items-start p-6 gap-[6px]'>
              <Typography color='var(--text-primary)' variant='h6'>
                {translationCapitalFirst(title)}
              </Typography>
              <Typography color='var(--text-secondary)' variant='body3'>
                {translationCapitalFirst(message)}
              </Typography>
            </Box>

            <Box className='flex justify-end items-center p-6 pt-0 gap-3'>
              {customGroupActionButton?.(handleClose) || (
                <>
                  <ButtonCustom
                    variant='contained'
                    onClick={handleClose}
                    //   startIcon={<IconPhosphor iconName='X' size={18} />}
                  >
                    <Typography variant='button3' fontWeight={600}>
                      {translationCapitalFirst('cancel')}
                    </Typography>
                  </ButtonCustom>
                  <ButtonCustom
                    className='hover:bg-white'
                    color='error'
                    variant='contained'
                    onClick={() => handleSubmit()}
                    //   startIcon={<IconPhosphor iconName='Check' size={18} />}
                    isLoading={isLoading}
                  >
                    <Typography variant='button3' fontWeight={600}>
                      {translationCapitalFirst('confirm')}
                    </Typography>
                  </ButtonCustom>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupCoverDelete;

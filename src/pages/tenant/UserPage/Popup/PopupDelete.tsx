import { useState } from 'react';
import { Box, Dialog, DialogContent, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import ButtonCustom from '~/components/ButtonCustom';
import { useTranslation } from 'react-i18next';
import { TrashSimple, Warning, X } from '@phosphor-icons/react';
import { generateCaptcha } from '../../LocationPage/utils';
import { useDeleteStaff } from '../handleApi';

type Props = {
  open: boolean;
  onClose: () => void;
  staffId: string;
};

let captcha = generateCaptcha();

const PopupDelete = ({ open, onClose, staffId }: Props) => {
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [userPageTranslate] = useTranslation('', { keyPrefix: 'user-page' });
  const { isPending, mutate } = useDeleteStaff(staffId);

  const handleClose = () => {
    captcha = generateCaptcha();
    onClose();
  };

  const handleDelete = () => {
    mutate();
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth={'desktop'}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            height: '400px'
          }
        }}
      >
        <DialogContent sx={{ padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Box className='flex justify-between items-center px-4 py-2.5'>
              <Typography color='var(--text-primary)' variant='h6'>
                {userPageTranslate('delete-account')}
              </Typography>
              <IconButton aria-label='close' onClick={handleClose}>
                <X size={20} />
              </IconButton>
            </Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
          </Box>
          <Stack height='100%' p='10px 16px 24px' gap='16px'>
            <Box display='flex' gap='16px' alignItems='center'>
              <Warning size={62} color='var(--red-400)' />
              <Stack gap='6px'>
                <Typography color='var(--text-primary)' variant='body3'>
                  {userPageTranslate('delete-account-confirm')}
                </Typography>
                <Typography color='var(--text-primary)' variant='body3'>
                  {userPageTranslate('delete-account-action')}
                </Typography>
              </Stack>
            </Box>
            <Typography variant='h3' textAlign='center'>
              {captcha}
            </Typography>
            <TextField
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder={userPageTranslate('enter-code')}
            />
          </Stack>
          <Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Box className='flex justify-end items-center p-4 gap-3'>
              <ButtonCustom variant='outlined' color='primary' onClick={handleClose} startIcon={<X size={18} />}>
                <Typography variant='button3' fontWeight={600}>
                  {userPageTranslate('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                className='hover:bg-white'
                color='error'
                variant='contained'
                onClick={handleDelete}
                startIcon={<TrashSimple size={18} />}
                disabled={verifyCode !== captcha}
                isLoading={isPending}
              >
                <Typography variant='button3' fontWeight={600}>
                  {userPageTranslate('delete-account')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupDelete;

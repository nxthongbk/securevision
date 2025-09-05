import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ButtonCustom from '~/components/ButtonCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useSetPassword } from '../handleApi';
import handleNotificationMessege from '~/utils/notification';

export default function PopupResetPassword({
  open,
  staffDetail,
  staffId,
  onClose
}: {
  open: boolean;
  staffDetail: Record<string, any>;
  staffId: string;
  onClose: () => void;
}) {
  const [userPageTranslate] = useTranslation('', { keyPrefix: 'user-page' });
  const mutation = useSetPassword();
  const handleResetPassword = () => {
    mutation.mutate({
      id: staffId,
      password: staffDetail?.phone
    });
    handleNotificationMessege('Đặt lại mật khẩu mặc định thành công', 'success');
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth={'desktop'}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '8px',
          minWidth: '400px',
          maxWidth: '400px',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
        <Box className='flex flex-col '>
          <Box className='flex flex-col justify-start items-start p-6 gap-[6px]'>
            <Typography color='var(--text-primary)' variant='h6'>
              {userPageTranslate('reset-password')}
            </Typography>
            <Typography color='var(--text-secondary)' variant='body3'>
              {userPageTranslate('reset-password-message')}
            </Typography>
          </Box>

          <Box className='flex justify-end items-center p-6 pt-0 gap-3'>
            <ButtonCustom variant='contained' color='tertiary' onClick={onClose}>
              <Typography variant='button3' fontWeight={600}>
                {translationCapitalFirst('cancel')}
              </Typography>
            </ButtonCustom>
            <ButtonCustom
              className='hover:bg-white'
              color='error'
              variant='contained'
              onClick={handleResetPassword}
              isLoading={mutation.isPending}
            >
              <Typography variant='button3' fontWeight={600}>
                {translationCapitalFirst('confirm')}
              </Typography>
            </ButtonCustom>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

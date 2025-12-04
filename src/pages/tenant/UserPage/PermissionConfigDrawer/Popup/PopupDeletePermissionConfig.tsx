import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import ButtonCustom from '~/components/ButtonCustom';
import { useDeletePermissionConfig } from '../../handleApi';
import { useTranslation } from 'react-i18next';

export default function PopupDeletePermissionConfig({
  open,
  permissionGroupId,
  staffCount,
  onClose
}: {
  open: boolean;
  permissionGroupId: string;
  staffCount: number;
  onClose: () => void;
}) {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const { isPending, mutate } = useDeletePermissionConfig(permissionGroupId);

  const handleDelete = () => {
    mutate();
    onClose();
  };
  const allowDelete = staffCount === 0;
  const title = hrPageTranslate(allowDelete ? 'delete-config' : 'not-able-delete-config');
  const message = hrPageTranslate(allowDelete ? 'delete-config-message' : 'not-able-delete-config-message');

  const renderGroupActionButton = (onClose) => {
    return (
      <ButtonCustom className='hover:bg-white' color='primary' variant='contained' onClick={onClose}>
        <Typography variant='button3' fontWeight={600}>
          {hrPageTranslate('close')}
        </Typography>
      </ButtonCustom>
    );
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
              {title}
            </Typography>
            <Typography color='var(--text-secondary)' variant='body3'>
              {message}
            </Typography>
          </Box>

          <Box className='flex justify-end items-center p-6 pt-0 gap-3'>
            {allowDelete ? (
              <>
                <ButtonCustom variant='contained' color='tertiary' onClick={onClose}>
                  <Typography variant='button3' fontWeight={600}>
                    {hrPageTranslate('cancel')}
                  </Typography>
                </ButtonCustom>
                <ButtonCustom
                  className='hover:bg-white'
                  color='error'
                  variant='contained'
                  onClick={handleDelete}
                  isLoading={isPending}
                >
                  <Typography variant='button3' fontWeight={600}>
                    {hrPageTranslate('confirm')}
                  </Typography>
                </ButtonCustom>
              </>
            ) : (
              renderGroupActionButton(onClose)
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

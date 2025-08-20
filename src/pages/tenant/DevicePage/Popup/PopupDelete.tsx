import { useDeleteDevice } from '../handleApi';
import { Box, Dialog, DialogContent, Divider, IconButton, ListItemIcon, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import ButtonCustom from '~/components/ButtonCustom';
import { translationCapitalFirst } from '~/utils/translate';
import IconPhosphor from '~/assets/iconPhosphor';
import { generateRandomCode } from '~/utils/generateRandomCode';
import InputCustom from '~/components/InputCustom';

export default function PopupDelete({ id }: { id: string }) {
  const { isPending, mutate, isSuccess } = useDeleteDevice();
  const [code, setCode] = useState('');
  const [newCode] = useState(generateRandomCode());
  const handleDelete = () => {
    mutate(id);
  };
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (isSuccess) handleClose();
  }, [isSuccess]);

  return (
    <>
      <div className='cursor-pointer w-full justify-start' onClick={handleOpen}>
        <div className='flex justify-start items-center'>
          <ListItemIcon>
            <IconPhosphor iconName='TrashSimple' size={20} />
          </ListItemIcon>
          <Typography variant='body3'>{translationCapitalFirst('delete')}</Typography>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            maxHeight: '80vh'
          }
        }}
        disableRestoreFocus
      >
        <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
          <Box className='flex flex-col '>
            <Box className='flex justify-between items-center p-4 h-[56px]'>
              <Typography color='var(--text-primary)' variant='h6'>
                {translationCapitalFirst('delete-device', 'devicePage')}
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
            <Box className='p-4 !important h-[270px] '>
              <Stack spacing={'16px'}>
                <Stack direction={'row'} spacing={'16px'} alignItems={'center'}>
                  <IconPhosphor iconName='Warning' size={50} color='var(--red-400)' weight='bold' />
                  <Stack spacing={1}>
                    <Typography variant='body3'>
                      {translationCapitalFirst('delete-device-message', 'devicePage')}
                    </Typography>
                    <Typography variant='body3'>
                      {translationCapitalFirst('enter-code-confirm', 'devicePage')}
                    </Typography>
                  </Stack>
                </Stack>
                <div className='w-full flex justify-center items-center'>
                  <Typography variant='h3'>{newCode}</Typography>
                </div>
                <InputCustom
                  placeholder={translationCapitalFirst('enter-code', 'devicePage')}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    setCode(e.target.value);
                  }}
                />
              </Stack>
            </Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Box className='flex justify-end items-center p-4 gap-3'>
              <ButtonCustom
                variant='contained'
                color='tertiary'
                onClick={handleClose}
                startIcon={<IconPhosphor iconName='X' size={18} />}
              >
                <Typography variant='button3' fontWeight={600}>
                  {translationCapitalFirst('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                className='hover:bg-white'
                color='error'
                variant='contained'
                onClick={handleDelete}
                startIcon={<IconPhosphor iconName='TrashSimple' size={18} />}
                isLoading={isPending}
                disabled={code !== newCode}
              >
                <Typography variant='button3' fontWeight={600}>
                  {translationCapitalFirst('delete-device', 'devicePage')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

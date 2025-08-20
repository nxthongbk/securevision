import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import IconPhosphor from '~/assets/iconPhosphor';
import PopupCover from '~/components/Modal/CoverModal';
import { PropsPopupcover } from '~/components/Modal/CoverModal';
import { translationCapitalFirst } from '~/utils/translate';

type PropsPopup = Omit<PropsPopupcover, 'btnOpen' | 'open'> & {
  isSuccess: boolean;
  label?: string;
};

export default function PopupAddCover(props: PropsPopup) {
  const { childrent, handleClose, handleOpen, handleSubmit, title, isLoading, isValid, isSuccess, label, ...rest } =
    props;
  const [open, setOpen] = useState<boolean>(false);
  const handleCloseAdd = () => {
    handleClose();
    setOpen(false);
  };
  const handleOpenAdd = () => {
    setOpen(true);
    handleOpen && handleOpen();
  };

  useEffect(() => {
    if (isSuccess) handleCloseAdd();
  }, [isSuccess]);
  return (
    <PopupCover
      {...rest}
      btnOpen={
        <>
          <div className='hidden miniLaptop:block'>
            <Button
              variant='contained'
              color='primary'
              onClick={handleOpenAdd}
              startIcon={<IconPhosphor iconName='Plus' size={20} color='white' />}
            >
              <Typography variant='button3' color='white'>
                {label ?? translationCapitalFirst('add-new')}
              </Typography>
            </Button>
          </div>
          <div className='flex gap-2 miniLaptop:hidden '>
            <div className='p-2 rounded-md bg-primary' onClick={handleOpenAdd}>
              <IconPhosphor iconName='Plus' size={20} color='white' />
            </div>
          </div>
        </>
      }
      open={open}
      handleClose={handleCloseAdd}
      title={title}
      handleSubmit={handleSubmit}
      childrent={childrent}
      isValid={isValid}
      isLoading={isLoading}
    />
  );
}

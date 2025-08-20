import IconPhosphor from '~/assets/iconPhosphor';
import PopupCover from '~/components/Modal/CoverModal';
import { ReactNode, useEffect, useState } from 'react';
import { PropsPopupcover } from '~/components/Modal/CoverModal';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
type PropsPopup = Omit<PropsPopupcover, 'btnOpen' | 'open'> & {
  isSuccess: boolean;
  btnComponent?: ReactNode;
  openOver?: boolean;
};

export default function PopupEditCover(props: PropsPopup) {
  const {
    childrent,
    handleClose,
    handleOpen,
    handleSubmit,
    title,
    isLoading,
    isValid,
    isSuccess,
    btnComponent,
    openOver,
    ...rest
  } = props;

  const [open, setOpen] = useState<boolean>(false);

  const handleCloseEdit = () => {
    handleClose();
    setOpen(false);
  };
  const handleOpenEdit = () => {
    setOpen(true);
    handleOpen && handleOpen();
  };

  useEffect(() => {
    if (isSuccess) handleCloseEdit();
  }, [isSuccess]);

  useEffect(() => {
    if (openOver) handleOpenEdit();
  }, [openOver]);

  return (
    <PopupCover
      {...rest}
      btnOpen={
        <div className='cursor-pointer' onClick={handleOpenEdit}>
          {btnComponent || (
            <MenuItem>
              <div className='flex justify-center items-center'>
                <ListItemIcon>
                  <IconPhosphor iconName='PencilSimple' size={20} />
                </ListItemIcon>
                <Typography variant='body3'>{translationCapitalFirst('update-infos')}</Typography>
              </div>
            </MenuItem>
          )}
        </div>
      }
      open={open}
      handleClose={handleCloseEdit}
      title={title}
      handleSubmit={handleSubmit}
      childrent={childrent}
      isValid={isValid}
      isLoading={isLoading}
    />
  );
}

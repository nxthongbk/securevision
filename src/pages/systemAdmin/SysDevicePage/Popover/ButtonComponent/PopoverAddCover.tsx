import IconPhosphor from '~/assets/iconPhosphor';
import PopupCover from '~/components/Modal/CoverModal';
import { useEffect, useState } from 'react';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { PropsPopupcover } from '~/components/Modal/CoverModal';
type PropsPopup = Omit<PropsPopupcover, 'btnOpen' | 'open'> & {
  isSuccess: boolean;
  label?: string;
  icon?: string;
  btnname?: string;
};

export default function PopoverAddCover(props: PropsPopup) {
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
        <MenuItem
        onClick={handleOpenAdd}
        >
          <div className='flex justify-center items-center'>
            <ListItemIcon>
              <IconPhosphor iconName={props.icon} size={20} />
            </ListItemIcon>
            <Typography variant='body3'>{props.btnname}</Typography>
          </div>
        </MenuItem>
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

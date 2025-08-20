import { Button, Popover, Typography } from '@mui/material';
import { useState } from 'react';
import IconPhosphor from '~/assets/iconPhosphor';
import PopupAdd from '../../Popup/PopupAdd';
import PopupUploadFile from '../../Popup/PopupUploadFile';
import deviceService from '~/services/device.service';
import { useTranslation } from 'react-i18next';

const PopoverButton = () => {
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExport = async () => {
    try {
      const response: any = await deviceService.exportDevice();

      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'export_devices.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download sample file:', error);
    }
  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div className='hidden miniLaptop:block'>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleExport}
          startIcon={<IconPhosphor iconName='FileXls' size={20} color='currentColor' />}
          sx={{
            mr: "16px",
            height: "38px"
          }}
        >
          <Typography variant='button3' color='currentColor'>
            {t('export-xls')}
          </Typography>
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handlePopoverOpen}
          startIcon={<IconPhosphor iconName='Plus' size={20} color='white' />}
        >
          <Typography variant='button3' color='white'>
            {t('add-new')}
          </Typography>
        </Button>
      </div>
      <div className='flex gap-2 miniLaptop:hidden '>
        <div
          onClick={handleExport}
          className='p-2 border rounded-md border-primary'
        >
          <IconPhosphor iconName='FileXls' size={20} color='currentColor' />
        </div>
        <div
          className='p-2 rounded-md bg-primary'
          onClick={handlePopoverOpen}
        >
          <IconPhosphor iconName='Plus' size={20} color='white' />
        </div>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        PaperProps={{
          style: { marginTop: '5px' }
        }}
      >
        <PopupAdd />
        <PopupUploadFile />
      </Popover>
    </>
  );
};

export default PopoverButton;

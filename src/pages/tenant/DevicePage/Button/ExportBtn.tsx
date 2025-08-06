import { Button, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import deviceService from '~/services/device.service';
import { useTranslation } from 'react-i18next';

const ExportBtn = () => {
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

  const handleExport = async () => {
    try {
      const response:any = await deviceService.exportDevice();
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'export_devices.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <Button
      variant='outlined'
      color='primary'
      onClick={handleExport}
      startIcon={<IconPhosphor iconName='FileXls' size={20} color='currentColor' />}
      sx={{
        height: "38px",
      }}
    >
      <Typography variant='button3' color='currentColor'>
        {t('export-xls')}
      </Typography>
    </Button>
  );
};

export default ExportBtn;

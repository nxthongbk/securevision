import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import PopoverAddCover from '../Popover/ButtonComponent/PopoverAddCover';
import deviceService from '~/services/device.service';
import { useTranslation } from 'react-i18next';
import handleNotificationMessege from '~/utils/notification'; // Adjust the path accordingly

const PopupUploadFile = () => {
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deviceSchema = yup.object({
    file: yup.mixed().required('File is required') // Validation cho file
  });

  const {
    formState: { isValid },
    handleSubmit,
    reset,
    setValue,
    register
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(deviceSchema),
    defaultValues: {
      file: null
    }
  });

  const { ref } = register('file');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const initFile = e.dataTransfer.files?.[0];
    if (initFile) {
      handleFileValidation(initFile);
    }
  };

  const handleFileValidation = (initFile: File) => {
    if (initFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setErrorMessage('Please upload only .xlsx files');
    } else if (initFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size should not exceed 10MB');
    } else {
      setErrorMessage(null);
      setFile(initFile);
      setValue('file', initFile, { shouldValidate: true });
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const initFile = e?.target?.files?.[0];
    if (initFile) {
      handleFileValidation(initFile);
    }
  };

  const handleDownloadSampleFile = async () => {
    try {
      const response: any = await deviceService.exportSample();

      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'sample_devices.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download sample file:', error);
    }
  };

  const handleClose = () => {
    reset(); // Reset form
    setFile(null); // Reset file
  };

  const uploadDevice = async (formData: FormData) => {
    try {
      setIsLoading(true);
      await deviceService.uploadDevice(formData);
      setIsSuccess(true);
      handleNotificationMessege('Upload successful!', 'success');
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setIsSuccess(false);
      handleNotificationMessege('Upload failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(() => {
    if (!file) {
      setErrorMessage('Please upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    uploadDevice(formData);
  });

  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col h-[360px]'>
        <div
          className='border-dashed border-2 border-blue-500 rounded-lg p-4 w-[568px] h-[300px] flex flex-col items-center justify-center text-center cursor-pointer'
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {file ? (
            <>
              <Typography variant='label3'>{file.name}</Typography>
              <Typography variant='caption' color='textSecondary'>
                {t('file-size')} {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Button
                variant='outlined'
                startIcon={<IconPhosphor iconName='UploadSimple' size={16} color='currentColor' />}
                component='label'
                sx={{ mt: 2 }}
              >
                {t('select-file')}
                <input type='file' accept='.xlsx' onChange={handleChangeFile} className='hidden' />
              </Button>
            </>
          ) : (
            <>
              <IconPhosphor iconName='UploadSimple' size={40} color='currentColor' />
              <Typography variant='label3' sx={{ mt: 2 }}>
                {t('input-drop-file-1')}{' '}
                <span style={{ color: 'var(--blue-500)', cursor: 'pointer' }}>{t('select-file')}</span>{' '}
                {t('input-drop-file-2')}
              </Typography>
              <Typography variant='caption' color='textSecondary'>
                {t('upload-caption')}
              </Typography>
              <input
                type='file'
                accept='.xlsx'
                onChange={handleChangeFile}
                className='hidden'
                id='file-upload'
                ref={ref}
              />
            </>
          )}
        </div>
        {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}

        <Button
          variant='outlined'
          color='primary'
          startIcon={<IconPhosphor iconName='DownloadSimple' size={16} color='currentColor' />}
          onClick={handleDownloadSampleFile}
          sx={{ mt: 1.25, fontSize: 14, width: 'fit-content' }}
        >
          {t('download-sample')}
        </Button>
      </div>
    );
  };

  return (
    <PopoverAddCover
      handleClose={handleClose}
      title='devicePage.add-devices'
      handleSubmit={onSubmit}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isLoading} 
      isSuccess={isSuccess}
      handleOpen={() => {}}
      icon='UploadSimple'
      btnname={t('upload-file')}
    />
  );
};

export default PopupUploadFile;

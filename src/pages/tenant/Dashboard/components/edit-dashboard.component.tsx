import { Box, Dialog, DialogActions, DialogContent, Divider, IconButton, MenuItem, Typography } from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUpload from '~/components/ImageUpload/ImageUpload';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import InputCustom from '~/components/InputCustom';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import fileStorageService from '~/services/fileStorage.service';
import { dashboardService } from '~/services/dashboard.service';
import handleNotificationMessege from '~/utils/notification';

interface EditDashboardProps {
  dataDefault: any;
  dashboardId: string;
  tenantCode: string; // Adjust the type based on the actual function signature
}

const EditDashboard: React.FC<EditDashboardProps> = ({ dataDefault, dashboardId, tenantCode }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslation().t;
  const [image, setImage] = useState<any>(null);
  const skipSchema = yup.object({
    title: yup.string().required(t('please-select-reason'))
  });
  const {
    control,
    reset,
    formState: { errors, isValid },
    handleSubmit
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: dataDefault?.name
    },
    resolver: yupResolver(skipSchema)
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const uploadFileMutation = useMutation({
    mutationFn: (formData) => {
      return fileStorageService.uploadFile(formData);
    }
  });
  const updateDashboard = useMutation({
    mutationFn: (body: { tenantCode: string; name: string; type: string; imageUrl: string }) => {
      return dashboardService.updateDashBoardById(dashboardId, body);
    }
  });
  const handleSuccess = () => {
    reset();
    setImage(null);
    handleClose();
    queryClient.invalidateQueries({ queryKey: ['getAllDashboard'] });
    handleNotificationMessege(t('upload-success'));
  };

  const handleMutationWithImage = (image: any, data: any) => {
    uploadFileMutation.mutate(image, {
      onSuccess: (res) => {
        updateDashboard.mutate(
          { tenantCode, name: data.title, type: dataDefault.type, imageUrl: res?.data?.id },
          {
            onSuccess: handleSuccess
          }
        );
      }
    });
  };

  const handleMutationWithoutImage = (data: any) => {
    updateDashboard.mutate(
      { tenantCode, name: data.title, type: dataDefault.type, imageUrl: dataDefault.imageUrl },
      {
        onSuccess: handleSuccess
      }
    );
  };

  const handleClick = handleSubmit((data) => {
    if (image) {
      handleMutationWithImage(image, data);
    } else {
      handleMutationWithoutImage(data);
    }
  });
  return (
    <>
      <MenuItem onClick={handleOpen} className='gap-2 !text-sm'>
        <PencilSimple size={20} /> Cập nhật
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            height: '500px'
          }
        }}
      >
        <Box className='flex justify-between items-center p-4 h-[56px]'>
          <Typography color='var(--text-primary)' variant='h6'>
            Cập nhật dashboard
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
        <DialogContent className='!px-4'>
          <div className='flex flex-col gap-6'>
            <div className='flex justify-center'>
              <ImageUpload src={dataDefault?.imageUrl} onFileUpload={setImage} />
            </div>
            <div>
              <InputCustom
                classNameContainer='w-full'
                isRequired
                label={t('title')}
                control={control}
                name='title'
                placeholder={t('title')}
                isError={!!errors.title}
                helperText={errors?.title?.message}
              />
            </div>
            <div>
              <InputCustom
                classNameContainer='w-full'
                label={t('Loại')}
                control={control}
                name='type'
                placeholder={t('title')}
                disabled
                isError={!!errors.title}
                helperText={errors?.title?.message}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonCustom variant='outlined' onClick={handleClose} startIcon={<IconPhosphor iconName='X' size={18} />}>
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst('cancel')}
            </Typography>
          </ButtonCustom>
          <ButtonCustom
            variant='contained'
            color='primary'
            type='submit'
            onClick={handleClick}
            startIcon={<IconPhosphor iconName='Check' size={18} />}
            disabled={!isValid}
          >
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst('save')}
            </Typography>
          </ButtonCustom>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditDashboard.propTypes = {};

export default EditDashboard;

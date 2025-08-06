import React, { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import StepperCustom from './stepper-custom.component';
import IconPhosphor from '~/assets/iconPhosphor';
import ButtonCustom from '~/components/ButtonCustom';
import { translationCapitalFirst } from '~/utils/translate';
import Monitor from '~/assets/images/svg/Monitor.svg';
import Management from '~/assets/images/svg/project.svg';
import RemoteControl from '~/assets/images/svg/remote-control.svg';
import AccessControl from '~/assets/images/svg/access-control.svg';
import CustomWidget from '~/assets/images/svg/widget.svg';
import Map from '~/assets/images/svg/map.svg';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import InputCustom from '~/components/InputCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DASHBOARD_TYPES } from '../../utils/const-dashboard';
import ImageUpload from '~/components/ImageUpload/ImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import fileStorageService from '~/services/fileStorage.service';
import { dashboardService } from '~/services/dashboard.service';
import handleNotificationMessege from '~/utils/notification';
import SelectLocation from '~/pages/tenant/DevicePage/ComponentSelect/SelectLocation';

const templates = [
  {
    id: 1,
    title: 'monitoring',
    type: DASHBOARD_TYPES.Monitor,
    img: Monitor
  },
  {
    id: 2,
    title: 'management',
    type: DASHBOARD_TYPES.Management,
    img: Management
  },
  {
    id: 3,
    title: 'remote-control',
    type: DASHBOARD_TYPES.RemoteControl,
    img: RemoteControl
  },
  {
    id: 4,
    title: 'access-control',
    type: DASHBOARD_TYPES.AccessControl,
    img: AccessControl
  },
  {
    id: 5,
    title: 'map',
    type: DASHBOARD_TYPES.Map,
    img: Map
  },
  {
    id: 6,
    title: 'custom-widget',
    type: DASHBOARD_TYPES.CustomWidget,
    img: CustomWidget
  }
];
interface CreateDashboardProps {
  tenantCode: string; // Adjust the type based on the actual function signature
}
const CreateDashboard: React.FC<CreateDashboardProps> = ({ tenantCode }) => {
  const { t } = useTranslation();
  const steps = [t('chosse-template'), t('addition-information')];
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const uploadFileMutation = useMutation({
    mutationFn: (formData) => {
      return fileStorageService.uploadFile(formData);
    }
  });
  const createDashboardSchema = yup.object({
    title: yup.string().required(t('title')),
    locationId: yup.string().required()
  });
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm<yup.InferType<typeof createDashboardSchema>>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      locationId: '',
    },
    resolver: yupResolver(createDashboardSchema)
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const createDashboard = useMutation({
    mutationFn: (body: { tenantCode: string; name: string; type: string; imageUrl: string; locationId: string }) => {
      return dashboardService.createDashboardData(body);
    }
  }); 
  const createPage = useMutation({
    mutationFn: (body: { dashboardId: string; data: any }) => {
      return dashboardService.createPage(tenantCode, body.dashboardId, body.data);
    }
  });
  const handleClick = handleSubmit((data) => {
    if (image) {
      uploadFileMutation.mutate(image, {
        onSuccess: (res) => {
          createDashboard.mutate(
            { tenantCode, name: data.title, type: selectedTemplate.type, imageUrl: res?.data?.id, locationId: data.locationId },
            {
              onSuccess: (res) => {
                reset();
                setSelectedTemplate(null);
                setImage(null);
                handleClose();
                setActiveStep(0);
                setIsLoading(true);
                queryClient.invalidateQueries({ queryKey: ['getAllDashboard'] });
                {
                  selectedTemplate.type === 'custom-widget' && createPage.mutate({
                    dashboardId: res?.data?.id,
                    data: [{ title: data.title, widgets: [], pageId: 1 }]
                  });
                }
                setIsLoading(false);
                handleNotificationMessege(t('upload-success'));
              }
            }
          );
        }
      });
      return;
    }
    handleClose();
  });
  const isValidStep = (step: number) => {
    switch (step) {
      case 0:
        return selectedTemplate !== null;
      case 1:
        return true;
      default:
        return false;
    }
  };
  const stepRender = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <div className='grid grid-cols-2 gap-5 '>
            {templates.map((item) => (
              <div
                onClick={() => setSelectedTemplate(item)}
                key={item?.id}
                className={`flex flex-col gap-2 cursor-pointer  `}
              >
                <div
                  className={classNames('flex justify-center items-center rounded-lg bg-[#D9E1E8] p-4 h-[120px]', {
                    'border border-blue-500': selectedTemplate?.id === item?.id
                  })}
                >
                  <img className='w-16 h-16' src={item?.img} />
                </div>
                <Typography
                  variant='label2'
                  className={classNames({ 'text-blue-500': selectedTemplate?.id === item?.id })}
                >
                  {t(item?.title)}
                </Typography>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className='flex flex-col gap-6'>
            <div className='flex justify-center'>
              <ImageUpload onFileUpload={setImage} />
            </div>
            <div className='flex flex-col gap-4'>
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
              <SelectLocation control={control} disabled={false} />
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  }, [activeStep, selectedTemplate]);
  return (
    <>
      <Button
        className='!justify-start w-full '
        onClick={handleClickOpen}
        variant='outlined'
        startIcon={<Plus size={18} />}
      >
        <Typography variant='button3' fontWeight={600}>
          {t('add-dashboard')}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            maxHeight: '90vh',
            height: '800px'
          }
        }}
      >
        <Box className='flex justify-between items-center p-4 h-[56px]'>
          <Typography color='var(--text-primary)' variant='h6'>
            {t('add-dashboard')}
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
          <div className='flex justify-center pb-8'>
            <StepperCustom steps={steps} activeStep={activeStep} />
          </div>
          {stepRender}
        </DialogContent>
        <Divider
          sx={{
            borderBottom: '1px solid var(--border-color)',
            width: '100%'
          }}
        />
        <DialogActions>
          <ButtonCustom
            variant='outlined'
            onClick={() => (activeStep === 1 ? setActiveStep(0) : handleClose())}
            startIcon={<IconPhosphor iconName='X' size={18} />}
          >
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst(activeStep === 0 ? 'cancel' : 'previous')}
            </Typography>
          </ButtonCustom>
          <ButtonCustom
            variant='contained'
            color='primary'
            type='submit'
            onClick={() => (activeStep === 0 ? setActiveStep(1) : handleClick())}
            startIcon={<IconPhosphor iconName='Check' size={18} />}
            disabled={!isValidStep(activeStep)}
            isLoading={isLoading}
          >
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst(activeStep === 0 ? 'next' : 'save')}
            </Typography>
          </ButtonCustom>
        </DialogActions>
      </Dialog>
    </>
  );
};

CreateDashboard.propTypes = {
  // Define your prop types here
};

export default CreateDashboard;

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography
} from '@mui/material';
import { ChartBar, ChartDonut, ChartLine, ChartLineDown, Hash, Image, Plus, UploadSimple } from '@phosphor-icons/react';
import StepperCustom from './stepper-custom.component';
import IconPhosphor from '~/assets/iconPhosphor';
import ButtonCustom from '~/components/ButtonCustom';
import { translationCapitalFirst } from '~/utils/translate';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import InputCustom from '~/components/InputCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RenderWidgetDemo from './render-widget-demo.component';
import SelectDevice from '../../DevicePage/ComponentSelect/SelectDevice';
import SelectTelemetry from '../../DevicePage/ComponentSelect/SelectTelemetry';
import { useQueryClient } from '@tanstack/react-query';
import { useGetLatestTelemetry } from '../../DevicePage/handleApi';
import RenderWidgetResult from './render-widget-result.component';
import { resizeImage } from '~/utils/resizeImage';
import SelectAgg from '../../DevicePage/ComponentSelect/SelectAgg';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const steps = ['Choose widget', 'Save information'];
const widgets = [
  {
    id: 1,
    icon: <Hash />,
    type: 'title'
  },
  {
    id: 3,
    icon: <ChartDonut />,
    type: 'chart-pie'
  },
  {
    id: 4,
    icon: <ChartLine />,
    type: 'chart-line'
  },
  {
    id: 5,
    icon: <ChartLineDown />,
    type: 'chart-area'
  },
  {
    id: 6,
    icon: <ChartBar />,
    type: 'chart-bar'
  },
  {
    id: 7,
    icon: <Image />,
    type: 'image'
  }
];
interface CreateWidgetProps {
  handleSuccess: (e) => void;
  pageId: string; // Adjust the type based on the actual function signature
}

const CreateWidget: React.FC<CreateWidgetProps> = ({ handleSuccess, pageId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [typeTitle, selectTypeTitle] = useState<any>(null);
  const [barChartType, setBarChartType] = useState<any>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [alignText, setAlignText] = useState<CanvasTextAlign>('start');
  const [image, setImage] = useState<string | null>('');
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlignText(event.target.value as CanvasTextAlign);
  };
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const skipSchema = yup.object({
    title: yup.string().required(t('please-input-title')),
    deviceId: yup.string().required(t('please-select-device')),
    unit: yup.string().required(t('please-input-unit')),
    telemetryId: yup.string().required(t('please-select-telemetry')),
    telemetryIds: yup.array().required(t('please-select-telemetry')),
    agg: yup.string().required(t('please-select-agg')),
    interval: yup.string().required(t('please-input-interval')),
    date: yup.date().required('Please select a date')
  });

  const {
    control,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      deviceId: '',
      unit: '',
      telemetryId: '',
      telemetryIds: [],
      agg: '',
      interval: '',
      date: null
    },
    resolver: yupResolver(skipSchema)
  });
  const formValues = watch();

  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: formValues?.deviceId
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset?.();
    setActiveStep(0);
    setSelectedTemplate(null);
  };

  const handleClick = () => {
    handleClose();
    handleSuccess({
      pageId,
      title: formValues.title,
      typeTitle,
      alignText,
      image,
      type: selectedTemplate?.type,
      telemetryId: formValues.telemetryId,
      telemetryIds: handleSelectTelemetry(),
      unit: formValues.unit,
      data: initLatestTelemetry?.data?.data[formValues.telemetryId]?.value ?? handleSelectTelemetry(),
      deviceId: formValues.deviceId,
      barChartType
    });
    setImage(null);
    setActiveStep(0);
    reset?.();
  };
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
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['lastestTelemetry'] });
    setIsLoading(false);
  }, [formValues?.deviceId]);

  const RenderWidget = useMemo(() => {
    return (
      <RenderWidgetDemo
        widget={selectedTemplate?.type}
        selectTypeTitle={selectTypeTitle}
        typeTitle={typeTitle}
        typeBarChart={barChartType}
        selectTypeBarChart={setBarChartType}
      />
    );
  }, [selectedTemplate, typeTitle]);
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Đoạn này để truyền file ra ngoài component cha
      const resizedImage: any = await resizeImage(file, 500, 500);
      if (resizedImage) {
        const formData = new FormData();
        formData.append('file', resizedImage);
      }
    }
  };
  const renderFormCreateWidget = useMemo(() => {
    switch (selectedTemplate?.type) {
      case 'title':
        return (
          <>
            <FormControl component='fieldset'>
              <Typography variant='label3' className='!mb-1'>
                Kiểu
              </Typography>
              <RadioGroup row aria-label='options' name='options' value={alignText} onChange={handleRadioChange}>
                <FormControlLabel
                  sx={{ color: 'var(--text-primary)' }}
                  value='left'
                  control={<Radio />}
                  label='Căn trái'
                />
                <FormControlLabel
                  sx={{ color: 'var(--text-primary)' }}
                  value='center'
                  control={<Radio />}
                  label='Căn giữa'
                />
              </RadioGroup>
            </FormControl>
            <SelectDevice control={control} isError={!!errors.deviceId} helperText={errors?.deviceId?.message} />
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <SelectTelemetry
                  isNumber={false}
                  options={watch('deviceId') ? initLatestTelemetry?.data?.data : []}
                  deviceId={formValues?.deviceId}
                  control={control}
                  isError={!!errors.telemetryId}
                  helperText={errors?.telemetryId?.message}
                />
              </div>
              <div>
                <InputCustom
                  classNameContainer='w-full'
                  isRequired
                  label={t('unit')}
                  control={control}
                  name='unit'
                  placeholder={t('input-unit')}
                  isError={!!errors.unit}
                  helperText={errors?.unit?.message}
                />
              </div>
            </div>
          </>
        );
      case 'image':
        return (
          <div
            className='input-file'
            onClick={() => (document.querySelector('.file-upload') as HTMLInputElement)?.click()}
          >
            <input type='file' accept='image/*' className='file-upload' hidden onChange={handleImageChange} />
            <Box sx={{ textAlign: 'center' }} className='flex flex-col items-center justify-center gap-2'>
              <UploadSimple size={42} className='text-[#3A3D41)]' />
              <Typography variant='body3'>Kéo thả hoặc chọn hình</Typography>
              <ButtonCustom className='!py-1' variant='outlined' startIcon={<Image size={18} />}>
                <Typography variant='button3' fontWeight={600}>
                  Chọn hình
                </Typography>
              </ButtonCustom>
            </Box>
          </div>
        );
      case 'table':
        return (
          <>
            <FormControl component='fieldset'>
              <Typography variant='label3' className='!mb-1'>
                Kiểu
              </Typography>
              <RadioGroup
                row
                aria-label='options'
                name='options'
                value={barChartType}
                onChange={(e) => setBarChartType(e.target.value)}
              >
                <FormControlLabel
                  sx={{ color: 'var(--text-primary)' }}
                  value='vertical'
                  control={<Radio />}
                  label='Dọc'
                />
                <FormControlLabel
                  sx={{ color: 'var(--text-primary)' }}
                  value='horizontal'
                  control={<Radio />}
                  label='Ngang'
                />
              </RadioGroup>
            </FormControl>
            <SelectDevice control={control} isError={!!errors.deviceId} helperText={errors?.deviceId?.message} />
            <div className='grid grid-cols-1 gap-2'>
              <div>
                <SelectTelemetry
                  options={watch('deviceId') ? initLatestTelemetry?.data?.data : []}
                  deviceId={formValues?.deviceId}
                  control={control}
                  isError={!!errors.telemetryIds}
                  helperText={errors?.telemetryIds?.message}
                  isMultiple={true}
                />
              </div>
            </div>
            <div className='grid grid-cols-7 gap-2'>
              <div className='col-span-2'>
                <FormControl component='fieldset'>
                  <Typography variant='label3' className='!mb-1'>
                    Thời gian <span className='text-[var(--semantic-alert)]'>*</span>
                  </Typography>
                  <LocalizationProvider adapterLocale='en-gb' dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formValues.date ? dayjs(formValues.date) : null}
                      onChange={(date) => setValue('date', date?.toDate())}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className='col-span-3'>
                <InputCustom
                  classNameContainer='w-full'
                  isRequired
                  label={'Khoản thời gian'}
                  control={control}
                  name='interval'
                  placeholder={t('input-interval')}
                  isError={!!errors.interval}
                  helperText={errors?.interval?.message}
                />
              </div>
              <div className='col-span-2'>
                <SelectAgg control={control} isError={!!errors.agg} helperText={errors?.agg?.message} />
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            <SelectDevice control={control} isError={!!errors.deviceId} helperText={errors?.deviceId?.message} />
            <div>
              <SelectTelemetry
                options={initLatestTelemetry?.data?.data}
                deviceId={formValues?.deviceId}
                control={control}
                isError={!!errors.telemetryIds}
                helperText={errors?.telemetryIds?.message}
                isMultiple={true}
              />
            </div>
          </>
        );
    }
  }, [activeStep, selectedTemplate, initLatestTelemetry, formValues, typeTitle, alignText, image]);
  const handleSelectTelemetry = () => {
    const listTelemetry = [];
    formValues.telemetryIds.map((item) => {
      const telemetry = { ...initLatestTelemetry?.data?.data[item], key: item };
      listTelemetry.push(telemetry);
    });
    return listTelemetry;
  };

  const stepRender = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <div className='flex flex-col gap-2'>
            <div className='flex justify-start gap-2 '>
              {widgets.map((item) => (
                <Tooltip title={item.type}>
                  <div
                    onClick={() => setSelectedTemplate(item)}
                    key={item?.id}
                    className={classNames(' rounded-md border-2  cursor-pointer', {
                      'border-primary text-primary': selectedTemplate?.id === item.id
                    })}
                  >
                    <IconButton
                      className={classNames(
                        'w-10 h-10 !rounded-md !border !border-[var(--grey-primary-100)] !text-[var(--primary)]'
                      )}
                    >
                      {item.icon}
                    </IconButton>
                  </div>
                </Tooltip>
              ))}
            </div>
            {selectedTemplate && RenderWidget}
          </div>
        );
      case 1:
        return (
          <div className='flex flex-col gap-2'>
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
            {renderFormCreateWidget}
            <RenderWidgetResult
              widget={selectedTemplate?.type}
              data={
                selectedTemplate?.type === 'chart-pie' ||
                  selectedTemplate?.type === 'chart-line' ||
                  selectedTemplate?.type === 'chart-area' ||
                  selectedTemplate?.type === 'chart-bar'
                  ? handleSelectTelemetry()
                  : initLatestTelemetry?.data?.data[watch('telemetryId')]
              }
              barType={barChartType}
              title={formValues?.title}
              typeTitle={typeTitle}
              unit={formValues?.unit}
              alignText={alignText}
              image={image}
              deviceId={formValues?.deviceId}
            />
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  }, [activeStep, selectedTemplate, initLatestTelemetry, formValues, typeTitle, alignText, image, barChartType]);
  return (
    <>
      <Button onClick={handleClickOpen} className='!justify-start  ' variant='outlined' startIcon={<Plus size={18} />}>
        <Typography variant='button3' fontWeight={600}>
          Create widget
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
            Create widget
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
          <div className='flex justify-center pb-3'>
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

CreateWidget.propTypes = {
  // Define your prop types here
};

export default CreateWidget;

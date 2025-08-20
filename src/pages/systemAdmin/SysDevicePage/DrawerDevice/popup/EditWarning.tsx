import * as yup from 'yup';

import { Box, Dialog, DialogActions, DialogContent, Divider, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetAlarmConfigByTelemetry, useSaveAlarmConfig } from '../../handleApi';

import ButtonCustom from '~/components/ButtonCustom';
import DropDownActionTable from '~/components/DropdownActionTable';
import IconPhosphor from '~/assets/iconPhosphor';
import InputCustom from '~/components/InputCustom';
import PopupDeleteAlarmConfig from '../../Popup/PopupDeleteAlarmConfig';
import SelectCondition from '../../ComponentSelect/SelectCondition';
import { translationCapitalFirst } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

function EditWarning({
  deviceId,
  telemetryId,
  deviceName,
  warning = false
}: {
  deviceId: string;
  telemetryId: string;
  deviceName?: string;
  warning?: boolean;
}) {
  const { mutate } = useSaveAlarmConfig();

  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const [open, setOpen] = useState(false);

  const { data } = useGetAlarmConfigByTelemetry(deviceId, telemetryId, {
    enabled: open
  });

  const skipSchema = yup.object({
    deviceId: yup.string().required(translationCapitalFirst('please-select-device')),
    telemetryId: yup.string().required(translationCapitalFirst('please-select-telemetry')),
    condition: yup.string().required(translationCapitalFirst('please-select-condition')),
    valueE: yup
      .mixed()
      .required(translationCapitalFirst('please-input-value'))
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    valueE2: yup
      .mixed()
      .required(translationCapitalFirst('please-input-value'))
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    duration: yup.number().required(translationCapitalFirst('please-input-duration')),
    alarmType: yup.string().required(translationCapitalFirst('please-select-type-warning')),
    alarmDetail: yup.string().required(translationCapitalFirst('please-input-detail-warning'))
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      deviceId: deviceId,
      telemetryId: telemetryId,
      condition: '',
      valueE: null,
      valueE2: 0,
      duration: null,
      alarmType: '',
      alarmDetail: ''
    },
    resolver: yupResolver(skipSchema)
  });
  const valueLabel = translationCapitalFirst('value');
  const valuePlaceholder = translationCapitalFirst('enter-value', 'devicePage');
  const selectedCondition = watch('condition');
  const rangeConditions = ['OUT_OF_RANGE', 'IN_RANGE'];
  const isRangeCondition = rangeConditions.includes(selectedCondition);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  useEffect(() => {
    if (data) {
      reset({
        deviceId: data.deviceId || deviceId,
        telemetryId: data.telemetryId || telemetryId,
        condition: data.condition || '',
        valueE: data.value.e ?? data.value.e1 ?? null,
        valueE2: data.value.e2 ?? 0,
        duration: data.duration ?? null,
        alarmType: data.alarmType || '',
        alarmDetail: data.alarmDetail || ''
      });
    }
  }, [data, reset, deviceId, telemetryId]);

  const handleValueChange = (data) => {
    let value = {};

    if (isRangeCondition) {
      value = { e1: data?.valueE, e2: data?.valueE2 };
    } else {
      value = { e: data?.valueE };
    }

    return value;
  };

  const onSubmit = handleSubmit((data) => {
    const value = handleValueChange(data);

    mutate({
      deviceId: data.deviceId,
      telemetry: data.telemetryId,
      condition: data.condition,
      value: value,
      duration: data.duration,
      alarmType: data.alarmType,
      alarmDetail: data.alarmDetail
    });

    handleClose();
  });

  return (
    <>
      {warning ? (
        <DropDownActionTable
          mainBtn={
            <div
              className='h-8 flex w-full  justify-center rounded items-center bg-[var(--grey-primary-80)] hover:bg-[var(--grey-primary-100)] cursor-pointer'
              onClick={handleClickOpen}
            >
              <Typography variant='button3' fontWeight={600}>
                {deviceTranslate('edit-warning')}
              </Typography>
            </div>
          }
          childrent={() => [
            {
              key: 'delete-alarm-config',
              component: <PopupDeleteAlarmConfig deviceId={deviceId} telemetry={telemetryId} />
            }
          ]}
        />
      ) : (
        <div
          className='h-8 flex w-full  justify-center rounded items-center bg-[var(--grey-primary-80)] hover:bg-[var(--grey-primary-100)] cursor-pointer'
          onClick={handleClickOpen}
        >
          <Typography variant='button3' fontWeight={600}>
            {deviceTranslate('edit-warning')}
          </Typography>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            maxHeight: '90vh',
            height: '1000px'
          }
        }}
      >
        <Box className='flex justify-between items-center p-4 h-[56px]'>
          <Typography color='var(--text-primary)' variant='h6'>
            {deviceTranslate('edit-warning')}
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
        <DialogContent className='!px-4 gap-4 flex flex-col'>
          <InputCustom
            name='deviceName'
            value={deviceName}
            disabled={true}
            label={translationCapitalFirst('device')}
            control={control}
            isError={!!errors.deviceId}
            helperText={errors?.deviceId?.message}
          />
          <InputCustom
            name='telemetryId'
            disabled={true}
            label={'Telemetry'}
            control={control}
            isError={!!errors.telemetryId}
            helperText={errors?.telemetryId?.message}
          />
          <SelectCondition control={control} isError={!!errors.condition} helperText={errors?.condition?.message} />
          {isRangeCondition ? (
            <Box className='flex w-full gap-4'>
              <InputCustom
                classNameContainer='flex-1'
                label={valueLabel + ' e1'}
                control={control}
                name='valueE'
                placeholder={valuePlaceholder}
                isRequired
                isError={!!errors.valueE}
                helperText={errors?.valueE?.message}
              />
              <InputCustom
                classNameContainer='flex-1'
                label={valueLabel + ' e2'}
                control={control}
                name='valueE2'
                placeholder={valuePlaceholder}
                isRequired
                isError={!!errors.valueE2}
                helperText={errors?.valueE2?.message}
              />
            </Box>
          ) : (
            <InputCustom
              classNameContainer='w-full'
              label={valueLabel + ' e'}
              control={control}
              name='valueE'
              placeholder={valuePlaceholder}
              isRequired
              isError={!!errors.valueE}
              helperText={errors?.valueE?.message}
            />
          )}
          <InputCustom
            classNameContainer='w-full'
            label={translationCapitalFirst('duration')}
            control={control}
            name='duration'
            placeholder={translationCapitalFirst('placehoder-input-duration')}
            isRequired
            type='duration'
            isError={!!errors.duration}
            helperText={errors?.duration?.message}
          />
          <InputCustom
            classNameContainer='w-full'
            label={translationCapitalFirst('type-warning')}
            control={control}
            name='alarmType'
            placeholder={translationCapitalFirst('please-select-type-warning')}
            isRequired
            isError={!!errors.alarmType}
            helperText={errors?.alarmType?.message}
          />
          <InputCustom
            classNameContainer='w-full'
            label={translationCapitalFirst('detail-warning')}
            control={control}
            name='alarmDetail'
            placeholder={translationCapitalFirst('please-input-detail-warning')}
            isRequired
            isError={!!errors.alarmDetail}
            helperText={errors?.alarmDetail?.message}
          />
          {/* <SelectFacility label={translationCapitalFirst('vehicle')} isRequired /> */}
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
            onClick={() => handleClose()}
            startIcon={<IconPhosphor iconName='X' size={18} />}
          >
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst('cancel')}
            </Typography>
          </ButtonCustom>
          <ButtonCustom
            variant='contained'
            color='primary'
            type='submit'
            onClick={onSubmit}
            startIcon={<IconPhosphor iconName='Check' size={18} />}
          >
            <Typography variant='button3' fontWeight={600}>
              {translationCapitalFirst('save')}
            </Typography>
          </ButtonCustom>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditWarning.propTypes = {};

export default EditWarning;

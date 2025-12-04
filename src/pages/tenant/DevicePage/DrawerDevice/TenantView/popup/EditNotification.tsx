import * as yup from 'yup';

import { Box, Dialog, DialogActions, DialogContent, Divider, IconButton, Typography } from '@mui/material';

import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import InputCustom from '~/components/InputCustom';
import SelectDevice from '../../../ComponentSelect/SelectDevice';
import { translationCapitalFirst } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectVehicle from '../../../ComponentSelect/SelectVehicle';

function EditNotification({ deviceId, telemetryId }: { deviceId: string; telemetryId: string }) {
  const skipSchema = yup.object({
    deviceId: yup.string().required(translationCapitalFirst('please-select-device')),
    telemetryId: yup.string().required(translationCapitalFirst('please-select-telemetry')),
    condition: yup.string().required(translationCapitalFirst('please-select-condition')),
    value: yup.string().required(translationCapitalFirst('please-input-value')),
    content: yup.string().required(translationCapitalFirst('error-content')),
    facility: yup.string().required(translationCapitalFirst('please-select-facility')),
    typeWarning: yup.string().required(translationCapitalFirst('please-select-type-warning')),
    detailWarning: yup.string().required(translationCapitalFirst('please-input-detail-warning'))
  });

  const {
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      deviceId: deviceId,
      telemetryId: telemetryId,
      condition: '',
      value: '',
      content: '',
      facility: ''
    },
    resolver: yupResolver(skipSchema)
  });
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className='h-8 flex w-full  justify-center rounded items-center hover:bg-[var(--grey-primary-100)] cursor-pointer'
        onClick={handleClickOpen}
      >
        <Typography variant='button3' fontWeight={600}>
          Cập nhật
        </Typography>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: '600px',
            maxHeight: '90vh',
            height: '1000px',
            backgroundColor: "#101828"
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
          <SelectDevice
            disabled={true}
            control={control}
            isError={!!errors.deviceId}
            helperText={errors?.deviceId?.message}
          />
          <SelectVehicle control={control} isError={!!errors.condition} helperText={errors?.condition?.message} />
          <InputCustom
            classNameContainer='w-full'
            label={translationCapitalFirst('value')}
            control={control}
            name='value'
            placeholder={translationCapitalFirst('placeholder-value')}
            isRequired
            isError={!!errors.value}
            helperText={errors?.value?.message}
          />
          <Typography variant='caption1'>Số điện thoại, Email, Tên Skype,...</Typography>
          <InputCustom
            classNameContainer='w-full'
            label={translationCapitalFirst('content')}
            control={control}
            name='content'
            placeholder={translationCapitalFirst('placeholder-content')}
            isRequired
            isError={!!errors.content}
            helperText={errors?.content?.message}
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
            onClick={() => handleClose()}
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

EditNotification.propTypes = {};

export default EditNotification;

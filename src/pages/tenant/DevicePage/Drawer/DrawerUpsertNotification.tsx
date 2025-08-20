import DrawerUpdate from '~/components/Drawer/DrawerUpdate';
import SelectDevice from '../ComponentSelect/SelectDevice';
import SelectVehicle from '../ComponentSelect/SelectVehicle';
import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { Typography } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

interface DrawerUpdateNotificationProps {
  deviceId: string;
  telemetryId?: string;
  isUpdating: boolean;
}

export default function DrawerUpsertNotification(props: DrawerUpdateNotificationProps) {
  const { deviceId, telemetryId, isUpdating, ...rest } = props;
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

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
    formState: { errors, isValid }
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
  
  const title = isUpdating ? t('update-notification') : t('add-new-notification');

  return (
    <DrawerUpdate
      title={title}
      isValid={isValid}
      isLoading={false}
      isSuccess={false}
      onSubmit={() => {}}
      {...rest}
    >
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
    </DrawerUpdate>
  );
}

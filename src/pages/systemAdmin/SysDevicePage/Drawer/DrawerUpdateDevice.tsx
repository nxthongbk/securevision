import SelectTenant from '../ComponentSelect/SelectTenant';
import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import SelectDeviceProfile from '../ComponentSelect/SelectDeviceProfile';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useUpdateDevice } from '../handleApi';
import { IParamEditDeviceInterFace } from '~/@types/deviceType/device.type';
import DrawerUpdate from '../../../../components/Drawer/DrawerUpdate';
import { DrawerProps, Stack } from '@mui/material';

interface DrawerUpdateDeviceProps extends DrawerProps, Record<string, any> {}

export default function DrawerUpdateDevice(props: DrawerUpdateDeviceProps) {
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

  const deviceUpdateSchema = yup.object({
    token: yup.string().required(t('please-enter-token')),
    deviceProfileId: yup.string().required(t('please-select-device-profile')),
    deviceName: yup.string().required(t('please-enter-device-name')),
    tenantCode: yup.string()
  });

  type DeviceUpdate = yup.InferType<typeof deviceUpdateSchema>;

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue
  } = useForm<DeviceUpdate>({
    mode: 'onBlur',
    defaultValues: {
      token: '',
      deviceProfileId: '',
      deviceName: '',
      tenantCode: ''
    },
    resolver: yupResolver(deviceUpdateSchema)
  });

  useEffect(() => {
    setValue('token', props?.token);
    setValue('deviceProfileId', props?.deviceProfile?.id);
    setValue('deviceName', props?.name);
    setValue('tenantCode', props?.tenantInfo?.code);
  }, [props, setValue]);

  const { isPending, mutate, isSuccess } = useUpdateDevice();

  const onSubmit = handleSubmit((data) => {
    const dataPayload: IParamEditDeviceInterFace & { [key: string]: string } = {
      id: props?.id,
      name: data.deviceName,
      token: data.token,
      deviceProfileId: data.deviceProfileId,
      tenantCode: data.tenantCode,
      status: 'USED'
    };
    mutate(dataPayload);
  });

  return (
    <DrawerUpdate
      title={t('update-infos')}
      isValid={isValid}
      isLoading={isPending}
      isSuccess={isSuccess}
      onSubmit={onSubmit}
      {...props}
    >
      <Stack>
        <InputCustom
          classNameContainer='w-full'
          label={translationCapitalFirst('device-token', 'devicePage')}
          control={control}
          name='token'
          placeholder={translationCapitalFirst('enter-device-token', 'devicePage')}
          isRequired
          isError={Boolean(errors.token)}
          inputProps={{ maxLength: 32 }}
          helperText={errors?.token?.message}
        />
        <SelectDeviceProfile
          control={control}
          isError={!!errors.deviceProfileId}
          helperText={errors?.deviceProfileId?.message}
        />
        <InputCustom
          classNameContainer='w-full'
          label={translationCapitalFirst('device-name', 'devicePage')}
          control={control}
          name='deviceName'
          placeholder={translationCapitalFirst('enter-device-name', 'devicePage')}
          isRequired
          isError={Boolean(errors.deviceName)}
          helperText={errors?.deviceName?.message}
        />
        <SelectTenant control={control} />
      </Stack>
    </DrawerUpdate>
  );
}

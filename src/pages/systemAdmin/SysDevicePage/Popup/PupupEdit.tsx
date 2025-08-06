import { useEffect } from 'react';
import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateDevice } from '../handleApi';
import SelectDeviceProfile from '../ComponentSelect/SelectDeviceProfile';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import SelectTenant from '../ComponentSelect/SelectTenant';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { Typography } from '@mui/material';
import * as yup from 'yup';
import { IParamEditDeviceInterFace } from '~/@types/deviceType/device.type';
import { useTranslation } from 'react-i18next';

export default function PopupEdit({ props }: { props: Record<string, any> }) {
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  const deviceSchema = yup.object({
    token: yup.string().required(deviceTranslate('please-enter-token')),
    deviceProfileId: yup.string().required(deviceTranslate('please-select-device-profile')),
    deviceName: yup.string().required(deviceTranslate('please-enter-device-name')),
    tenantCode: yup.string()
  });
  const {
    control,
    reset,
    formState: { errors, isValid },
    handleSubmit,
    setValue
  } = useForm<yup.InferType<typeof deviceSchema>>({
    mode: 'onBlur',
    defaultValues: {
      token: '',
      deviceProfileId: '',
      deviceName: '',
      tenantCode: ''
    },
    resolver: yupResolver(deviceSchema)
  });
  const handlePopupClose = () => {
    reset({
      token: props?.token,
      deviceProfileId: props?.deviceProfile?.id,
      deviceName: props?.name,
      tenantCode: props?.tenantInfo?.code
    });
  };
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
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col h-[338px]'>
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
      </div>
    );
  };

  return (
    <PopupEditCover
      btnComponent={
        <ButtonCustom variant='contained' className='gap-2'>
          <IconPhosphor iconName='PencilSimple' size={20} />
          <Typography variant='button3'>{translationCapitalFirst('update')}</Typography>
        </ButtonCustom>
      }
      isSuccess={isSuccess}
      handleClose={() => {
        handlePopupClose();
      }}
      title={translationCapitalFirst('update-infos')}
      handleSubmit={onSubmit}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
    />
  );
}

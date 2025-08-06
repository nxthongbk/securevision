import * as yup from 'yup';

import { useCreateDevice, useGetRandomToken } from '../handleApi';

import { IParamCreateDeviceInterface } from '~/@types/deviceType/device.type';
import InputCustom from '~/components/InputCustom';
import PopoverAddCover from '../Popover/ButtonComponent/PopoverAddCover';
import SelectDeviceProfile from '../ComponentSelect/SelectDeviceProfile';
import SelectTenant from '../ComponentSelect/SelectTenant';
import { translationCapitalFirst } from '~/utils/translate';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

export default function PopupAdd() {
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const { dataToken, refetchToken } = useGetRandomToken();
  const { isPending, isSuccess, mutate } = useCreateDevice();

  const deviceSchema = yup.object({
    token: yup.string().required(deviceTranslate('please-enter-token')),
    deviceProfileId: yup.string().required(deviceTranslate('please-select-device-profile')),
    deviceName: yup.string().required(deviceTranslate('please-enter-device-name')),
    tenantCode: yup.string()
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
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

  const handleClose = () => {
    reset();
  };

  const handleOpen = () => {
    refetchToken();
  };

  useEffect(() => {
    if (dataToken?.data) {
      setValue('token', dataToken?.data?.token);
    }
  }, [dataToken?.data, setValue]);

  const onSubmit = handleSubmit((data) => {
    const dataPayload: IParamCreateDeviceInterface & { [key: string]: string } = {
      description: '',
      deviceProfileId: data.deviceProfileId,
      label: '',
      name: data.deviceName,
      token: data.token,
      tenantCode: data.tenantCode,
      status: 'USED'
    };
    mutate(dataPayload);
  });

  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col h-[360px]'>
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
    <PopoverAddCover
      handleClose={handleClose}
      title='devicePage.add-devices'
      handleSubmit={onSubmit}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
      isSuccess={isSuccess}
      handleOpen={handleOpen}
      icon='Plus'
      btnname={translationCapitalFirst('add-manual', 'devicePage')}
    />
  );
}

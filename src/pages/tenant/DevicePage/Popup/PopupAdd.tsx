import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import SelectDeviceProfile from '../ComponentSelect/SelectDevice';
import PopupAddCover from '~/components/Modal/PopupAddCover';
import { useCreateDevice, useGetRandomToken } from '../handleApi';
import SelectLocation from '../ComponentSelect/SelectLocation';
import { useTranslation } from 'react-i18next';
import { translationCapitalFirst } from '~/utils/translate';
import { IParamCreateDeviceInterface } from '~/@types/deviceType/device.type';
interface IFormInput {
  code: string;
  token: string;
  deviceProfileId: string;
  deviceName: string;
}

export default function PopupAdd() {
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  const { dataToken, refetchToken } = useGetRandomToken();

  const deviceSchema = yup.object({
    code: yup.string().required(translationCapitalFirst('field-is-required')),
    token: yup.string().required(translationCapitalFirst('field-is-required')),
    deviceProfileId: yup.string().required(translationCapitalFirst('field-is-required')),
    deviceName: yup.string().required(translationCapitalFirst('field-is-required')),
    tenant: yup.string()
  });

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    defaultValues: {
      code: '',
      token: '',
      deviceProfileId: '',
      deviceName: '',
      tenant: ''
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
  }, [dataToken?.data]);

  const { isPending, isSuccess, mutate } = useCreateDevice();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const dataPaylaod: IParamCreateDeviceInterface = {
      ...data,
      name: data.deviceName
    };
    mutate(dataPaylaod);
  };

  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col min-h-[280px]'>
        <SelectDeviceProfile isError={false} helperText={''} control={control} />
        <SelectLocation control={control} disabled={false} isError={false} helperText={''} />
      </div>
    );
  };

  return (
    <PopupAddCover
      handleClose={handleClose}
      title='devicePage.add'
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
      isSuccess={isSuccess}
      label={deviceTranslate('add')}
      handleOpen={handleOpen}
    />
  );
}

import { useEffect } from 'react';
import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { Typography } from '@mui/material';
import { useUpdateDevice } from '../../handleApi';
import SelectDeviceProfile from '../../ComponentSelect/SelectDeviceProfile';
import * as yup from 'yup';
import { IParamEditDeviceInterFace } from '~/@types/deviceType/device.type';
interface IFormInput {
  code: string;
  token: string;
  deviceProfileId: string;
  deviceName: string;
}
export default function PopupEdit({ props }: { props:  Record<string, any> }) {
  const deviceSchema = yup.object({
    code: yup.string().required(translationCapitalFirst('field-is-required')),
    token: yup.string().required(translationCapitalFirst('field-is-required')),
    deviceProfileId: yup.string().required(translationCapitalFirst('field-is-required')),
    deviceName: yup.string().required(translationCapitalFirst('field-is-required')),
    tenant: yup.string()
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
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
  useEffect(() => {
    setValue('code', props?.code);
    setValue('token', props?.token);
    setValue('deviceProfileId', props?.deviceProfileId);
  }, [props]);

  const { isPending, mutate, isSuccess } = useUpdateDevice();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const dataPayload: IParamEditDeviceInterFace = {
      ...data,
      name: data?.deviceName,
      id: props?.id
    };
    mutate(dataPayload);
  };
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col min-h-[472px]'>
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={translationCapitalFirst('device-id', 'devicePage')}
          control={control}
          name='code'
          placeholder={translationCapitalFirst('enter-device-code', 'devicePage')}
          isRequired={true}
          isError={Boolean(errors.code)}
          inputProps={{ maxLength: 6 }}
          helperText={errors?.code?.message}
        />

        <InputCustom
          classNameContainer='w-full'
          label={translationCapitalFirst('device-token', 'devicePage')}
          control={control}
          name='token'
          placeholder={translationCapitalFirst('enter-device-token', 'devicePage')}
          isRequired={true}
          isError={Boolean(errors.token)}
          inputProps={{ maxLength: 6 }}
          helperText={errors?.token?.message}
        />
        <SelectDeviceProfile control={control} />
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={translationCapitalFirst('device-name', 'devicePage')}
          control={control}
          name='deviceName'
          placeholder={translationCapitalFirst('enter-device-name', 'devicePage')}
          isRequired={true}
          isError={Boolean(errors.deviceName)}
          helperText={errors?.deviceName?.message}
        />
      </div>
    );
  };

  return (
    <PopupEditCover
      btnComponent={
        <ButtonCustom variant='contained' className='gap-2'>
          <IconPhosphor iconName='PencilSimple' size={20} />
          <Typography variant='button3'>Cập nhật</Typography>
        </ButtonCustom>
      }
      isSuccess={isSuccess}
      handleClose={() => {}}
      title={translationCapitalFirst('update-infos')}
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
    />
  );
}

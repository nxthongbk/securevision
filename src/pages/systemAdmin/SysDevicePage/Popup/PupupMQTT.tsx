import InputCustom from '~/components/InputCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import ButtonCustom from '~/components/ButtonCustom';
import { Typography } from '@mui/material';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { PaperPlane } from '@phosphor-icons/react';
import { useCreateMQTT, useGetInfoMQTT } from '../handleApi';
import { useEffect } from 'react';

export default function PopupMQTT({ deviceId }: Readonly<{ deviceId: string }>) {
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const mqttSchema = yup.object({
    clientId: yup.string().required(deviceTranslate('error-client-id')),
    usernameMqtt: yup.string().required(deviceTranslate('error-username')),
    passwordMqtt: yup.string().required(deviceTranslate('error-password'))
  });

  const { data } = useGetInfoMQTT({ deviceId });
  const { isPending, isSuccess, mutate } = useCreateMQTT({ deviceId });
  const {
    control,
    formState: { errors, isValid, dirtyFields },
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset
  } = useForm<yup.InferType<typeof mqttSchema>>({
    mode: 'onBlur',
    defaultValues: {
      clientId: '',
      usernameMqtt: '',
      passwordMqtt: ''
    },
    resolver: yupResolver(mqttSchema)
  });

  const currentPassword = watch('passwordMqtt');

  // Reset value
  useEffect(() => {
    if (data) {
      setValue('clientId', data?.['clientId']);
      setValue('usernameMqtt', data?.['username'], { shouldValidate: true });
      setValue('passwordMqtt', data?.['password'], { shouldValidate: true });
    }
  }, [data, setValue]);

  // Trigger validation in case of autofill
  useEffect(() => {
    if (dirtyFields.usernameMqtt && currentPassword) {
      trigger('usernameMqtt');
    }
  }, [currentPassword, dirtyFields.usernameMqtt, trigger]);

  const onSubmit = handleSubmit((dataForm) => {
    mutate({
      clientId: dataForm.clientId,
      username: dataForm.usernameMqtt,
      password: dataForm.passwordMqtt,
      deviceId,
      isEdit: Boolean(data?.['clientId'])
    });
  });

  const handleClose = () => {
    reset();
    if (data?.['clientId']) {
      setValue('clientId', data?.['clientId']);
      setValue('usernameMqtt', data?.['username']);
    }
  };

  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col h-[338px]'>
        <InputCustom
          label={'Client ID'}
          control={control}
          name='clientId'
          placeholder={deviceTranslate('enter-client-id')}
          isRequired
          isError={!!errors.clientId}
          inputProps={{ maxLength: 100 }}
          helperText={errors?.clientId?.message}
        />
        <InputCustom
          label={'Username'}
          control={control}
          name='usernameMqtt'
          placeholder={deviceTranslate('enter-username')}
          isRequired
          isError={!!errors.usernameMqtt}
          inputProps={{ maxLength: 20 }}
          helperText={errors?.usernameMqtt?.message}
          autoComplete='off'
        />
        <InputCustom
          classNameContainer='w-full'
          label={'Password'}
          control={control}
          name='passwordMqtt'
          placeholder={deviceTranslate('enter-password')}
          isRequired
          isError={!!errors.passwordMqtt}
          helperText={errors?.passwordMqtt?.message}
          type='password'
          autoComplete='new-password'
        />
      </div>
    );
  };

  return (
    <PopupEditCover
      btnComponent={
        <ButtonCustom variant='outlined' className='gap-2'>
          <PaperPlane size={20} />
          <Typography variant='button3'>MQTT</Typography>
        </ButtonCustom>
      }
      isSuccess={isSuccess}
      handleClose={handleClose}
      title={'MQTT'}
      handleSubmit={onSubmit}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
    />
  );
}

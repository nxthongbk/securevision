import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { deviceTenantSchema } from '~/utils/yup';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUpdateDeviceRoleTenant } from '../../handleApi';
import { useEffect } from 'react';

export default function PopupEdit({ props }: { props: Record<string, any> }) {
  const {  name, id, token } = props;
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      deviceName: ''
    },
    resolver: yupResolver(deviceTenantSchema)
  });
  const { isPending, mutate, isSuccess } = useUpdateDeviceRoleTenant();

  useEffect(() => {
    setValue('deviceName', name);
  }, [props, setValue]);
  const onSubmit = (data) => {
    mutate({ id, name: data.deviceName, token });
  };

  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col min-h-[270px]'>
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={deviceTranslate('device-name')}
          control={control}
          name='deviceName'
          placeholder={deviceTranslate('enter-device-name')}
          isRequired
          isError={!!errors.deviceName}
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
          <Typography variant='button3'>{deviceTranslate('update')}</Typography>
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

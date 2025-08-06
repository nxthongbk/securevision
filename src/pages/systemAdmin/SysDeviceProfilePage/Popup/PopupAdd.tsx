import * as yup from 'yup';

import { IDeviceTypeContent, IParamsCreacteDeviceProfile } from '~/@types/deviceProfile/deviceProfile.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDeleteFileAvatar, useUploadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
import { useEffect, useState } from 'react';

import AvatarUpload from '~/components/avatar-upload';
import FreeSoloCreateOption from './SelectTypeDevice';
import IconPhosphor from '~/assets/iconPhosphor';
import InputCustom from '~/components/InputCustom';
import PopupAddCover from '~/components/Modal/PopupAddCover';
import Textarea from '~/components/Textarea';
import { Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import { useCreateDeviceProfile } from '../handleApi';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

export default function PopupAdd() {
  const [deviceProfileTranslate] = useTranslation('', { keyPrefix: 'deviceProfile' });
  const [_imageFile, setFileImage] = useState();
  const handleFileUpload = (file: any) => {
    setFileImage(file);
  };
  const { isPending, isSuccess, mutate } = useCreateDeviceProfile();
  const { dataFile, mutateUploadFile, resetUploadFile } = useUploadFileAvatar();
  const { mutateDeleteFile } = useDeleteFileAvatar();

  const deviceProfileSchema = yup.object().shape({
    name: yup
      .string()
      .required(deviceProfileTranslate('please-enter-device-profile-name'))
      .trim(deviceProfileTranslate('please-enter-device-profile-name'))
      .max(100, deviceProfileTranslate('max-100-character')),
    typeIdTemp: yup
      .object<IDeviceTypeContent>()
      .shape({
        inputValue: yup
          .string()
          .max(100, deviceProfileTranslate('max-100-character'))
          .min(1, deviceProfileTranslate('enter-type-valid')),
        id: yup.string(),
        label: yup.string()
      })
      .typeError(deviceProfileTranslate('enter-type-valid'))
      .required(deviceProfileTranslate('enter-type-valid')),
    description: yup.string(),
    signalWaitingTime: yup
      .number()
      .positive(deviceProfileTranslate('enter-signal-waiting-time-valid'))
      .typeError(deviceProfileTranslate('enter-signal-waiting-time-valid'))
      .required(translationCapitalFirst('field-is-required'))
  });
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      typeIdTemp: { inputValue: '', label: '', id: '' },
      description: '',
      signalWaitingTime: 5
    },
    resolver: yupResolver(deviceProfileSchema)
  });

  const handleClose = () => {
    reset();
    setFileImage(undefined);
  };

  //upload file image  và  xóa file image khi close popup
  useEffect(() => {
    if (_imageFile) {
      mutateUploadFile(_imageFile);
    }
    if (dataFile?.id && !isSuccess) {
      mutateDeleteFile(dataFile?.id);
      resetUploadFile();
    }
  }, [_imageFile]);

  const onSubmit: SubmitHandler<IParamsCreacteDeviceProfile> = async (data) => {
    const payload = { ...data, imageUrl: null, signalWaitingTime: data.signalWaitingTime * 60000 };
    try {
      if (_imageFile) {
        payload.imageUrl = dataFile?.id;
        await mutate(payload);
      } else {
        await mutate(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bodyPopup = () => {
    return (
      <div className='gap-4 flex flex-col min-h-[50vh]'>
        <div className='w-full justify-center flex'>
          <AvatarUpload onFileUpload={handleFileUpload} />
        </div>
        <InputCustom
          label={translationCapitalFirst('device-profile-name', 'deviceProfile')}
          control={control}
          name='name'
          placeholder={translationCapitalFirst('enter-device-profile-name', 'deviceProfile')}
          isRequired={true}
          isError={Boolean(errors.name)}
          helperText={errors?.name?.message}
        />
        <FreeSoloCreateOption
          control={control}
          name='typeIdTemp'
          error={Boolean(errors.typeIdTemp)}
          helperText={errors?.typeIdTemp?.message || errors?.typeIdTemp?.inputValue?.message}
        />
        <div className='relative flex flex-col w-full'>
          <InputCustom
            label={translationCapitalFirst('time-waiting-connect', 'deviceProfile')}
            control={control}
            name='signalWaitingTime'
            placeholder={translationCapitalFirst('enter-time', 'deviceProfile')}
            isRequired={true}
            isError={Boolean(errors.signalWaitingTime)}
            helperText={errors?.signalWaitingTime?.message}
          />
          <div className='absolute bg-[#F4F5F5] h-[38px] flex justify-center items-center px-4 right-[1px] rounded-tr-md rounded-br-md top-[25px] '>
            <Typography variant='body3'>{translationCapitalFirst('minutes', 'deviceProfile')}</Typography>
          </div>
          <div className='flex items-center'>
            <IconPhosphor iconName='Info' size={16} />
            <Typography variant='caption1' color={'var(--text-secondary)'}>
              {translationCapitalFirst('time-waiting-connect-info', 'deviceProfile')}
            </Typography>
          </div>
        </div>

        <Textarea
          name='description'
          label={translationCapitalFirst('description', 'deviceProfile')}
          control={control}
          placeholder={translationCapitalFirst('enter-description', 'deviceProfile')}
          className='resize-none min-h-[96px] border border-[var(--grey-neutral-100)] px-4 py-3 rounded-md outline-none text-sm font-normal'
        />
      </div>
    );
  };

  return (
    <PopupAddCover
      isSuccess={isSuccess}
      handleClose={handleClose}
      title='Thêm hồ sơ thiết bị mới'
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid && _imageFile}
      isLoading={isPending}
    />
  );
}

import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputCustom from '~/components/InputCustom';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import { translationCapitalFirst } from '~/utils/translate';
import { useUpdateDeviceProfile } from '../handleApi';
import { useEffect, useState } from 'react';
import Textarea from '~/components/Textarea';
import FreeSoloCreateOption from './SelectTypeDevice';
import { Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import {
  IDeviceTypeContent,
  IParamsEditDeviceProfile,
  IRowDataTabelDeviceProfile
} from '~/@types/deviceProfile/deviceProfile.type';
import AvatarUpload from '~/components/avatar-upload';
import * as yup from 'yup';
import { useDeleteFileAvatar, useDownloadFileAvatar, useUploadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
import { useTranslation } from 'react-i18next';

type EditProps = IRowDataTabelDeviceProfile & {
  openEdit: boolean;
  handleCloseEdit: () => void;
};
export default function PopupEdit({ props }: { props: EditProps }) {
  const { imageUrl, name, signalWaitingTime, description, type, id, openEdit, handleCloseEdit } = props;
  const [deviceProfileTranslate] = useTranslation('', { keyPrefix: 'deviceProfile' });
  const [_imageFile, setFileImage] = useState();
  const handleFileUpload = (file: any) => {
    setFileImage(file);
  };
  const { isPending, isSuccess, mutate, dataDeviceProfileU } = useUpdateDeviceProfile();

  //handle avatart
  const { dataFile, mutateUploadFile, resetUploadFile, isPendingUploadFile } = useUploadFileAvatar();
  const { mutateDeleteFile } = useDeleteFileAvatar();
  const { imageUrlR } = useDownloadFileAvatar(imageUrl);

  const deviceProfileSchema = yup.object().shape({
    name: yup
      .string()
      .required(deviceProfileTranslate('please-enter-device-profile-name'))
      .trim(deviceProfileTranslate('please-enter-device-profile-name'))
      .max(100, deviceProfileTranslate('max-100-character')),
    typeIdTemp: yup
      .object<IDeviceTypeContent>()
      .shape({
        inputValue: yup.string().max(100, deviceProfileTranslate('max-100-character')),
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
    reset,
    setValue
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      typeIdTemp: { inputValue: '', label: '', id: '' },
      signalWaitingTime: 5,
      description: ''
    },
    resolver: yupResolver(deviceProfileSchema)
  });
  const handleClose = () => {
    reset();
    handleCloseEdit();
  };

  //upload image mới, xóa image nếu có thay đổi file hoặc close popup
  useEffect(() => {
    if (_imageFile) {
      mutateUploadFile(_imageFile);
    }
    if (dataFile?.id && !isSuccess) {
      mutateDeleteFile(dataFile?.id);
      resetUploadFile();
    }
  }, [_imageFile]);

  // delete file image cũ nếu thay đổi image thành công
  useEffect(() => {
    if (isSuccess) {
      if (imageUrl && dataDeviceProfileU?.imageUrl !== imageUrl) {
        mutateDeleteFile(imageUrl);
      }
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<IParamsEditDeviceProfile> = async (data) => {
    const datapayload: IParamsEditDeviceProfile = {
      ...data,
      id,
      imageUrl,
      signalWaitingTime: data.signalWaitingTime * 60000
    };

    try {
      if (_imageFile) {
        datapayload.imageUrl = dataFile?.id;
        await mutate(datapayload);
      } else {
        await mutate(datapayload);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpen = () => {
    setValue('name', name);
    if (type?.id) {
      setValue('typeIdTemp', { id: type?.id, label: type?.label });
    }
    setValue('signalWaitingTime', signalWaitingTime / 60000);
    setValue('description', description);
  };

  const bodyPopup = () => {
    return (
      <div className='gap-4 flex flex-col min-h-[50vh]'>
        <div className='w-full justify-center flex'>
          <AvatarUpload onFileUpload={handleFileUpload} src={imageUrlR} />
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
    <PopupEditCover
      openOver={openEdit}
      btnComponent={<></>}
      isSuccess={isSuccess}
      handleClose={handleClose}
      title='deviceProfile.update-infor-device-profile'
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending || isPendingUploadFile}
      handleOpen={handleOpen}
    />
  );
}

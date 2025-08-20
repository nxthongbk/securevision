import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AvatarUserUpdate from '~/components/AvatarUserUpdate';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import { AppContext } from '~/contexts/app.context';
import fileStorageService from '~/services/fileStorage.service';
import userService from '~/services/user.service';
import { setUserInfoToCookie } from '~/utils/auth';
import handleNotificationMessege from '~/utils/notification';
import { editUserProfileSchema } from '~/utils/yup';

interface IFormInput {
  avatarUrl: any;
  email: string;
  phone: string;
}

export default function EditAccount() {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const { userInfo, setUserInfo } = useContext(AppContext);
  const { data } = useQuery({ queryKey: ['userInfo'], queryFn: () => userService.getProfile() });
  const [fileImage, setFileImage] = useState(null);
  const editMutation = useMutation({
    mutationFn: (body: { avatarUrl: string; email: string; phone: string }) => {
      return userService.updateProfile(body);
    }
  });
  const uploadFileMutation = useMutation({
    mutationFn: (formData) => {
      return fileStorageService.uploadFile(formData);
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editUserProfileSchema),
    values: {
      avatarUrl: data?.data?.avatarUrl || '',
      email: data?.data?.email || '',
      phone: data?.data?.phone || ''
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (fileImage) {
      uploadFileMutation.mutate(fileImage, {
        onSuccess: (res) => {
          editMutation.mutate(
            {
              avatarUrl: res?.data?.id,
              email: data.email,
              phone: data.phone
            },
            {
              onSuccess: () => {
                setUserInfoToCookie({ ...userInfo, avatarUrl: res?.data?.id, email: data.email, phone: data.phone });
                setUserInfo({ ...userInfo, avatarUrl: res?.data?.id, email: data.email, phone: data.phone });
                handleNotificationMessege(t('upload-success'));
              },
              onError: () => {
                handleNotificationMessege(t('upload-failed'));
              }
            }
          );
        }
      });
    }
  };

  const onFileUpload = (file) => {
    setFileImage(file);
  };

  return (
    <div className='min-w-[640px]'>
      <Typography variant='h4'>{t('title-update-info')}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
        <AvatarUserUpdate avatarUrl={data?.data?.avatarUrl || ''} onFileUpload={onFileUpload} />
        <InputCustom
          type='text'
          name='phone'
          control={control}
          label={t('phone')}
          isSpacingHelperText={true}
          isRequired
          isError={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
        <div className='text-end'>
          <ButtonCustom
            isLoading={editMutation.isPending}
            className='!bg-[#DFE0E2] !text-[#888E96] w-[95px] h-[40px]'
            type='submit'
            variant='contained'
          >
            <Typography variant='button3'>{t('update')}</Typography>
          </ButtonCustom>
        </div>
      </form>
    </div>
  );
}

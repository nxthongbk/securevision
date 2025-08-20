import * as yup from 'yup';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AppContext } from '~/contexts/app.context';
import AvatarUserUpdate from '~/components/AvatarUserUpdate';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import { Typography } from '@mui/material';
import fileStorageService from '~/services/fileStorage.service';
import handleNotificationMessege from '~/utils/notification';
import { setUserInfoToCookie } from '~/utils/auth';
import { translationCapitalFirst } from '~/utils/translate';
import { useTranslation } from 'react-i18next';
import userService from '~/services/user.service';
import { yupResolver } from '@hookform/resolvers/yup';

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

  const editUserProfileSchema = yup.object({
    phone: yup
      .string()
      .required(translationCapitalFirst('error-enter-phone-tenant', 'tenantPage'))
      .max(10, translationCapitalFirst('error-phone-tenant', 'tenantPage'))
      .min(10, translationCapitalFirst('error-phone-tenant', 'tenantPage'))
      .matches(/^[0-9]+$/, translationCapitalFirst('only-enter-number', 'tenantPage'))
      .matches(/^0\d*$/, translationCapitalFirst('only-start-with-0', 'tenantPage')),
    avatarUrl: yup.string(),
    email: yup.string()
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
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
        },
        onError: () => {
          handleNotificationMessege(t('upload-failed'));
        }
      });
    } else {
      editMutation.mutate(data, {
        onSuccess: () => {
          setUserInfoToCookie({ ...userInfo, avatarUrl: data?.avatarUrl, email: data.email, phone: data.phone });
          setUserInfo({ ...userInfo, avatarUrl: data?.avatarUrl, email: data.email, phone: data.phone });
          handleNotificationMessege(t('upload-success'));
        },
        onError: () => {
          handleNotificationMessege(t('upload-failed'));
        }
      });
    }
  };

  const onFileUpload = (file) => {
    setFileImage(file);
  };

  return (
    <div className='miniLaptop:w-[640px] w-full'>
      <Typography className='hidden miniLaptop:block' variant='h4'>
        {t('title-update-info')}
      </Typography>
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
          <ButtonCustom isLoading={editMutation.isPending} type='submit' variant='contained' disabled={!isValid}>
            <Typography variant='button3'>{t('update')}</Typography>
          </ButtonCustom>
        </div>
      </form>
    </div>
  );
}

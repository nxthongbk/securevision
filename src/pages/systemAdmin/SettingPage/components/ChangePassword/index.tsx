import { SubmitHandler, useForm } from 'react-hook-form';

import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import { Typography } from '@mui/material';
import { editChangePassword } from '~/utils/yup';
import handleNotificationMessege from '~/utils/notification';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import userService from '~/services/user.service';
import { yupResolver } from '@hookform/resolvers/yup';

interface IFormInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const updatePasswordMutation = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => {
      return userService.updatePassword(body);
    }
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editChangePassword),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    updatePasswordMutation.mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      },
      {
        onSuccess: () => {
          handleNotificationMessege('Cập nhật mật khẩu mới thành công');
        },
        onError: (err: any) => {
          setError('oldPassword', { message: err?.response?.data?.data });
          setError('newPassword', { message: err?.response?.data?.data });
          setError('confirmPassword', { message: err?.response?.data?.data });
        }
      }
    );
  };

  return (
    <div className='min-w-[640px]'>
      <Typography variant='h4'>{t('change-password')}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
        <InputCustom
          type='password'
          control={control}
          name='oldPassword'
          label={t('old-password')}
          isRequired
          isSpacingHelperText={true}
          isError={Boolean(errors.oldPassword)}
          helperText={errors.oldPassword?.message}
          placeholder={t('Nhập mật khẩu cũ')}
        />
        <InputCustom
          type='password'
          control={control}
          name='newPassword'
          label={t('new-password')}
          isRequired
          isSpacingHelperText={true}
          isError={Boolean(errors.newPassword)}
          helperText={errors.newPassword?.message}
        />
        <InputCustom
          type='password'
          control={control}
          name='confirmPassword'
          label={t('confirm-password')}
          isSpacingHelperText={true}
          isRequired
          isError={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
        />
        <div className=' text-end'>
          <ButtonCustom className='!bg-[#DFE0E2] !text-[#888E96] w-[95px] h-[40px]' type='submit' variant='contained'>
            <Typography variant='button3'>{t('update')}</Typography>
          </ButtonCustom>
        </div>
      </form>
    </div>
  );
}

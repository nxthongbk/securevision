import * as yup from 'yup';

import { SubmitHandler, useForm } from 'react-hook-form';

import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import { Typography } from '@mui/material';
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
  const [tGlobal] = useTranslation();
  const [translation] = useTranslation('');
  const updatePasswordMutation = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => {
      return userService.updatePassword(body);
    }
  });

  const changePasswordSchema = yup.object({
    oldPassword: yup
      .string()
      .required(t('old-password-required'))
      .min(8, tGlobal('password-length-lower-bound-exceed')),
    newPassword: yup
      .string()
      .required(t('new-password-required'))
      .min(8, tGlobal('password-length-lower-bound-exceed')),
    confirmPassword: yup
      .string()
      .required(t('confirm-password-required'))
      .equals([yup.ref('newPassword'), null], t('passwords-mismatch'))
  });

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'all',
    resolver: yupResolver(changePasswordSchema),
    values: {
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
          reset();
        },
        onError: () => {
          setError('oldPassword', { message: t('wrong-old-password') });
          setValue('oldPassword', '');
          setValue('newPassword', '');
          setValue('confirmPassword', '');
        }
      }
    );
  };

  return (
    <div className='miniLaptop:w-[640px] w-full'>
      <Typography className='hidden miniLaptop:block' variant='h4'>
        {t('change-password')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
        <InputCustom
          type='password'
          control={control}
          name='oldPassword'
          label={t('old-password')}
          isRequired
          isSpacingHelperText={true}
          placeholder={translation('Nhập mật khẩu cũ')}
          isError={Boolean(errors.oldPassword)}
          helperText={errors.oldPassword?.message}
        />
        <InputCustom
          type='password'
          control={control}
          name='newPassword'
          label={t('new-password')}
          isRequired
          isSpacingHelperText={true}
          placeholder={translation('Nhập mật khẩu mới')}
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
          placeholder={translation('Nhập xác nhận mật khẩu mới')}
          isError={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message as string}
        />
        <div className=' text-end'>
          <ButtonCustom type='submit' variant='contained' disabled={!isValid}>
            <Typography variant='button3'>{t('update')}</Typography>
          </ButtonCustom>
        </div>
      </form>
    </div>
  );
}

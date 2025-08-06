import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputCustom from '~/components/InputCustom';
import { newPasswordSchema } from '~/utils/yup';

interface IFormInput {
  password: string;
  confirmPassword: string;
}

export default function NewPasswordForm() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    resolver: yupResolver(newPasswordSchema)
  });

  const onSubmit: SubmitHandler<IFormInput> = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='mb-5'>
        <InputCustom
          type='password'
          label={'Mật khẩu'}
          isRequired={true}
          control={control}
          name='password'
          isError={Boolean(errors.password)}
          variant='outlined'
          size='small'
          placeholder={'Nhập mật khẩu'}
          helperText={errors.password?.message}
          isSpacingHelperText={true}
        />
        <InputCustom
          type='password'
          label={'Xác nhận mật khẩu'}
          isRequired={true}
          control={control}
          name='confirmPassword'
          isError={Boolean(errors.confirmPassword)}
          variant='outlined'
          size='small'
          placeholder={'Nhập lại mật khẩu'}
          helperText={errors.confirmPassword?.message}
          isSpacingHelperText={true}
        />
        <Typography variant='body2' color={'var(--text-primary)'}>
          Mật khẩu phải có ít nhất 8 ký tự
        </Typography>
      </div>

      <div className='mb-4'>
        <Button variant='contained' className='w-full' type='submit'>
          Xác nhận
        </Button>
      </div>
    </form>
  );
}

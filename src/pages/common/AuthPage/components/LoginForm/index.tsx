import * as yup from 'yup';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { translation, translationCapitalFirst } from '~/utils/translate';

import { AppContext } from '~/contexts/app.context';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import Logo from '~/assets/images/svg/Icon.svg';
import { Typography } from '@mui/material';
import authService from '~/services/auth.service';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

interface IFormInput {
  username: string;
  password: string;
}

interface IProps {
  setResetMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginForm({ setResetMode }: IProps) {
  const loginSchema = yup.object({
    username: yup
      .string()
      .required(translationCapitalFirst('field-is-required-user-name'))
      .max(20, translationCapitalFirst('user-name-must-4-20-character'))
      .min(4, translationCapitalFirst('user-name-must-4-20-character'))
      .matches(/^[A-Za-z0-9]+$/, translationCapitalFirst('username-must-contain-only-letters-and-numbers')),
    password: yup
      .string()
      .required(translationCapitalFirst('field-is-required-password'))
      .max(50, translationCapitalFirst('password-length-upper-bound-exceed'))
      .min(8, translationCapitalFirst('password-length-lower-bound-exceed'))
  });
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(loginSchema)
  });
  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => {
      return authService.login(body);
    }
  });
  const { setAuthenticated, setUserInfo } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        setAuthenticated(true);
        setUserInfo(res?.data?.userInfo);
        navigate('/');
      },
      onError: (err: any) => {
        setError('username', { message: err?.response?.data?.data });
        setError('password', { message: err?.response?.data?.data });
      }
    });
  };

  const onInvalid = (errors: FieldErrors<IFormInput>) => {
    if (errors.password) {
      setValue("password", "")
    }
  }

  return (
    <div className='max-w-[544px] w-full'>
      <div className='mb-10'>
        <img alt='logo' src={Logo} className='w-[56px] h-[56px]' />
      </div>
      <Typography variant='h4' className='!mb-10'>
        {translation('Đăng nhập')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='w-full'>
        <InputCustom
          type='text'
          label={translation('Tên đăng nhập')}
          isRequired={true}
          control={control}
          name='username'
          isError={Boolean(errors.username)}
          variant='outlined'
          size='small'
          placeholder={translation('Nhập tên đăng nhập')}
          helperText={errors.username?.message}
          isSpacingHelperText={true}
        />
        <InputCustom
          type='password'
          label={translation('Mật khẩu')}
          classNameContainer='mb-4'
          isRequired={true}
          control={control}
          name='password'
          isError={Boolean(errors.password)}
          variant='outlined'
          size='small'
          placeholder={translation('Nhập mật khẩu')}
          helperText={errors.password?.message}
          isSpacingHelperText={true}
        />

        <div>
          <ButtonCustom
            disabled={loginMutation.isPending}
            isLoading={loginMutation.isPending}
            variant='contained'
            className='w-full h-10'
            type='submit'
          >
            {translation('Đăng nhập')}
          </ButtonCustom>
        </div>
        <div className='w-full text-center mt-3'>
          <Typography
            variant='button3'
            color='var(--primary)'
            className='cursor-pointer'
            onClick={() => setResetMode(true)}
          >
            {translation('Quên mật khẩu?')}
          </Typography>
        </div>
      </form>
    </div>
  );
}

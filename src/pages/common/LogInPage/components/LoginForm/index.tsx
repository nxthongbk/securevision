import * as yup from 'yup';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { translation, translationCapitalFirst } from '~/utils/translate';
import { AppContext } from '~/contexts/app.context';
import InputCustom from '~/components/InputCustom';
import authService from '~/services/auth.service';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography } from '@mui/material';
import { Factory } from '@phosphor-icons/react';

import '../../style.scss';

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
      .matches(
        /^[A-Za-z0-9]+$/,
        translationCapitalFirst('username-must-contain-only-letters-and-numbers')
      ),
    password: yup
      .string()
      .required(translationCapitalFirst('field-is-required-password'))
      .max(50, translationCapitalFirst('password-length-upper-bound-exceed'))
      .min(8, translationCapitalFirst('password-length-lower-bound-exceed')),
  });
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });
  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => {
      return authService.login(body);
    },
  });
  const { setAuthenticated, setUserInfo } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    loginMutation.mutate(data, {
      onSuccess: res => {
        setAuthenticated(true);
        setUserInfo(res?.data?.userInfo);
        navigate('/dashboard');
      },
      onError: (err: any) => {
        setError('username', { message: err?.response?.data?.data });
        setError('password', { message: err?.response?.data?.data });
      },
    });
  };

  const onInvalid = (errors: FieldErrors<IFormInput>) => {
    if (errors.password) {
      setValue('password', '');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center mobile:py-12">
      <div className="relative py-3 mobile:max-w-xl mobile:mx-auto min-w-[460px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] to-[#2563eb] backdrop-blur-lg shadow-lg transform -skew-y-6 mobile:skew-y-0 mobile:-rotate-6 mobile:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg mobile:rounded-3xl mobile:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center items-center space-x-2">
              <Factory size={50} className="text-blue-700" mirrored />
              <span className="text-2xl font-semibold text-blue-700">TMA MES</span>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 mobile:text-lg mobile:leading-7">
                <form onSubmit={handleSubmit(onSubmit, onInvalid)} style={{ width: '100%' }}>
                  <InputCustom
                    type="text"
                    classNameContainer="font-normal"
                    label={translation('Tên đăng nhập')}
                    isRequired={true}
                    control={control}
                    name="username"
                    isError={Boolean(errors.username)}
                    variant="outlined"
                    size="small"
                    placeholder={translation('Nhập tên đăng nhập')}
                    helperText={translation(errors.username?.message)}
                    isSpacingHelperText={true}
                  />
                  <InputCustom
                    type="password"
                    label={translation('Mật khẩu')}
                    classNameContainer=" font-normal"
                    isRequired={true}
                    control={control}
                    name="password"
                    isError={Boolean(errors.password)}
                    variant="outlined"
                    size="small"
                    placeholder={translation('Nhập mật khẩu')}
                    helperText={translation(errors.username?.message)}
                    isSpacingHelperText={true}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Typography
                      variant="button3"
                      sx={{ color: '#2563eb', fontSize: 14, cursor: 'pointer' }}
                      onClick={() => setResetMode(true)}
                    >
                      {translation('Quên mật khẩu?')}
                    </Typography>
                  </Box>
                  <Button
                    className="login-btn"
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#0794ff',
                      color: '#fff',
                      fontWeight: 400,
                      fontSize: 18,
                      borderRadius: 2,
                      py: 1,
                      mt: 1,
                      textTransform: 'none',
                      boxShadow: 'none',
                      transition: 'background 0.3s, transform 0.3s',
                    }}
                  >
                    {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

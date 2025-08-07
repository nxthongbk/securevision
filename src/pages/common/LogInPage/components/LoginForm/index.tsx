import * as yup from 'yup';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { translation, translationCapitalFirst } from '~/utils/translate';
import { AppContext } from '~/contexts/app.context';
import authService from '~/services/auth.service';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from '~/assets/images/jpg/logo-login.jpg';

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
        navigate('/cameras');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 py-8">
      <div
        className="w-full max-w-5xl min-w-[320px] bg-white border border-[#e5e7eb] rounded-xl shadow-[0_2px_8px_0_rgba(16,30,54,0.08)] flex flex-row overflow-hidden"
        style={{ boxSizing: 'border-box' }}
      >
        <div className="flex-1 bg-blue-900 text-center hidden smallLaptop:flex items-center justify-center border-r-2 border-[#e5e7eb] p-0">
          <div
            className="w-full h-full min-h-[520px] bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${Logo})`,
            }}
          ></div>
        </div>
        <div className="w-full miniLaptop:w-5/12 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="text-center">
              <h1
                className="text-2xl smallLaptop:text-4xl font-bold text-blue-900"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Sign In
              </h1>
            </div>
            <div className="w-full flex-1 mt-8">
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="mx-auto max-w-xs flex flex-col gap-4"
              >
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter your username"
                  {...control.register('username')}
                />
                {errors.username && (
                  <div className="text-xs text-red-500 mt-1">
                    {translation(errors.username.message)}
                  </div>
                )}
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Enter your password"
                  {...control.register('password')}
                />
                {errors.password && (
                  <div className="text-xs text-red-500 mt-1">
                    {translation(errors.password.message)}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-900 hover:underline mt-2"
                    onClick={() => setResetMode(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

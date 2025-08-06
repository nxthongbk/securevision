import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputCustom from '~/components/InputCustom';
import { MODE_RESET_PASSWORD_FORM } from '~/constants/rule.constant';
import userService from '~/services/user.service';
import { translation } from '~/utils/translate';
import { resetPasswordSchema } from '~/utils/yup';

interface IFormInput {
  username: string;
  phone: string;
}

interface IProps {
  setModeForm: React.Dispatch<React.SetStateAction<MODE_RESET_PASSWORD_FORM>>;
  setAccount: React.Dispatch<
    React.SetStateAction<{
      phone: string;
      username: string;
    }>
  >;
}

export default function ResetForm(props: IProps) {
  const { setModeForm, setAccount } = props;
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      phone: '',
    },
    resolver: yupResolver(resetPasswordSchema),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (body: { username: string; phone: string }) => {
      return userService.resetPassword(body);
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = data => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setModeForm(MODE_RESET_PASSWORD_FORM.OTP_PASSWORD_FORM);
        setAccount({ username: data?.username, phone: data?.phone });
      },
      onError: (err: any) => {
        setError('username', { message: err?.response?.data?.data });
        setError('phone', { message: err?.response?.data?.data });
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-5">
        <InputCustom
          classNameContainer="text-white"
          type="text"
          label={translation('Tên đăng nhập')}
          isRequired={true}
          control={control}
          name="username"
          isError={Boolean(errors.username)}
          variant="outlined"
          size="small"
          placeholder={translation('Nhập tên đăng nhập')}
          helperText={errors.username?.message}
          isSpacingHelperText={true}
        />
        <InputCustom
          classNameContainer="text-white"
          type="text"
          label={translation('Số điện thoại')}
          isRequired={true}
          control={control}
          name="phone"
          isError={Boolean(errors.phone)}
          variant="outlined"
          size="small"
          placeholder={translation('Nhập số điện thoại')}
          helperText={errors.phone?.message}
          isSpacingHelperText={true}
        />
      </div>

      <div className="mb-4">
        <Button variant="contained" className="w-full" type="submit">
          Gửi mã OTP
        </Button>
      </div>
    </form>
  );
}

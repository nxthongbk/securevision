import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputCustom from '~/components/InputCustom';
import userService from '~/services/user.service';
import { otpPasswordSchema } from '~/utils/yup';

interface IFormInput {
  oneTimeOtp: string;
}

export default function OtpForm(props: { username: string }) {
  const { username } = props;
  const [count, setCount] = useState(120);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      oneTimeOtp: ''
    },
    resolver: yupResolver(otpPasswordSchema)
  });

  const compareOtpMutation = useMutation({
    mutationFn: (body: { username: string; oneTimeOtp: string }) => {
      return userService.compareOtp(body);
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    compareOtpMutation.mutate({
      username: username,
      oneTimeOtp: data.oneTimeOtp
    });
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      if (count > 0) {
        setCount((pre) => pre - 1);
      } else {
        setCount(0);
        clearInterval(countdown);
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <InputCustom
        type='text'
        label={'Mã OTP'}
        isRequired={true}
        control={control}
        name='oneTimeOtp'
        isError={Boolean(errors.oneTimeOtp)}
        variant='outlined'
        size='small'
        placeholder={'Nhập mã OTP'}
        helperText={errors.oneTimeOtp?.message}
        isSpacingHelperText={true}
      />

      <Typography variant='body2' color='var(--text-primary)' className='!mb-5'>
        Mã OTP sẽ hết hạn sau{' '}
        <Typography variant='label2' color='var(--alert)'>
          {count}
        </Typography>{' '}
        giây
      </Typography>

      <div className='mb-4'>
        <Button variant='contained' className='w-full' type='submit'>
          Xác nhận
        </Button>
      </div>
    </form>
  );
}

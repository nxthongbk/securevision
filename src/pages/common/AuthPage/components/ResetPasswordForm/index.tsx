import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import Logo from '~/assets/images/svg/Icon.svg';
import ResetForm from './ResetForm';
import OtpForm from './OtpForm';
import NewPasswordForm from './NewPasswordForm';
import { MODE_RESET_PASSWORD_FORM } from '~/constants/rule.constant';
interface IProps {
  setResetMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResetPasswordForm({ setResetMode }: IProps) {
  const [modeForm, setModeForm] = useState(MODE_RESET_PASSWORD_FORM.RESET_PASSWORD_FORM);
  const [account, setAccount] = useState({
    phone: '',
    username: ''
  });

  const renderForm = () => {
    if (modeForm === MODE_RESET_PASSWORD_FORM.RESET_PASSWORD_FORM) {
      return <ResetForm setAccount={setAccount} setModeForm={setModeForm} />;
    }
    if (modeForm === MODE_RESET_PASSWORD_FORM.OTP_PASSWORD_FORM) {
      return <OtpForm username={account.username} />;
    }
    if (modeForm === MODE_RESET_PASSWORD_FORM.NEW_PASSWORD_FORM) {
      return <NewPasswordForm />;
    }
  };

  return (
    <div className='min-w-[544px]'>
      <div className='mb-10'>
        <img alt='logo' src={Logo} className='w-[56px] h-[56px]' />
      </div>
      <div className='!mb-10'>
        <Typography variant='h4'>Đổi mật khẩu mới</Typography>
        {modeForm === MODE_RESET_PASSWORD_FORM.OTP_PASSWORD_FORM && (
          <Typography variant='body2' className='!mt-2' color='var(--text-secondary)'>
            Mã OTP đã được gửi về số điện thoại <span className='text-[var(--text-primary)]'>{account.phone}</span>
          </Typography>
        )}
      </div>
      <div>{renderForm()}</div>

      {/* <div className='!mb-10'>
        <Typography variant='h4'>{modeOtpForm ? 'Nhập mã OTP' : 'Cấp lại mật khẩu'}</Typography>
        {modeOtpForm && (
          <Typography variant='body2' className='!mt-2' color='var(--text-secondary)'>
            Mã OTP đã được gửi về số điện thoại <span className='text-[var(--text-primary)]'>{phone}</span>
          </Typography>
        )}
      </div>
      {modeOtpForm ? <OtpForm /> : <ResetForm setModeOtpForm={setModeOtpForm} setPhone={setPhone} />} */}
      <div>
        <Button variant='outlined' className='w-full' type='submit' onClick={() => setResetMode(false)}>
          Về trang đăng nhập
        </Button>
      </div>
    </div>
  );
}

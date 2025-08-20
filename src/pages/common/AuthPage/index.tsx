import LoginForm from './components/LoginForm';
import { useState } from 'react';
import ResetPasswordForm from './components/ResetPasswordForm';
import BannerLoginImg from '~/assets/images/svg/BuidingBanner.svg';
import { Typography } from '@mui/material';
import { translation } from '~/utils/translate';

export default function AuthPage() {
  const [resetMode, setResetMode] = useState(false);

  return (
    <div className='flex h-screen '>
      <div className='flex-1 flex justify-center items-center p-8'>
        {!resetMode ? <LoginForm setResetMode={setResetMode} /> : <ResetPasswordForm setResetMode={setResetMode} />}
      </div>
      <div className='flex-1 p-8 h-full hidden miniLaptop:flex'>
        <div className='w-full h-full flex flex-col items-center justify-center top-0 left-0 bg-[linear-gradient(180deg,_#C2E1FF_0%,_#0069CC_100%)] rounded-2xl'>
          <img src={BannerLoginImg} className='h-[80%]' />
          <div className='bg-[#3F8ED9] w-[90%] p-8 text-center rounded-2xl'>
            <Typography variant='h5' color='white'>
              {translation('Hệ thống quản lý khu đô thị thông minh')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

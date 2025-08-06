import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import { useContext, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import ChangePassword from './components/ChangePassword';
import EditAccount from './components/EditAccount';
import { INDEX_SETTING } from '~/constants/rule.constant';
import Language from './components/Language';
import SettingMenu from './components/SettingMenu';
import { SignOut } from '@phosphor-icons/react';
import { Typography } from '@mui/material';
import authService from '~/services/auth.service';
import env from '@ludovicm67/react-dotenv';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SettingPage() {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const [menuIndex, setMenuIndex] = useState(INDEX_SETTING.UPDATE_INFO_ACCOUNT);

  const renderViewSetting = () => {
    if (menuIndex === INDEX_SETTING.UPDATE_INFO_ACCOUNT) {
      return <EditAccount />;
    }
    if (menuIndex === INDEX_SETTING.CHANGE_PASSWORD) {
      return <ChangePassword />;
    }
    if (menuIndex === INDEX_SETTING.LANGUAGE) {
      return <Language />;
    }
  };
  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => {
      return authService.logout(query);
    }
  });
  const navigate = useNavigate();
  const { reset } = useContext(AppContext);
  const handleLogout = () => {
    const refreshToken = getRefreshTokenFromCookie();
    logoutMutation.mutate(
      { refreshToken },
      {
        onSettled: () => {
          clearCookie();
          reset();
          navigate('/login');
        }
      }
    );
  };
  return (
    <div className='w-full h-screen p-6 px-4'>
      <div className='flex justify-between'>
        <Typography variant='h4'>{t('setting')}</Typography>
        <div
          onClick={handleLogout}
          className='miniLaptop:hidden flex p-[10px] px-4 gap-2 text-white bg-[#F50000] cursor-pointer rounded-md max-w-[228px] hover:bg-[#FFEBEB]'
        >
          <SignOut size={20} />
          <Typography variant='body3'>{t('sign-out')}</Typography>
        </div>
      </div>

      <div className='flex flex-col h-5/6 miniLaptop:h-full miniLaptop:flex-col'>
        <div className='flex-wrap flex-auto block mt-6 miniLaptop:flex'>
          <div className='miniLaptop:w-[240px] w-screen  miniLaptop:border-r border-[var(--border-color)] overflow-auto'>
            <SettingMenu menuIndex={menuIndex} setMenuIndex={setMenuIndex} />
          </div>
          <div className='flex justify-center flex-1 '>{renderViewSetting()}</div>
        </div>
        <div className='flex-none p-6 text-center'>
          <Typography variant='body3' color='var(--grey-neutral-800)'>
            {t('version')} {env?.VERSION || import.meta.env.VITE_REACT_APP_VERSION}
          </Typography>
        </div>
      </div>
    </div>
  );
}

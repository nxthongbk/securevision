import { Typography } from '@mui/material';
import SettingMenu from './components/SettingMenu';
import EditAccount from './components/EditAccount';
import ChangePassword from './components/ChangePassword';
import Language from './components/Language';
import { useState } from 'react';
import { INDEX_SETTING } from '~/constants/rule.constant';
import env from '@ludovicm67/react-dotenv';
import { useTranslation } from 'react-i18next';

export default function SysSettingPage() {
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

  return (
    <div className='w-full h-screen p-6'>
      <Typography variant='h4'>{t('setting')}</Typography>
      <div className='flex flex-col h-full'>
        <div className='flex flex-wrap flex-auto mt-6'>
          <div className='min-w-[240px] border-r border-[var(--border-color)]'>
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

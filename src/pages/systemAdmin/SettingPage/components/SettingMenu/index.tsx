import { Typography } from '@mui/material';
import { GlobeSimple, LockSimple, SignOut, UserCircle } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dispatch, MouseEventHandler, ReactNode, SetStateAction, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { INDEX_SETTING } from '~/constants/rule.constant';
import { AppContext } from '~/contexts/app.context';
import authService from '~/services/auth.service';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';

interface IProps {
  menuIndex: INDEX_SETTING;
  setMenuIndex: Dispatch<SetStateAction<INDEX_SETTING>>;
}

const menuList = [
  {
    id: INDEX_SETTING.UPDATE_INFO_ACCOUNT,
    icon: <UserCircle size={20} />,
    title: 'title-update-info'
  },
  {
    id: INDEX_SETTING.CHANGE_PASSWORD,
    icon: <LockSimple size={20} />,
    title: 'change-password'
  },
  {
    id: INDEX_SETTING.LANGUAGE,
    icon: <GlobeSimple size={20} />,
    title: 'language'
  }
];

function MenuItem(props: {
  icon: ReactNode;
  title: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const { icon, title, active, onClick } = props;
  const classDiv = classNames('flex p-[10px] gap-2 items-center max-w-[228px] rounded-md  cursor-pointer', {
    'text-[#FFFFFF] bg-[#007EF5]': active,
    'text-[#3A3D41]  hover:bg-[#D9E1E8]': !active
  });
  //' text-[#3A3D41]  hover:bg-[#D9E1E8]'
  return (
    <div onClick={onClick} className={classDiv}>
      {icon} <Typography variant='body3'>{title}</Typography>
    </div>
  );
}

export default function SettingMenu(props: IProps) {
  const [t] = useTranslation('', { keyPrefix: 'setting' });
  const { reset } = useContext(AppContext);
  const { menuIndex, setMenuIndex } = props;
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => {
      return authService.logout(query);
    }
  });

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
    <div className=''>
      {menuList.map((item) => {
        return (
          <MenuItem
            key={item.id}
            icon={item.icon}
            title={t(item.title)}
            active={menuIndex === item.id ? true : false}
            onClick={() => {
              setMenuIndex(item.id);
            }}
          />
        );
      })}
      <div
        onClick={handleLogout}
        className='flex p-[10px] gap-2 text-[#CC0000] cursor-pointer rounded-md max-w-[228px] hover:bg-[#FFEBEB]'
      >
        <SignOut size={20} />
        <Typography variant='body3'>{t('sign-out')}</Typography>
      </div>
    </div>
  );
}

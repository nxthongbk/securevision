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
    icon: <UserCircle className='hidden miniLaptop:block' size={20} />,
    title: 'title-update-info'
  },
  {
    id: INDEX_SETTING.CHANGE_PASSWORD,
    icon: <LockSimple className='hidden miniLaptop:block' size={20} />,
    title: 'change-password'
  },
  {
    id: INDEX_SETTING.LANGUAGE,
    icon: <GlobeSimple className='hidden miniLaptop:block' size={20} />,
    title: 'language'
  }
];

export function MenuItem(props: {
  icon?: ReactNode;
  title: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const { icon, title, active, onClick } = props;
  const classDiv = classNames('flex p-[10px] gap-2  items-center max-w-[228px] miniLaptop:rounded-md  cursor-pointer ', {
    'miniLaptop:text-[#FFFFFF] miniLaptop:bg-[#007EF5] border-b-2 text-primary border-primary ': active,
    'text-[#3A3D41]  hover:bg-[#D9E1E8]': !active
  });
  //' text-[#3A3D41]  hover:bg-[#D9E1E8]'
  return (
    <div onClick={onClick} className={classDiv}>
      {icon} <Typography className='block miniLaptop:hidden' variant='button3'>{title}</Typography>
      <Typography className='hidden miniLaptop:block' variant='body3'>{title}</Typography>
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
    <div className='flex gap-2 miniLaptop:border-0 border-b miniLaptop:flex-col sm:border-[var(--border-color)]'>
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
        className='hidden miniLaptop:flex p-[10px] gap-2 text-[#CC0000] cursor-pointer rounded-md max-w-[228px] hover:bg-[#FFEBEB]'
      >
        <SignOut size={20} />
        <Typography variant='body3'>{t('sign-out')}</Typography>
      </div>
    </div>
  );
}

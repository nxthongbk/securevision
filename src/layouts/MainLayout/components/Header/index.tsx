import { AppBar, Avatar, Divider, Fade, Popper, Typography } from '@mui/material';
import { BellSimple } from '@phosphor-icons/react';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import { useContext, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import Logo from '~/assets/images/svg/logo/Logo32.svg';
import authService from '~/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => {
      return authService.logout(query);
    }
  });
  const navigate = useNavigate();
  const { reset, userInfo } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenControl = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

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
    <AppBar className='w-screen !min-h-14 !bg-[white] !shadow-none border border-b border-[var(--border-color)]'>
      <div className='flex h-full px-4 justify-between'>
        <div className='flex items-center !min-h-14'>
          <img src={Logo} alt='logo-tma' className='ml-3' />
          <Typography variant='h6' className='text-[var(--text-primary)] !ml-6'>
            Trung tâm điều hành - Phòng điều hành Phú Mỹ Hưng
          </Typography>
        </div>
        <div className='flex items-center min-h-14 gap-3'>
          <span className='p-1'>
            <BellSimple size={24} color={'var(--text-primary)'} />
          </span>
          <div>
            <Avatar
              onClick={handleOpenControl}
              className='!w-[32px] !h-[32px]'
              alt={userInfo?.name || userInfo?.username}
              src={userInfo?.avatarUrl}
            />

            <Popper id={id} open={open} anchorEl={anchorEl} transition className=''>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <div className='bg-white border px-4 min-w-[250px] mr-4 mt-4 rounded-lg shadow-md'>
                    <div className='flex py-2 gap-3 items-center'>
                      <Avatar
                        className='!w-[32px] !h-[32px]'
                        alt={userInfo?.name || userInfo?.username}
                        src={userInfo?.avatarUrl}
                      />
                      <div className='flex flex-col'>
                        <Typography variant='label1'>{userInfo?.name || userInfo?.username}</Typography>
                        <Typography variant='label4' color='var(--grey-neutral-500)'>
                          {userInfo?.roles?.[0]}
                        </Typography>
                      </div>
                    </div>
                    <Divider />
                    <div className='py-2'>
                      <ButtonCustom
                        variant='text'
                        sx={{
                          textDecoration: 'none !important'
                        }}
                        className='cursor-pointer w-full !justify-start text- hover:no-underline !px-0 gap-2'
                      >
                        <IconPhosphor iconName='SignOut' size={24} color='var(--text-secondary)' />
                        <Typography onClick={handleLogout} className='!no-underline text-[var(--text-secondary)]'>
                          Đăng xuất
                        </Typography>
                      </ButtonCustom>
                    </div>
                  </div>
                </Fade>
              )}
            </Popper>
          </div>
        </div>
      </div>
    </AppBar>
  );
}

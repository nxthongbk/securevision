import TopBarSVG from '~/assets/uisvg/HeaderSVG/topbar.svg';
import { Avatar, Popper, Fade, Typography, Divider, IconButton } from '@mui/material';
import { BellRinging, BellSlash } from '@phosphor-icons/react';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '~/contexts/app.context';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import authService from '~/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FormatHourly, FormatDate } from '~/utils/formatDateTime'; // adjust path
import LanguageMini from '~/pages/systemAdmin/SettingPage/components/Language/mini';

export default function TopHeader() {
  const { userInfo, reset } = useContext(AppContext);
  const navigate = useNavigate();

  // 🔔 Alarm state
  const [isBellRingAlarm, setIsBellRingAlarm] = useState(true);

  const handleAlarmToggle = () => {
    const newValue = !isBellRingAlarm;
    setIsBellRingAlarm(newValue);
    localStorage.setItem('isBellRingAlarm', newValue.toString());
    window.dispatchEvent(new Event('localStorageChange'));
  };

  useEffect(() => {
    const checkLocalStorage = () => {
      const isBell = localStorage.getItem('isBellRingAlarm') === 'true';
      setIsBellRingAlarm(isBell);
    };
    checkLocalStorage();
    window.addEventListener('storage', checkLocalStorage);
    window.addEventListener('localStorageChange', checkLocalStorage);
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('localStorageChange', checkLocalStorage);
    };
  }, []);

  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => authService.logout(query)
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenControl = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
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
    <div className="relative w-full">
      {/* TopBar SVG as background */}
      <img
        src={TopBarSVG}
        alt="TopBar Background"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[110%] max-w-none pointer-events-none select-none z-40"
      />

      {/* Title */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full">
        <Typography
          className="
            font-saira font-bold uppercase
            text-[24px] leading-[32px]
            tracking-normal text-white
          "
          style={{
            textShadow: '0 0 8px rgba(124, 212, 253, 0.7), 0 0 16px rgba(124, 212, 253, 0.5)'
          }}
        >
          Secure Vision
        </Typography>
      </div>

      {/* Date and Time at 1/4 of the topbar width */}
      <div className="fixed top-3 left-[25%] -translate-x-1/2 z-50 flex items-center gap-2">
        <Typography
          className="font-saira font-normal uppercase text-white"
          style={{ fontSize: '16px', lineHeight: '24px' }}
        >
          {FormatHourly(dateTime)}
        </Typography>
        <Typography
          className="font-saira font-small uppercase text-white opacity-80"
          style={{ fontSize: '12px', lineHeight: '18px' }}
        >
          {FormatDate(dateTime)}
        </Typography>
      </div>

      {/* Profile + Language + Alarm at 3/4 of the topbar width */}
      <div className="fixed top-2 left-[70%] z-50 flex items-center gap-2 scale-90">
        {/* Language selector */}
        <div className="h-full flex items-center">
          <LanguageMini />
        </div>

        {/* 🔔 Alarm toggle beside Language */}
        <IconButton
          onClick={handleAlarmToggle}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            backgroundColor: 'transparent', // clear background
            color: isBellRingAlarm ? 'var(--primary-main)' : 'var(--grey-primary-200)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          {isBellRingAlarm ? <BellRinging size={18} /> : <BellSlash size={18} />}
        </IconButton>

        <div className="w-[1px] h-5 bg-white/20 rounded-full" />

        {/* Profile */}
        <Avatar
          onClick={handleOpenControl}
          className="!w-[22px] !h-[22px] cursor-pointer"
          alt={userInfo?.name || userInfo?.username}
          src={userInfo?.avatarUrl}
        />
        <Typography
          className="font-saira font-small uppercase text-white text-[12px] leading-[18px]"
        >
          {userInfo?.name || userInfo?.username}
        </Typography>

        {/* Popper */}
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div className="bg-white border px-4 min-w-[200px] rounded-lg shadow-md mt-4">
                <div className="flex py-2 gap-3 items-center">
                  <Avatar
                    className="!w-[28px] !h-[28px]"
                    alt={userInfo?.name || userInfo?.username}
                    src={userInfo?.avatarUrl}
                  />
                  <div className="flex flex-col">
                    <Typography variant="body2">{userInfo?.name || userInfo?.username}</Typography>
                    <Typography variant="caption" color="var(--grey-neutral-500)">
                      {userInfo?.roles?.[0]}
                    </Typography>
                  </div>
                </div>
                <Divider />
                <div className="py-2">
                  <Typography
                    onClick={handleLogout}
                    className="cursor-pointer text-[var(--text-secondary)] hover:text-[#7CD4FD]"
                  >
                    Đăng xuất
                  </Typography>
                </div>
              </div>
            </Fade>
          )}
        </Popper>
      </div>
    </div>
  );
}

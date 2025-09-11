import TopBarSVG from '~/assets/uisvg/HeaderSVG/topbar.svg';
import { Avatar, Popper, Fade, Typography, Divider, IconButton, ClickAwayListener } from '@mui/material';
import { BellRinging, BellSlash } from '@phosphor-icons/react';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/contexts/app.context';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import authService from '~/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FormatHourly, FormatDate } from '~/utils/formatDateTime';
import LanguageMini from '~/pages/systemAdmin/SettingPage/components/Language/mini';
import { useTranslation } from "react-i18next";
import fileStorageService from '~/services/fileStorage.service';
import { useQuery } from '@tanstack/react-query';

export default function TopHeader() {
  const { userInfo, reset } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Alarm state
  const [isBellRingAlarm, setIsBellRingAlarm] = useState(true);
  // New: state to represent actual ringing
  const [isRinging, setIsRinging] = useState(false);

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

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => authService.logout(query)
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const avatarRef = useRef<HTMLDivElement | null>(null);

  const handleOpenControl = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

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

  // Date and Time
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch avatar image like in AvatarPopper
  const { data: img } = useQuery({
    queryKey: ['userImg', userInfo?.avatarUrl],
    queryFn: async () => {
      if (!userInfo?.avatarUrl) return '';
      const res: any = await fileStorageService.getFileImage(userInfo.avatarUrl);
      if (res) return URL.createObjectURL(res);
      return '';
    }
  });

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  // Bell color logic
  const bellColor = !isBellRingAlarm
    ? 'var(--grey-primary-200)' // disabled
    : isRinging
      ? '#f87171' 
      : '#22d3ee'; 

  return (
    <div className="relative w-full">
      {/* TopBar SVG */}
      <img
        src={TopBarSVG}
        alt="TopBar Background"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[110%] max-w-none pointer-events-none select-none z-40"
      />

      {/* Title */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full">
        <Typography
          className="font-saira font-bold uppercase text-[24px] leading-[32px] tracking-normal text-white"
          style={{ textShadow: '0 0 8px rgba(124, 212, 253, 0.7), 0 0 16px rgba(124, 212, 253, 0.5)' }}
        >
          Secure Vision
        </Typography>
      </div>

      {/* Date and Time */}
      <div className="fixed top-3 left-[25%] -translate-x-1/2 z-50 flex items-center gap-2">
        <Typography className="font-saira font-normal uppercase text-white" style={{ fontSize: '16px', lineHeight: '24px' }}>
          {FormatHourly(dateTime)}
        </Typography>
        <Typography className="font-saira font-small uppercase text-white opacity-80" style={{ fontSize: '12px', lineHeight: '18px' }}>
          {FormatDate(dateTime)}
        </Typography>
      </div>

      {/* Profile + Language + Alarm */}
      <div className="fixed top-2 left-[70%] z-50 flex items-center gap-2 scale-90">
        {/* Language selector */}
        <LanguageMini />

        {/* Alarm toggle */}
        <IconButton
          onClick={handleAlarmToggle}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: bellColor,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
          }}
        >
          {isBellRingAlarm ? <BellRinging size={18} /> : <BellSlash size={18} />}
        </IconButton>

        <div className="w-[1px] h-5 bg-white/20 rounded-full" />

        {/* Profile avatar */}
        <div ref={avatarRef} className="flex items-center gap-2">
          <Avatar
            onClick={handleOpenControl}
            className="!w-[22px] !h-[22px] cursor-pointer"
            alt={userInfo?.name || userInfo?.username || 'User'}
            src={img || undefined} // use fetched Blob URL
          >
            {!img && (userInfo?.name?.[0] || 'U')}
          </Avatar>
          <Typography className="font-saira font-small uppercase text-white text-[12px] leading-[18px]">
            {userInfo?.name || userInfo?.username}
          </Typography>
        </div>

        {/* Popper */}
        <ClickAwayListener
          onClickAway={(event) => {
            if (avatarRef.current && avatarRef.current.contains(event.target as Node)) return;
            setOpen(false);
          }}
        >
          <Popper id={id} open={open} anchorEl={anchorEl} transition sx={{ zIndex: 1001 }}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div className=" px-4 min-w-[200px] shadow-md mt-4 bg-[#030912A3] backdrop-blur ">
                  <div className="flex py-2 gap-3 items-center">
                    <Avatar className="!w-[28px] !h-[28px]" alt={userInfo?.name || userInfo?.username} src={img || undefined}>
                      {!img && (userInfo?.name?.[0] || 'U')}
                    </Avatar>
                    <div className="flex flex-col">
                      <Typography variant="body2" className='text-white'>{userInfo?.name || userInfo?.username}</Typography>
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
                      {t('setting.sign-out')}
                    </Typography>
                  </div>
                </div>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      </div>
    </div>
  );
}

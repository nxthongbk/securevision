import { useContext, useState } from 'react';
import { SignOut, Bird, SunDim, Moon, ArrowsClockwise, Sparkle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import { useMutation } from '@tanstack/react-query';
import authService from '~/services/auth.service';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import { Menu, MenuItem } from '@mui/material';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { reset } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const logoutMutation = useMutation({
    mutationFn: (query: { refreshToken: string }) => authService.logout(query),
  });

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        },
      }
    );
    handleMenuClose();
  };

  const menuItems = [
    {
      key: 'auto-dark',
      label: 'Auto dark mode',
      icon: <Sparkle size={16} className="w-6 h-6 self-center mr-2 text-gray-500 flex-shrink-0" />,
      onClick: () => handleMenuClose(),
    },
    { divider: true },
    {
      key: 'light',
      label: 'Light',
      icon: <SunDim size={16} className="w-6 h-6 self-center mr-2 text-gray-500 flex-shrink-0" />,
      onClick: () => handleMenuClose(),
    },
    {
      key: 'dark',
      label: 'Dark',
      icon: <Moon size={16} className="w-6 h-6 self-center mr-2 text-gray-500 flex-shrink-0" />,
      onClick: () => handleMenuClose(),
    },
    {
      key: 'restart',
      label: 'Restart Frigate',
      icon: (
        <ArrowsClockwise
          size={16}
          className="w-6 h-6 self-center mr-2 text-gray-500 flex-shrink-0"
        />
      ),
      onClick: () => handleMenuClose(),
    },
    { divider: true },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <SignOut size={16} className="w-6 h-6 self-center mr-2 text-gray-500 flex-shrink-0" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 flex items-center justify-between h-16">
      <div className="flex items-center">
        <button
          className="smallLaptop:hidden  p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
        <div className=" smallLaptop:hidden flex items-center h-16 px-4 border-b border-gray-100">
          <Bird size={32} className="text-blue-900 mr-2" />
          <span className="text-lg font-bold tracking-wide text-blue-900">FRIGATE</span>
        </div>
        <span className="hidden smallLaptop:block"></span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 ">
          <div className="text-right cursor-pointer relative " onClick={handleAvatarClick}>
            <div className="text-sm font-medium text-gray-900">Admin System</div>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {menuItems.map((item, idx) =>
              item.divider ? (
                <div key={idx} className="border-b border-gray-200 my-2"></div>
              ) : (
                <MenuItem key={item.key} onClick={item.onClick}>
                  <div className="flex space-x-2 cursor-pointer">
                    <div>{item.icon}</div>
                    <div className="whitespace-nowrap text-[15px]">{item.label}</div>
                  </div>
                </MenuItem>
              )
            )}
          </Menu>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ">
            <span className="text-blue-600 font-bold text-lg">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useContext, useState } from 'react';
import { SignOut } from '@phosphor-icons/react';
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

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between h-16">
      {/* Left section: Sidebar menu icon */}
      <div className="flex items-center">
        {sidebarOpen ? (
          <button
            onClick={() => setSidebarOpen(false)}
            className="mr-4 flex p-1 items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-all duration-200"
            type="button"
            aria-label="Đóng menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 flex p-1 items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-all duration-200"
            type="button"
            aria-label="Mở menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        )}
        {/* Search box */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none w-64"
            />
          </div>
        </div>
      </div>
      {/* Right section */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            Ca làm việc: <span>Sáng</span>
          </div>
          <div className="text-xs text-gray-500">07:00 - 15:00</div>
        </div>
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        {/* User info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 ">
          <div className="text-right cursor-pointer relative " onClick={handleAvatarClick}>
            <div className="text-sm font-medium text-gray-900">Nguyễn Văn A</div>
            <div className="text-xs text-gray-500">Quản lý sản xuất</div>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>
              <div className="flex items-center space-x-2 ">
                <SignOut size={16} className=" text-gray-600" />{' '}
                <p className="text-gray-600 text-[15px]">Đăng xuất</p>
              </div>
            </MenuItem>
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

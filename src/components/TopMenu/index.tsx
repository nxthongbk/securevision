import { useContext, useState } from 'react';
import {
  Bell,
  User,
  House,
  ChartLine,
  Lightbulb,
  CurrencyDollar,
  Leaf,
  GearSix,
  SignOut,
} from '@phosphor-icons/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import { useMutation } from '@tanstack/react-query';
import authService from '~/services/auth.service';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import { Menu, MenuItem } from '@mui/material';
import energyLogo from '~/assets/images/png/energy-flatform-logo.png';

const navItems = [
  { label: 'Dashboard', icon: <House className="mr-2" size={18} />, path: '/dashboard' },
  { label: 'Devices', icon: <GearSix className="mr-2" size={18} />, path: '/devices' },
  { label: 'Analytics', icon: <ChartLine className="mr-2" size={18} />, path: '/analytics' },
  {
    label: 'Recommendations',
    icon: <Lightbulb className="mr-2" size={18} />,
    path: '/recommendations',
  },
  { label: 'Costs', icon: <CurrencyDollar className="mr-2" size={18} />, path: '/costs' },
  {
    label: 'Environmental',
    icon: <Leaf className="mr-2" size={18} />,
    path: '/environmental',
  },
];

const TopMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const activePath = location.pathname === '/' ? '/dashboard' : location.pathname;

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
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 rounded-t-2xl mx-auto w-full shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="p-2 flex items-center justify-center">
              <img src={energyLogo} alt="Energy Platform Logo" className="w-[54px] h-[46px]" />
            </div>
            <h1 className="text-xl font-bold text-white">Energy Platform</h1>
          </div>
          <nav className="hidden smallLaptop:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  activePath === item.path
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="smallLaptop:hidden p-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-6 h-6" weight="duotone" />
            </button>
            <>
              <button
                className="p-2 text-gray-300 hover:text-white transition-colors"
                onClick={handleAvatarClick}
              >
                <User className="w-6 h-6" weight="duotone" />
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: 'rgba(30,41,59,0.95)',
                      color: '#fff',
                      boxShadow: '0 8px 32px 0 rgba(16,185,129,0.15)',
                      borderRadius: 2,
                      minWidth: 140,
                      mt: 1,
                      border: '1px solid rgba(255,255,255,0.12)',
                      '& .MuiMenuItem-root': {
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderRadius: 1,
                        transition: 'background 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(16,185,129,0.15)',
                          color: '#10b981',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <SignOut size={20} className="mr-2" />
                  <p className="text-md">Signout</p>
                </MenuItem>
              </Menu>
            </>
          </div>
        </div>
        {mobileOpen && (
          <nav className="flex flex-col smallLaptop:hidden mt-2 space-y-2 pb-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${
                  activePath === item.path
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default TopMenu;

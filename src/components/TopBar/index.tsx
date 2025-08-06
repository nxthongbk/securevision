import React from 'react';
import './style.scss';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import { useMutation } from '@tanstack/react-query';
import authService from '~/services/auth.service';
import { clearCookie, getRefreshTokenFromCookie } from '~/utils/auth';
import { SignOut } from '@phosphor-icons/react';

interface TopBarProps {
  topBarBg: string;
  formattedTime: string;
  formattedDate: string;
  country: string;
  setCountry: (country: string) => void;
  onTitleClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  topBarBg,
  formattedTime,
  formattedDate,
  country,
  setCountry,
  onTitleClick,
}) => {
  const { reset } = useContext(AppContext);
  const navigate = useNavigate();
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
    <div className="top-bar-wrapper">
      <img src={topBarBg} alt="Top Bar" className="top-bar" />
      <div className="top-bar-content">
        <div className="top-bar-left">
          <div className="top-bar-time">{formattedTime}</div>
          <div className="top-bar-date">{formattedDate}</div>
        </div>
        <div className="top-bar-title" style={{ cursor: 'pointer' }} onClick={onTitleClick}>
          Master Dashboard
        </div>
        <div className="top-bar-controls">
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="country-select"
          >
            <option value="US">USA</option>
            <option value="VN">Vietnam</option>
            <option value="JP">Japan</option>
          </select>
          {
            <>
              <Avatar
                sx={{ width: 25, height: 25, cursor: 'pointer' }}
                alt="User Avatar"
                onClick={handleAvatarClick}
              />
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>
                  <SignOut size={20} className="mr-1" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default TopBar;

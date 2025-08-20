/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { getAccessTokenFromCookie, getUserInfoFromCookie } from '~/utils/auth';

export const initialAuthReducer = {
  isAuthenticated: Boolean(getAccessTokenFromCookie()),
  setAuthenticated: () => {},
  userInfo: getUserInfoFromCookie(),
  setUserInfo: () => {}
};

export default function useAuthReducer() {
  const [isAuthenticated, setAuthenticated] = useState(initialAuthReducer.isAuthenticated);
  const [userInfo, setUserInfo] = useState(initialAuthReducer.userInfo);
  const reset = () => {
    setAuthenticated(false);
    setUserInfo(null);
  };
  return { isAuthenticated, setAuthenticated, userInfo, setUserInfo, reset };
}

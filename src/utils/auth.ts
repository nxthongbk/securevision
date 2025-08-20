import { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { URL_REFRESH_TOKEN } from '~/services/auth.service';

export const setAccessTokenToCookie = (value: string) => {
  Cookies.set('access_token', value);
};

export const getAccessTokenFromCookie = () => Cookies.get('access_token') || null;

export const setRefreshTokenToCookie = (value: string) => {
  Cookies.set('refresh_token', value);
};

export const getRefreshTokenFromCookie = () => Cookies.get('refresh_token') || null;

export const setUserInfoToCookie = (value: any) => {
  Cookies.set('userinfo', JSON.stringify(value));
};

export const getUserInfoFromCookie = () => {
  const result = Cookies.get('userinfo');
  return result ? JSON.parse(result) : null;
};

export const getRuleUser = () => {
  const result = getUserInfoFromCookie();
  return result?.roles?.[0];
};

export const clearCookie = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('userinfo');
};

export const handleRefreshToken = ({
  axiosClient,
  refreshToken
}: {
  axiosClient: AxiosInstance;
  refreshToken: string;
}) => {
  return axiosClient
    .post(`${URL_REFRESH_TOKEN}`, null, { params: { refreshToken: refreshToken } })
    .then((res) => {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { accessToken, refreshToken } = res?.data?.token;
      setAccessTokenToCookie(accessToken);
      setRefreshTokenToCookie(refreshToken);
      return accessToken;
    })
    .catch((err) => {
      throw err;
    });
};

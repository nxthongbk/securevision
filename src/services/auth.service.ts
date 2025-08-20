import axiosClient from '~/utils/axiosClient';

export const URL_LOGIN = '/user/auth/login';
export const URL_LOGOUT = '/user/auth/logout';
export const URL_REFRESH_TOKEN = '/user/auth/refresh';

const authService = {
  login: (body: { username: string; password: string }) => {
    return axiosClient.post(URL_LOGIN, body);
  },

  logout: (query: { refreshToken: string }) => {
    return axiosClient.post(`${URL_LOGOUT}`, null, { params: query });
  },

  refreshToken: (query: { refreshToken: string }) => {
    return axiosClient.post(`${URL_REFRESH_TOKEN}`, null, { params: query });
  }
};

export default authService;

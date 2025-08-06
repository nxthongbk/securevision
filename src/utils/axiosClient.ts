import axios, { type AxiosInstance } from 'axios';
import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  handleRefreshToken,
  setAccessTokenToCookie,
  setRefreshTokenToCookie,
  setUserInfoToCookie,
  getUserInfoFromCookie
} from './auth';
import { URL_LOGIN } from '~/services/auth.service';

const axiosClient: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_HOST + '/api',
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 10000,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    // Add token to request header of API
    const accessToken = getAccessTokenFromCookie();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // Check if tenantCode is present in query parameters
    // Parse the URL to extract query parameters
    const queryParams = new URLSearchParams(window.location.search);
    // Check if tenantCode is present in query parameters
    const tenantCode = queryParams.get('tenantCode');
    const tenantCodeTenant = getUserInfoFromCookie();

    if (config.url.includes('/storage/files/') || config.url.includes('/telemetry')) {
      return config;
    }

    if (config)
      if (tenantCode || tenantCodeTenant?.tenantCode !== 'DEFAULT') {
        // If tenantCode is present, add it to the request body for PUT method
        if (config.method === 'put' || config.method === 'patch' || config.method === 'post') {
          config.data = {
            ...config.data,
            tenantCode: tenantCode || tenantCodeTenant?.tenantCode
          };
        }
        // If tenantCode is present, add it to the request parameters for GET method
        else if (config.method === 'get' || config.method === 'delete') {
          config.params = {
            ...config.params,
            tenantCode: tenantCode || tenantCodeTenant?.tenantCode
          };
        }
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// eslint-disable-next-line no-unsafe-optional-chaining
let refreshTokenPromise: any; // this holds any in-progress token refresh requests

axiosClient.interceptors.response.use(
  (response) => {
    const { url } = response.config;
    if (url === URL_LOGIN) {
      const data = response.data;
      setAccessTokenToCookie(data?.data?.token?.accessToken);
      setRefreshTokenToCookie(data?.data?.token?.refreshToken);
      setUserInfoToCookie(data?.data?.userInfo);

      return {
        code: data?.code,
        data: {
          userInfo: data?.data?.userInfo
        }
      };
    }
    return response.data;
  },
  (error) => {
    // Handle refresh token
    // If error is 401
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // check retry refresh token
        if (!refreshTokenPromise) {
          refreshTokenPromise = handleRefreshToken({
            axiosClient,
            refreshToken: getRefreshTokenFromCookie()
          }).then((accessToken) => {
            refreshTokenPromise = null;
            return accessToken;
          });
        }
        return refreshTokenPromise.then((accessToken: any) => {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosClient(originalRequest);
        });
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

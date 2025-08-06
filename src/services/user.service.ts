import axiosClient from '~/utils/axiosClient';

const URL_GET_PROFILE = '/user/users/my-profile';
const URL_RESET_PASSWORD = '/user/users/forget-password';
const URL_COMPARE_OTP = '/user/users/compare-otp';
const URL_PASSWORD = '/user/users/password';
const URL_UPDATE_PROFILE = '/user/users/my-profile'
const URL_UPDATE_PASSWORD = '/user/users/my-profile/password'

const userService = {
  getProfile: () => {
    return axiosClient.get(URL_GET_PROFILE);
  },
  updateProfile: (body: {
    avatarUrl: string,
    email: string,
    phone: string
  }) => {
    return axiosClient.put(URL_UPDATE_PROFILE, body)
  },
  updatePassword: (body: {
    oldPassword: string,
    newPassword: string
  }) => {
    return axiosClient.put(URL_UPDATE_PASSWORD, body)
  },
  resetPassword: (body: { username: string, phone: string }) => {
    return axiosClient.post(URL_RESET_PASSWORD, body);
  },
  compareOtp: (body: { username: string, oneTimeOtp: string }) => {
    return axiosClient.post(URL_COMPARE_OTP, body)
  },
  password: (body: { username: string, oneTimeOtp: string }) => {
    return axiosClient.post(URL_PASSWORD, body)
  },
  updateStatus: (id: string, status: string) => {
    return axiosClient.put(`/user/users/${id}/status?status=${status}`);
  },
  setPassword: (id: string, password: string) => {
    return axiosClient.put(`/user/users/${id}/password`, {
      password
    });
  }
};

export default userService;

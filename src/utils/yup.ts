import * as yup from 'yup';

import i18next from 'i18next';

const t = i18next.t.bind(i18next);

export const otpPasswordSchema = yup.object({
  oneTimeOtp: yup
    .string()
    .required(t('field-is-required'))
    .max(6, t('Mã OTP chỉ có 6 chữ số'))
    .min(6, t('Mã OTP chỉ có 6 chữ số'))
});

export const resetPasswordSchema = yup.object({
  username: yup
    .string()
    .required(t('field-is-required'))
    .max(20, t('Tên đăng nhập phải có từ 4-20 ký tự'))
    .min(4, t('Tên đăng nhập phải có từ 4-20 ký tự')),
  phone: yup
    .string()
    .required('Bạn chưa nhập số điện thoại')
    .min(10, t('Số điện thoại tối thiểu 10 số'))
    .max(10, t('Số điện thoại tối đa 10 số'))
});

export const newPasswordSchema = yup.object({
  password: yup
    .string()
    .required(t('field-is-required'))
    .max(50, t('Mật khẩu phải có từ 8-50 ký tự'))
    .min(8, t('Mật khẩu phải có từ 8-50 ký tự')),
  confirmPassword: yup
    .string()
    .required(t('field-is-required'))
    .max(50, t('Mật khẩu phải có từ 8-50 ký tự'))
    .min(8, t('Mật khẩu phải có từ 8-50 ký tự'))
    .oneOf([yup.ref('password'), null], t('Mật khẩu xác nhận phải giống với mật khẩu mới'))
});

export const editUserProfileSchema = yup.object({
  phone: yup.string().required('Vui lòng nhập số điện thoại khách hàng'),
  avatarUrl: yup.string(),
  email: yup.string()
});

export const editChangePassword = yup.object({
  oldPassword: yup.string().required(t('field-is-required')).min(8, t('Mật khẩu phải có ít nhất 8 ký tự')),
  newPassword: yup.string().required(t('field-is-required')).min(8, t('Mật khẩu phải có ít nhất 8 ký tự')),
  confirmPassword: yup
    .string()
    .required(t('field-is-required'))
    .oneOf([yup.ref('newPassword'), null], t('Mật khẩu xác nhận phải giống với mật khẩu mới'))
});

export const deviceProfileSchema = yup.object({
  deviceProfileName: yup.string().required(t('field-is-required')),
  deviceProfileType: yup.object({}).required(t('field-is-required')),
  description: yup.string(),
  waitingTime: yup.number().required(t('field-is-required'))
});

export const deviceTenantSchema = yup.object({
  deviceName: yup.string().required(t('field-is-required'))
});

export const deviceSchemaedit = yup.object({
  code: yup.string().required(t('field-is-required')),
  token: yup.string().required(t('field-is-required')),
  deviceProfileId: yup.string().required(t('field-is-required'))
});

export const attributesDeviceSchema = yup.object({
  key: yup.string().required(t('field-is-required')),
  value: yup.string().required(t('field-is-required'))
});

export const addDeviceToLocationSchema = yup.object({
  tenantCode: yup.string().required(t('field-is-required')),
  locationId: yup.string().required(t('field-is-required'))
});

export const postTelemetryDeviceSchema = yup.object({
  token: yup.string().required(t('field-is-required')),
  telemetry: yup.object().json()
});

export const postAlarmDeviceSchema = yup.object({
  token: yup.string().required(t('field-is-required')),
  telemetry: yup.object().json()
});
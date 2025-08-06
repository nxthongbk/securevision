import {
  IParamsCreacteDeviceProfile,
  IParamsCreateDeviceType,
  IParamsEditDeviceProfile,
  IParamsGetDeviceType
} from '~/@types/deviceProfile/deviceProfile.type';
import axiosClient from '~/utils/axiosClient';

const deviceProfileService = {
  getDeviceProfile(page: number, size: number, keyword: string, typeId: string) {
    const url = `/device/deviceProfiles`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword || '',
        deviceProfileTypeId: typeId || ''
      }
    });
  },

  createDeviceProfile(data: IParamsCreacteDeviceProfile) {
    const url = `/device/deviceProfiles`;
    return axiosClient.post(url, data);
  },

  updateDeviceProfile(data: IParamsEditDeviceProfile) {
    const url = `/device/deviceProfiles/${data.id}`;
    return axiosClient.put(url, data);
  },

  deleteDeviceProfile(id: string) {
    const url = `/device/deviceProfiles/${id}`;
    return axiosClient.delete(url, {});
  },

  createDeviceType(data: IParamsCreateDeviceType) {
    const url = '/device/deviceProfiles/types';
    return axiosClient.post(url, data);
  },

  getDeviceType(params: IParamsGetDeviceType) {
    const url = '/device/deviceProfiles/types';
    return axiosClient.get(url, { params });
  }
};

export default deviceProfileService;

import axiosClient from '~/utils/axiosClient';

export interface CreateStaff {
  tenantCode: string;
  username: string;
  phone: string;
  name: string;
  avatarUrl: string;
  locationIds: string[];
  permissionGroupId: string;
  assignAllLocations: boolean;
}

export interface UpdateStaff {
  staffId: string;
  requestBody: CreateStaff;
}

const staffService = {
  getStaffs(
    page: number,
    size: number,
    keyword: string,
    tenantCode: string,
    locationId: string,
    permissionGroupId: string,
    status: string
  ) {
    const url = `/user/users/staff`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword || '',
        tenantCode: tenantCode || '',
        locationId: locationId || '',
        permissionGroupId: permissionGroupId || '',
        status: status || ''
      }
    });
  },
  createStaff(requestBody: CreateStaff) {
    const url = '/user/users/staff';
    return axiosClient.post(url, requestBody);
  },
  updateStaff(staffId: string, requestBody: CreateStaff) {
    const url = `/user/users/staff/${staffId}`;
    return axiosClient.put(url, requestBody);
  },
  getStaffDetail(staffId: string, tenantCode: string) {
    const url = `/user/users/staff/${staffId}`;
    return axiosClient.get(url, {
      params: {
        tenantCode
      }
    });
  },
  deleteStaff(staffId: string) {
    const url = `/user/users/staff/${staffId}`;
    return axiosClient.delete(url, {});
  }
};

export default staffService;

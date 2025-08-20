import axiosClient from '~/utils/axiosClient';

export interface CreatePermissionConfig {
  tenantCode: string;
  name: string;
  description: string;
  status: string;
  permissionIds: string[];
}

export interface UpdatePermissionConfig {
  permissionGroupId: string;
  requestBody: CreatePermissionConfig;
}

const permissionService = {
  getPermissionConfigs(page: number, size: number, keyword: string, tenantCode: string) {
    const url = `/user/permissions/permission-groups`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword || '',
        tenantCode: tenantCode || ''
      }
    });
  },
  getPermissionConfigDetail(permissionGroupId: string) {
    const url = `/user/permissions/permission-groups/${permissionGroupId}`;
    return axiosClient.get(url);
  },
  deletePermissionConfig(permissionGroupId: string) {
    const url = `/user/permissions/permission-groups/${permissionGroupId}`;
    return axiosClient.delete(url, {});
  },
  createPermissionConfig(requestBody: CreatePermissionConfig) {
    const url = '/user/permissions/permission-groups';
    return axiosClient.post(url, requestBody);
  },
  updatePermissionConfig(permissionGroupId: string, requestBody: CreatePermissionConfig) {
    const url = `/user/permissions/permission-groups/${permissionGroupId}`;
    return axiosClient.put(url, requestBody);
  },
  getFunctionGroupPermission(page: number, size: number, keyword: string, tenantCode: string) {
    const url = `/user/permissions/function-groups`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 50,
        keyword: keyword || '',
        tenantCode: tenantCode || ''
      }
    });
  },
  getPermissionList(page: number, size: number, keyword: string, tenantCode: string) {
    const url = `/user/permissions`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 50,
        keyword: keyword || '',
        tenantCode: tenantCode || ''
      }
    });
  }
};

export default permissionService;

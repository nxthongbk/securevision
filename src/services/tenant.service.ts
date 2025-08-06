import {
  ParamsCreateTenant,
  ParamsGetTenant,
  ParamsUpdateTenant
} from '~/pages/systemAdmin/SysTenantManagementPage/interFace';
import axiosClient from '~/utils/axiosClient';

const tenantService = {
  getTenant(params: ParamsGetTenant) {
    const { keyword, page, size, status } = params;
    const url = `/user/users/tenant`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 0,
        keyword: keyword || '',
        status: status || 'ALL'
      }
    });
  },
  createTenant(data: ParamsCreateTenant) {
    const url = '/user/users/tenant';
    return axiosClient.post(url, data);
  },
  updateTenant(data: ParamsUpdateTenant) {
    const url = `/user/users/tenant/${data.id}`;
    return axiosClient.put(url, data);
  },
  setStatusTenant(id: string, status: string) {
    const url = `/user/users/tenant/${id}/status`;
    return axiosClient.put(
      url,
      {},
      {
        params: {
          status: status || 'ACTIVE'
        }
      }
    );
  },
  resetDefaultPassWorkTenant(id: string, phone: string) {
    const url = `/user/users/tenant/${id}/password`;
    return axiosClient.put(url, { password: phone });
  }
};
export default tenantService;

import axiosClient from '~/utils/axiosClient';
export interface CreateDashboardInputData {
  tenantCode: string;
  name: string;
  type: string;
  imageUrl: string;
}

export interface CreatePageInputData {
  pages: [
    {
      title: string;
      widgets: any[];
      id?: string;
    }
  ];
}
export const dashboardService = {
  getDashboardData(page: number, size: number, tenantCode: string) {
    const url = '/device/dashboard';
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        tenantCode: tenantCode || ''
      }
    });
  },
  createDashboardData(requestBody: CreateDashboardInputData) {
    const url = '/device/dashboard';
    return axiosClient.post(url, requestBody);
  },
  getDashboardById(dashboardId: string, tenantCode: string) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  },
  deleteDashboardById(dashboardId: string) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.delete(url);
  },
  updateDashBoardById(dashboardId: string, requestBody: CreateDashboardInputData) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.put(url, requestBody);
  },
  createPage(tenantCode: string, dashboardId: string, requestBody: any) {
    const url = `/device/telemetry/DASHBOARD/${dashboardId}/attributes?tenantCode=${tenantCode}`;
    return axiosClient.post(url, { pages: requestBody });
  },
  saveEntityAttributes(tenantCode, entityId, data) {
    const url = `/device/telemetry/DASHBOARD/${entityId}/attributes?tenantCode=${tenantCode}`;
    const payload = data;
    return axiosClient.post(url, payload);
  },
};

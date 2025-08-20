import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import deviceService from '~/services/device.service';

export const useGetAllDashboard = (page: number, size: number, tenantCode?: string) => {
  const { isLoading, isSuccess, data, error } = useQuery({
    queryKey: ['getAllDashboard', { page, size, tenantCode }],
    queryFn: () => dashboardService.getDashboardData(page, size, tenantCode),
    staleTime: 1000
  });
  return { isLoading, isSuccess, data, dataDeviceProfile: data, error };
};

export const useGetAttributes = (dashboardId: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAttributes', { dashboardId }],
    queryFn: () => deviceService.getAttributes('DASHBOARD', dashboardId),
    staleTime: 1000
  });
  const attributes = data?.data?.data?.pages?.value || data;
  return { isLoading, status, data: attributes, error };
};

export const useGetAttributesMonitoring = (dashboardId: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAttributesMonitoring', { dashboardId }],
    queryFn: () => deviceService.getAttributes('DASHBOARD', dashboardId),
    staleTime: 1000
  });
  const attributes = data?.data?.data;

  let operationImage,
    operationData,
    listArea,
    filterDiagram,
    filterChart,
    gridCamera,
    gridDevice;
  if (attributes && typeof attributes === 'object') {
    Object.entries(attributes).forEach(([key, item]: [string, any]) => {
      if (key === 'gridDevice') gridDevice = item.value;
      if (key === 'gridCamera') gridCamera = item.value;
      if (key === 'filterChart') filterChart = item.value;
      if (key === 'filterDiagram') filterDiagram = item.value;
      if (key === 'operationImage') operationImage = item.value;
      if (key === 'operationData') operationData = item.value;
      if (key === 'listArea') listArea = item.value;
    });
  }

  return {
    isLoading, status, data: {
      deviceId: data?.data?.deviceId,
      operationImage: operationImage,
      operationData: operationData,
      filterChart: filterChart,
      filterDiagram: filterDiagram,
      listArea: listArea,
      gridCamera: gridCamera,
      gridDevice: gridDevice,
    }, error
  };
};
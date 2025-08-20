import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import alarmService from '~/services/alarm.service';
import handleNotificationMessege from '~/utils/notification';
import locationService from '~/services/location.service';

export const useGetLocationMap = ({
  page,
  size,
  keyword,
  tenantCode
}: {
  page?: number;
  size?: number;
  keyword?: string;
  tenantCode?: string;
}) => {
  return useQuery({
    queryKey: ['locationMap', { page, size, tenantCode }, keyword],
    queryFn: () => locationService.getLocations(page, size, keyword, tenantCode),
    staleTime: 3000
  });
};

export const useGetDetailLocation = ({ locationId, tenantCode }: { locationId: string; tenantCode: string }) => {
  return useQuery({
    queryKey: ['locationDetail'],
    queryFn: () => locationService.getLocationDetail(locationId, tenantCode)
  });
};

export const useGetAlarmLocationInfo = (locationId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAlarmLocationInfo', { tenantCode, locationId }],
    queryFn: () => alarmService.getAlarmLocationInfo(locationId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useGetAlarmPendingLocationInfo = (locationId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAlarmPendingLocationInfo', { tenantCode, locationId }],
    queryFn: () => alarmService.getAlarmPendingLocationInfo(locationId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useUpdateAlarmStatusOfLocation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      tenantCode,
      alarmLocationId,
      requestBody
    }: {
      tenantCode: string;
      alarmLocationId: string;
      requestBody: { status: string; reason: string };
    }) => alarmService.updateAlarmStatusOfLocation(tenantCode, alarmLocationId, requestBody),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['locationMap'] }),
        queryClient.invalidateQueries({ queryKey: ['getAlarmLocationInfo'] })
      ])
  });

  return { mutate, isPending, isSuccess };
};

export const useGetDashboards = (locationId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getDashboardsByLocation', { tenantCode, locationId }],
    queryFn: () => locationService.getDashboards(locationId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};
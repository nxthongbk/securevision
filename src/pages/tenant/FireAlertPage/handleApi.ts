import { useQuery } from '@tanstack/react-query';
import alarmService from '~/services/alarm.service';

export const useGetAlarmLocations = (
  page: number,
  size: number,
  keyword: string,
  tenantCode: string,
  locationId: string,
  status: string,
  startTime: number | string,
  endTime: number | string
) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['getAlarmLocations', { page, size, keyword, tenantCode, locationId, status, startTime, endTime }],
    queryFn: () =>
      alarmService.getAlarmLocations(page, size, keyword, tenantCode, locationId, status, startTime, endTime),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useGetAlarmLocationByAlarmLocationId = (alarmLocationId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAlarmLocationByAlarmLocationId', { alarmLocationId, tenantCode }],
    queryFn: () => alarmService.getAlarmLocationByAlarmLocationId(alarmLocationId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

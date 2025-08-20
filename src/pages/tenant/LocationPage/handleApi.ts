import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import locationService, { CreateLocationInputData, UpdateLocationInputData } from '~/services/location.service';
import handleNotificationMessege from '~/utils/notification';

export const useGetLocations = (page: number, size: number, keyword: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getLocations', { page, size, keyword, tenantCode }],
    queryFn: () => locationService.getLocations(page, size, keyword, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useGetLocationDetail = (locationId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getLocationDetail', { tenantCode, locationId }],
    queryFn: () => locationService.getLocationDetail(locationId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useDeleteLocation = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteLocation'],
    mutationFn: () => locationService.deleteLocation(id),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getLocations'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['createLocation'],
    mutationFn: (requestBody: CreateLocationInputData) => locationService.createLocation(requestBody),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['createLocation'] }),
        queryClient.invalidateQueries({ queryKey: ['getLocations'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['createLocation'],
    mutationFn: (data: UpdateLocationInputData) => {
      const { requestBody, locationId } = data;
      return locationService.updateLocation(locationId, requestBody);
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['createLocation'] }),
        queryClient.invalidateQueries({ queryKey: ['getLocations'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useGetProvinces = (page = 0, size = 63, keyword = '') => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getProvinces', { page, size, keyword }],
    queryFn: () => locationService.getProvinces(keyword, page, size),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

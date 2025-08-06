import {
  IParamCreateDeviceInterface,
  IParamEditDeviceInterFace,
  IParamsGetDeviceInterFace
} from '~/@types/deviceType/device.type';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import deviceService from '~/services/device.service';
import handleNotificationMessege from '~/utils/notification';
import telemetryService from '~/services/telemetry.service';

export const useGetDataDevice = (params: IParamsGetDeviceInterFace) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getDataDevice', params],
    queryFn: () => deviceService.getDevice(params),
    staleTime: 3 * 3000
  });
  return { isLoading, status, data, error };
};
export const useGetDataDeviceOptions = (params: IParamsGetDeviceInterFace) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getDataDevice', params],
    queryFn: () => deviceService.getDevice(params),
    staleTime: 3 * 3000
  });
  return { isLoading, status, data, error };
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteDevice'],
    mutationFn: (id: string) => deviceService.deleteDevice(id),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['updateDevice'],
    mutationFn: (data: IParamEditDeviceInterFace) => deviceService.updateDevice(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

export const useGetRandomToken = () => {
  const { data, refetch } = useQuery({
    queryKey: ['getRandonTokenDevice'],
    queryFn: () => deviceService.getRandomTokenDevice(),
    staleTime: 5 * 1000
  });
  return { dataToken: data, refetchToken: refetch };
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: IParamCreateDeviceInterface) => deviceService.createDevice(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });

  return { mutate, isPending, isSuccess };
};

export const useUpdateDeviceRoleTenant = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['updateDeviceRoleTenant'],
    mutationFn: (data: IParamEditDeviceInterFace) => deviceService.updateDevice(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

export const useGetAttributes = (entityType: string, entityId: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getAttributes', { entityId, entityType }],
    queryFn: () => deviceService.getAttributes(entityType, entityId),
    staleTime: 3 * 3000
  });
  return { isLoading, status, data, error };
};

export const useGetLatestTelemetry = (data: { entityType: string; entityId: string }) => {
  const query = useQuery({
    queryKey: ['lastestTelemetry'],
    queryFn: () => telemetryService.getLatestTelemetryCassandra(data)
  });
  return query;
};

export const useGetLatestTelemetryNoC = (data: { entityType: string; entityId: string; }) => {
  const query = useQuery({
    queryKey: ['lastestTelemetry', data.entityId],
    queryFn: () => telemetryService.getLatestTelemetry(data)
  });
  return query;
};

export const useGetLatestTelemetrys = (data: { entityType: string; entityIds: string[] }) => {
  const queries =
    data?.entityIds?.map((deviceId) => ({
      queryKey: ['latestTelemetry', deviceId],
      queryFn: () => telemetryService.getLatestTelemetryCassandra({ entityType: data.entityType, entityId: deviceId })
    })) || [];

  const queryResults = useQueries({
    queries
  });

  return queryResults;
};

export const useGetLatestTelemetrysNoC = (data: { entityType: string; entityIds: string[] }) => {
  const queries =
    data?.entityIds?.map((deviceId) => ({
      queryKey: ['latestTelemetry', deviceId],
      queryFn: () => telemetryService.getLatestTelemetry({ entityType: data.entityType, entityId: deviceId })
    })) || [];

  const queryResults = useQueries({
    queries
  });

  return queryResults;
};

export const useAssignDeviceTolocation = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['assignDeviceTolocation'],
    mutationFn: ({ deviceToken, locationId }: { deviceToken: string; locationId: string }) =>
      deviceService.assignDeviceToLocation(deviceToken, locationId),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

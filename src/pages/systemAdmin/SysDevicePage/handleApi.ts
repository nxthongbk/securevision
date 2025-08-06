import {
  ICreateMQTT,
  IParamCreateDeviceInterface,
  IParamEditDeviceInterFace,
  IParamsUseGetDeviceInterFace,
} from "~/@types/deviceType/device.type";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { IParamsAlarmConfig } from "~/@types/alarmConfig/alarmConfig.type";
import alarmService from "~/services/alarm.service";
import deviceService from "~/services/device.service";
import handleNotificationMessege from "~/utils/notification";
import ruleEngineService from "~/services/ruleEngine.service";
import telemetryService from "~/services/telemetry.service";

export const useGetDataDevice = (params: IParamsUseGetDeviceInterFace) => {
  const {
    keyword,
    page,
    size,
    tenantCode,
    deviceProfileId,
    locationId,
    status,
    alarmStatusList,
  } = params;
  const { isLoading, data, error } = useQuery({
    queryKey: [
      "getDataDevice",
      {
        page,
        size,
        keyword,
        tenantCode,
        deviceProfileId,
        locationId,
        status,
        alarmStatusList,
      },
    ],
    queryFn: async () => {
      if (!alarmStatusList.length) {
        const response = await deviceService.getDevice({
          page,
          size,
          keyword,
          tenantCode,
          deviceProfileId,
          locationId,
          status,
          alarmStatus: "",
        });
        return response.data;
      }

      const requests = alarmStatusList.map((alarmStatus) =>
        deviceService.getDevice({
          page,
          size,
          keyword,
          tenantCode,
          deviceProfileId,
          locationId,
          status,
          alarmStatus,
        })
      );
      const results = await Promise.all(requests);

      const mergedContent = results.flatMap((result) => result?.data?.content);
      const totalItems = mergedContent.length;

      return {
        content: mergedContent,
        page,
        size,
        total: totalItems,
      };
    },
    staleTime: 3 * 3000,
  });
  return { isLoading, data, error };
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["deleteDevice"],
    mutationFn: (id: string) => deviceService.deleteDevice(id),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDataDevice"] });
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useAssignDevice = (deviceCode: string, locationId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["assignDeviceToLocation"],
    mutationFn: () =>
      deviceService.assignDeviceToLocation(deviceCode, locationId),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDataDevice"] });
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["updateDevice"],
    mutationFn: (data: IParamEditDeviceInterFace & { [key: string]: string }) =>
      deviceService.updateDevice(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: async (data, variables) => {
      const { locationId, tenantCode } = variables;
      if (data?.data && locationId && tenantCode) {
        await deviceService.assignDeviceToLocation(data.data?.code, locationId);
      }
      queryClient.invalidateQueries({ queryKey: ["getDataDevice"] });
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useGetRandomToken = () => {
  const { data, refetch } = useQuery({
    queryKey: ["getRandonTokenDevice"],
    queryFn: () => deviceService.getRandomTokenDevice(),
    staleTime: 5 * 1000,
  });
  return { dataToken: data, refetchToken: refetch };
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (
      data: IParamCreateDeviceInterface & { [key: string]: string }
    ) => deviceService.createDevice(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: async (data, variables) => {
      const { locationId, tenantCode } = variables;
      if (data?.data && locationId && tenantCode) {
        await deviceService.assignDeviceToLocation(data.data?.code, locationId);
      }
      queryClient.invalidateQueries({ queryKey: ["getDataDevice"] });
    },
  });

  return { mutate, isPending, isSuccess };
};

export const useGetAttributes = (entityType: string, entityId: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ["getAttributes", { entityId, entityType }],
    queryFn: () => deviceService.getAttributes(entityType, entityId),
    staleTime: 1000,
  });
  return { isLoading, status, data, error };
};

export const useUpsertAttribute = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      deviceId,
      attributes,
    }: {
      deviceId: string;
      attributes: Record<string, any>;
    }) => deviceService.upsertAttribute(deviceId, attributes),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["getAttributes"] }),
  });

  return { mutate, isPending, isSuccess };
};

export const useDeleteAttributes = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      deviceId,
      keyAtrribute,
    }: {
      deviceId: string;
      keyAtrribute: string;
    }) => deviceService.deleteAtrributes(deviceId, keyAtrribute),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAttributes"] });
    },
  });

  return { mutate, isPending, isSuccess };
};

export const useCreateMQTT = ({ deviceId }: { deviceId: string }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: ICreateMQTT) => {
      if (data?.isEdit) {
        return deviceService.updateMQTT(data);
      } else {
        return deviceService.createMQTT(data);
      }
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getInfoMQTT", { deviceId }],
      });
    },
  });

  return { mutate, isPending, isSuccess };
};

export const useGetInfoMQTT = ({ deviceId }: { deviceId: string }) => {
  const { data } = useQuery({
    queryKey: ["getInfoMQTT", { deviceId }],
    queryFn: () => deviceService.getInforMQTT(deviceId),

    staleTime: 3 * 3000,
  });
  return { data };
};

export const useGetAlarmDevice = ({
  token,
  page,
  size,
}: {
  token: string;
  page: number;
  size: number;
}) => {
  const { data } = useQuery({
    queryKey: ["getAlarmDevice", { token, page, size }],
    queryFn: () => alarmService.getAlarmByTokenDevice({ token, page, size }),

    staleTime: 3 * 3000,
  });
  return { data, total: data?.data?.total };
};

export const useGetLatestTelemetry = (data: {
  entityType: string;
  entityId: string;
}) => {
  const query = useQuery({
    queryKey: ["lastestTelemetry"],
    queryFn: () => telemetryService.getLatestTelemetryCassandra(data),
  });
  return query;
};

export const useGetLatestTelemetrys = (data: {
  entityType: string;
  entityIds: string[];
}) => {
  const queries =
    data?.entityIds?.map((deviceId) => ({
      queryKey: ["latestTelemetry", deviceId],
      queryFn: () =>
        telemetryService.getLatestTelemetryCassandra({
          entityType: data.entityType,
          entityId: deviceId,
        }),
    })) || [];

  const queryResults = useQueries({
    queries,
  });

  return queryResults;
};

export const useGetCondition = () => {
  const { data } = useQuery({
    queryKey: ["getCondition"],
    queryFn: () => ruleEngineService.getCondition(),

    staleTime: 3 * 3000,
  });
  return { condition: data?.data };
};

export const useSaveAlarmConfig = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: IParamsAlarmConfig) =>
      ruleEngineService.saveAlarmConfig(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAlarmConfigByDeviceID"] });
      queryClient.invalidateQueries({
        queryKey: ["getAlarmConfigByTelemetry"],
      });
    },
  });

  return { mutate, isPending, isSuccess };
};

export const useGetAlarmConfigByDeviceID = (deviceId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getAlarmConfigByDeviceID", deviceId],
    queryFn: () => ruleEngineService.getAlarmConfigByDeviceID(deviceId),
    staleTime: 3 * 3000,
  });
  return { alarmConfig: data?.data, error, isLoading };
};

export const useGetAlarmConfigByTelemetry = (
  deviceId: string,
  telemetry: string,
  options?: { enabled?: boolean }
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getAlarmConfigByTelemetry", deviceId, telemetry],
    queryFn: () =>
      ruleEngineService.getAlarmConfigByTelemetry(deviceId, telemetry),
    staleTime: 3 * 3000,
    enabled: options?.enabled !== false,
  });
  return { data: data?.data, error, isLoading };
};

export const useDeleteAlarmConfig = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      deviceId,
      telemetry,
    }: {
      deviceId: string;
      telemetry: string;
    }) => ruleEngineService.deleteAlarmConfig(deviceId, telemetry),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error.response.data.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["getAlarmConfigByDeviceID"] }),
  });

  return { mutate, isPending, isSuccess };
};

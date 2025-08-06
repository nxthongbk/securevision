import deviceProfileService from '~/services/deviceProfile.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import handleNotificationMessege from '~/utils/notification';
import {
  IParamsCreacteDeviceProfile,
  IParamsCreateDeviceType,
  IParamsEditDeviceProfile,
  IParamsGetDeviceType,
} from '~/@types/deviceProfile/deviceProfile.type';

export const useGetDataDeviceProfile = (
  page: number,
  size: number,
  keyword: string,
  typeId: string
) => {
  const { isLoading, isSuccess, data, error } = useQuery({
    queryKey: ['getDataDeviceProfile', { page, size, keyword, typeId }],
    queryFn: () => deviceProfileService.getDeviceProfile(page, size, keyword, typeId),
    staleTime: 1000,
  });
  return { isLoading, isSuccess, data, dataDeviceProfile: data, error };
};

export const useGetDataDeviceProfiles = (
  page: number,
  size: number,
  keyword: string,
  typeIds: string[]
) => {
  const { isLoading, isSuccess, data, error } = useQuery({
    queryKey: ['getDataDeviceProfiles', { page, size, keyword, typeIds }],
    queryFn: async () => {
      if (!typeIds.length) {
        const response = await deviceProfileService.getDeviceProfile(page, size, keyword, '');
        return response.data;
      }

      const requests = typeIds.map(typeId =>
        deviceProfileService.getDeviceProfile(page, size, keyword, typeId)
      );
      const results = await void Promise.all(requests);

      const mergedContent = results.flatMap(result => result?.data?.content);
      const totalItems = mergedContent.length;

      return {
        content: mergedContent,
        page,
        size,
        total: totalItems,
      };
    },
    staleTime: 1000,
  });

  return { isLoading, isSuccess, data, dataDeviceProfile: data?.content || [], error };
};

export const useDeleteDeviceProfile = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteDeviceProfile'],
    mutationFn: () => deviceProfileService.deleteDeviceProfile(id),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDeviceProfiles'] });
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useUpdateDeviceProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError, data } = useMutation({
    mutationKey: ['updateDeviceProfile'],
    mutationFn: async (data: IParamsEditDeviceProfile) => {
      if (data?.typeIdTemp?.id) {
        data.typeId = data.typeIdTemp.id;

        const response = await deviceProfileService.updateDeviceProfile(data);
        return response;
      } else {
        const newType = await deviceProfileService.createDeviceType({
          label: data?.typeIdTemp?.inputValue,
        });

        if (newType?.data?.id) {
          data.typeId = newType.data.id;

          const response = await deviceProfileService.updateDeviceProfile(data);
          return response;
        }
      }
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getDataDeviceProfiles'] }),
        queryClient.invalidateQueries({ queryKey: ['getDataDeviceType'] }),
      ]),
  });

  return { mutate, isPending, isSuccess, isError, dataDeviceProfileU: data?.data };
};

export const useCreateDeviceProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['createDeviceProfile'],
    mutationFn: async (data: IParamsCreacteDeviceProfile) => {
      if (data?.typeIdTemp?.id) {
        data.typeId = data.typeIdTemp.id;

        await deviceProfileService.createDeviceProfile(data);
      } else {
        const newType = await deviceProfileService.createDeviceType({
          label: data?.typeIdTemp?.inputValue,
        });

        if (newType?.data?.id) {
          data.typeId = newType.data.id;

          await deviceProfileService.createDeviceProfile(data);
        }
      }
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getDataDeviceProfiles'] }),
        queryClient.invalidateQueries({ queryKey: ['getDataDeviceType'] }),
      ]),
  });

  return { mutate, isPending, isSuccess };
};

export const useCreateDeviceType = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['createDevcieType'],
    mutationFn: (data: IParamsCreateDeviceType) => deviceProfileService.createDeviceType(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDeviceType'] });
    },
  });

  return {
    mutateDeviceTypeC: mutate,
    isPendingDeviceTypeC: isPending,
    isSuccessDeviceTypeC: isSuccess,
  };
};

export const useGetDataDeviceType = (params: IParamsGetDeviceType) => {
  const { isLoading, isSuccess, data } = useQuery({
    queryKey: ['getDataDeviceType', params],
    queryFn: () => deviceProfileService.getDeviceType(params),
    staleTime: 3 * 3000,
  });
  return {
    isLoadingDeviceTypeR: isLoading,
    isSuccessDevcieTypeR: isSuccess,
    dataDeviceTypeR: data,
  };
};

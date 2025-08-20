import handleNotificationMessege from '~/utils/notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParamsCreateTenant, ParamsGetTenant, ParamsUpdateTenant } from './interFace';
import tenantService from '~/services/tenant.service';

export const useGetDataTenant = (params: ParamsGetTenant) => {
  const { data, isLoading } = useQuery({
    queryKey: ['getDataTenant', { params }],
    queryFn: () => tenantService.getTenant(params),
    staleTime: 3 * 1000
  });
  return { dataTenant: data, isLoadingTenant: isLoading };
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['createTenant'],
    mutationFn: (data: ParamsCreateTenant) => tenantService.createTenant(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataTenant'] });
    }
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError, data } = useMutation({
    mutationKey: ['updateTenant'],
    mutationFn: (data: ParamsUpdateTenant) => tenantService.updateTenant(data),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataTenant'] });
    }
  });
  return { isPending, isSuccess, mutate, isError, dataUpdateTenant: data?.data };
};

export const useSetStatusTenant = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate } = useMutation({
    mutationKey: ['setstatusTenant'],
    mutationFn: (data: { id: string; status: string }) => tenantService.setStatusTenant(data.id, data.status),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataTenant'] });
    }
  });
  return { isPending, isSuccess, mutate };
};

export const useResetPasswordTenant = () => {
  const { isPending, isSuccess, mutate } = useMutation({
    mutationKey: ['resetPasswordTenant'],
    mutationFn: (data: { id: string; phone: string }) => tenantService.resetDefaultPassWorkTenant(data.id, data.phone),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      handleNotificationMessege('tenantPage.reset-password-success');
    }
  });
  return { isPending, isSuccess, mutate };
};

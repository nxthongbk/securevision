import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import permissionService, { CreatePermissionConfig, UpdatePermissionConfig } from '~/services/permission.service';
import staffService, { CreateStaff, UpdateStaff } from '~/services/staff.service';
import userService from '~/services/user.service';
import handleNotificationMessege from '~/utils/notification';

export const useGetStaffs = ({
  page,
  size,
  keyword,
  tenantCode,
  locationId,
  permissionGroupId,
  status = 'ACTIVE'
}: {
  page: number;
  size: number;
  keyword: string;
  tenantCode: string;
  locationId: string;
  permissionGroupId: string;
  status?: string;
}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['getStaffs', { page, size, keyword, tenantCode, locationId, permissionGroupId, status }],
    queryFn: () => staffService.getStaffs(page, size, keyword, tenantCode, locationId, permissionGroupId, status),
    staleTime: 3000
  });
  return { isLoading, data, error };
};

export const useGetStaffDetail = (staffId: string, tenantCode: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getStaffDetail', { tenantCode, staffId }],
    queryFn: () => staffService.getStaffDetail(staffId, tenantCode),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['createStaff'],
    mutationFn: (requestBody: CreateStaff) => staffService.createStaff(requestBody),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['createStaff'] }),
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useChangeStaffStatus = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['updateStaffStatus'],
    mutationFn: (data: { staffId: string; status: string }) => {
      const { status, staffId } = data;
      return userService.updateStatus(staffId, status);
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getStaffs'] })
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['updateStaff'],
    mutationFn: (data: UpdateStaff) => {
      const { requestBody, staffId } = data;
      return staffService.updateStaff(staffId, requestBody);
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
        queryClient.invalidateQueries({ queryKey: ['createStaff'] }),
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useSetPassword = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['setPassword'],
    mutationFn: (data: { id: string; password: string }) => {
      const { id, password } = data;
      return userService.setPassword(id, password);
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getStaffs'] })
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useDeleteStaff = (staffId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteStaff'],
    mutationFn: () => staffService.deleteStaff(staffId),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getStaffs'] })
  });
  return { mutate, isPending, isSuccess };
};

export const useGetPermissionConfigs = (page: number, size: number, keyword: string, tenantCode: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['getPermissionConfigs', { page, size, keyword, tenantCode }],
    queryFn: () => permissionService.getPermissionConfigs(page, size, keyword, tenantCode),
    staleTime: 3000
  });
  return { isLoading, data, error };
};

export const useGetPermissionConfigDetail = (permissionGroupId: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ['getPermissionConfigDetail', { permissionGroupId }],
    queryFn: () => permissionService.getPermissionConfigDetail(permissionGroupId),
    staleTime: 3000
  });
  return { isLoading, status, data, error };
};

export const useDeletePermissionConfig = (permissionGroupId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['deletePermissionConfig'],
    mutationFn: () => permissionService.deletePermissionConfig(permissionGroupId),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPermissionConfigs'] });
    }
  });
  return { mutate, isPending, isSuccess };
};

export const useCreatePermissionConfig = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['createPermissionConfig'],
    mutationFn: (requestBody: CreatePermissionConfig) => permissionService.createPermissionConfig(requestBody),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['createPermissionConfig'] }),
        queryClient.invalidateQueries({ queryKey: ['getPermissionConfigs'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useUpdatePermissionConfig = () => {
  const queryClient = useQueryClient();
  const { isPending, isSuccess, mutate, isError } = useMutation({
    mutationKey: ['updatePermissionConfig'],
    mutationFn: (data: UpdatePermissionConfig) => {
      const { requestBody, permissionGroupId } = data;
      return permissionService.updatePermissionConfig(permissionGroupId, requestBody);
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
        queryClient.invalidateQueries({ queryKey: ['createPermissionConfig'] }),
        queryClient.invalidateQueries({ queryKey: ['getPermissionConfigs'] })
      ])
  });
  return { isPending, isSuccess, mutate, isError };
};

export const useGetFunctionGroupPermission = (page: number, size: number, keyword: string, tenantCode: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['getFunctionGroupPermission', { page, size, keyword, tenantCode }],
    queryFn: () => permissionService.getFunctionGroupPermission(page, size, keyword, tenantCode),
    staleTime: 3000
  });
  return { isLoading, data, error };
};

export const useGetPermissionList = (page: number, size: number, keyword: string, tenantCode: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['getPermissionList', { page, size, keyword, tenantCode }],
    queryFn: () => permissionService.getPermissionList(page, size, keyword, tenantCode),
    staleTime: 3000
  });
  return { isLoading, data, error };
};

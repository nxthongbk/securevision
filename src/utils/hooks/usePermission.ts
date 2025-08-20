import { useContext } from 'react';
import { AppContext } from '~/contexts/app.context';
import { useGetPermissionList } from '~/pages/tenant/HumanResourcesPage/handleApi';

export const usePermissions = (viewCode: string, editCode: string, tenantCode: string) => {
  const { userInfo } = useContext(AppContext);

  const { data: permissionList } = useGetPermissionList(0, 50, '', tenantCode);
  const permissionCodes = permissionList?.data?.content?.map((item) => item.code) || [];
  const userPermissionCodes = userInfo.permissions || [];

  const userRole = userInfo?.roles?.[0];

  if (userRole === 'STAFF') {
    return {
      hasEdit: userPermissionCodes.includes(editCode) && permissionCodes.includes(editCode),
      hasView: userPermissionCodes.includes(viewCode) && permissionCodes.includes(viewCode)
    };
  }

  return {
    hasEdit: true,
    hasView: true
  };
};

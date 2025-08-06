import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import { UserRole } from '../constant';

export function useTenantCode() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { userInfo } = useContext(AppContext);
  const userRole = userInfo?.roles?.[0];

  const tenantCode = userRole === UserRole.SYSADMIN ? params.get('tenantCode') : userInfo?.tenantCode;
  return { tenantCode };
}

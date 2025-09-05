import { Navigate, Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router-dom';

import { AppContext } from '~/contexts/app.context';
import AuthLayout from '~/layouts/AuthLayout';
import ControlCenterPage from '~/pages/tenant/ControlCenterPage';
import DevicePage from '~/pages/tenant/DevicePage';
import AlarmPage from '~/pages/tenant/AlarmPage';
import UserPage from '~/pages/tenant/UserPage';
import LocationPage from '~/pages/tenant/LocationPage';
import MainLayout from '~/layouts/MainLayout';
import NotFoundPage from '~/pages/common/404Page';
import ROUTES from '~/constants/routes.constant';
import { USER_ROLE } from '~/constants/rule.constant';
import ReportPage from '~/pages/tenant/ReportPage';
import SettingPage from '~/pages/tenant/SettingPage';
import SysDevicePage from '~/pages/systemAdmin/SysDevicePage';
import SysDeviceProfilePage from '~/pages/systemAdmin/SysDeviceProfilePage';
import SysTenantManagementPage from '~/pages/systemAdmin/SysTenantManagementPage';
import SysToolsPage from '~/pages/systemAdmin/SysToolsPage';
import { useContext } from 'react';
import DashboardPage from '~/pages/tenant/Dashboard/index.page';
import ConfigPage from '~/pages/tenant/ConfigPage';
import SecureLandingPage from '~/pages/common/SecureLandingPage/Index';

const Guard = () => {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Outlet /> : <SecureLandingPage />;
};

const CheckRoleSYSAdmin = () => {
  const { userInfo } = useContext(AppContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  return userInfo?.roles?.[0] !== 'SYSADMIN' || (userInfo?.roles?.[0] === 'SYSADMIN' && tenantCode) ? (
    <ControlCenterPage />
  ) : (
    <Navigate to={ROUTES.CUSTOMER_MANAGEMENT} />
  );
};

const tenantRoutes: RouteObject[] = [
  {
    path: '',
    element: <ControlCenterPage />
  },
  {
    path: ROUTES.HISTORY,
    element: <ControlCenterPage />
  },
  {
    path: ROUTES.DEVICE,
    element: <DevicePage />
  },
  {
    path: ROUTES.ALARM,
    element: <AlarmPage />
  },
  {
    path: ROUTES.LOCATION,
    element: <LocationPage />
  },
  {
    path: ROUTES.USER,
    element: <UserPage />
  },
  {
    path: ROUTES.REPORT,
    element: <ReportPage />
  },
  {
    path: ROUTES.SETTING,
    element: <SettingPage />
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />
  }
  ,
  {
    path: ROUTES.CONFIGURATION,
    element: <ConfigPage />
  }
];
const systemAdminRoutes: RouteObject[] = [
  {
    path: '',
    element: <CheckRoleSYSAdmin />
  },
  {
    path: ROUTES.DEVICE_PROFILE,
    element: <SysDeviceProfilePage />
  },
  {
    path: ROUTES.VIEW_DEVICE_BY_DEVICEPROFILE_ID,
    element: <SysDevicePage />
  },
  {
    path: ROUTES.DEVICE_MANAGEMENT,
    element: <SysDevicePage />
  },
  {
    path: ROUTES.CUSTOMER_MANAGEMENT,
    element: <SysTenantManagementPage />
  },
  {
    path: ROUTES.TOOLS,
    element: <SysToolsPage />
  },
  {
    path: ROUTES.SETTING,
    element: <SettingPage />
  },
  // Review to avoid SysAdmin Routes overriding TenantRoutes when accessing the customer page.
  {
    path: ROUTES.HISTORY,
    element: <ControlCenterPage />
  },
  {
    path: ROUTES.DEVICE,
    element: <DevicePage />
  },
  {
    path: ROUTES.ALARM,
    element: <AlarmPage />
  },
  {
    path: ROUTES.LOCATION,
    element: <LocationPage />
  },
  {
    path: ROUTES.USER,
    element: <UserPage />
  },
  {
    path: ROUTES.REPORT,
    element: <ReportPage />
  }
];
const useRoutes = (role: USER_ROLE) => {
  const routes = [USER_ROLE.TENANT, USER_ROLE.STAFF].includes(role) ? tenantRoutes : systemAdminRoutes;
  const routesElement = createBrowserRouter([
    {
      path: '',
      element: <Guard />,
      children: [
        {
          path: ROUTES.HOME,
          element: <MainLayout />,
          children: routes
        }
      ]
    },
    {
      path: '/login',
      element: <AuthLayout />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);
  return routesElement;
};

export default useRoutes;

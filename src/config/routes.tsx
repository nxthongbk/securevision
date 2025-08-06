import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import NotFoundPage from '~/pages/common/404Page';
import { useContext } from 'react';
import LogInPage from '~/pages/common/LogInPage';
import MesSystemMain from '~/pages/MesSystem';
import MesDashboard from '~/pages/MesSystem/Dashboard';
import ProductionOrdersPage from '~/pages/MesSystem/ProductionOrders/Index';
import ProductionProcessPage from '~/pages/MesSystem/ProductionProcess/Index';
import EmployeesManagementPage from '~/pages/MesSystem/Employees/Index';
import MaterialsManagementPage from '~/pages/MesSystem/MaterialsManagement/Index';
import DevicesManagementPage from '~/pages/MesSystem/Devices/Index';
import QualityManagementPage from '~/pages/MesSystem/QualityManagement/Index';
import ReportsPage from '~/pages/MesSystem/Reports/Index';
import MesLandingPage from '~/pages/common/MesLandingPage/Index';

const Guard = () => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// const CheckRoleSYSAdmin = () => {
//   const { userInfo } = useContext(AppContext);
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const tenantCode = searchParams.get('tenantCode');
//   return userInfo?.roles?.[0] !== 'SYSADMIN' ||
//     (userInfo?.roles?.[0] === 'SYSADMIN' && tenantCode) ? (
//     <ControlCenterPage />
//   ) : (
//     <Navigate to={ROUTES.CUSTOMER_MANAGEMENT} />
//   );
// };

const useRoutes = () => {
  const routesElement = createBrowserRouter([
    {
      path: '/',
      element: <MesLandingPage />,
    },
    {
      path: '/login',
      element: <LogInPage />,
    },
    {
      path: '',
      element: <Guard />,
      children: [
        {
          path: '',
          element: <MesSystemMain />,
          children: [
            { path: '', element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', element: <MesDashboard /> },
            { path: 'orders', element: <ProductionOrdersPage /> },
            { path: 'processing', element: <ProductionProcessPage /> },
            { path: 'employees', element: <EmployeesManagementPage /> },
            { path: 'materials', element: <MaterialsManagementPage /> },
            { path: 'devices', element: <DevicesManagementPage /> },
            { path: 'quality-control', element: <QualityManagementPage /> },
            { path: 'reports', element: <ReportsPage /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
  return routesElement;
};

export default useRoutes;

import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AppContext } from '~/contexts/app.context';
import NotFoundPage from '~/pages/common/404Page';
import { useContext } from 'react';
import LogInPage from '~/pages/common/LogInPage';
import SecureLandingPage from '~/pages/common/SecureLandingPage/Index';
import SecureSystemMain from '~/pages/SecureVision';
import CamerasPage from '~/pages/SecureVision/CamerasPage';

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
      element: <SecureLandingPage />,
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
          element: <SecureSystemMain />,
          children: [
            { path: '', element: <Navigate to="cameras" replace /> },
            { path: 'cameras', element: <CamerasPage /> },
          ],
        },
        ,
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

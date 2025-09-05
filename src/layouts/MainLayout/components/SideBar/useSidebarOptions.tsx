import {
  Users,
  Tag,
  Cpu,
  Monitor,
  FireSimple,
  Buildings,
  ChartPieSlice,
  UsersThree,
  Hammer,
  SquaresFour,
  SlidersHorizontal
} from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from '~/constants/routes.constant';

export function useSidebarOptions() {
  const [sidebarTranslate] = useTranslation('', { keyPrefix: 'sidebar' });

  const sysAdminSidebar = useMemo(
    () => [
      {
        id: 1,
        title: sidebarTranslate('customer-management'),
        icon: <Users size={20} />,
        path: ROUTES.CUSTOMER_MANAGEMENT
      },
      {
        id: 2,
        title: sidebarTranslate('device-profile'),
        icon: <Tag size={20} />,
        path: ROUTES.DEVICE_PROFILE
      },
      {
        id: 3,
        title: sidebarTranslate('device-management'),
        icon: <Cpu size={20} />,
        path: ROUTES.DEVICE_MANAGEMENT
      },
      {
        id: 4,
        title: sidebarTranslate('tool'),
        icon: <Hammer size={20} />,
        path: ROUTES.TOOLS
      }
    ],
    [sidebarTranslate]
  );

  const tenantSidebar = useMemo(
    () => [
      {
        id: 1,
        title: sidebarTranslate('monitor'),
        icon: <Monitor size={20} />,
        path: ROUTES.HOME
      },
      {
        id: 2,
        title: 'Dashboard',
        icon: <SquaresFour size={20} />,
        path: ROUTES.DASHBOARD
      },
      {
        id: 3,
        title: sidebarTranslate('alarm-page'),
        icon: <FireSimple size={20} />,
        path: ROUTES.ALARM
      },
      {
        id: 4,
        title: sidebarTranslate('location-management'),
        icon: <Buildings size={20} />,
        path: ROUTES.LOCATION
      },
      {
        id: 5,
        title: sidebarTranslate('user-management'),
        icon: <UsersThree size={20} />,
        path: ROUTES.USER
      },
      {
        id: 6,
        title: sidebarTranslate('device-management'),
        icon: <Cpu size={20} />,
        path: ROUTES.DEVICE
      },
      {
        id: 7,
        title: sidebarTranslate('setting'),
        icon: <SlidersHorizontal size={20} />,
        path: ROUTES.CONFIGURATION
      },
      {
        id: 8,
        title: sidebarTranslate('report'),
        icon: <ChartPieSlice size={20} />,
        path: ROUTES.REPORT
      }
    ],
    [sidebarTranslate]
  );

  return { sysAdminSidebar, tenantSidebar };
}

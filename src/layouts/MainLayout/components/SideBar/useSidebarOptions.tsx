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
import ROUTES from '~/constants/routes.constant';

// labels for sidebar
const LABELS = {
  // tenant sidebar
  monitor: { en: "MONITOR", vi: "GIÁM SÁT", ja: "モニター" },
  dashboard: { en: "DASHBOARD", vi: "DASHBOARD", ja: "ダッシュボード" },
  alerts: { en: "ALERTS", vi: "CẢNH BÁO", ja: "アラート" },
  location: { en: "LOCATION", vi: "ĐỊA ĐIỂM", ja: "場所" },
  users: { en: "USERS", vi: "NGƯỜI DÙNG", ja: "ユーザー" },
  devices: { en: "DEVICES", vi: "THIẾT BỊ", ja: "デバイス" },
  settings: { en: "SETTINGS", vi: "CÀI ĐẶT", ja: "設定" },
  reports: { en: "REPORTS", vi: "BÁO CÁO", ja: "レポート" },

  // sysadmin sidebar
  "customer-management": { en: "CUSTOMERS", vi: "KHÁCH HÀNG", ja: "顧客" },
  "device-profile": { en: "DEVICE PROFILE", vi: "HỒ SƠ THIẾT BỊ", ja: "デバイスプロファイル" },
  "device-management": { en: "DEVICE MANAGEMENT", vi: "QUẢN LÝ THIẾT BỊ", ja: "デバイス管理" },
  tool: { en: "TOOLS", vi: "CÔNG CỤ", ja: "ツール" }
};

export function useSidebarOptions() {
  const sysAdminSidebar = useMemo(
    () => [
      { id: 1, key: "customer-management", icon: <Users size={20} />, path: ROUTES.CUSTOMER_MANAGEMENT },
      { id: 2, key: "device-profile", icon: <Tag size={20} />, path: ROUTES.DEVICE_PROFILE },
      { id: 3, key: "device-management", icon: <Cpu size={20} />, path: ROUTES.DEVICE_MANAGEMENT },
      { id: 4, key: "tool", icon: <Hammer size={20} />, path: ROUTES.TOOLS }
    ],
    []
  );

  const tenantSidebar = useMemo(
    () => [
      { id: 1, key: "monitor", icon: <Monitor size={20} />, path: ROUTES.HOME },
      { id: 2, key: "dashboard", icon: <SquaresFour size={20} />, path: ROUTES.DASHBOARD },
      { id: 3, key: "alerts", icon: <FireSimple size={20} />, path: ROUTES.ALARM },
      { id: 4, key: "location", icon: <Buildings size={20} />, path: ROUTES.LOCATION },
      { id: 5, key: "users", icon: <UsersThree size={20} />, path: ROUTES.USER },
      { id: 6, key: "devices", icon: <Cpu size={20} />, path: ROUTES.DEVICE },
      { id: 7, key: "settings", icon: <SlidersHorizontal size={20} />, path: ROUTES.CONFIGURATION },
      { id: 8, key: "reports", icon: <ChartPieSlice size={20} />, path: ROUTES.REPORT }
    ],
    []
  );

  return { sysAdminSidebar, tenantSidebar, LABELS };
}

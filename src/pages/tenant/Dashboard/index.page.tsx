import { useEffect, useMemo, useState } from 'react';
import CreateDashboard from './components/CustomWidgets/create-dashboard.component';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './index.css';
import { MenuItem } from './components/CustomWidgets/menu-item.component';
import { DotsThreeOutlineVertical } from '@phosphor-icons/react';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useGetAllDashboard } from './useDashboard';
import DashboardDisplay from './TypeDashboard/custom-widget';
import Monitoring from './TypeDashboard/monitoring';

export default function DashboardPage() {
  const { tenantCode } = useTenantCode();
  const { data } = useGetAllDashboard(0, 30, tenantCode);

  const dashboards = useMemo(() => data?.data?.content || [], [data?.data?.content]);
  const [menuIndex, setMenuIndex] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const pathId = window.location.pathname.split('/').pop();
    const initialMenuIndex =
      dashboards.length > 0
        ? dashboards.find((item) => item.id === pathId)?.id || dashboards[0]?.id
        : null;

    setMenuIndex(initialMenuIndex);
    setDashboard(dashboards.find((item) => item.id === initialMenuIndex) || null);
  }, [dashboards]);

  useEffect(() => {
    if (menuIndex) {
      history.pushState({}, '', `/dashboard/${menuIndex}`);
      setDashboard(dashboards.find((item) => item.id === menuIndex));
    }
  }, [menuIndex, dashboards]);

  return (
    <div className='w-full h-screen p-6 px-4 overflow-auto'>
      <div className={`flex h-full ${!isVisible && ' flex-col'} `}>
        <div
          className={` border-r border-[var(--border-color)] overflow-auto transition-all duration-500 ${isVisible ? 'h-[1000px] opacity-100 w-[240px]' : ' w-[0px] max-h-0 opacity-0'
            }`}
        >
          <div className='px-2 '>
            <div className='flex gap-2 py-2 border-b'>
              <CreateDashboard tenantCode={tenantCode} />
            </div>
            <div className='flex-col gap-2 py-2'>
              {dashboards.map((item) => {
                return (
                  <MenuItem
                    key={item.id}
                    title={item.name}
                    img={item.imageUrl}
                    active={menuIndex === item.id}
                    onClick={() => setMenuIndex(item.id)}
                    tenantCode={tenantCode}
                    data={item}
                    icon={menuIndex === item.id && <DotsThreeOutlineVertical />}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {dashboard && dashboard?.type === 'custom-widget' &&
          <DashboardDisplay
            dashboards={dashboards}
            dashboard={dashboard}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />}
        {dashboard && dashboard?.type === 'monitoring' &&
          <Monitoring
            typeProject={dashboard.type}
            projectName={dashboard.name}
            dashboard={dashboard}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />}
      </div>
    </div>
  );
}

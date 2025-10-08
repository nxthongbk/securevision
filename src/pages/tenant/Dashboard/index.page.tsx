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
import HandleScrollPage from '~/components/HandleScrollPage';
import { HeaderPageProps } from '~/components/HeaderPage';

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

  const headerProps: HeaderPageProps = {
    title: 'Dashboard',
    // subtitle: '',
  };

  return (
    <HandleScrollPage props={headerProps}>
      <div className="flex flex-1 min-h-0 w-full px-4">
        {/* Sidebar + content container */}
        <div className={`flex flex-1 min-h-0 ${!isVisible && 'flex-col'}`}>
          
          {/* Sidebar */}
          <div
            className={`border-r border-[var(--border-color)] transition-all duration-500 
              ${isVisible ? 'opacity-100 w-[240px]' : 'w-0 opacity-0'}
            `}
          >
            
            <div className="h-full overflow-auto px-2">
              <div className="flex gap-2 py-2 border-b border-[var(--border-color)]">
                <CreateDashboard tenantCode={tenantCode} />
              </div>
              <div className="flex flex-col gap-2 py-2">
                {dashboards.map((item) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Main Content */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
              {dashboard?.type === 'custom-widget' && (
                <DashboardDisplay
                  dashboards={dashboards}
                  dashboard={dashboard}
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                />
              )}

              {dashboard?.type === 'monitoring' && (
                <Monitoring
                  typeProject={dashboard.type}
                  projectName={dashboard.name}
                  dashboard={dashboard}
                  // isVisible={isVisible}
                  // setIsVisible={setIsVisible}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </HandleScrollPage>
  );
}

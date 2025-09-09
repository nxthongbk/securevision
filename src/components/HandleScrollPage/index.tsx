import { ReactNode } from 'react';
import { HeaderPageProps } from '../HeaderPage';
import { useLocation } from 'react-router-dom';

export default function HandleScrollPage({ children }: { props: HeaderPageProps; children: ReactNode }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');

  return (
    <div
      className="flex flex-col"
      style={{
        height: tenantCode ? 'calc(100vh - 56px)' : '100vh', // fixed viewport height
        backgroundColor: '#030712',
        overflow: 'hidden', // prevent page scroll
      }}
    >
      <div
        className="flex flex-col w-full gap-6 p-0 pb-0 miniLaptop:p-6 flex-1"
        style={{
          paddingTop: '7vh', // reserve space for header
          paddingBottom: '5vh', // reserve space for footer
          minHeight: 0, // allow children to shrink inside flex container
        }}
      >
        {/* constrained children */}
        <div className="flex flex-col w-full gap-4 flex-1 min-h-0">
          {children}
        </div>

        <div className="w-full h-2"></div>
      </div>
    </div>
  );
}

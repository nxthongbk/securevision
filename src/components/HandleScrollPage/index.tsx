import { ReactNode } from 'react';

import { HeaderPageProps } from '../HeaderPage';
import { useLocation } from 'react-router-dom';
export default function HandleScrollPage({ children }: { props: HeaderPageProps; children: ReactNode }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  return (
    <div className={`flex flex-1  overflow-y-auto ${tenantCode ? 'h-[calc(100vh-56px)]' : 'h-[100vh]'} `}>
      <div className='flex flex-col flex-1 w-full gap-6 p-0 pb-0 miniLaptop:p-6'>
        <div className='flex flex-col flex-1 w-full gap-4 p-4'>
          {children}
          <div className='w-full h-2'></div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Typography } from '@mui/material';
import Page from '../components/CustomWidgets/page.component'; // Adjust the import path as necessary

interface DashboardDisplayProps {
  dashboards: any[];
  dashboard: any;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const DashboardDisplay: React.FC<DashboardDisplayProps> = ({ dashboards, dashboard, isVisible, setIsVisible }) => {
  return (
    <>
      {dashboards.length > 0 ? (
        <div className='w-full'>
          <Page toggleMenu={() => setIsVisible(!isVisible)} dashboard={dashboard} />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full'>
          <img alt='error' src='/src/assets/images/svg/Duplicate-amico.svg' className='max-w-[400px] max-h-[400px]' />
          <Typography variant='h4'>Chưa có dashboard nào</Typography>
        </div>
      )}
    </>
  );
};

export default DashboardDisplay;
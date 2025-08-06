import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import TopMenu from '~/components/TopMenu';
import './style.scss';

const EnergyMain = () => {
  return (
    <Box className="energy-flatform overflow-y-auto h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex flex-col">
      <div className="sticky top-0 z-30">
        <TopMenu />
      </div>
      <main className="flex-1 px-4 py-8" role="main">
        <section className="container mx-auto px-4 animate-fade-in">
          <Outlet />
        </section>
      </main>
    </Box>
  );
};

export default EnergyMain;

import { AppBar } from '@mui/material';
import { Link } from 'react-router-dom';
import IconPhosphor from '~/assets/iconPhosphor';
import SelectTenant from './SelectTenant';

export default function HeaderAccessTenant() {
  return (
    <AppBar className='w-screen !min-h-14 !bg-[white] !shadow-none border border-b border-[var(--border-color)]'>
      <div className='flex h-full  justify-between'>
        <div className='flex items-center !min-h-14'>
          <div className='min-w-[64px] flex justify-center items-center'>
            <Link to={'/customer-management'}>
              <IconPhosphor iconName='ArrowLeft' size={32} color='var(--text-primary)' />
            </Link>
          </div>
          <div className='w-[320px]'>
            <SelectTenant />
          </div>
        </div>
      </div>
    </AppBar>
  );
}

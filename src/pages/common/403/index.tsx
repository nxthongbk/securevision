import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Img from '~/assets/images/svg/403.svg';

export default function ForbiddenPage() {
  const { t } = useTranslation('');
  return (
    <div className='flex items-center justify-center h-full w-screen'>
      <div className='flex flex-col items-center'>
        <img alt='error' src={Img} className='max-w-[400px] max-h-[400px]' />
        <div className='flex flex-col justify-center items-center mt-14'>
          <Typography variant='h4'>{t('forbidden-page')}</Typography>
        </div>
      </div>
    </div>
  );
}

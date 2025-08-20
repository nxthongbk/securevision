import { Typography } from '@mui/material';
import { Buildings, Cpu, FireSimple } from '@phosphor-icons/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonCustom from '~/components/ButtonCustom';
import { AppContext } from '~/contexts/app.context';

export default function Filter() {
  const { t } = useTranslation('');
  const { selectedFilter, setSelectedFilter } = useContext(AppContext);
  const handleFilterClick = (filter) => {
    if (selectedFilter.includes(filter)) {
      setSelectedFilter(selectedFilter.filter((item) => item !== filter));
    } else {
      setSelectedFilter([...selectedFilter, filter]);
    }
  };

  return (
    <div className=' flex gap-3 '>
      <ButtonCustom
        onClick={() => handleFilterClick('ALARM')}
        variant='contained'
        startIcon={<FireSimple size={16} weight='fill' />}
        style={{
          backgroundColor: !selectedFilter.includes('ALARM') && '#ffffff',
          color: !selectedFilter.includes('ALARM') && 'var(--text-primary)'
        }}
      >
        <Typography variant='button3' className='text-nowrap'>
          {t('fire-alarm')}
        </Typography>
      </ButtonCustom>
      <ButtonCustom
        onClick={() => {
          if (selectedFilter.includes('ACTIVE')) {
            setSelectedFilter(
              selectedFilter.filter((item) => !['ACTIVE', 'CONFIRM', 'PENDING', 'IGNORE'].includes(item))
            );
          } else {
            setSelectedFilter([...selectedFilter, 'ACTIVE', 'CONFIRM', 'PENDING', 'IGNORE']);
          }
        }}
        variant='contained'
        startIcon={<Buildings size={16} weight='fill' />}
        style={{
          backgroundColor: !selectedFilter.includes('ACTIVE') && '#ffffff',
          color: !selectedFilter.includes('ACTIVE') && 'var(--text-primary)'
        }}
      >
        <Typography variant='button3' className='text-nowrap'>
          {t('location')}
        </Typography>
      </ButtonCustom>
      <ButtonCustom
        onClick={() => handleFilterClick('device')}
        variant='contained'
        startIcon={<Cpu size={16} weight='fill' />}
        style={{
          backgroundColor: !selectedFilter.includes('device') && '#ffffff',
          color: !selectedFilter.includes('device') && 'var(--text-primary)'
        }}
      >
        <Typography variant='button3' className='text-nowrap'>
          {t('device')}
        </Typography>
      </ButtonCustom>
    </div>
  );
}

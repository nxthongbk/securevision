import { Typography } from '@mui/material';
import { useState } from 'react';
import { TabFacility } from './tabs/tab-facility';
import { TabCondition } from './tabs/tab-condition';
import { useTranslation } from 'react-i18next';

function ConfigPage() {
  const [activeTab, setActiveTab] = useState('Phương tiện');
  const [t] = useTranslation();

  const tabs = {
    vehicle: t('vehicle'),
    condition: t('condition'),
    schedule: t('schedule')
  };
  return (
    <div className='p-6'>
      <div className='bg-[var(--grey-primary-60)] w-fit px-2  py-1 rounded-md flex gap-2'>
        {Object.entries(tabs).map(([key, label]) => (
          <div
            key={key}
            className={`px-4 py-2 rounded-md  cursor-pointer ${activeTab === label ? 'shadow-md bg-white' : ''}`}
            onClick={() => setActiveTab(label)}
          >
            <Typography variant='button3'>{label}</Typography>
          </div>
        ))}
      </div>
      <div className='py-6'>
        {activeTab === tabs.vehicle && <TabFacility />}
        {activeTab === tabs.condition && <TabCondition />}
      </div>
    </div>
  );
}

export default ConfigPage;

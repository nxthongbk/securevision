import { Typography } from '@mui/material';
import { useState } from 'react';
import { TabFacility } from './tabs/tab-facility';
import { TabCondition } from './tabs/tab-condition';
import { useTranslation } from 'react-i18next';

function ConfigPage() {
  const [t] = useTranslation();

  const tabs = {
    vehicle: t('vehicle'),
    condition: t('condition'),
    schedule: t('schedule'),
  };

  // dynamically take the first tab label as default
  const firstTab = Object.values(tabs)[0];
  const [activeTab, setActiveTab] = useState(firstTab);

  return (
    <div className="min-h-screen p-6 pt-[7vh] bg-[var(--bg)]">
      <div className="bg-[#031f2f] w-fit px-2 py-1 flex gap-2 text-white border border-[#FFFFFF33]">
        {Object.entries(tabs).map(([key, label]) => (
          <div
            key={key}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === label ? 'shadow-md bg-[#232a39]' : ''
            }`}
            onClick={() => setActiveTab(label)}
          >
            <Typography variant="button3">{label}</Typography>
          </div>
        ))}
      </div>

      <div className="py-6">
        {activeTab === tabs.vehicle && <TabFacility />}
        {activeTab === tabs.condition && <TabCondition />}
        {/* schedule tab can be rendered here once implemented */}
      </div>
    </div>
  );
}

export default ConfigPage;

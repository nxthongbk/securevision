import { Box, Drawer, DrawerProps, Tab, Tabs, Typography } from '@mui/material';

import TabAlarmDevice from '../DrawerDevice/TenantView/TabAlarm';
import TabAttributesDevice from '../DrawerDevice/TenantView/TabAttributes';
import TabLastTelemetry from '../DrawerDevice/TenantView/TabLastTelemetry';
import TabNotification from '~/pages/tenant/DevicePage/DrawerDevice/TenantView/TabNotification';
import TabsInforDevice from '../DrawerDevice/TenantView/TabInfo';
import { X } from '@phosphor-icons/react';
import { translationCapitalFirst } from '~/utils/translate';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className={`flex-1 ${value === index ? ' flex' : 'hidden'}`}
      role='tabpanel'
      // hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className='flex flex-1 h-[75vh]'>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

interface DrawerDeviceDetailsProps extends DrawerProps, Record<string, any> {
  hasEdit: boolean;
}

export default function DrawerDeviceDetails(props: DrawerDeviceDetailsProps) {
  const { hasEdit, open, onClose, ...rest } = props;

  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCloseClick = () => {
    onClose({}, 'escapeKeyDown');
  };

  return (
    <Drawer open={open} onClose={onClose} anchor='bottom' {...rest}>
      <Box className='flex flex-col flex-1 gap-4 p-6 h-[100vh]' role='presentation'>
        <div className='flex flex-row h-fit'>
          <Typography fontSize={20} lineHeight={'24px'} fontWeight={600}>
            {props?.name}
          </Typography>
          <X className='ml-auto hover:cursor-pointer size-[15px]' fill='#737982' onClick={handleCloseClick} />
        </div>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
            <Tab label={translate('info')} {...a11yProps(0)} />
            <Tab label={'Attributes'} {...a11yProps(1)} />
            <Tab label={'Latest telemetry'} {...a11yProps(2)} />
            <Tab label={translate('warning')} {...a11yProps(3)} />
            <Tab label={translate('notification')} {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TabsInforDevice props={props} hasEdit={hasEdit} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TabAttributesDevice deviceId={props.id} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <TabLastTelemetry deviceId={props.id} deviceName={props?.name} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <TabAlarmDevice token={props?.token} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <TabNotification deviceId={props.id} token={props?.token} />
        </CustomTabPanel>
      </Box>
    </Drawer>
  );
}

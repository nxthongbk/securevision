import { Box, Drawer, Tab, Tabs, Typography } from '@mui/material';

import TabAlarmDevice from '../DrawerDevice/TenantView/TabAlarm';
import TabAttributesDevice from '../DrawerDevice/TenantView/TabAttributes';
import TabLastTelemetry from '../DrawerDevice/TenantView/TabLastTelemetry';
import TabNotification from '../DrawerDevice/TenantView/TabNotification';
import TabsInforDevice from '../DrawerDevice/TenantView/TabInfo';
import { translationCapitalFirst } from '~/utils/translate';
import { useState } from 'react';
import TabConfiguration from '../DrawerDevice/TenantView/TabConfiguration';
import TabCredentials from '../DrawerDevice/TenantView/TabCredentials'; 


// import TabsInforDeviceSysAdminView from '../DrawerDevice/SysAdminView/TabInfo';
// import TabAttributesDeviceSysAdminView from '../DrawerDevice/SysAdminView/TabAttributes';
// import TabLastTelemetrySysAdminView from '../DrawerDevice/SysAdminView/TabLastTelametry';
// import TabAlarmDeviceSysAdminView from '../DrawerDevice/SysAdminView/TabAlarm';
// import { AppContext } from '~/contexts/app.context';
// import { UserRole } from '~/utils/constant';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className='flex flex-1'>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
export default function PopupDeviceInfor({ props, hasEdit }: { props: Record<string, any>; hasEdit: boolean }) {
  // const { userInfo } = useContext(AppContext);
  // const userRole = userInfo?.roles?.[0];
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const renderTabPanel = () => {
    // if (userRole === UserRole.SYSADMIN) {
    //   return (
    //     <>
    //       <CustomTabPanel value={value} index={0}>
    //         <TabsInforDeviceSysAdminView props={props} />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={1}>
    //         <TabAttributesDeviceSysAdminView />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={2}>
    //         <TabLastTelemetrySysAdminView deviceId={props.id} />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={3}>
    //         <TabAlarmDeviceSysAdminView />
    //       </CustomTabPanel>
    //     </>
    //   );
    // }
    return (
      <>
        <CustomTabPanel value={value} index={0}>
          <TabsInforDevice props={props} hasEdit={hasEdit} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TabCredentials  props={props} hasEdit={hasEdit} /> 
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <TabAttributesDevice deviceId={props?.id} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <TabLastTelemetry deviceId={props?.id} deviceName={props?.name} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <TabAlarmDevice token={props?.token} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <TabNotification deviceId={props?.id} token={props?.token} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
          <TabConfiguration deviceId={props?.id} />
        </CustomTabPanel>
      </>
    );
  };

  return (
    <>
      <div className='w-full h-full' onClick={toggleDrawer(true)}>
        <Typography variant='button3'>{translationCapitalFirst('show-infos')}</Typography>
      </div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        <Box sx={{ width: 1024, bgcolor: 'var(--bg)' }} className='flex flex-col flex-1 gap-4 p-6' role='presentation'>
          <div className='h-10'>
            <Typography variant='h4' color="var(--text-primary)">{props?.name}</Typography>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
              <Tab label={translate('info')} {...a11yProps(0)} />
              <Tab label={"Credentials"} {...a11yProps(1)} />
              <Tab label={'Attributes'} {...a11yProps(2)} />
              <Tab label={'Latest telemetry'} {...a11yProps(3)} />
              <Tab label={translate('warning')} {...a11yProps(4)} />
              <Tab label={translate('notification')} {...a11yProps(5)} />
              <Tab label={translate('configuration')} {...a11yProps(6)} />
            </Tabs>
          </Box>
          {renderTabPanel()}
        </Box>
      </Drawer>
    </>
  );
}

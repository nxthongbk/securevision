import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import HeaderPage from '~/components/HeaderPage';
import InputCustom from '~/components/InputCustom';
import JSONInput from 'react-json-editor-ajrm';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import TabAlarmTest from './TabAlarm';
import TabUploadFile from './TabUploadFile';
import handleNotificationMessege from '~/utils/notification';
import locale from 'react-json-editor-ajrm/locale/en';
import { postTelemetryDeviceSchema } from '~/utils/yup';
import telemetryService from '~/services/telemetry.service';
import { translation } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className={`flex-1 w-full h-[85vh]  ${value === index ? ' flex' : 'hidden'}`}
      role='tabpanel'
      // hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className='flex-1 flex w-full h-full'>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function SysToolsPage() {
  const [keyPressUpdate, setKeyPressUpdate] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      token: '',
      telemetry: {}
    },
    resolver: yupResolver(postTelemetryDeviceSchema)
  });

  const postTelemetryDeviceMutation = useMutation({
    mutationFn: (query: { token: string; telemetry: any }) => telemetryService.postTelemetry(query)
  });

  const onSubmit = (data) => {
    postTelemetryDeviceMutation.mutate(
      {
        token: data?.token,
        telemetry: data?.telemetry
      },
      {
        onSuccess: (res) => {
          handleNotificationMessege(res?.data, 'success');
        }
      }
    );
  };

  useEffect(() => {
    // Don't update
    setKeyPressUpdate(true);
  }, []);

  const [value, setValueTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '24px 24px 0 24px' }}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label={translation('Tải lên Telemetry Json')} {...a11yProps(0)} />
          <Tab label={translation('Gửi cảnh báo')} {...a11yProps(1)} />
          <Tab label={translation('upload-file')} {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 h-full w-full'>
          <HeaderPage
            title={translation('Tải lên Telemetry Json')}
            btnPopup={
              <Button disabled={!isValid} type='submit' variant='contained' startIcon={<PaperPlaneTilt size={20} />}>
                {translation('Tải lên')}
              </Button>
            }
          />
          <div className='mt-6 flex flex-col h-full gap-[6px]'>
            <InputCustom
              type='text'
              name='token'
              isError={Boolean(errors?.token)}
              control={control}
              isSpacingHelperText={true}
              classNameContainer='max-w-[800px]'
              label='Token'
              placeholder={translation('Nhập token thiết bị')}
              isRequired
              helperText={errors.token?.message}
            />
            <div className='flex-1'>
              <Typography variant='label3' className='!mb-1'>
                Telemetry Json <span className='text-[var(--semantic-alert)]'>*</span>
              </Typography>
              <div className='w-full rounded-lg border border-[#C0C4C4] bg-white h-[85%] overflow-scroll'>
                <JSONInput
                  id='tool-page-json-editor'
                  placeholder={{ sample: 'value' }}
                  locale={locale}
                  height='100%'
                  width='100%'
                  theme='mitsuketa_tribute'
                  colors={{
                    default: '#000000',
                    background: '#ffffff',
                    keys: '#000000',
                    string: '#388023',
                    number: '#388023'
                  }}
                  style={{
                    body: {
                      fontSize: '16px !important'
                    }
                  }}
                  onKeyPressUpdate={keyPressUpdate}
                  onChange={(event) => {
                    setValue('telemetry', event.json);
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabAlarmTest />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TabUploadFile />
      </CustomTabPanel>
    </>
  );
}

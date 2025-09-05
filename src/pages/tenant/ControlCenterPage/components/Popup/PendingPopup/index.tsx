import { Box, Divider, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import ButtonCustom from '~/components/ButtonCustom';
import { CameraDetail } from '../AlertPopup';
import CarouselCustom from '~/components/Carousel';
import CommonInfoLocation from '../../CommonInfoLocation';
import { DATA_STATUS } from '~/components/StatusChip/constant';
import DialogCustom from '~/components/DialogCustom';
import PopupSkipAlarm from '~/pages/tenant/AlarmPage/Popup/PopupSkipAlarm';
import PopupVerifyAlarm from '~/pages/tenant/AlarmPage/Popup/PopupVerifyAlarm';
import SockJS from 'sockjs-client';
import StatusChip from '~/components/StatusChip';
import Stomp from 'stompjs';
import dayjs from 'dayjs';
import { useGetAlarmPendingLocationInfo } from '../../../handleApi';
import { useGetLocationDetail } from '~/pages/tenant/LocationPage/handleApi';
import { useQueryClient } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useTranslation } from 'react-i18next';

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function PendingPopup() {
  const { t } = useTranslation('');
  const queryClient = useQueryClient();
  const [fireAlertTranslate] = useTranslation('', { keyPrefix: 'fire-alerts-page' });
  const { openPendingPopup, setOpenPendingPopup } = useContext(AppContext);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [openSkipPopup, setOpenSkipPopup] = useState<boolean>(false);
  const [selectedAlarmLocationId, setSelectedAlarmLocationId] = useState<string>('');
  const { tenantCode } = useTenantCode();
  const [cameraList, setCameraList] = useState([]);
  const timeoutId = useRef<NodeJS.Timeout>(); 
  const socket = new SockJS(SOCKET_URL);
  const { data: detail } = useGetLocationDetail(openPendingPopup?.id, tenantCode);
  const { status, data } = useGetAlarmPendingLocationInfo(openPendingPopup?.id, tenantCode);

  useEffect(() => {
    if (openPendingPopup) {
      const topic = '/topic/' + openPendingPopup?.id;
      const connectHeaders = {};
      let stompClient = Stomp.over(socket);

      if (!stompClient.connected) {
        stompClient.connect(connectHeaders, () => {
          stompClient.subscribe(topic, (message) => {
            const body = JSON.parse(message.body);
            if (body.hasNewAlarm) {
              timeoutId.current = setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['getAlarmPendingLocationInfo'] });
              }, 1200);
            }
          });
        });
      }
      // Cleanup
      return () => {
        clearTimeout(timeoutId.current);
        if (stompClient.connected) {
          stompClient.disconnect(() => {
            stompClient = null;
          });
        }
      };
    }
  }, [openPendingPopup]);

  const handleClose = () => {
    setOpenPendingPopup(false);
  };

  const pendingLocations = data?.data || [];

  const renderPendingPanel = (pendingVerifyAlarm) => {
    return (
      <>
        <Box className='flex flex-col	bg-[var(--orange-60)] rounded-lg'>
          <Box className='flex items-center justify-between w-full px-4 py-3'>
            <div className='flex flex-col'>
              <Typography variant='caption1'>
                ID: {pendingVerifyAlarm?.code ? String(pendingVerifyAlarm?.code).padStart(6, '0') : ''}
              </Typography>
              <Typography variant='label1'>
                {pendingVerifyAlarm?.createdAlarmBy?.date
                  ? dayjs(pendingVerifyAlarm?.createdAlarmBy?.date).format('HH:mm DD/MM')
                  : ''}
                {' - '}
                {pendingVerifyAlarm?.updatedAlarmBy?.date
                  ? dayjs(pendingVerifyAlarm?.updatedAlarmBy?.date).format('HH:mm DD/MM')
                  : ''}
              </Typography>
            </div>
            <div>
              <StatusChip status={DATA_STATUS.PENDING} />
            </div>
          </Box>
          <Divider
            sx={{
              borderBottom: '1px solid var(--border-color)',
              width: '100%'
            }}
          />
          <Box className='self-end px-4 py-3'>
            <ButtonCustom
              variant='contained'
              color='info'
              className='!mr-2 h-[40px] !text-sm	!text-[#007EF5]'
              onClick={() => {
                setOpenSkipPopup(true);
                setSelectedAlarmLocationId(pendingVerifyAlarm.id);
              }}
            >
              {fireAlertTranslate('skip')}
            </ButtonCustom>
            <ButtonCustom
              variant='contained'
              className='h-[40px] !text-sm'
              onClick={() => {
                setOpenVerifyPopup(true);
                setSelectedAlarmLocationId(pendingVerifyAlarm.id);
              }}
            >
              {fireAlertTranslate('verify')}
            </ButtonCustom>
          </Box>
        </Box>
        <div className='pt-3'>
          <CarouselCustom>{pendingVerifyAlarm.alarms.map((item) => renderDeviceAlarmPanel(item))}</CarouselCustom>
        </div>
      </>
    );
  };
  const renderDeviceAlarmPanel = (alarm) => {
    if (status === 'pending') {
      return (
        <Box key={alarm.id}>
          <Typography variant='label1'>Loading...</Typography>
        </Box>
      );
    }

    if (status === 'error') {
      return (
        <Box key={alarm.id}>
          <Typography variant='label1'>{fireAlertTranslate('no-alarm')}</Typography>
        </Box>
      );
    }

    return (
      <Grid>
        <div className='w-80 flex flex-col gap-3 border border-[var(--neutral)] rounded-lg pt-3 '>
          <div className='flex flex-col px-3 '>
            <Typography variant='caption1' className='max-w-[256px]'>
              {alarm.deviceInfo?.code ? String(alarm.deviceInfo?.code).padStart(4, '0') : ''}
            </Typography>
            <Typography variant='label1' className='max-w-[256px]'>
              {alarm.deviceInfo?.name}
            </Typography>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-[6px]'>
              <div className='flex bg-[var(--grey-primary-60)] p-2 px-4 rounded-lg'>
                <Typography variant='label3' className='flex-1'>
                  {t('fire-alerts-page.status')}
                </Typography>
                <div className='flex-end'>
                  <StatusChip status={alarm?.status} />
                </div>
              </div>
              <div className='flex px-4 py-2'>
                <Typography variant='label3' className='flex-1'>
                  {t('devicePage.content')}
                </Typography>
                <div className='break-words '>
                  <Typography variant='body3' className='flex-1 text-right'>
                    {alarm?.detail}
                  </Typography>
                </div>
              </div>
              <div className='flex px-4 py-2 bg-[var(--grey-primary-60)] rounded-lg'>
                <Typography variant='label3' className='flex-1'>
                  {t('devicePage.start-time')}
                </Typography>
                <Typography variant='body3' className='flex-1 text-right'>
                  {alarm?.createdAlarmBy ? dayjs(alarm?.createdAlarmBy.date).format('HH:mm DD/MM') : '-'}
                </Typography>
              </div>
              <div className='flex p-2 px-4 '>
                <Typography variant='label3' className='flex-1'>
                  {t('devicePage.update-time')}
                </Typography>
                <Typography variant='body3' className='flex-1 text-right'>
                  {alarm?.updatedAlarmBy ? dayjs(alarm?.updatedAlarmBy.date).format('HH:mm DD/MM') : '-'}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    );
  };

  useEffect(() => {
    if (detail) {
      setCameraList(detail?.data?.cameraList);
    }
  }, [detail?.data]);
  return (
    <>
      <DialogCustom
        open={Boolean(openPendingPopup)}
        title={t('locationPage.location-information')}
        maxWidth={1280}
        handleClose={handleClose}
        content={
          <div className='flex flex-col gap-6 px-4 py-6'>
            <div className='grid grid-cols-2 gap-12'>
              <CommonInfoLocation info={openPendingPopup} />
              <div>
                <Typography variant='label1'>{t('fire-alerts-page.warning')}</Typography>
                {pendingLocations.map((alarm) => renderPendingPanel(alarm))}
              </div>
            </div>
            {cameraList?.length > 0 && (
              <div className='flex flex-col gap-3 '>
                <Typography variant='label1'>Camera</Typography>
                <CarouselCustom>
                  {cameraList.map((deviceInfo, index) => (
                    <div key={index} className='mx-2'>
                      <CameraDetail deviceInfo={deviceInfo} />
                    </div>
                  ))}
                </CarouselCustom>
              </div>
            )}
          </div>
        }
      />
      {openVerifyPopup && (
        <PopupVerifyAlarm
          tenantCode={tenantCode}
          open={openVerifyPopup}
          onClose={() => setOpenVerifyPopup(false)}
          alarmLocationId={selectedAlarmLocationId}
        />
      )}
      {openSkipPopup && (
        <PopupSkipAlarm
          tenantCode={tenantCode}
          open={openSkipPopup}
          onClose={() => setOpenSkipPopup(false)}
          alarmLocationId={selectedAlarmLocationId}
        />
      )}
    </>
  );
}

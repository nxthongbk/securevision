import { Box, Divider, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import { ArrowsOut } from '@phosphor-icons/react';
import ButtonCustom from '~/components/ButtonCustom';
import CarouselCustom from '~/components/Carousel';
import CommonInfoLocation from '../../CommonInfoLocation';
import DialogCustom from '~/components/DialogCustom';
import DrawerViewDetails from '~/components/Drawer/DrawerViewDetails';
import Hls from 'hls.js';
import PopupSkipAlarm from '~/pages/tenant/FireAlertPage/Popup/PopupSkipAlarm';
import PopupVerifyAlarm from '~/pages/tenant/FireAlertPage/Popup/PopupVerifyAlarm';
import SockJS from 'sockjs-client';
import StatusChip from '~/components/StatusChip';
import Stomp from 'stompjs';
import dayjs from 'dayjs';
import locationService from '~/services/location.service';
import { useGetAlarmLocationInfo } from '../../../handleApi';
import { useGetLocationDetail } from '~/pages/tenant/LocationPage/handleApi';
import { useQueryClient } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useTranslation } from 'react-i18next';

// import { ArrowsOut } from '@phosphor-icons/react';

// import IconPhosphor from '~/assets/iconPhosphor';

// import VideoDemo1 from '~/assets/videos/VideoDemo1.mp4';
// import VideoDemo2 from '~/assets/videos/VideoDemo2.mp4';

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function AlertPopup() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [fireAlertTranslate] = useTranslation('', { keyPrefix: 'fire-alerts-page' });
  const { openAlertPopup, setOpenAlertPopup } = useContext(AppContext);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [openSkipPopup, setOpenSkipPopup] = useState<boolean>(false);
  const [selectedAlarmLocationId, setSelectedAlarmLocationId] = useState<string>('');
  const [cameraList, setCameraList] = useState([]);
  const { tenantCode } = useTenantCode();
  const timeoutId = useRef<NodeJS.Timeout>();
  const socket = new SockJS(SOCKET_URL);

  const { status, data } = useGetAlarmLocationInfo(openAlertPopup?.id, tenantCode);
  const { data: detail } = useGetLocationDetail(openAlertPopup?.id, tenantCode);

  useEffect(() => {
    if (openAlertPopup) {
      const topic = '/topic/' + openAlertPopup?.id;
      const connectHeaders = {};
      let stompClient = Stomp.over(socket);

      if (!stompClient.connected) {
        stompClient.connect(connectHeaders, () => {
          stompClient.subscribe(topic, (message) => {
            const body = JSON.parse(message.body);
            if (body.hasNewAlarm) {
              timeoutId.current = setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['getAlarmLocationInfo'] });
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
  }, [openAlertPopup]);
  useEffect(() => {
    if (detail) {
      setCameraList(detail?.data?.cameraList);
    }
  }, [detail?.data]);

  const handleClose = () => {
    setOpenAlertPopup(false);
  };

  const alarms = data?.data || [];
  const renderAlarmPanel = (alarm) => {
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
      <>
        <Box key={alarm.id} className='flex flex-col	bg-[var(--red-60)] rounded-lg'>
          <Box className='flex items-center justify-between w-full px-4 py-3'>
            <div className='flex flex-col'>
              <Typography variant='caption1'>ID: {alarm?.code ? String(alarm?.code).padStart(6, '0') : ''}</Typography>
              <Typography variant='label1'>
                {alarm?.createdAlarmBy?.date ? dayjs(alarm?.createdAlarmBy?.date).format('HH:mm DD/MM') : ''}
              </Typography>
            </div>
            <div>
              <StatusChip status={alarm.status} />
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
                setSelectedAlarmLocationId(alarm.id);
              }}
            >
              {fireAlertTranslate('skip')}
            </ButtonCustom>
            <ButtonCustom
              variant='contained'
              className='h-[40px] !text-sm'
              onClick={() => {
                setOpenVerifyPopup(true);
                setSelectedAlarmLocationId(alarm.id);
              }}
            >
              {fireAlertTranslate('verify')}
            </ButtonCustom>
          </Box>
        </Box>
        <div className='pt-3'>
          <CarouselCustom>{alarm.alarms.map((item) => renderDeviceAlarmPanel(item))}</CarouselCustom>
        </div>
      </>
    );
  };

  const renderDeviceAlarmPanel = (alarm) => {
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
                <div className='break-words'>
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

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = fireAlertTranslate('location-information');

  const renderBody = () => (
    <div className='flex flex-col gap-6 p-0 tablet:px-4 tablet:py-6'>
      <div className='flex flex-col tablet:grid grid-cols-2 gap-6 tablet:gap-12'>
        <CommonInfoLocation info={status === 'error' ? { ...openAlertPopup, status: 'CONFIRM' } : openAlertPopup} />
        <div className='flex flex-col gap-2'>
          <Typography variant='label1'>{t('fire-alerts-page.warning')}</Typography>
          {alarms.map((alarm) => renderAlarmPanel(alarm))}
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
  );

  return (
    <>
      {isTablet ? (
        <DrawerViewDetails title={title} open={openAlertPopup} onClose={handleClose}>
          {renderBody()}
        </DrawerViewDetails>
      ) : (
        <DialogCustom
          open={Boolean(openAlertPopup)}
          title={title}
          maxWidth={1280}
          handleClose={handleClose}
          content={renderBody()}
        />
      )}
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

export function CameraDetail({ deviceInfo }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [cameraInfo, setCameraInfo] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    locationService.getCamera(deviceInfo.id).then((res) => {
      setCameraInfo(res?.data?.result.data);
    });
  }, [deviceInfo]);
  useEffect(() => {
    if (cameraInfo?.streams && cameraInfo && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(cameraInfo?.streams[2].hls);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = cameraInfo?.streams[2].hls;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }
  }, [cameraInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };
  return (
    <div className='rounded-lg h-[253px] relative'>
      <div className='w-full h-full bg-black rounded-lg'>
        <video ref={videoRef} className='w-full h-full rounded-lg' />
      </div>
      <div className='bg-[rgba(0,_0,_0,_0.5)] rounded-b-xl px-2 py-1 absolute w-full bottom-0 flex justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-[var(--red-400)]' />
          <Typography variant='label3' color='white'>
            {deviceInfo.name}
          </Typography>
        </div>
        <div className='flex gap-[10px] items-center'>
          <Typography variant='label3' color='white'>
            {currentTime}
          </Typography>
          <ArrowsOut color='white' size={20} className='cursor-pointer' onClick={toggleFullscreen} />
        </div>
      </div>
    </div>
  );
}

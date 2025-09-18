import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState, useMemo } from 'react';

import { AppContext } from '~/contexts/app.context';
import { ArrowsOut } from '@phosphor-icons/react';
import ButtonCustom from '~/components/ButtonCustom';
import CarouselCustom from '~/components/Carousel';
import CommonInfoLocation from '../../CommonInfoLocation';
import DialogCustom from '~/components/DialogCustom';
import DrawerViewDetails from '~/components/Drawer/DrawerViewDetails';
import Hls from 'hls.js';
import PopupSkipAlarm from '~/pages/tenant/AlarmPage/Popup/PopupSkipAlarm';
import PopupVerifyAlarm from '~/pages/tenant/AlarmPage/Popup/PopupVerifyAlarm';
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
import { useGetDashboards } from '../../../handleApi';
import { MenuItem } from '../../../../Dashboard/components/CustomWidgets/menu-item.component';
import { useNavigate } from 'react-router-dom';


// import { ArrowsOut } from '@phosphor-icons/react';

// import IconPhosphor from '~/assets/iconPhosphor';

// import VideoDemo1 from '~/assets/videos/VideoDemo1.mp4';
// import VideoDemo2 from '~/assets/videos/VideoDemo2.mp4';

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function AlertPopup() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });
  const { openAlertPopup, setOpenAlertPopup } = useContext(AppContext);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [openSkipPopup, setOpenSkipPopup] = useState<boolean>(false);
  const [selectedAlarmLocationId, setSelectedAlarmLocationId] = useState<string>('');
  const [cameraList, setCameraList] = useState([]);
  const { tenantCode } = useTenantCode();
  const timeoutId = useRef<NodeJS.Timeout>();
  const socket = new SockJS(SOCKET_URL);
  const navigate = useNavigate();
  

  const { status, data } = useGetAlarmLocationInfo(openAlertPopup?.id, tenantCode);
  const { data: detail } = useGetLocationDetail(openAlertPopup?.id, tenantCode);
  // Fetch dashboards (React Query)
  const { data: dashboardsData } = useGetDashboards(detail?.data?.id, tenantCode);
  const dashboards = useMemo(() => dashboardsData?.data || [], [dashboardsData]);  

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
          <Typography variant='label1'>{alarmTranslate('no-alarm')}</Typography>
        </Box>
      );
    }

    return (
      <>
        <Box key={alarm.id} className='flex flex-col bg-[#0D1117] text-white '>
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
          {/* <Divider
            sx={{
              borderBottom: '1px solid var(--border-color)',
              width: '100%'
            }}
          /> */}
          <Box className='self-end px-4 py-3'>
            <ButtonCustom
              variant='contained'
              color='info'
              className='!mr-2 h-[40px] !text-sm  !text-white !rounded-none !bg-[#0e2c42]'
              onClick={() => {
                setOpenSkipPopup(true);
                setSelectedAlarmLocationId(alarm.id);
              }}
            >
              {alarmTranslate('skip')}
            </ButtonCustom>
            <ButtonCustom
              variant='contained'
              className='h-[40px] !text-sm !rounded-none !bg-[#00BCFFCC]'
              onClick={() => {
                setOpenVerifyPopup(true);
                setSelectedAlarmLocationId(alarm.id);
              }}
            >
              {alarmTranslate('verify')}
            </ButtonCustom>
          </Box>
        </Box>

      </>
    );
  };

  const renderDeviceAlarmPanel = (alarm) => {
    return (
    <Grid>
      <div className='flex flex-col w-80 text-white'>
        <div className='flex w-full px-4 py-3'>
          <Typography variant='label2' className='w-[40%]'>
            {t('alarm-page.status')}
          </Typography>
          <Typography variant='body2' className='flex-1'>
            <StatusChip status={alarm?.status} />
          </Typography>
        </div>

      
        <div className='flex w-full px-4 py-3 bg-[#00BCFF12]'>
          <Typography variant='label2' className='w-[40%]'>
            {t('devicePage.name')}
          </Typography>
          <Typography variant='body2' className='flex-1'>
            {alarm.deviceInfo?.name || '-'}
          </Typography>
        </div>

        <div className='flex w-full px-4 py-3 '>
          <Typography variant='label2' className='w-[40%]'>
            {t('devicePage.detail')}
          </Typography>
          <Typography variant='body2' className='flex-1 break-words'>
            {alarm?.detail || '-'}
          </Typography>
        </div>

        <div className='flex w-full px-4 py-3 bg-[#00BCFF12]'>
          <Typography variant='label2' className='w-[40%]'>
            {t('devicePage.start-time')}
          </Typography>
          <Typography variant='body2' className='flex-1'>
            {alarm?.createdAlarmBy ? dayjs(alarm?.createdAlarmBy.date).format('HH:mm DD/MM') : '-'}
          </Typography>
        </div>

        <div className='flex w-full px-4 py-3'>
          <Typography variant='label2' className='w-[40%]'>
            {t('devicePage.update-time')}
          </Typography>
          <Typography variant='body2' className='flex-1'>
            {alarm?.updatedAlarmBy ? dayjs(alarm?.updatedAlarmBy.date).format('HH:mm DD/MM') : '-'}
          </Typography>
        </div>
      </div>
    </Grid>

    );
  };

  
  const renderVideoSection = () => {
    if (alarms.length === 0) {
      return (
        <Typography variant="body2" className="text-[var(--text-secondary)]">
          No alarms found
        </Typography>
      );
    }

    const alarm = alarms[0]; // Take the first alarm for simplicity
    const alarmDateTime = alarm?.createdAlarmBy?.date;

    // Get device ID from the first device in the alarm
    const deviceId = alarm?.alarms?.[0]?.deviceInfo?.id;

    if (!alarmDateTime || !deviceId) {
      return (
        <Typography variant="body2" className="text-[var(--text-secondary)]">
          Missing alarm date or device ID
        </Typography>
      );
    }

    const formattedDate = dayjs(alarmDateTime).format('YYYY-MM-DD_HH:mm:ss');
    const videoUrl = `https://scity-dev.innovation.com.vn/api/media/get_video?alarm_time=${formattedDate}&camera=camera-${deviceId}`;

    console.log('Generated video URL:', videoUrl);

    return (
      <div className="h-[253px] relative border border-gray-700 overflow-hidden">
        <div className="w-full h-full bg-black flex items-center justify-center">
          <video className="w-full h-full" controls autoPlay loop>
            <source src={videoUrl} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  };


  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = alarmTranslate('location-information');

  const renderBody = () => (
  <div className="flex flex-col gap-6 p-0 tablet:px-4 tablet:py-6">

    {/* Top row */}
    <div className="tablet:grid grid-cols-2 gap-6 tablet:gap-12">
      <div className="bg-[#161B29] p-3">
        <CommonInfoLocation
          info={
            status === 'error'
              ? { ...openAlertPopup, status: 'CONFIRM' }
              : openAlertPopup
          }
        />
      </div>

      <div className="bg-[#0D1117]">
        {/* Full-width red header */}
        <div className="bg-[#FF6467] w-full py-3">
          <Typography variant="label1" className="text-white px-3 py-2">
            {t('alarm-page.warning')}
          </Typography>
        </div>

        {/* Content section with padding */}
        <div className="p-3 flex flex-col gap-4">
          {alarms.map((alarm) => (
            <Box className="border border-white" key={alarm.id}>
              {renderAlarmPanel(alarm)}
            </Box>
          ))}
        </div>
      </div>
    </div>
  
    {/* Video panel row (full width) */}
    <div className="bg-[#0D1117] p-3">
      <Typography variant="label1" className="text-white mb-2">
        Alarm Video
      </Typography>
      {renderVideoSection()}
    </div>

    {/* Device panel row (full width) */}
    <div className="bg-[#0D1117] p-3">
    {alarms.some((alarm) => alarm.alarms?.length > 0) && (
      <div className="flex flex-col gap-3 ">
        <Typography variant="label1" className='text-white'>Devices</Typography>
        <CarouselCustom>
          {alarms.flatMap((alarm) =>
            alarm.alarms.map((device) => (
              <div key={device.id} className="mx-2">
                {renderDeviceAlarmPanel(device)}
              </div>
            ))
          )}
        </CarouselCustom>
      </div>
    )}
    </div>

    {/* Dashboard row (full width) */}
    <div className="flex flex-col gap-3 bg-[#161B29] p-3">
      <Typography variant="label1" className="text-white">
        Dashboard
      </Typography>
      <div className="overflow-y-auto max-h-56 flex flex-col gap-1">
        {dashboards.length > 0 ? (
          dashboards.map((item) => (
            <MenuItem
              key={item.id}
              title={item.name}
              img={item.imageUrl}
              onClick={() => navigate(`/dashboard/${item.id}`)}
              tenantCode={tenantCode}
              data={item}
            />
          ))
        ) : (
          <Typography variant="body2" className="text-[var(--text-primary)]">
            No dashboards
          </Typography>
        )}
      </div>
    </div>

    {/* Camera row (full width) */}
    {cameraList?.length > 0 && (
      <div className="flex flex-col gap-3 bg-[#0D1117] p-3">
        <Typography variant="label1">Camera</Typography>
        <CarouselCustom>
          {cameraList.map((deviceInfo, index) => (
            <div key={index} className="mx-2">
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
    <div className=' h-[253px] relative'>
      <div className='w-full h-full bg-black '>
        <video ref={videoRef} className='w-full h-full ' />
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

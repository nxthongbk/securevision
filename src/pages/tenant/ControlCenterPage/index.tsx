import { Dialog, DialogTitle, IconButton, Typography, useMediaQuery } from '@mui/material';
import { difference, isEmpty } from 'lodash';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ListMagnifyingGlass } from '@phosphor-icons/react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { MapRef } from 'react-map-gl';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { AppContext } from '~/contexts/app.context';
import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import IconPhosphor from '~/assets/iconPhosphor';
import ListBuilding from './components/ListBuilding';
import MapRight from './components/Map';
import SearchBox from './components/SearchBox';
import Sound from '~/assets/videos/fire-alarm-33770.mp3';
import theme from '~/assets/theme';
import useDebounce from '~/utils/hooks/useDebounce';
import { useGetLocationMap } from './handleApi';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import LocationLog, { ILocationLog } from './components/LocationLog';

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function ControlCenterPage({
  onToggle,
  isCameraView
}: {
  onToggle: (checked: boolean) => void;
  isCameraView: boolean;
}) {
  const queryClient = useQueryClient();
  const { tenantCode } = useTenantCode();
  const { userInfo, setOpenMarkerPopup } = useContext(AppContext);
  const { t } = useTranslation();

  const alarmLocationIdsRef = useRef<string[]>([]);
  const hasNewAlarmRef = useRef<boolean>(false);
  const mapRef = useRef<MapRef>();
  const timeoutId = useRef<NodeJS.Timeout>();
  const stompClientRef = useRef<any>(null);

  const [keyword, setKeyword] = useState('');
  const keywordDebounce = useDebounce(keyword, 500);
  const { data } = useGetLocationMap({ tenantCode, keyword: keywordDebounce });
  const [socketData, setSocketData] = useState<any>();
  const [logs, setLogs] = useState<ILocationLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const locations = useMemo(() => data?.data?.content || [], [data?.data?.content]);

  // 🔌 WebSocket setup
  useEffect(() => {
    if (!userInfo?.tenant?.id) return;

    const topic = '/topic/' + userInfo?.tenant?.id;
    const connectHeaders = {};
    const socket = new SockJS(SOCKET_URL);
    let stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    const connectToSocket = () => {
      if (!stompClient.connected) {
        stompClient.connect(
          connectHeaders,
          () => {
            stompClient.subscribe(topic, (message) => {
              const body = JSON.parse(message.body);
              if (body.hasNewAlarm) {
                hasNewAlarmRef.current = true;
                if (timeoutId.current) {
                  clearTimeout(timeoutId.current);
                }
                timeoutId.current = setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ['locationMap'] });
                }, 1200);
              } else {
                setSocketData(body);
              }
            });
          },
          (error) => {
            console.error('WebSocket connection error:', error);
          }
        );
      }
    };

    connectToSocket();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          stompClient = null;
        });
      }
      stompClientRef.current = null;
    };
  }, [userInfo?.tenant?.id, queryClient]);

  // 🔔 Alarm detection and focus on map
  useEffect(() => {
    const locationIdsWithAlarmStatus = locations
      .filter((location) => location.status === 'ALARM')
      .map((item) => item.id);

    if (hasNewAlarmRef.current) {
      const differenceIds = difference(locationIdsWithAlarmStatus, alarmLocationIdsRef.current);
      if (!isEmpty(differenceIds)) {
        const locationId = differenceIds[0];
        const locationsData = locations.filter((location) => location.id === locationId);
        const locationData = locationsData[0];
        setSocketData(locationsData);
        if (locationData) {
          hasNewAlarmRef.current = false;
          const longitude = locationData?.location?.longitude;
          const latitude = locationData?.location?.latitude;
          mapRef.current?.easeTo({
            center: [longitude, latitude],
            zoom: 18,
            pitch: 55,
            bearing: 30,
            duration: 1500,
            curve: 1.5,
            offset: [0, 250],
            essential: true
          });
          setOpenMarkerPopup(locationData);
        }
      }
    }

    alarmLocationIdsRef.current = locationIdsWithAlarmStatus;
  }, [locations, setOpenMarkerPopup]);

  // 🔊 Alarm sound
  useEffect(() => {
    let alarmSound: HTMLAudioElement | null = null;

    const initializeSound = () => {
      if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
      }
      alarmSound = new Audio(Sound);
      alarmSound.loop = true;
    };

    const checkLocalStorage = () => {
      if (!alarmSound) initializeSound();

      const isBellRingAlarm = localStorage.getItem('isBellRingAlarm') === 'true';
      const newData = locations?.filter((item) => item.status === 'ALARM');

      if (isBellRingAlarm && newData.length > 0) {
        alarmSound?.play().catch(console.error);
      } else {
        if (alarmSound) {
          alarmSound.pause();
          alarmSound.currentTime = 2;
        }
      }
    };

    initializeSound();
    checkLocalStorage();

    window.addEventListener('storage', checkLocalStorage);
    window.addEventListener('localStorageChange', checkLocalStorage);

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('localStorageChange', checkLocalStorage);
      if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmSound = null;
      }
    };
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('isBellRingAlarm', 'false');
  }, []);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('tablet'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className='flex flex-col h-screen overflow-hidden relative'>
      {/* Header / search button for mobile */}
      <div className='block px-6 miniLaptop:hidden z-20 relative'>
        <DataGridHeader
          isSearch={false}
          setKeyword={setKeyword}
          btnPopup={
            <div onClick={handleDialogOpen} className='p-2 rounded-md bg-primary'>
              <ListMagnifyingGlass size={20} color='white' />
            </div>
          }
        />
      </div>

      {/* Full-screen map */}
      <div className='flex-1 relative w-full h-full'>
        <MapRight data={locations} socketData={socketData} mapRef={mapRef} setLogs={setLogs} />

        {/* Left panel with toggle */}
        {!isSmallScreen && (
          <div
            className='absolute top-[10%] left-4 overflow-auto z-10 backdrop-blur-none scrollbar-hide'
            style={{
              width: '320px',
              height: '80%',
              backgroundColor: '#030912A3',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              border: '1px solid #36BFFA3D'
            }}
          >
            {/* 🔘 Toggle control */}
            <div className='flex items-center justify-between px-4 py-2 border-b border-[#36BFFA3D] bg-[rgba(8,16,26,0.8)]'>
              <Typography variant='label2' className='text-[#36BFFA]'>
                {isCameraView ? 'Camera View' : 'Map View'}
              </Typography>
              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={isCameraView}
                  onChange={(e) => onToggle(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <ListBuilding data={locations} mapRef={mapRef} />
          </div>
        )}

        {/* Right panel for logs */}
        <div
          className='absolute top-[10%] right-4 overflow-hidden z-10 backdrop-blur-none'
          style={{
            width: '320px',
            height: '80%',
            backgroundColor: '#030912A3',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            border: '1px solid #36BFFA3D'
          }}
        >
          <div className='flex flex-col h-full'>
            {/* Sticky Header */}
            <div className='sticky top-0 z-10 px-2 py-2 bg-[rgba(8,16,26,0.9)] backdrop-blur'>
              <Typography variant='label2' className='tracking-wide text-[#36BFFA]'>
                {t('device-statistics')}
              </Typography>
            </div>

            {/* Scrollable logs */}
            <div ref={logContainerRef} className='flex-1 overflow-y-auto p-2'>
              {logs.map((log, index) => (
                <LocationLog key={index} log={log} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullScreen fullWidth className='rounded-md'>
        <div className='flex justify-between'>
          <DialogTitle>{t('list-location')}</DialogTitle>
          <IconButton onClick={handleDialogClose}>
            <IconPhosphor iconName='X' size={24} />
          </IconButton>
        </div>
        <div className='overflow-hidden px-4'>
          <SearchBox setKeyword={setKeyword} />
          <ListBuilding closeDialog={handleDialogClose} data={locations} mapRef={mapRef} />
        </div>
      </Dialog>
    </div>
  );
}

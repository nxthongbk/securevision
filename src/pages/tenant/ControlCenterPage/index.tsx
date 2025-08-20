import { Box, Dialog, DialogTitle, IconButton, useMediaQuery } from '@mui/material';
import { difference, isEmpty } from 'lodash';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import IconPhosphor from '~/assets/iconPhosphor';
import ListBuilding from './components/ListBuilding';
import { ListMagnifyingGlass } from '@phosphor-icons/react';
import { MapRef } from 'react-map-gl';
import MapRight from './components/Map/index';
import SearchBox from './components/SearchBox';
import SockJS from 'sockjs-client';
import Sound from '~/assets/videos/fire-alarm-33770.mp3';
import Stomp from 'stompjs';
import { popupStyles } from './styled';
import theme from '~/assets/theme';
import useDebounce from '~/utils/hooks/useDebounce';
import { useGetLocationMap } from './handleApi';
import { useQueryClient } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useTranslation } from 'react-i18next';

// import Filter from './components/Filter';

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function ControlCenterPage() {
  const queryClient = useQueryClient();
  const { tenantCode } = useTenantCode();
  const { userInfo, setOpenMarkerPopup } = useContext(AppContext);
  const { t } = useTranslation();
  const alarmLocationIdsRef = useRef<string[]>([]);
  const hasNewAlarmRef = useRef<boolean>(false);
  const mapRef = useRef<MapRef>();
  const [keyword, setKeyword] = useState('');
  const keywordDebounce = useDebounce(keyword, 500);
  const { data } = useGetLocationMap({ tenantCode, keyword: keywordDebounce });
  const timeoutId = useRef<NodeJS.Timeout>();
  const socket = new SockJS(SOCKET_URL);
  const [socketData, setSocketData] = useState<any>();

  const locations = useMemo(() => data?.data?.content || [], [data?.data?.content]);

  useEffect(() => {
    const topic = '/topic/' + userInfo?.tenant?.id;
    const connectHeaders = {};

    let stompClient = Stomp.over(socket);

    if (!stompClient.connected) {
      stompClient.connect(connectHeaders, () => {
        stompClient.subscribe(topic, (message) => {
          const body = JSON.parse(message.body);
          if (body.hasNewAlarm) {
            hasNewAlarmRef.current = true;
            timeoutId.current = setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ['locationMap'] });
            }, 1200);
          } else {
            setSocketData(body);
          }
        });
      });
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId.current);
      if (stompClient.connected) {
        stompClient.unsubscribe('sub-0');
        stompClient.disconnect(() => {
          stompClient = null;
        });
      }
    };
  }, []);

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
          mapRef.current?.flyTo({
            center: [locationData?.location?.longitude, locationData?.location?.latitude],
            duration: 1000,
            zoom: 14
          });
          setOpenMarkerPopup(locationData);
        }
      }
    }

    alarmLocationIdsRef.current = locationIdsWithAlarmStatus;
  }, [locations, setOpenMarkerPopup]);
  useEffect(() => {
    // Create an Audio object for the MP3 file
    const alarmSound = new Audio(Sound);
    // Set the alarm sound to loop
    alarmSound.loop = true;
    const checkLocalStorage = () => {
      const isBellRingAlarm = localStorage.getItem('isBellRingAlarm') === 'true';
      const newData = locations?.filter((item) => item.status === 'ALARM');
      if (isBellRingAlarm && newData.length > 0) {
        // Play the alarm sound
        alarmSound.play();
      } else {
        alarmSound.pause();
        alarmSound.currentTime = 2;
      }
    };

    // Check localStorage on component mount
    checkLocalStorage();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLocalStorage);

    // Add custom event listener for local changes
    window.addEventListener('localStorageChange', checkLocalStorage);

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('localStorageChange', checkLocalStorage);
      // Stop the alarm sound when the component unmounts
      alarmSound.pause();
      alarmSound.currentTime = 0;
    };
  }, [locations]);
  useEffect(() => {
    localStorage.setItem('isBellRingAlarm', 'false');
  }, []);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('tablet')); // State để quản lý trạng thái hiển thị
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State để quản lý trạng thái mở/đóng của dialog

  const handleDialogOpen = () => {
    setIsDialogOpen(true); // Mở dialog
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Đóng dialog
  };
  return (
    <div className={'overflow-hidden miniLaptop:flex block h-full'}>
      <div className='block px-6 miniLaptop:hidden'>
        <DataGridHeader
          isSearch={false}
          setKeyword={setKeyword}
          title={t('monitoring')}
          btnPopup={
            <div onClick={handleDialogOpen} className='p-2 rounded-md bg-primary'>
              <ListMagnifyingGlass size={20} color='white' />
            </div>
          }
        />
      </div>
      {!isSmallScreen && (
        <div className='pt-6 px-4 bg-[white] border-r border-[var(--border-color)] min-w-[320px]'>
          <SearchBox setKeyword={setKeyword} />
          <ListBuilding data={locations} mapRef={mapRef} />
        </div>
      )}
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullScreen fullWidth className='rounded-md'>
        <div className='flex justify-between'>
          <DialogTitle>{t('list-location')}</DialogTitle>
          <IconButton onClick={handleDialogClose}>
            <IconPhosphor iconName='X' size={24} />
          </IconButton>
        </div>
        <div className='overflow-hidden'>
          <div className='px-4'>
            <SearchBox setKeyword={setKeyword} />
            <ListBuilding closeDialog={handleDialogClose} data={locations} mapRef={mapRef} />
          </div>
        </div>
      </Dialog>
      <Box className='relative w-full miniLaptop:h-full h-[calc(100vh-56px)]' sx={popupStyles}>
        <MapRight data={locations} socketData={socketData} mapRef={mapRef} />
      </Box>
      {/* <audio autoPlay>
        <source
          src='C:\\Users\\nghialt\\Works\\tma\\repos\\sCity\\src\\assets\\videos\\fire-alarm-33770.mp3'
          type='audio/mpeg'
        />
      </audio> */}
    </div>
  );
}

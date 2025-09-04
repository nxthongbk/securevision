import { BellRinging, BellSlash } from '@phosphor-icons/react';
import { Button, Typography } from '@mui/material';
import LocationLog, { ILocationLog } from '../LocationLog';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import AlertPopup from '../Popup/AlertPopup';
import { AppContext } from '~/contexts/app.context';
import CancelPopup from '../Popup/CancelPopup';
import LocationPopup from '../Popup/LocationPopup';
import MapBox from '~/components/MapBox';
import MarkerMap from '../../../../../components/Marker';
import PendingPopup from '../Popup/PendingPopup';
import PopupMarker from '../Popup/PopupMarker';
import { useTranslation } from 'react-i18next';

function MapRight({ data, mapRef, socketData }: { data: any[]; mapRef: any; socketData: any }) {
  const [isBellRingAlarm, setIsBellRingAlarm] = useState(true);
  const { t } = useTranslation();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [logs, setLogs] = useState<ILocationLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference to the log container
  const {
    openLocationPopup,
    openCancelPopup,
    openAlertPopup,
    openMarkerPopup,
    openPendingPopup,
    viewportMapRight,
    setViewportMapRight,
    setOpenMarkerPopup,
    selectedFilter
  } = useContext(AppContext);

  useEffect(() => {
    if (!socketData) {
      return;
    }

    if (socketData.deviceId) {
      setLogs([...logs, { deviceSocketData: socketData }]);
    }

    if (socketData.length) {
      setLogs([
        ...logs,
        ...socketData.map((location) => ({ alarmSocketData: { locationName: location.name, timestamp: Date.now() } }))
      ]);
    }
  }, [location, socketData]);

  useEffect(() => {
    if (logs.length > 100) {
      setLogs(logs.slice(-50));
    }
  }, [logs]);

  useEffect(() => {
    // Scroll to bottom whenever logs change
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth' // Enables smooth scrolling
      });
    }
  }, [logs]);

  const onLoadMap = useCallback((evt: mapboxgl.MapboxEvent) => {
    setMap(evt?.target);
  }, []);

  const markerData = useMemo(
    () => data?.filter((item) => [...selectedFilter].includes(item.status)) || [],
    [data, selectedFilter]
  );

  const coordinates = useMemo(
    () => markerData.map((marker) => [marker?.location?.longitude, marker?.location?.latitude]),
    [markerData]
  ) as LngLatLike[];

  useEffect(() => {
    if (map) {
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
      for (const coord of coordinates) {
        bounds.extend(coord);
      }
      if (bounds['_ne'] && bounds['_sw']) {
        map.fitBounds(bounds, {
          padding: {
            top: 100,
            bottom: 20,
            left: 20,
            right: 20
          }
        });
      }
    }
  }, [coordinates, map]);
  const handleButtonClick = () => {
    const newValue = !isBellRingAlarm;
    setIsBellRingAlarm(newValue);

    localStorage.setItem('isBellRingAlarm', newValue.toString());
    window.dispatchEvent(new Event('localStorageChange'));
  };
  useEffect(() => {
    const checkLocalStorage = () => {
      const isBellRingAlarm = localStorage.getItem('isBellRingAlarm') === 'true';
      setIsBellRingAlarm(isBellRingAlarm);
    };
    checkLocalStorage();
    window.addEventListener('storage', checkLocalStorage);
    window.addEventListener('localStorageChange', checkLocalStorage);
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('localStorageChange', checkLocalStorage);
    };
  }, []);
  const [isSatelliteView, setIsSatelliteView] = useState(false);

  const handleToggleView = () => {
    setIsSatelliteView(!isSatelliteView);
  };

  return (
    <MapBox
      ref={mapRef}
      initialViewState={viewportMapRight}
      onMove={(evt) => setViewportMapRight(evt.viewState)}
      onLoad={onLoadMap}
      mapStyle={isSatelliteView ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12'}
    >
      {markerData?.map((item) => (
        <MarkerMap
          key={item.id}
          status={item?.status}
          longitude={item?.location?.longitude}
          latitude={item?.location?.latitude}
          avatarUrl={item?.imageUrl}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setOpenMarkerPopup(item);
          }}
        />
      ))}

      {openMarkerPopup && <PopupMarker />}
      {openLocationPopup && <LocationPopup />}
      {openCancelPopup && <CancelPopup />}
      {openAlertPopup && <AlertPopup />}
      {openPendingPopup && <PendingPopup />}

      <div className='absolute flex flex-col top-4 right-4 rounded-lg bg-opacity-70 bg-blue-200 p-2 z-50 w-fit'>
        <div className='flex flex-row justify-center items-center z-50'>
          {/* <Button
            onClick={handleToggleView}
            variant='text'
            color='primary'
            sx={{
              padding: '10px',
              zIndex: 1
            }}
          >
            <img
              className='w-10 h-10'
              src={
                isSatelliteView
                  ? 'https://maps.gstatic.com/tactile/layerswitcher/ic_satellite-1x.png'
                  : 'https://maps.gstatic.com/tactile/layerswitcher/ic_default_colors2-1x.png'
              }
            />
          </Button> */}
          {/* <Button
            className={`!px-6 ${!isBellRingAlarm && '!bg-[var(--grey-primary-100)]'} `}
            onClick={handleButtonClick}
            variant='contained'
            startIcon={isBellRingAlarm ? <BellRinging size={18} /> : <BellSlash size={18} />}
            sx={{
              padding: '10px',
              zIndex: 1
            }}
          >
            <Typography variant='button3' fontWeight={600}>
              {t('alram-ring')}
            </Typography>
          </Button> */}
        </div>
        {/* <div ref={logContainerRef} className='flex flex-col overflow-y-scroll w-[320px] max-h-[700px]'>
          {logs?.map((log) => <LocationLog log={log} />)}
        </div> */}
      </div>
    </MapBox>
  );
}

export default MapRight;

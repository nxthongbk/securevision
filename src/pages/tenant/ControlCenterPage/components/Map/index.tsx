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

function MapRight({
  data,
  mapRef,
  socketData,
  setLogs // accept logs setter
}: {
  data: any[];
  mapRef: any;
  socketData: any;
  setLogs: React.Dispatch<React.SetStateAction<ILocationLog[]>>;
}) {
  const [isBellRingAlarm, setIsBellRingAlarm] = useState(true);
  const { t } = useTranslation();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null); // optional if needed for scrolling

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

  // Update logs from socket
  useEffect(() => {
    if (!socketData) return;

    if (socketData.deviceId) {
      setLogs((prev) => [...prev, { deviceSocketData: socketData }]);
    }

    if (socketData.length) {
      setLogs((prev) => [
        ...prev,
        ...socketData.map((location) => ({
          alarmSocketData: { locationName: location.name, timestamp: Date.now() }
        }))
      ]);
    }
  }, [socketData]);

  useEffect(() => {
    // keep logs capped at 100
    setLogs((prev) => (prev.length > 100 ? prev.slice(-50) : prev));
  }, [socketData]);

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
  ) as mapboxgl.LngLatLike[];

  useEffect(() => {
    if (map && coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
      for (const coord of coordinates) bounds.extend(coord);
      if (bounds['_ne'] && bounds['_sw']) {
        map.fitBounds(bounds, { padding: { top: 150, bottom: 20, left: 20, right: 20 }, maxZoom: 13});
      }
    }
  }, [coordinates, map]);

  const [isSatelliteView, setIsSatelliteView] = useState(false);

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
    </MapBox>
  );
}

export default MapRight;



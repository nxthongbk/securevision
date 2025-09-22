import { ILocationLog } from '../LocationLog';
import mapboxgl from 'mapbox-gl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import AlertPopup from '../Popup/AlertPopup';
import { AppContext } from '~/contexts/app.context';
import CancelPopup from '../Popup/CancelPopup';
import LocationPopup from '../Popup/LocationPopup';
import MapBox from '~/components/MapBox';
import PendingPopup from '../Popup/PendingPopup';
import PopupMarker from '../Popup/PopupMarker';
import './style.css';

function MapRight({
  data,
  mapRef,
  socketData,
  setLogs
}: {
  data: any[];
  mapRef: any;
  socketData: any;
  setLogs: React.Dispatch<React.SetStateAction<ILocationLog[]>>;
}) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const initialFitDoneRef = useRef(false); // <-- ensure fitBounds only runs once

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

  // 🟢 Add pins whenever markerData changes (native markers)
  useEffect(() => {
    if (!map) return;

    const markers: mapboxgl.Marker[] = [];

    markerData.forEach((item) => {
      const el = document.createElement('div');
      el.className = item.status === 'ALARM' ? 'alarm-marker' : 'normal-marker';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([item?.location?.longitude, item?.location?.latitude])
        .addTo(map);

      // Click handler: fly to marker (center + offset) and open popup
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // center marker + offset so popup sits nicely centered
        map.flyTo({
          center: [item.location.longitude, item.location.latitude],
          zoom: 17,
          speed: 1.2,
          curve: 1.4,
          
        });

        setOpenMarkerPopup(item);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, markerData, setOpenMarkerPopup]);

  // 🗺️ Fit bounds — run only once when map + coordinates first appear
  useEffect(() => {
    if (!map) return;
    if (!coordinates || coordinates.length === 0) return;
    if (initialFitDoneRef.current) return; // already fitted once

    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
    for (const coord of coordinates) bounds.extend(coord);

    // check bounds validity
    if (!bounds || (bounds && bounds.isEmpty && bounds.isEmpty())) return;

    // do initial fit (symmetric padding so it actually centers visually)
    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 60, right: 60 },
      maxZoom: 13
    });

    initialFitDoneRef.current = true;
    // helpful debug
    // console.log('initial fitBounds applied');
  }, [map, coordinates]);

  // If you still want a dynamic fit when there are no previous markers, you can later clear `initialFitDoneRef.current = false`

  return (
    <MapBox
      ref={mapRef}
      initialViewState={viewportMapRight}
      onMove={(evt) => setViewportMapRight(evt.viewState)}
      onLoad={onLoadMap}
    >
      {openMarkerPopup && <PopupMarker />}
      {openLocationPopup && <LocationPopup />}
      {openCancelPopup && <CancelPopup />}
      {openAlertPopup && <AlertPopup />}
      {openPendingPopup && <PendingPopup />}
    </MapBox>
  );
}

export default MapRight;

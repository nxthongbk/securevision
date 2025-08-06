import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

import lampIconActive from '~/assets/images/png/activeLight.png';
import lampIconError from '~/assets/images/png/alertLight.png';
import lampIconWarning from '~/assets/images/png/maintanceLight.png';

import cctvIconActive from '~/assets/images/png/cctvIconActive.png';
import cctvIconError from '~/assets/images/png/cctvIconError.png';
import cctvIconWarning from '~/assets/images/png/cctvIconWarning.png';

export type DeviceItems = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
  status: 'Active' | 'Offline' | 'Maintenance' | 'Error' | 'Alarm';
  latitude?: string | number;
  longitude?: string | number;
  ['north/south']?: string;
  ['east/west']?: string;
  type: 'streetlight' | 'cctv' | 'firealarm';
};

// Define default location
const DEFAULT_LOCATION = {
  lat: 10.853397686226927,
  lng: 106.62823723344383,
};

const iconMap = {
  cctv: {
    Active: cctvIconActive,
    Error: cctvIconError,
    Maintenance: cctvIconWarning,
    Offline: cctvIconError,
    Alarm: cctvIconError,
    Default: cctvIconActive,
  },
  streetlight: {
    Active: lampIconActive,
    Error: lampIconError,
    Maintenance: lampIconWarning,
    Offline: lampIconError,
    Alarm: lampIconError,
    Default: lampIconActive,
  },
  firealarm: {
    Active: cctvIconActive,
    Error: cctvIconError,
    Maintenance: cctvIconWarning,
    Offline: cctvIconError,
    Alarm: cctvIconError,
    Default: cctvIconActive,
  },
};

export const getDeviceIcon = (type: string, status: string) => {
  return iconMap[type][status] || iconMap[type].Default;
};

interface CustomMapProps {
  initialCenter: {
    lat: number;
    lng: number;
  };
  mapRef?: any;
  socketData?: any;
  listOfDevices?: DeviceItems[];
  setListOfDevices?: React.Dispatch<React.SetStateAction<DeviceItems[]>>;
  openMarkerId?: string | null;
  setOpenMarkerId?: (id: string | null) => void;
}

function MapInstanceSetter({ setMap }: { setMap: (map: any) => void }) {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map]);
  return null;
}

function extractValuesOnly(data: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in data) {
    if (typeof data[key] === 'object' && data[key] !== null && 'value' in data[key]) {
      result[key] = data[key].value;
    } else {
      result[key] = data[key];
    }
  }
  return result;
}

const iconCache: Record<string, L.Icon> = {};

function getCachedIcon(type: string, status: string) {
  const key = `${type}_${status}`;
  if (!iconCache[key]) {
    iconCache[key] = new L.Icon({
      iconUrl: getDeviceIcon(type, status),
      iconSize: [65, 95],
    });
  }
  return iconCache[key];
}

const animatedErrorIconCache: Record<string, L.DivIcon> = {};

function getAnimatedErrorIcon(type: string) {
  if (!animatedErrorIconCache[type]) {
    animatedErrorIconCache[type] = L.divIcon({
      className: 'custom-marker-icon error-animate',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; ">
          <img src="${getDeviceIcon(type, 'Error')}" style="width:65px;height:95px;" class="custom-marker-icon error-animate" />
        </div>
      `,
      iconSize: [65, 110],
      iconAnchor: [32, 104],
    });
  }
  return animatedErrorIconCache[type];
}

export default function DeviceMapContainer({
  initialCenter,
  mapRef,
  socketData,
  listOfDevices = [],
  setListOfDevices,
  openMarkerId,
  setOpenMarkerId,
}: CustomMapProps) {
  const [center] = useState(initialCenter || DEFAULT_LOCATION);
  const [map, setMap] = useState<any>(null);
  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});
  const [hasAutoCentered, setHasAutoCentered] = useState(false);

  useEffect(() => {
    if (!socketData || !setListOfDevices) return;

    const cleanedSocketData = extractValuesOnly(socketData) as any;

    const lat = cleanedSocketData.latitude;
    const lon = cleanedSocketData.longitude;
    if (!lat || !lon || lat === 'null' || lon === 'null') return;

    setListOfDevices(prev => {
      const index = prev.findIndex(item => item.id === cleanedSocketData.deviceId);
      if (index === -1) return prev;

      const oldItem = prev[index];
      const oldLat = oldItem.latitude;
      const oldLon = oldItem.longitude;

      const hasMoved =
        parseFloat(oldLat as any) !== parseFloat(lat) ||
        parseFloat(oldLon as any) !== parseFloat(lon);

      if (!hasMoved) return prev;

      const updated = [...prev];
      updated[index] = { ...oldItem, ...cleanedSocketData };
      return updated;
    });
  }, [socketData, setListOfDevices]);

  // Compute convex hull polygon from current device positions
  // const polygonCoords = useMemo(() => {
  //   if (!listOfDevices.length) return [];
  //   const points = listOfDevices
  //     .filter(
  //       light =>
  //         typeof light.lat === 'number' &&
  //         typeof light.lng === 'number' &&
  //         !isNaN(light.lat) &&
  //         !isNaN(light.lng)
  //     )
  //     .map(light => [light.lng, light.lat]);
  //   if (points.length < 3) return [];
  //   const featureCollection = turf.featureCollection(points.map(pt => turf.point(pt)));
  //   const hull = turf.convex(featureCollection);
  //   return hull
  //     ? hull.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])
  //     : points.map(([lng, lat]) => [lat, lng]);
  // }, [listOfDevices]);

  useEffect(() => {
    if (map && listOfDevices.length && !hasAutoCentered) {
      const bounds = L.latLngBounds(listOfDevices.map(item => [item.lat ?? 0, item.lng ?? 0]));
      map.fitBounds(bounds, { padding: [50, 50] });
      setHasAutoCentered(true);
    }
  }, [map, listOfDevices, hasAutoCentered]);

  useEffect(() => {
    if (map && openMarkerId && markerRefs.current[openMarkerId]) {
      const marker = markerRefs.current[openMarkerId];
      // Only fly if the popup is not already open (prevents repeated flyTo)
      if (!marker.isPopupOpen()) {
        // @ts-ignore
        map.flyTo(marker.getLatLng(), 17, { duration: 1.2 });
        marker.openPopup();
      }
    }
  }, [openMarkerId, map]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100vh', width: '100%', zIndex: 1 }}
      ref={mapRef as any}
      minZoom={10}
      maxZoom={18}
    >
      {/* <TileLayer url="http://192.168.12.10:8089/tile/{z}/{x}/{y}.png" /> */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* <TileLayer url="http://14.161.14.155:8081/tile/{z}/{x}/{y}.png" /> */}
      {/* <MapEventHandler onMoveEnd={handleMoveEnd} /> */}
      <MapInstanceSetter setMap={setMap} />

      {/* {polygonCoords.length > 2 && (
        <Polygon
          positions={polygonCoords as [number, number][]}
          pathOptions={{
            color: '#36bffa',
            fillColor: '#36bffa',
            fillOpacity: 0.2,
            weight: 2,
            opacity: 0.8,
            dashArray: '2',
          }}
        />
      )} */}

      {listOfDevices?.map((item, index) => {
        if (!item.lat || !item.lng) return null;
        const isError = item.status === 'Error';
        const markerIcon = isError
          ? getAnimatedErrorIcon(item.type)
          : getCachedIcon(item.type, item.status);

        return (
          <Marker
            key={item?.id || index}
            position={[item.lat, item.lng]}
            icon={markerIcon}
            ref={ref => {
              if (ref && item.id) {
                markerRefs.current[item.id] = ref;
              }
            }}
            eventHandlers={{
              click: () =>
                setOpenMarkerId && setOpenMarkerId(openMarkerId === item.id ? null : item.id),
              popupclose: () => setOpenMarkerId && setOpenMarkerId(null),
            }}
          >
            <Popup>
              <strong>
                {item.type === 'cctv'
                  ? `CCTV #${item.id}`
                  : item.type === 'streetlight'
                    ? `Streetlight #${item.id}`
                    : item.type === 'firealarm'
                      ? `Device #${item.name}`
                      : `Device #${item.id}`}
              </strong>
              <br />
              Status: {item.status}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

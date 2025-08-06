import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useContext, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { AppContext } from '~/contexts/app.context';
import type { LatLngTuple } from 'leaflet';

// Define default location
const DEFAULT_LOCATION = {
  lat: 10.853397686226927,
  lng: 106.62823723344383,
};

function convertNMEAToDecimal(coord: string): number {
  const value = parseFloat(coord);
  const degrees = Math.floor(value / 100);
  const minutes = value % 100;
  return degrees + minutes / 60;
}

interface CustomMapProps {
  initialCenter: {
    lat: number;
    lng: number;
  };
  mapRef?: any;
  socketData?: any;
}

function MapEventHandler({ onMoveEnd }: { onMoveEnd: (center: any) => void }) {
  useMapEvents({
    moveend: e => {
      const center = e.target.getCenter();
      onMoveEnd(center);
    },
  });
  return null;
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

export default function CustomMap({ initialCenter, mapRef, socketData }: CustomMapProps) {
  const { listOfDevices, setListOfDevices, openMarkerPopup, setOpenMarkerPopup } =
    useContext(AppContext);
  const [center, setCenter] = useState(initialCenter || DEFAULT_LOCATION);
  const [map, setMap] = useState<any>(null);

  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});

  useEffect(() => {
    if (!socketData) return;

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
        parseFloat(oldLat) !== parseFloat(lat) || parseFloat(oldLon) !== parseFloat(lon);

      if (!hasMoved) return prev;

      const updated = [...prev];
      updated[index] = { ...oldItem, ...cleanedSocketData };
      return updated;
    });
  }, [socketData]);

  const handleMoveEnd = newCenter => {
    if (center.lat !== newCenter.lat || center.lng !== newCenter.lng) {
      setCenter(newCenter);
    }
  };

  const getValidCoordinates = (
    lonStr?: string,
    latStr?: string,
    northSouth?: string,
    eastWest?: string
  ) => {
    let lng = DEFAULT_LOCATION.lng;
    let lat = DEFAULT_LOCATION.lat;

    if (lonStr && latStr) {
      const convertedLng = convertNMEAToDecimal(lonStr);
      const convertedLat = convertNMEAToDecimal(latStr);
      if (
        isFinite(convertedLng) &&
        isFinite(convertedLat) &&
        convertedLng >= -180 &&
        convertedLng <= 180 &&
        convertedLat >= -90 &&
        convertedLat <= 90
      ) {
        lng = convertedLng;
        lat = convertedLat;

        if (northSouth === 'S') lat *= -1;
        if (eastWest === 'W') lng *= -1;
      }
    }

    return { lng, lat };
  };

  const coordinates: LatLngTuple[] = useMemo(() => {
    if (!socketData?.deviceId) return [];

    const latestDevice = listOfDevices.find(item => item.id === socketData.deviceId);
    const lonStr = latestDevice?.longitude;
    const latStr = latestDevice?.latitude;

    if (!lonStr || !latStr) return [];

    const lon = typeof lonStr === 'string' ? convertNMEAToDecimal(lonStr) : lonStr;
    const lat = typeof latStr === 'string' ? convertNMEAToDecimal(latStr) : latStr;

    if (!isFinite(lat) || !isFinite(lon) || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      return [];
    }

    return [[lat, lon]];
  }, [listOfDevices, socketData?.deviceId]);

  useEffect(() => {
    if (map && coordinates.length) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, {
        paddingTopLeft: [20, 100],
        paddingBottomRight: [20, 20],
      });
    }
  }, [coordinates, map]);

  useEffect(() => {
    if (openMarkerPopup && markerRefs.current[openMarkerPopup.id]) {
      markerRefs.current[openMarkerPopup.id].openPopup();
    }
  }, [openMarkerPopup, listOfDevices]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100vh', width: '100%', zIndex: 1 }}
      ref={mapRef as any}
    >
      {/* <TileLayer url="http://192.168.12.10:8089/tile/{z}/{x}/{y}.png" /> */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* <TileLayer url="http://14.161.14.155:8081/tile/{z}/{x}/{y}.png" /> */}
      <MapEventHandler onMoveEnd={handleMoveEnd} />
      <MapInstanceSetter setMap={setMap} />

      {listOfDevices?.map((item, index) => {
        const { lat, lng } = getValidCoordinates(
          item?.longitude,
          item?.latitude,
          item?.['north/south'],
          item?.['east/west']
        );

        return (
          <Marker
            key={item?.id || index}
            position={[lat, lng]}
            ref={ref => {
              if (ref && item.id) {
                markerRefs.current[item.id] = ref;
              }
            }}
            eventHandlers={{
              click: () => setOpenMarkerPopup(item),
            }}
          >
            <Popup>
              <div>
                <strong>{item?.name || 'No name'}</strong>
                <br />
                IP: {item?.ip_address || '192.168.1.23'}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

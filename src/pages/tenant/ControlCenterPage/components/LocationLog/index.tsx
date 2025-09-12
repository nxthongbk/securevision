import { FormatTime } from '~/utils/formatDateTime';
import { WifiHigh, WifiMedium, WifiLow, Plug, BatteryLow, BatteryMedium, BatteryFull } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import deviceService from '~/services/device.service';

export interface SocketData {
  ts: number;
  value: any;
}

export interface DeviceSocketData {
  deviceId: string;
  token: string;
  fa_signal: SocketData;
  data_percentBat: SocketData;
  data_isPower: SocketData;
}

export interface AlarmSocketData {
  locationName: string;
  timestamp: number;
}

export interface ILocationLog {
  alarmSocketData?: AlarmSocketData;
  deviceSocketData?: DeviceSocketData;
}

export interface LocationLogProps {
  log: ILocationLog;
}

const LocationLog = (props: LocationLogProps) => {
  const { log } = props;
  const [locationName, setLocationName] = useState<string>(log.alarmSocketData?.locationName || 'Loading...');

  useEffect(() => {
    const fetchLocationName = async () => {
      if (log.deviceSocketData?.deviceId) {
        const device = await deviceService.getDeviceById(log.deviceSocketData.deviceId);
        setLocationName(device?.data?.locationInfo?.name || 'Unknown Location');
      }
    };
    fetchLocationName();
  }, [log.deviceSocketData]);

  const getColor = (value: number, type: 'wifi' | 'battery') => {
    if (value <= 15 && type === 'wifi') return '#B61B00';
    if (value <= 20 && type === 'battery') return '#B61B00';
    if (value <= 25 && type === 'wifi') return '#FFD230';
    if (value <= 80 && type === 'battery') return '#FFD230';
    return '#46ECD5';
  };

  const getBatteryIcon = (percentage: number) => {
    const color = getColor(percentage, 'battery');
    if (percentage <= 20) return <BatteryLow size={24} weight="bold" color={color} />;
    if (percentage <= 80) return <BatteryMedium size={24} weight="bold" color={color} />;
    return <BatteryFull size={24} weight="bold" color={color} />;
  };

  const getWifiIcon = (signalStrength: number) => {
    const color = getColor(signalStrength, 'wifi');
    if (signalStrength <= 15) return <WifiLow size={24} weight="bold" color={color} />;
    if (signalStrength <= 25) return <WifiMedium size={24} weight="bold" color={color} />;
    return <WifiHigh size={24} weight="bold" color={color} />;
  };

  const powerIcon = (value: boolean) => {
    const color = value ? '#46ECD5' : '#B61B00';
    return <Plug size={24} weight="bold" color={color} />;
  };

  // Public folder URLs
  const LogCardSvg = '/assets/uisvg/LogsSVG/logs.svg';
  const WifiHighIcon = '/assets/uisvg/LogsSVG/detailsHigh.svg';
  const WifiMedIcon = '/assets/uisvg/LogsSVG/detailsMed.svg';
  const WifiLowIcon = '/assets/uisvg/LogsSVG/detailsLow.svg';
  const BatteryFullIcon = '/assets/uisvg/LogsSVG/detailsHigh.svg';
  const BatteryMedIcon = '/assets/uisvg/LogsSVG/detailsMed.svg';
  const BatteryLowIcon = '/assets/uisvg/LogsSVG/detailsLow.svg';
  const PlugIcon = '/assets/uisvg/LogsSVG/detailsHigh.svg';

  if (log.deviceSocketData) {
    const { deviceId, fa_signal, data_isPower, data_percentBat } = log.deviceSocketData;
    if (!(deviceId && fa_signal && data_isPower && data_percentBat)) return null;

    const timestamp = FormatTime(fa_signal.ts);

    return (
      <div
        className="flex flex-col gap-1 my-2 w-full flex-none"
        style={{
          height: '178px',
          backgroundImage: `url(${LogCardSvg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="flex flex-col px-2 gap-1">
          <h4 className="text-lg font-semibold text-[#74D4FF] truncate">{locationName}</h4>
          <p className="text-xs font-medium text-[#74D4FF] truncate">Device ID</p>
          <p className="text-sm text-white truncate">{deviceId}</p>
          <p className="text-xs font-medium text-[#74D4FF] truncate">Last Updated</p>
          <p className="text-sm text-white truncate">{timestamp}</p>
        </div>

        {/* Device info */}
        <div className="flex flex-row justify-around -gap-x-2 flex-none -mt-2">
          {/* WiFi */}
          <div
            className="flex items-center justify-center gap-2 p-3 flex-none"
            style={{
              width: '80px',
              height: '80px',
              backgroundImage: `url(${
                fa_signal?.value <= 15
                  ? WifiLowIcon
                  : fa_signal?.value <= 25
                  ? WifiMedIcon
                  : WifiHighIcon
              })`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%'
            }}
          >
            {getWifiIcon(fa_signal?.value)}
            <p className="text-sm truncate" style={{ color: getColor(fa_signal?.value, 'wifi') }}>
              {fa_signal?.value}
            </p>
          </div>

          {/* Power */}
          <div
            className="flex items-center justify-center gap-2 p-3 flex-none"
            style={{
              width: '80px',
              height: '80px',
              backgroundImage: `url(${PlugIcon})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%'
            }}
          >
            {powerIcon(data_isPower?.value)}
            <p className="text-sm truncate" style={{ color: data_isPower?.value ? '#46ECD5' : '#B61B00' }}>
              {data_isPower?.value ? 'On' : 'Off'}
            </p>
          </div>

          {/* Battery */}
          <div
            className="flex items-center justify-center gap-2 p-3 flex-none"
            style={{
              width: '80px',
              height: '80px',
              backgroundImage: `url(${
                data_percentBat?.value <= 20
                  ? BatteryLowIcon
                  : data_percentBat?.value <= 80
                  ? BatteryMedIcon
                  : BatteryFullIcon
              })`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%'
            }}
          >
            {getBatteryIcon(data_percentBat?.value)}
            <p className="text-sm truncate" style={{ color: getColor(data_percentBat?.value, 'battery') }}>
              {`${data_percentBat?.value}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (log.alarmSocketData) {
    const timestamp = FormatTime(log.alarmSocketData.timestamp);

    return (
      <div className="flex flex-col p-2 border rounded-md bg-gray-50 bg-opacity-70 shadow-sm gap-2 my-2">
        <div className="flex flex-row justify-between items-center">
          <h4 className="text-lg font-semibold text-red-500">{log.alarmSocketData.locationName}</h4>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LocationLog;

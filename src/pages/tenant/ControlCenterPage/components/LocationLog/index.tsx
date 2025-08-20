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

  // Utility functions for determining icons based on values
  const getBatteryIcon = (percentage: number) => {
    if (percentage <= 20) return <BatteryLow size={24} weight='bold' className='text-red-500' />;
    if (percentage <= 80) return <BatteryMedium size={24} weight='bold' className='text-yellow-500' />;
    return <BatteryFull size={24} weight='bold' className='text-green-500' />;
  };

  const getWifiIcon = (signalStrength: number) => {
    if (signalStrength <= 15) return <WifiLow size={24} weight='bold' className='text-red-500' />;
    if (signalStrength <= 25) return <WifiMedium size={24} weight='bold' className='text-yellow-500' />;
    return <WifiHigh size={24} weight='bold' className='text-green-500' />;
  };

  const powerIcon = (value: boolean) =>
    value ? (
      <Plug size={24} weight='bold' className='text-green-500' />
    ) : (
      <Plug size={24} weight='bold' className='text-red-500' />
    );

  if (log.deviceSocketData) {
    const { deviceId, fa_signal, data_isPower, data_percentBat } = log.deviceSocketData;

    if (!(deviceId && fa_signal && data_isPower && data_percentBat)) {
      return null
    }

    const timestamp = FormatTime(fa_signal.ts);

    return (
      <div className='flex flex-col p-2 border rounded-md bg-blue-50 bg-opacity-90 shadow-sm gap-2 my-2'>
        <div className='flex flex-row'>
          <h4 className='text-lg font-semibold text-gray-800 ml-1'>{locationName}</h4>
          <p className='text-sm text-gray-500 min-w-36 ml-auto mt-1'>{timestamp}</p>
        </div>
        <div className='bg-gray-50 p-2 flex flex-col gap-1 rounded-md'>
          <p className='text-sm text-gray-500 italic text-center'>{deviceId}</p>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='p-2 bg-gray-100 rounded-md shadow-sm flex flex-row justify-center items-center gap-2'>
              {getWifiIcon(fa_signal?.value)}
              <p className='text-sm text-gray-600'>{fa_signal?.value}</p>
            </div>
            <div className='p-2 bg-gray-100 rounded-md shadow-sm flex flex-col items-center'>
              {powerIcon(data_isPower?.value)}
            </div>
            <div className='p-2 bg-gray-100 rounded-md shadow-sm flex flex-row justify-center items-center gap-2'>
              {getBatteryIcon(data_percentBat?.value)}
              <p className='text-sm text-gray-600'>{`${data_percentBat?.value}%`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (log.alarmSocketData) {
    const timestamp = FormatTime(log.alarmSocketData.timestamp);

    return (
      <div className='flex flex-col p-2 border rounded-md bg-gray-50 bg-opacity-70 shadow-sm gap-2 my-2'>
        <div className='flex flex-row justify-between items-center'>
          <h4 className='text-lg font-semibold text-red-500'>{log.alarmSocketData.locationName}</h4>
          <p className='text-sm text-gray-500'>{timestamp}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LocationLog;

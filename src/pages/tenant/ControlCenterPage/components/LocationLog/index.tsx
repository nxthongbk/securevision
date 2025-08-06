import { FormatTime } from '~/utils/formatDateTime';
import { Car } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import deviceService from '~/services/device.service';
import { Image } from '@phosphor-icons/react';
import fileStorageService from '~/services/fileStorage.service';
import { useQuery } from '@tanstack/react-query';

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
  licensePlate: SocketData;
  image: SocketData;
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

  const carIcon = (value: boolean) =>
    value ? (
      <Car size={24} weight='bold' className='text-green-500' />
    ) : (
      <Car size={24} weight='bold' className='text-red-500' />
    );

  const imageFileName = log.deviceSocketData?.image?.value;

  const { data: img } = useQuery({
    queryKey: ['userImg', imageFileName],
    queryFn: async () => {
      if (!imageFileName) return '';
      const res: any = await fileStorageService.getFileImage(imageFileName);
      if (res) {
        return URL.createObjectURL(res);
      }
      return '';
    },
    enabled: !!imageFileName
  });

  if (log.deviceSocketData) {
    const { deviceId, licensePlate } = log.deviceSocketData;

    if (!(licensePlate && imageFileName)) {
      return null;
    }

    return (
      <div className='flex flex-col p-2 border rounded-md bg-blue-50 bg-opacity-90 shadow-sm gap-2 my-2'>
        <div className='flex flex-row'>
          <h4 className='text-lg font-semibold text-gray-800 ml-1'>{locationName}</h4>
        </div>
        <div className='bg-gray-50 p-2 flex flex-col gap-1 rounded-md'>
          <p className='text-sm text-gray-500 italic text-center'>{deviceId}</p>
          <div className='grid grid-cols-1 gap-4 text-center'>
            <div className='p-2 bg-gray-100 rounded-md shadow-sm flex flex-row justify-center items-center gap-2'>
              {carIcon(licensePlate?.value)}
              <p className='text-sm text-gray-600'>{`${licensePlate?.value}`}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 text-center'>
            <div className='p-2 bg-gray-100 rounded-md shadow-sm flex flex-row justify-center items-center gap-2'>
              {img ? (
                <img src={img} alt='' className='w-full max-w-xs h-auto rounded-md shadow' />
              ) : (
                <div className='w-full flex justify-center p-10 bg-[var(--grey-primary-40)]'>
                  {' '}
                  <Image className='text-[#7490AA]' size={44} />
                </div>
              )}
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

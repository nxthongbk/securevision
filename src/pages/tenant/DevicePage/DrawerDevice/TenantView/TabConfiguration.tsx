// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import { useGetLatestTelemetry } from '../../handleApi';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';

interface IProps {
  deviceId: string;
  deviceName?: string;
}

export default function TabConfiguration(props: IProps) {
  const { deviceId } = props;
  // const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  // const [keyword, setKeyword] = useState<string>('');
  // const [page, setPage] = useState<number>(1);
  // const [size, setSize] = useState<number>(10);
  // const { heightWindow } = useWindowDimensions();

  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId
  });

  const { rows } = useSocketLatestTelemetry({
    dependency: [deviceId],
    topic: `/topic/${deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });

  const partitionsTelemetry = rows?.find((row) => row.key === 'partitions');

  let partitionList: any[] = [];
  if (partitionsTelemetry?.value) {
    try {
      const parsed = JSON.parse(partitionsTelemetry.value);
      if (Array.isArray(parsed.value)) {
        partitionList = parsed.value;
      }
    } catch (e) {
      partitionList = [];
    }
  }

  const zonesTelemetry = rows?.find((row) => row.key === 'zones');
  let zoneList: any[] = [];
  if (zonesTelemetry?.value) {
    try {
      const parsed = JSON.parse(zonesTelemetry.value);
      if (Array.isArray(parsed.value)) {
        zoneList = parsed.value;
      }
    } catch (e) {
      zoneList = [];
    }
  }

  return (
    <div className='w-full flex flex-col justify-start'>
      <div className='mb-2 font-bold text-lg'>Partitions</div>

      <div className='flex gap-4 mb-6'>
        {partitionList.map((p) => (
          <div key={p.id} className='bg-white rounded-lg shadow p-4 min-w-[200px] flex flex-col items-center'>
            <div className='font-semibold mb-2'>{p.name}</div>
            <div
              className={`px-3 py-1 rounded-full text-white text-sm font-bold mb-2 ${
                p.status[0] === 'Disarmed'
                  ? 'bg-green-400'
                  : p.status[0] === 'Armed'
                    ? 'bg-red-400'
                    : p.status[0] === 'Partial'
                      ? 'bg-yellow-400'
                      : 'bg-yellow-300'
              }`}
            >
              {p.status}
            </div>
            <button className='w-full bg-white text-gray-700 text-sm font-bold py-2 rounded mb-2 border mt-2 shadow-sm'>
              Configure
            </button>
          </div>
        ))}
      </div>
      <div className='mb-2 font-bold text-lg'>Zones</div>
      <div className='flex flex-col gap-2'>
        {(() => {
          const rows: any[][] = [];
          for (let i = 0; i < zoneList.length; i += 8) {
            rows.push(zoneList.slice(i, i + 8));
          }
          return rows.map((row, idx) => (
            <div key={idx} className='flex flex-wrap gap-2'>
              {row.map((zone) => (
                <div
                  key={zone.id}
                  className={`w-[100px] px-3 py-2 rounded font-semibold text-white text-sm text-center ${
                    zone.status === 'Normal' ? 'bg-green-400' : zone.status === 'Alarm' ? 'bg-red-400' : 'bg-yellow-300'
                  }`}
                  style={{ flex: '0 0 100px' }}
                >
                  {zone.name}
                </div>
              ))}
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '~/contexts/app.context';
import { useGetDataDevice, useGetLatestTelemetrysNoC } from '~/pages/tenant/DevicePage/handleApi';
import useSocket from '~/utils/hooks/socket/useSocket';
import { isEqual } from 'lodash';

export type Activity = {
  time: number;
  desc: string;
  color: string;
};

export function useLiveDeviceTelemetry({
  search,
  page = 0,
  size = 10,
  keyword = '',
}: {
  search?: string;
  page?: number;
  size?: number;
  keyword?: string;
}) {
  const { userInfo } = useContext(AppContext);

  // 1. Fetch device list
  const { data: deviceData } = useGetDataDevice({ page, size, keyword });
  const devicesList = useMemo(() => deviceData?.data?.content || [], [deviceData]);
  const deviceIdList = useMemo(() => devicesList.map(device => device.id), [devicesList]);

  // 2. Fetch telemetry for all devices
  const telemetryQueries = useGetLatestTelemetrysNoC({
    entityType: 'DEVICE',
    entityIds: deviceIdList,
  });

  const apiTelemetryMap = useMemo(() => {
    const map: Record<string, any> = {};
    telemetryQueries.forEach(query => {
      const id = query?.data?.data?.deviceId;
      const data = query?.data?.data?.data;
      if (id && data) map[id] = data;
    });
    return map;
  }, [JSON.stringify(telemetryQueries.map(q => q?.data?.data))]);

  const [liveDevices, setLiveDevices] = useState(devicesList);
  const [liveTelemetryMap, setLiveTelemetryMap] = useState<Record<string, any>>(apiTelemetryMap);
  const [latestPowerUpdates, setLatestPowerUpdates] = useState<Activity[]>([]);

  // 3. Connect to socket
  const socketData = useSocket({
    dependency: [userInfo?.tenant?.id],
    topic: '/topic/' + userInfo?.tenant?.id,
    connectHeaders: {},
  }) as any;

  // 4. Sync API response to live state
  useEffect(() => {
    if (!isEqual(liveDevices, devicesList)) {
      setLiveDevices(devicesList);
    }
    if (!isEqual(liveTelemetryMap, apiTelemetryMap)) {
      setLiveTelemetryMap(apiTelemetryMap);
    }
  }, [devicesList, apiTelemetryMap]);

  // 5. Merge socket data into live state
  useEffect(() => {
    if (!socketData?.deviceId) return;

    const { deviceId, token, ...telemetryFields } = socketData;

    setLiveDevices(prev =>
      prev.map(device => (device.id === deviceId ? { ...device, token } : device))
    );

    setLiveTelemetryMap(prev => {
      const prevData = prev[deviceId] ?? {};
      const mergedData = { ...prevData, ...telemetryFields };
      if (isEqual(prevData, mergedData)) return prev; // Avoid state update loop
      return {
        ...prev,
        [deviceId]: mergedData,
      };
    });
  }, [socketData]);

  useEffect(() => {
    if (!liveDevices?.length || !liveTelemetryMap) return;

    const initialUpdates: Activity[] = liveDevices
      .map(device => {
        const telemetry = liveTelemetryMap[device.id];
        const power = telemetry?.TotalActivePower;
        if (power?.ts && power?.value !== undefined) {
          return {
            time: power.ts,
            desc: `Device ${device.name} - Power Usage: ${power.value} KWh`,
            color: 'bg-blue-400',
          };
        }
        return null;
      })
      .filter(Boolean) as Activity[];

    const sorted = initialUpdates.sort((a, b) => {
      const aDate = new Date(a.time).getTime();
      const bDate = new Date(b.time).getTime();
      return bDate - aDate; // Latest first
    });

    setLatestPowerUpdates(sorted.slice(0, 10));
  }, [liveDevices, liveTelemetryMap]);


	useEffect(() => {
  if (
    !socketData?.deviceId ||
    !socketData?.TotalActivePower ||
    typeof socketData.TotalActivePower.ts !== 'number' ||
    typeof socketData.TotalActivePower.value !== 'number'
  )
    return;

  const { deviceId, TotalActivePower } = socketData;
  const deviceName = liveDevices.find(device => device.id === deviceId)?.name || deviceId;

  setLatestPowerUpdates(prev => {
    const newUpdate: Activity = {
      time: TotalActivePower.ts,
      desc: `Device ${deviceName} - Power Usage: ${TotalActivePower.value} KWh`,
      color: 'bg-blue-400',
    };

    // Avoid duplicate by checking if the same device update with same ts exists
    const isDuplicate = prev.some(
      item => item.desc === newUpdate.desc && item.time === newUpdate.time
    );

    if (isDuplicate) return prev;

    const next = [newUpdate, ...prev];
    next.sort((a, b) => b.time - a.time);
    return next.slice(0, 10);
  });
}, [socketData]);

  // 6. Filter devices by search input
  const filteredDevices = useMemo(() => {
    const lowerSearch = (search ?? '').toLowerCase();
    return liveDevices.filter(d => (d.name ?? '').toLowerCase().includes(lowerSearch));
  }, [liveDevices, search]);

  // 7. Helpers
  const safeValue = (v: unknown): string => {
    if (v === null || v === undefined) return '-';
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') return '-';
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return String(v);
  };

  const getTelemetryValue = (telemetry: Record<string, any>, key: string): string => {
    const val = telemetry?.[key];
    return val && typeof val === 'object' && 'value' in val ? safeValue(val.value) : safeValue(val);
  };

  const getLatestTs = (telemetry: Record<string, any>): number | null => {
    const timestamps = Object.values(telemetry ?? {})
      .map((val: any) => (val?.ts ? val.ts : null))
      .filter(Boolean) as number[];
    return timestamps.length ? Math.max(...timestamps) : null;
  };

  // function getTimeAgo(ts: number) {
  //   const date = new Date(ts);
  //   const pad = (n: number) => n.toString().padStart(2, '0');
  //   return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  // }

  return {
    isLoading: !deviceData,
    filteredDevices,
    liveTelemetryMap,
    getTelemetryValue,
    getLatestTs,
    safeValue,
    latestPowerUpdates,
  };
}

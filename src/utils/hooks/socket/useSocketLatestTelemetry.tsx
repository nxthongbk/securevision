import { useEffect, useMemo, useState } from 'react';
import useSocket from './useSocket';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';

interface IProps {
  dependency: any[];
  topic: string;
  connectHeaders: any;
  initData: any;
}

export default function useSocketLatestTelemetry({ dependency, topic, connectHeaders, initData }: IProps) {
  const [latestTelemetry, setLatestTelemetry] = useState(initData || {});

  const data = useSocket({ dependency, topic, connectHeaders }) as Record<string, any>;

  // Only update the keys coming from WebSocket
  useEffect(() => {
    if (!data) return;

    setLatestTelemetry((prev) => {
      const updated = { ...prev };
      for (const key in data) {
        if (key !== 'token') updated[key] = data[key];
      }
      return updated;
    });
  }, [data]);

  const rows = useMemo(() => {
    if (!latestTelemetry) return [];

    const newArr = Object.keys(latestTelemetry).map((key) => ({
      id: key,
      key,
      value: JSON.stringify(latestTelemetry[key]),
      time: latestTelemetry[key]?.ts
        ? dayjs(latestTelemetry[key].ts).format('DD/MM/YYYY HH:mm:ss')
        : ''
    }));

    return sortBy(newArr, (row) => row.key.toLowerCase());
  }, [latestTelemetry]);

  return { rows };
}

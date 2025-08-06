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

export default function useSocketLatestTelemetryBoard(props: IProps) {
  const { dependency, topic, connectHeaders, initData } = props;
  const [latestTelemetry, setLatestTelemetry] = useState<Record<string, any> | null>(null);

  const data = useSocket({
    dependency,
    topic,
    connectHeaders,
  }) as Record<string, unknown>;

  useEffect(() => {
    const dataCopy = { ...data };
    if (dataCopy?.token) delete dataCopy.token;
    const merged = { ...initData, ...dataCopy };
    if (JSON.stringify(merged) !== JSON.stringify(latestTelemetry)) {
      setLatestTelemetry(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, data]);

  const rows = useMemo(() => {
    if (!latestTelemetry) return [];
    const newArr = Object.keys(latestTelemetry).map(key => ({
      id: key,
      time: dayjs((latestTelemetry as any)[key]?.ts).format('DD/MM/YYYY HH:mm:ss'),
      key,
      value: JSON.stringify((latestTelemetry as any)[key]),
    }));
    return sortBy(newArr, row => row.key.toLowerCase());
  }, [latestTelemetry]);

  return { rows, length: rows.length };
}
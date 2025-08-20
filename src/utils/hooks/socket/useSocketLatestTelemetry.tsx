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

export default function useSocketLatestTelemetry(props: IProps) {
  const { dependency, topic, connectHeaders, initData } = props;
  const [latestTelemetry, setLatestTelemetry] = useState(null);
  const [length, setLength] = useState<number>(0);

  const data = useSocket({
    dependency,
    topic,
    connectHeaders
  }) as Record<string, unknown>;

  useEffect(() => {
    if (data?.token) delete data.token;
    setLatestTelemetry({ ...initData, ...data });
  }, [initData, data]);

  const rows = useMemo(() => {
    const newArr = [];
    for (const key in latestTelemetry) {
      newArr.push({
        id: key,
        time: dayjs(latestTelemetry[key]?.ts).format('DD/MM/YYYY HH:mm:ss'),
        key: key,
        value: JSON.stringify(latestTelemetry[key])
      });
      setLength((pre) => ++pre);
    }
    const sortedRows = sortBy(newArr, (row) => row.key.toLowerCase());
    return sortedRows;
  }, [latestTelemetry]);

  return { rows, length };
}

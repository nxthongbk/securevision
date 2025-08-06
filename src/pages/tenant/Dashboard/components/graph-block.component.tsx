import { Typography } from '@mui/material';
import { Image } from '@phosphor-icons/react';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Label,
  Legend,
  Tooltip
} from 'recharts';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import { useGetLatestTelemetry } from '../../DevicePage/handleApi';
import telemetryService from '~/services/telemetry.service';
import { timestampToDate } from '../utils/const-dashboard';

interface GraphBlockProps {
  type: 'chart-pie' | 'chart-line' | 'chart-bar' | 'chart-area' | 'title' | 'image';
  item: any;
  setTimeTitle: (time: string) => void;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#2E8B57', '#FFD700'];
const GraphBlock: React.FC<GraphBlockProps> = ({ type, item, setTimeTitle }) => {
  switch (type) {
    case 'chart-pie':
      return <PieChartCustom item={item} />;
    case 'chart-line':
      return <ChartLineCustom item={item} setTimeTitle={setTimeTitle} />;
    case 'chart-bar':
      return <BarChartCustom item={item} setTimeTitle={setTimeTitle} />;
    case 'chart-area':
      return <AreaChartCustom item={item} setTimeTitle={setTimeTitle} />;
    case 'title':
      return <TitleWidget item={item} classNames={classNames} />;
    case 'image':
      return (
        <>
          {item?.image ? (
            <img src={item?.image} className='w-full ' />
          ) : (
            <div className='w-full flex justify-center p-10 bg-[var(--grey-primary-40)]'>
              {' '}
              <Image className='text-[#7490AA]' size={44} />{' '}
            </div>
          )}
        </>
      );
  }
};

export default GraphBlock;

function TitleWidget({ item, classNames }) {
  const [data, setData] = useState(item);
  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: item.deviceId
  });

  const { rows } = useSocketLatestTelemetry({
    dependency: [item.deviceId],
    topic: `/topic/${item.deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0 && data?.telemetryId) {
      const foundItem = rows?.find((item) => item?.id === data?.telemetryId);
      const value = foundItem?.value ? JSON.parse(foundItem.value) : null;
      if (value) {
        setData({ ...data, data: value.value });
      }
    }
  }, [rows]);

  return (
    <div
      className='flex flex-col justify-center gap-3'
      style={{
        textAlign: data?.alignText
      }}
    >
      <div
        className={classNames(' p-6 w-full rounded-md cursor-pointer', {
          hidden: data?.typeTitle === 'end'
        })}
      >
        <Typography variant='h5' className='text-[var(--text-primary)]'>
          {data?.data ? data?.data + ` ${data?.unit ? data?.unit : ''}` : 'Nội dung'}
        </Typography>
        <Typography variant='label3' className='text-[var(--text-secondary)]'>
          {data?.title ? data?.title : 'Tiêu đề'}
        </Typography>
      </div>
      <div
        className={classNames(' p-6 w-full rounded-md cursor-pointer', {
          hidden: data?.typeTitle === 'start'
        })}
      >
        <Typography variant='h5' className='text-[var(--text-primary)]'>
          {data?.data ? data?.data + ` ${data?.unit ? data?.unit : ''}` : 'Nội dung'}
        </Typography>
        <Typography variant='label3' className='text-[var(--text-secondary)]'>
          {data?.title ? data?.title : 'Tiêu đề'}
        </Typography>
      </div>
    </div>
  );
}

function PieChartCustom({ item }) {
  const [data, setData] = useState(item);
  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: item.deviceId
  });

  const { rows } = useSocketLatestTelemetry({
    dependency: [item.deviceId],
    topic: `/topic/${item.deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      const dataList = [];
      data.telemetryIds.map((item) => {
        const value = rows.find((e) => e.id === item.key);
        if (value) {
          const valueItem = JSON.parse(value.value);
          dataList.push({ ...value, value: Number(valueItem.value) });
        }
      });
      setData({ ...data, data: dataList });
    }
  }, [rows]);
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart>
        <Pie
          data={data?.data?.map((e, index) => ({
            name: e.key,
            value: e.value,
            color: COLORS[Math.floor(index)]
          }))}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={90}
          outerRadius={120}
          fill='#25D07E'
          isAnimationActive={false}
          paddingAngle={1}
        >
          {data?.data?.map((item, index) => {
            return <Cell key={`cell-${item.key}`} fill={COLORS[index]} />;
          })}
          <Label
            value='Trung bình'
            position='center'
            fill='#737982'
            style={{
              fontSize: '14px',
              fontWeight: '400'
            }}
            dy={-15}
          />
          <Label
            value={data?.data?.reduce((acc, cur) => acc + cur.value, 0).toFixed(2) / 2}
            position='center'
            fill='#3A3D41'
            style={{
              fontSize: '32px',
              fontWeight: '700'
            }}
            dy={10}
          />
        </Pie>
        <Tooltip />
        <Legend layout='horizontal' verticalAlign='bottom' align='center' />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartLineCustom({ item, setTimeTitle }) {
  const [dataChart, setDataChart] = useState<any>([]);

  const { rows } = useSocketLatestTelemetry({
    dependency: [item.deviceId],
    topic: `/topic/${item.deviceId}`,
    initData: item?.telemetryIds,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      // const dataInit = data;
      const dataList = [];
      item?.telemetryIds.map((item) => {
        const value = rows.find((e) => e.id === item.key);
        if (value) {
          setTimeTitle(value.time);
          const valueItem = JSON.parse(value.value);
          dataList.push({ key: dataChart.length + 1, time: value.time, [item.key]: Number(valueItem.value) });
        }
      });
      const chartChange = dataChart.concat(dataList);
      setDataChart(chartChange);
    }
  }, [rows]);
  useEffect(() => {
    const today = new Date();
    telemetryService
      .getTimeseriTelemetry({
        entityId: item.deviceId,
        startTime: 0,
        endTime: today.getTime(),
        keys: item?.telemetryIds?.map((item) => item.key) // Lấy danh sách các key từ dữ liệu
      })
      .then(({ data }) => {
        const resultMap = new Map();

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            data[key].forEach((el) => {
              const timestamp = timestampToDate(el.ts);
              const value = JSON.parse(el.value);
              if (resultMap.has(timestamp)) {
                const existingItem = resultMap.get(timestamp);
                resultMap.set(timestamp, { ...existingItem, [key]: value });
              } else {
                resultMap.set(timestamp, {
                  index: resultMap.size + 1, // Cập nhật chỉ mục dựa trên kích thước của Map
                  time: timestamp,
                  [key]: value
                });
              }
            });
          }
        }

        const combinedData = Array.from(resultMap.values()).sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        const lastTenItems = combinedData?.slice(-10);
        setDataChart(lastTenItems);
      })
      .catch((error) => {
        console.error('Error fetching telemetry data:', error);
      });
  }, [item]);

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={dataChart} margin={{ left: 10, right: 10 }}>
        <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.1} />
        <XAxis dataKey='time' />
        <YAxis />
        <Tooltip />
        <Legend />
        {item?.data.map((item, index) => (
          <Line
            key={item.key} // Thêm key để giúp React phân biệt các Line
            type='monotone'
            dataKey={item.key}
            stroke={COLORS[index]}
            dot={true}
            isAnimationActive={true}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
function BarChartCustom({ item, setTimeTitle }) {
  const [dataChart, setDataChart] = useState<any>([]);

  const { rows } = useSocketLatestTelemetry({
    dependency: [item.deviceId],
    topic: `/topic/${item.deviceId}`,
    initData: item?.telemetryIds,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      // const dataInit = data;
      const dataList = [];
      item?.telemetryIds.map((item) => {
        const value = rows.find((e) => e.id === item.key);
        if (value) {
          const valueItem = JSON.parse(value.value);
          setTimeTitle(value.time);
          dataList.push({ key: dataChart.length + 1, time: value.time, [item.key]: Number(valueItem.value) });
        }
      });

      const chartChange = dataChart.concat(dataList);
      setDataChart(chartChange);
    }
  }, [rows]);
  useEffect(() => {
    const today = new Date();
    telemetryService
      .getTimeseriTelemetry({
        entityId: item.deviceId,
        startTime: 0,
        endTime: today.getTime(),
        keys: item?.telemetryIds?.map((item) => item.key) // Lấy danh sách các key từ dữ liệu
      })
      .then(({ data }) => {
        const resultMap = new Map();

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            data[key].forEach((el) => {
              const timestamp = timestampToDate(el.ts);
              const value = JSON.parse(el.value);

              if (resultMap.has(timestamp)) {
                const existingItem = resultMap.get(timestamp);
                resultMap.set(timestamp, { ...existingItem, [key]: value });
              } else {
                resultMap.set(timestamp, {
                  index: resultMap.size + 1, // Cập nhật chỉ mục dựa trên kích thước của Map
                  time: timestamp,
                  [key]: value
                });
              }
            });
          }
        }

        const combinedData = Array.from(resultMap.values()).sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        const lastTenItems = combinedData?.slice(-10);
        setDataChart(lastTenItems);
      })
      .catch((error) => {
        console.error('Error fetching telemetry data:', error);
      });
  }, [item]);
  return (
    <>
      <ResponsiveContainer
        width='100%'
        height='100%'
        className={classNames('grid-item', {
          hidden: item.barChartType !== 'bar-chart'
        })}
      >
        <BarChart data={dataChart}>
          <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.1} />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip />
          <Legend />
          {item?.data.map((item, index) => <Bar dataKey={item.key} fill={COLORS[index]} />)}
          <Legend />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer
        width='100%'
        height='100%'
        className={classNames('grid-item', {
          hidden: item.barChartType !== 'stacked-chart'
        })}
      >
        <BarChart data={dataChart}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip />
          <Legend />
          {item?.data.map((item, index) => <Bar dataKey={item.key} stackId='a' fill={COLORS[index]} />)}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

function AreaChartCustom({ item, setTimeTitle }) {
  const [dataChart, setDataChart] = useState<any>([]);

  const { rows } = useSocketLatestTelemetry({
    dependency: [item.deviceId],
    topic: `/topic/${item.deviceId}`,
    initData: item?.telemetryIds,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      // const dataInit = data;
      const dataList = [];
      item?.telemetryIds.map((item) => {
        const value = rows.find((e) => e.id === item.key);
        if (value) {
          setTimeTitle(value.time);
          const valueItem = JSON.parse(value.value);
          dataList.push({ key: dataChart.length + 1, time: value.time, [item.key]: Number(valueItem.value) });
        }
      });
      const chartChange = dataChart.concat(dataList);
      setDataChart(chartChange);
    }
  }, [rows]);
  useEffect(() => {
    const today = new Date();
    telemetryService
      .getTimeseriTelemetry({
        entityId: item.deviceId,
        startTime: 0,
        endTime: today.getTime(),
        keys: item?.telemetryIds?.map((item) => item.key) // Lấy danh sách các key từ dữ liệu
      })
      .then(({ data }) => {
        const resultMap = new Map();

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            data[key].forEach((el) => {
              const timestamp = timestampToDate(el.ts);
              const value = JSON.parse(el.value);

              if (resultMap.has(timestamp)) {
                const existingItem = resultMap.get(timestamp);
                resultMap.set(timestamp, { ...existingItem, [key]: value });
              } else {
                resultMap.set(timestamp, {
                  index: resultMap.size + 1, // Cập nhật chỉ mục dựa trên kích thước của Map
                  time: timestamp,
                  [key]: value
                });
              }
            });
          }
        }

        const combinedData = Array.from(resultMap.values()).sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        const lastTenItems = combinedData?.slice(-10);
        setDataChart(lastTenItems);
      })
      .catch((error) => {
        console.error('Error fetching telemetry data:', error);
      });
  }, [item]);

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={dataChart} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='time' />
        <YAxis />
        <Tooltip />
        <Legend />
        {item?.data.map((item, index) => <defs>
          <linearGradient id={item.key} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={COLORS[index]} stopOpacity={0.8} />
            <stop offset='95%' stopColor={COLORS[index]} stopOpacity={0} />
          </linearGradient>
        </defs>)}


        {item?.data.map((item) => <Area key={item.key} type='monotone' dataKey={item.key} stackId='1' fill={`url(#${item.key})`} />)}
      </AreaChart>
    </ResponsiveContainer>
  );
}

import { Typography } from '@mui/material';
import { Image } from '@phosphor-icons/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import telemetryService from '~/services/telemetry.service';
import { getRandomColor, timestampToDate } from '../../utils/const-dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function RenderWidgetResult({
  widget,
  typeTitle,
  data,
  title,
  unit,
  alignText = 'start',
  image,
  barType,
  deviceId
}: {
  widget: string;
  typeTitle: string;
  data?: any;
  title?: string;
  unit?: string;
  alignText?: CanvasTextAlign;
  image?: any;
  barType?: string;
  deviceId?: string;
}) {
  const [dataChart, setDataChart] = useState<any>([]);

  useEffect(() => {
    const today = new Date();

    telemetryService
      .getTimeseriTelemetry({
        entityId: deviceId,
        startTime: 0,
        endTime: today.getTime(),
        keys: widget === 'title' ? data : data?.map((item) => item.key) // Lấy danh sách các key từ dữ liệu
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

        setDataChart(combinedData);
      })
      .catch((error) => {
        console.error('Error fetching telemetry data:', error);
      });
  }, [deviceId, data]);

  switch (widget) {
    case 'title':
      return (
        <div className='flex flex-col justify-center gap-3' style={{ textAlign: alignText }}>
          <div
            className={classNames('border p-6 w-full rounded-md cursor-pointer', {
              hidden: typeTitle === 'end'
            })}
          >
            <Typography variant='h5' className='text-[var(--text-primary)]'>
              {data?.value ? data?.value + ` ${unit ? unit : ''}` : 'Nội dung'}
            </Typography>
            <Typography variant='label3' className='text-[var(--text-secondary)]'>
              {title ? title : 'Tiêu đề'}
            </Typography>
          </div>
          <div
            className={classNames('border p-6 w-full rounded-md cursor-pointer', {
              hidden: typeTitle === 'start'
            })}
          >
            <Typography variant='label3' className='text-[var(--text-secondary)]'>
              {title ? title : 'Tiêu đề'}
            </Typography>
            <Typography variant='h5' className='text-[var(--text-primary)]'>
              {data?.value ? data?.value + ` ${unit ? unit : ''}` : 'Nội dung'}
            </Typography>
          </div>
        </div>
      );
    case 'chart-pie':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'> {title ? title : 'Tiêu đề'}</div>
          <div className='grid-item__graph'>
            <PieChart width={550} height={350}>
              <Pie
                data={data.map((e) => ({
                  name: e.key,
                  value: Number(e.value),
                  color: COLORS[Math.floor(Math.random() * COLORS.length)]
                }))}
                cx='50%'
                cy='50%'
                innerRadius={90}
                outerRadius={120}
                fill='#8884d8'
                paddingAngle={1}
                dataKey='value'
              >
                {data.map((item, index) => {
                  return <Cell key={`cell-${item.key}`} fill={COLORS[index % COLORS.length]} />;
                })}
                <Label
                  value='Trung bình'
                  position='center'
                  fill='#737982'
                  style={{ fontSize: '14px', fontWeight: '400' }}
                  dy={-15}
                />
                <Label
                  value={data.reduce((acc, cur) => acc + Number(cur?.value), 0)?.toFixed(2) / 2}
                  position='center'
                  fill='#3A3D41'
                  style={{ fontSize: '24px', fontWeight: '700' }}
                  dy={10}
                />
              </Pie>
              <Tooltip />
              <Legend layout='horizontal' verticalAlign='bottom' align='center' />
            </PieChart>
          </div>
        </div>
      );
    case 'chart-line':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'> {title ? title : 'Tiêu đề'}</div>
          <div className='flex justify-center grid-item__graph'>
            <LineChart data={dataChart} margin={{ left: 10, right: 10 }} width={550} height={350}>
              <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.1} />
              <XAxis dataKey='time' />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.map((item) => (
                <Line
                  key={item.key} // Thêm key để giúp React phân biệt các Line
                  type='monotone'
                  dataKey={item.key}
                  stroke={getRandomColor()}
                  dot={true}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </div>
        </div>
      );
    case 'chart-area':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'> {title ? title : 'Tiêu đề'}</div>
          <div className='flex justify-center grid-item__graph'>
            <AreaChart data={dataChart} margin={{ left: 10, right: 10, top: 10, bottom: 10 }} width={550} height={350}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='time' />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.map((item) => (
                <Area key={item.key} type='monotone' dataKey={item.key} stackId='1' />
              ))}
            </AreaChart>
          </div>
        </div>
      );
    case 'chart-bar':
      return (
        <>
          <div
            className={classNames('grid-item', {
              hidden: barType !== 'bar-chart'
            })}
          >
            <div className='grid-item__title'>bar chart</div>
            <div className='flex justify-center grid-item__graph'>
              <BarChart width={550} height={350} data={dataChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((item) => (
                  <Bar dataKey={item.key} fill={getRandomColor()} />
                ))}
              </BarChart>
            </div>
          </div>
          <div
            className={classNames('grid-item', {
              hidden: barType !== 'stacked-chart'
            })}
          >
            <div className='grid-item__title'>Stacked bar chart</div>
            <div className='flex justify-center grid-item__graph'>
              <BarChart width={550} height={350} data={dataChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((item) => (
                  <Bar dataKey={item.key} stackId='a' fill={getRandomColor()} />
                ))}
              </BarChart>
            </div>
          </div>
        </>
      );
    case 'image':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'> {title ? title : 'Tiêu đề'}</div>
          <div className='flex justify-center p-2 grid-item__graph'>
            {image ? (
              <img src={image} className='w-full ' />
            ) : (
              <div className='w-full flex justify-center p-10 bg-[var(--grey-primary-40)]'>
                {' '}
                <Image className='text-[#7490AA]' size={44} />{' '}
              </div>
            )}
          </div>
        </div>
      );
    case 'table':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'> {title ? title : 'Tiêu đề'}</div>
          <div className='flex flex-col justify-center grid-item__graph '>
            <div className='w-full flex justify-around p-3 text-right bg-[var(--grey-primary-80)]'>
              <div className='w-1/4 text-left'>
                <Typography variant='label3' className='text-[var(--text-primary)]'>
                  Table
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='label3' className='text-[var(--text-primary)]'>
                  Table
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='label3' className='text-[var(--text-primary)]'>
                  Table
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='label3' className='text-[var(--text-primary)]'>
                  Table
                </Typography>
              </div>
            </div>
            <div className='flex justify-around w-full p-3 text-right '>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
            </div>
            <div className='w-full flex justify-around p-3 text-right bg-[var(--grey-primary-60)]'>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
            </div>
            <div className='flex justify-around w-full p-3 text-right '>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
            </div>
            <div className='w-full flex justify-around p-3 text-right bg-[var(--grey-primary-60)]'>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
              <div className='w-1/4 text-left'>
                <Typography variant='body3' className='text-[var(--text-primary)]'>
                  Body
                </Typography>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      break;
  }
}
export default RenderWidgetResult;

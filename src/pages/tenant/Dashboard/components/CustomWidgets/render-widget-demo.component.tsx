import { Typography } from '@mui/material';
import { Image, Video } from '@phosphor-icons/react';
import classNames from 'classnames';
import React from 'react';
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
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const dataGauge = [
  { name: 'A', value: 80, color: '#FF1F1F' },
  { name: 'B', value: 45, color: '#F5C000' },
  { name: 'C', value: 25, color: '#1F93FF' },
  { name: 'C', value: 25, color: '#25D07E' }
];
const dataLine = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];
const iR = 80;
const oR = 100;

function RenderWidgetDemo({
  widget,
  typeTitle,
  selectTypeTitle,
  typeBarChart,
  selectTypeBarChart,
}: {
  widget: string;
  typeTitle: string;
  selectTypeTitle?: any;
  data?: any;
  title?: string;
  typeBarChart: string;
  selectTypeBarChart?: any;
}) {
  const [titleType, setTitleType] = React.useState(typeTitle);
  const [barChartType, setBarChartType] = React.useState(typeBarChart);
  const changeTitleType = (type: string) => {
    setTitleType(type);
    selectTypeTitle(type);
  };

  const changeBarChartType = (type: string) => {
    selectTypeBarChart(type)
    setBarChartType(type);
  };
  switch (widget) {
    case 'title':
      return (
        <div className='flex flex-col justify-center gap-3'>
          <div
            className={classNames('border p-6 w-full rounded-md cursor-pointer', {
              'border-primary text-primary': titleType === 'start'
            })}
            onClick={() => changeTitleType('start')}
          >
            <Typography variant='h5' className='text-[var(--text-primary)]'>
              Nội dung
            </Typography>
            <Typography variant='label3' className='text-[var(--text-secondary)]'>
              Tiêu đề
            </Typography>
          </div>
          <div
            className={classNames('border p-6 w-full rounded-md cursor-pointer', {
              'border-primary text-primary': titleType === 'end'
            })}
            onClick={() => changeTitleType('end')}
          >
            <Typography variant='label3' className='text-[var(--text-secondary)]'>
              Tiêu đề
            </Typography>
            <Typography variant='h5' className='text-[var(--text-primary)]'>
              Nội dung
            </Typography>
          </div>
        </div>
      );
    case 'gauge':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>gauge chart</div>
          <div className='flex justify-center grid-item__graph'>
            <PieChart width={550} height={150}>
              <Pie
                dataKey='value'
                startAngle={200}
                endAngle={-20}
                data={data}
                cx={'50%'}
                cy={'95%'}
                innerRadius={iR}
                outerRadius={oR}
                fill='#8884d8'
                stroke='none'
              >
                {dataGauge.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label value='100' position='center' fill='#000' style={{ fontSize: '32px', fontWeight: 'bold' }} />
              </Pie>
            </PieChart>
          </div>
        </div>
      );
    case 'chart-pie':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>Pie chart</div>
          <div className='grid-item__graph'>
            <PieChart width={550} height={350}>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={90}
                outerRadius={120}
                fill='#8884d8'
                paddingAngle={1}
                dataKey='value'
              >
                {data.map((item, index) => {
                  return <Cell key={`cell-${item.name}`} fill={COLORS[index % COLORS.length]} />;
                })}
                <Label
                  value='Tiêu đề'
                  position='center'
                  fill='#737982'
                  style={{ fontSize: '14px', fontWeight: '400' }}
                  dy={-15}
                />
                <Label
                  value='Giá trị'
                  position='center'
                  fill='#3A3D41'
                  style={{ fontSize: '24px', fontWeight: '700' }}
                  dy={10}
                />
              </Pie>
              <Legend layout='horizontal' verticalAlign='bottom' align='center' />
            </PieChart>
          </div>
        </div>
      );
    case 'chart-line':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>line chart</div>
          <div className='flex justify-center grid-item__graph'>
            <LineChart data={dataLine} margin={{ left: 10, right: 10 }} width={550} height={350}>
              <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.1} />
              <XAxis dataKey='name' />
              <YAxis mirror />
              <Line type='monotone' dataKey='pv' stroke='#25D07E' dot={true} isAnimationActive={true} />
            </LineChart>
          </div>
        </div>
      );
    case 'chart-area':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>area chart</div>
          <div className='flex justify-center grid-item__graph'>
            <AreaChart data={dataLine} margin={{ left: 10, right: 10 }} width={550} height={350}>
              <defs>
                <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#25D07E' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#25D07E' stopOpacity={0} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id='purler' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#7547FF' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#7547FF' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis mirror />
              <Area type='monotone' dataKey='uv' stackId='1' stroke='#7547FF' fill='url(#purler)' />
              <Area type='monotone' dataKey='pv' stackId='1' stroke='#25D07E' fill='url(#colorPv)' />
            </AreaChart>
          </div>
        </div>
      );
    case 'chart-bar':
      return (
        <>
          <div
            className={classNames('grid-item', {
              'border-primary text-primary': barChartType === 'bar-chart'
            })}
            onClick={() => changeBarChartType('bar-chart')}
          >
            <div className='grid-item__title'>bar chart</div>
            <div className='flex justify-center grid-item__graph'>
              <BarChart
                width={550} height={250}
                data={dataLine}

              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#7547FF" />
                <Bar dataKey="uv" fill="#25D07E" />
              </BarChart>
            </div>
          </div>
          <div
            className={classNames('grid-item', {
              'border-primary text-primary': barChartType === 'stacked-chart'
            })}
            onClick={() => changeBarChartType('stacked-chart')}
          >
            <div className='grid-item__title'>Stacked bar chart</div>
            <div className='flex justify-center grid-item__graph'>
              <BarChart
                width={500}
                height={250}
                data={dataLine}

              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" stackId="a" fill="#7547FF" />
                <Bar dataKey="uv" stackId="a" fill="#25D07E" />
              </BarChart>
            </div>
          </div>
        </>
      );
    case 'image':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>Image</div>
          <div className='flex justify-center p-2 grid-item__graph'>
            <div className='w-full flex justify-center p-10 bg-[var(--grey-primary-40)]'>
              <Image className='text-[#7490AA]' size={44} />
            </div>
          </div>
        </div>
      );
    case 'camera':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>Camera</div>
          <div className='flex justify-center p-2 grid-item__graph'>
            <div className='w-full flex justify-center p-10 bg-[var(--grey-primary-40)]'>
              <Video className='text-[#7490AA]' size={44} />
            </div>
          </div>
        </div>
      );
    case 'table':
      return (
        <div className={`grid-item`}>
          <div className='grid-item__title'>table</div>
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
export default RenderWidgetDemo;

import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import statusChartFrame from '~/assets/images/png/streetLightStatusFrame.png';

interface StatusItem {
  label: string;
  value: number;
  color: string;
}

interface StatusChartProps {
  statusList: StatusItem[];
}

const StatusChart = ({ statusList }: StatusChartProps) => {
  const series = statusList.map(s => s.value);
  const labels = statusList.map(s => s.label);
  const colors = statusList.map(s => s.color);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels,
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
        },
      },
    },
    stroke: {
      show: false,
    },
    tooltip: { enabled: true },
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 340,
        minHeight: 160,
        backgroundImage: `url(${statusChartFrame})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        position: 'relative',
        zIndex: 3,
      }}
    >
      <div style={{ position: 'relative', zIndex: 20 }}>
        <ReactApexChart options={options} series={series} type="donut" width={160} />
      </div>
      <div style={{ zIndex: 10 }}>
        {statusList.map(s => (
          <div
            key={s.label}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 6, fontSize: 13 }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: s.color,
                marginRight: 4,
              }}
            />
            <span style={{ color: '#fff', minWidth: 110 }}>{s.label}</span>
            <span style={{ color: s.color, fontWeight: 700, marginLeft: 0, marginRight: 4 }}>
              {s.value.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
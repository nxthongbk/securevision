import { useQuery } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import alarmService from '~/services/alarm.service';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import  { useTranslation } from "react-i18next";

export default function AlarmSummary() {
  const { tenantCode } = useTenantCode();

  const start = dayjs().subtract(7, 'day').startOf('day');
  const end = dayjs().endOf('day');
  const  { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['alarmSummary', tenantCode, start.valueOf(), end.valueOf()],
    queryFn: async () => {
      const res = await alarmService.getAlarmLocations(
        0,
        1000,
        '',
        tenantCode ?? '',
        '',
        '',
        start.valueOf(),
        end.valueOf()
      );
      return res.data;
    },
    enabled: !!tenantCode,
  });

  if (isLoading) return <div>Loading alarm summary…</div>;
  if (error) return <div>Error loading alarm summary: {(error as Error).message}</div>;

  // Flatten alarms
  const alarms: any[] = [];
  data?.content?.forEach((item: any) => {
    if (Array.isArray(item.alarms)) {
      item.alarms.forEach((alarm: any) => {
        alarms.push(alarm);
      });
    }
  });
  // console.log(alarms);
  // Group alarms by day
  const grouped = alarms.reduce((acc: Record<string, number>, alarm: any) => {
    const dateStr = alarm.createdAlarmBy?.date || alarm.createdAlarmBy?.createdAt;
    if (!dateStr) return acc;
    const date = dayjs(dateStr).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for past 7 days
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    chartData.push({ date, count: grouped[date] || 0 });
  }

  return (
    <div className="p-4 w-full h-full">
      <h2 className="text-lg font-bold mb-4 text-white">
        {t("report.alarm-summary")}

      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'white', fontSize: 12 }} />
          <YAxis tick={{ fill: 'white', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

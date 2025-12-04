// import { useQuery } from '@tanstack/react-query';
import { useTranslation } from "react-i18next";
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useGetAlarmLocations } from '../../AlarmPage/handleApi'; // ✅ import your existing hook
import dayjs from 'dayjs';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function LocationSummary() {
  const { tenantCode } = useTenantCode();
  const { t } = useTranslation();

  // Calculate 7-day range
  const startTs = dayjs().subtract(7, 'day').startOf('day').valueOf();
  const endTs = dayjs().endOf('day').valueOf();

  // Fetch alarms in the last 7 days
  const { data, isLoading, error } = useGetAlarmLocations(
    0, // page
    1000, // size (fetch enough to cover 7 days of alarms)
    '', // keyword
    tenantCode,
    '', // locationFilter
    '', // status
    startTs,
    endTs
  );

  if (isLoading) return <div>Loading location summary…</div>;
  if (error) return <div>Error loading alarms: {(error as Error).message}</div>;

  // Group alarms by location
  const alarmCounts: Record<string, number> = {};
  (data?.data?.content || []).forEach((alarm: any) => {
    const loc = alarm.locationInfo?.name || "Unknown";
    alarmCounts[loc] = (alarmCounts[loc] || 0) + 1;
  });

  // Sort & take top 3
  const topLocations = Object.entries(alarmCounts)
    .map(([name, count]) => ({ name, alarmCount: count }))
    .sort((a, b) => b.alarmCount - a.alarmCount)
    .slice(0, 3);

  return (
    <div className="p-4 w-full h-full">
      <h2 className="text-lg font-bold mb-4 text-white">
        {t("report.location-summary")}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={topLocations}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
          <YAxis tick={{ fill: 'white', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="alarmCount" fill="#f87171" name="Alarm Records" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import locationService from '~/services/location.service';
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

  // Fetch all locations (limit 1000 just in case)
  const { data, isLoading, error } = useQuery({
    queryKey: ['locationSummary', tenantCode],
    queryFn: async () => {
      const res = await locationService.getLocations(0, 1000, '', tenantCode ?? '');
      return res.data;
    },
    enabled: !!tenantCode,
  });

  if (isLoading) return <div>Loading location summary…</div>;
  if (error) return <div>Error loading locations: {(error as Error).message}</div>;

  // Process data: get top 3 locations by device count
  const locations = (data?.content || [])
    .map((item: any) => ({
      name: item.name,
      totalDevices: item.devices?.total || 0,
      totalActiveDevices: item.devices?.totalActive || 0,
    }))
    .sort((a, b) => b.totalDevices - a.totalDevices)
    .slice(0, 3);

  return (
    <div className="p-4 w-full h-full">
      <h2 className="text-lg font-bold mb-4 text-white">Top 3 Locations by Devices</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={locations}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
          <YAxis tick={{ fill: 'white', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalDevices" fill="#60a5fa" name="Total Devices" />
          <Bar dataKey="totalActiveDevices" fill="#34d399" name="Active Devices" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

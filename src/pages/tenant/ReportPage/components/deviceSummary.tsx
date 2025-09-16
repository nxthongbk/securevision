"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTenantCode } from "~/utils/hooks/useTenantCode";
import deviceService from "~/services/device.service";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

// custom hook only for summary
const useGetDevicesSummary = (tenantCode: string | null) => {
  return useQuery({
    queryKey: ["deviceSummary", tenantCode],
    queryFn: async () => {
      const res = await deviceService.getDevice({
        page: 0,
        size: 1000,
        keyword: "",
        tenantCode: tenantCode ?? "",
        deviceProfileId: "",
        locationId: "",
        status: "",
        alarmStatus: "",
      });
      console.log("Device API raw response:", res);
      return res;
    },
    enabled: !!tenantCode,
  });
};

export default function DeviceSummary() {
  const { tenantCode } = useTenantCode();
  console.log("TenantCode from hook (DeviceSummary):", tenantCode);

  const { data, isLoading, error } = useGetDevicesSummary(tenantCode);

  const chartData = useMemo(() => {
    if (!data?.data?.content) return [];

    console.log("Device API content:", data.data.content);

    const statusCount: Record<string, number> = {};

    data.data.content.forEach((device: any) => {
      const status = device.status || "UNKNOWN";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    console.log("Device status tally:", statusCount);

    return Object.entries(statusCount).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [data]);

  if (isLoading) return <p className="p-4">Loading device summary...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading device summary</p>;

  return (
    <div className="p-4 w-full h-full">
      <h2 className="text-lg font-bold mb-4 text-white">
        Device Summary (by Status)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// src/components/UserSummary.tsx
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
import staffService from "~/services/staff.service";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

export default function UserSummary() {
  const { tenantCode } = useTenantCode();

  console.log("TenantCode from hook:", tenantCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userSummary", tenantCode],
    queryFn: async () => {
      const res = await staffService.getStaffs(
        0, // page
        1000, // size
        "", // keyword
        tenantCode ?? "",
        "", // locationId
        "", // permissionGroupId
        "" // status (empty = all)
      );
      console.log("Staff API raw response:", res);
      return res;
    },
    enabled: !!tenantCode,
  });

  const chartData = useMemo(() => {
    if (!data?.data?.content) return [];

    const statusCount: Record<string, number> = {};

    data.data.content.forEach((user: any) => {
      const status = user.status || "UNKNOWN";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const transformed = Object.entries(statusCount).map(([status, value]) => ({
      name: status,
      value,
    }));

    console.log("Transformed ChartData:", transformed);
    return transformed;
  }, [data]);

  if (isLoading) return <p className="p-4">Loading user summary...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading user summary</p>;

  return (
    <div className="p-4 w-full h-[400px]">
      <h2 className="text-lg font-bold mb-4 text-white">
        User Summary (by Status)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
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

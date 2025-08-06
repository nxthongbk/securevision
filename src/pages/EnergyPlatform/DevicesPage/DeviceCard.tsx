import { Cpu, Gear, Power } from '@phosphor-icons/react';
import dayjs from 'dayjs';

type DeviceCardProps = {
  device: any;
  telemetry: Record<string, any>;
  getTelemetryValue: (telemetry: Record<string, any>, key: string) => string;
  getLatestTs: (telemetry: Record<string, any>) => number | null;
  safeValue: (v: unknown) => string;
};

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  telemetry,
  getTelemetryValue,
  getLatestTs,
  safeValue,
}) => {
  const power = getTelemetryValue(telemetry, 'TotalActivePower');
  const efficiency = getTelemetryValue(telemetry, 'PowerFactor');
  const schedule = getTelemetryValue(telemetry, 'Schedule');
  const status = device.status || 'Unknown';

  const statusColor =
    status === 'Active' || status === 'CONNECTED'
      ? 'text-green-400'
      : status === 'Standby'
        ? 'text-yellow-400'
        : 'text-gray-400';

  const dotColor =
    status === 'Active' || status === 'CONNECTED'
      ? 'bg-green-400'
      : status === 'Standby'
        ? 'bg-yellow-400'
        : 'bg-gray-400';

  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg p-6 flex flex-col h-[338px] relative">
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
        <span className={`${statusColor} text-sm`}>{status}</span>
      </div>
      <div className="flex flex-col items-start">
        <div
          className="p-3 bg-white/10 rounded-lg text-white flex items-center justify-center mb-3"
          style={{ minWidth: 36, minHeight: 36 }}
        >
          <Cpu size={24} color="#fff" />
        </div>
        <span className="block text-white font-medium text-lg leading-tight">
          {safeValue(device?.name)}
        </span>
        <span className="block text-white/80 text-sm mt-1">
          {safeValue(device?.tenantInfo?.name)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-y-1 text-white/60 text-sm">
        <div>Power Usage</div>
        <div className="text-right text-white">{power} KWh</div>
        <div>Efficiency</div>
        <div className="text-right text-white">{efficiency} %</div>
        <div>Schedule</div>
        <div className="text-right text-white">{schedule}</div>
        <div>Last Updated</div>
        <div className="text-right text-white">
          {getLatestTs(telemetry)
            ? dayjs(getLatestTs(telemetry)).format('DD/MM/YYYY HH:mm:ss')
            : '-'}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-8">
        <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 rounded-lg flex items-center justify-center gap-2 transition">
          <Power size={18} color="#fff" />
          Toggle
        </button>
        <button className="bg-white/10 hover:bg-white/20 rounded-lg py-2 px-3 text-white transition">
          <Gear size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;

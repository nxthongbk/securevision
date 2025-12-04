import { useGetLatestTelemetry } from '../../handleApi';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import { useState, useEffect } from 'react';

interface IProps {
  deviceId: string;
  deviceName?: string;
}

export default function TabConfiguration(props: IProps) {
  const { deviceId } = props;

  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId
  });

  const { rows } = useSocketLatestTelemetry({
    dependency: [deviceId],
    topic: `/topic/${deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });

  const [partitionList, setPartitionList] = useState<any[]>([]);
  const [zoneList, setZoneList] = useState<any[]>([]);

  const partitionsTelemetry = rows?.find((row) => row.key === 'partitions');
  const zonesTelemetry = rows?.find((row) => row.key === 'zones');

  useEffect(() => {
    if (!partitionsTelemetry?.value) return;

    let parsedPartitions: any[] = [];
    try {
      const parsed = JSON.parse(partitionsTelemetry.value);
      parsedPartitions = Array.isArray(parsed.value) ? parsed.value : [];
    } catch {}

    // Standardize status to 'Arm', 'Disarm', or 'Alarm'
    parsedPartitions = parsedPartitions.map((p) => ({
      ...p,
      status: Array.isArray(p.status)
        ? p.status.map((s: string) => {
            if (s.toLowerCase() === 'disarmed') return 'Disarm';
            if (s.toLowerCase() === 'alarm') return 'Alarm';
            return 'Arm';
          })
        : [p.status?.toLowerCase() === 'disarmed' ? 'Disarm' : p.status?.toLowerCase() === 'alarm' ? 'Alarm' : 'Arm']
    }));

    setPartitionList((prev) =>
      JSON.stringify(prev) !== JSON.stringify(parsedPartitions)
        ? parsedPartitions
        : prev
    );
  }, [partitionsTelemetry?.value]);

  useEffect(() => {
    if (!zonesTelemetry?.value) return;

    let parsedZones: any[] = [];
    try {
      const parsed = JSON.parse(zonesTelemetry.value);
      parsedZones = Array.isArray(parsed.value) ? parsed.value : [];
    } catch {}

    setZoneList((prev) =>
      JSON.stringify(prev) !== JSON.stringify(parsedZones) ? parsedZones : prev
    );
  }, [zonesTelemetry?.value]);

  const [selectedPartition, setSelectedPartition] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('Arm');
  const [isSaving, setIsSaving] = useState(false);

  const openDialog = (partition: any) => {
    setSelectedPartition(partition);
    setSelectedMode(partition.status?.[0] || 'Arm'); // Use first status
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPartition(null);
  };

  const handleSave = async () => {
    if (!selectedPartition) return;

    setIsSaving(true);
    const action = selectedMode.toLowerCase(); // API expects 'arm' or 'disarm'

    try {
      const response = await fetch(
        'https://scity-dev.innovation.com.vn/api/alarm/setArm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site_id: 1639201,
            partition_id: selectedPartition.id,
            action
          })
        }
      );
      const data = await response.json();
      console.log('API response:', data);
    } catch (err) {
      console.error('Failed to update partition:', err);
    } finally {
      setIsSaving(false);
      closeDialog();
    }
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <div className="mb-2 font-bold text-lg">Partitions</div>

      <div className="flex gap-4 mb-6">
        {partitionList.map((p) => {
          const statuses = Array.isArray(p.status) ? p.status : [p.status || ''];

          let bgClass = 'bg-[#00D492]'; // default green
          let displayText = statuses.join(', ');

          if (statuses.includes('Arm')) {
            bgClass = 'bg-[#FF6467]'; // red
            displayText = 'Arm';
          } else if (statuses.includes('Disarm')) {
            bgClass = 'bg-[#00D492]'; // green
            displayText = 'Disarm';
          } else if (statuses.includes('Alarm')) {
            bgClass = 'bg-[#FDC700]'; // yellow
            displayText = 'Alarm';
          }

          return (
            <div
              key={p.id}
              className={`bg-[#031f2f] border border-[#FFFFFF33] shadow p-4 min-w-[200px] flex flex-col items-center`}
            >
              <div className="font-semibold mb-2">{p.name}</div>
              <div
                className={`px-3 py-1 rounded-full text-black text-sm font-bold mb-2 ${bgClass}`}
              >
                {displayText}
              </div>
              <button
                className="w-full bg-white text-gray-700 text-sm font-bold py-2 rounded mb-2 border mt-2 shadow-sm"
                onClick={() => openDialog(p)}
              >
                Configure
              </button>
            </div>
          );
        })}
      </div>

      <div className="mb-2 font-bold text-lg">Zones</div>
      <div className="grid grid-cols-8 gap-2">
        {zoneList.map((zone) => {
          let bgClass = '';
          switch (zone.status) {
            case 'Normal':
              bgClass = 'bg-[#00D492]';
              break;
            case 'Alarm':
              bgClass = 'bg-[#FF6467]';
              break;
            case 'Open':
              bgClass = 'bg-[#FDC700]';
              break;
            case 'Not used':
              bgClass = 'bg-gray-400';
              break;
            default:
              bgClass = 'bg-[#FDC700]';
              break;
          }
          return (
            <div
              key={zone.id}
              className={`w-[100px] px-3 py-2 rounded font-semibold text-white text-sm text-center ${bgClass}`}
            >
              <div className="text-xs">Zone: {zone.id}</div>
              <div className="text-sm font-semibold">{zone.name || 'Unnamed'}</div>
            </div>
          );
        })}
      </div>

      {isDialogOpen && selectedPartition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#101828] p-6 rounded-lg shadow-lg w-[400px]">
            <div className="text-lg font-bold mb-4">
              Configure: {selectedPartition.name}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Partition Name</label>
              <input
                type="text"
                className="w-full border border-[#FFFFFF33] bg-[#232a39] px-3 py-2"
                value={selectedPartition.name}
                onChange={(e) =>
                  setSelectedPartition({ ...selectedPartition, name: e.target.value })
                }
                disabled={isSaving}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mode</label>
              <select
                className="w-full border border-gray-300 bg-[#232a39] px-2 py-2"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                disabled={isSaving}
              >
                <option value="Arm">Arm</option>
                <option value="Disarm">Disarm</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-800 rounded hover:bg-none text-sm"
                onClick={closeDialog}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

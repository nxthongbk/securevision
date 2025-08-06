import { useEffect, useState } from 'react';
import { Plus, MagnifyingGlass, Funnel, Cpu } from '@phosphor-icons/react';
import DeviceCard from './DeviceCard';
import { useLiveDeviceTelemetry } from '../CommonComponents/useLiveDeviceTelemetry';

function useDebounce(value: string, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function DevicesPage() {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (search !== debouncedSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [search, debouncedSearch]);

  const {
    isLoading,
    filteredDevices,
    liveTelemetryMap,
    getTelemetryValue,
    getLatestTs,
    safeValue,
  } = useLiveDeviceTelemetry({ search: debouncedSearch });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Device Manager</h1>
            <p className="text-gray-300">Control and monitor all your connected devices</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition mt-2 tablet:mt-0">
            <Plus size={20} />
            Add Device
          </button>
        </div>

        <div className="w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                <MagnifyingGlass className="text-white/50 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Search devices..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                />
              </div>
              <Funnel size={18} className="text-white/50" />
              <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/90 focus:outline-none">
                <option>All Devices</option>
                {/* Add more filter options here */}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 miniLaptop:grid-cols-3 gap-6 min-h-[300px]">
        {isLoading || isSearching ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 animate-fade-in">
            <svg
              className="animate-spin h-10 w-10 text-emerald-400 mb-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <div className="text-white text-lg font-medium tracking-wide animate-pulse">
              {search ? ' ' : 'Loading devices...'}
            </div>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-white col-span-full text-center py-12 text-lg opacity-70">
            <Cpu size={64} className="mx-auto mb-4 border-white/20 p-2 rounded-md bg-white/10" />
            No devices found.
          </div>
        ) : (
          filteredDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              telemetry={liveTelemetryMap[device?.id] || {}}
              getTelemetryValue={getTelemetryValue}
              getLatestTs={getLatestTs}
              safeValue={safeValue}
            />
          ))
        )}
      </div>
    </div>
  );
}

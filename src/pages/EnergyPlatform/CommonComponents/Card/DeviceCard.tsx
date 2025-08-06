type Props = {
  name: string;
  power: string;
  status: string;
  efficiency: string;
};

export const DeviceCard = ({ name, power, status, efficiency }: Props) => {
  const statusColor = {
    Active: 'text-green-400',
    Standby: 'text-yellow-400',
    Off: 'text-gray-400',
  }[status];

  return (
    <div className="flex justify-between p-4 bg-[#223354] rounded-xl text-white">
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className={`${statusColor} text-sm`}>{status}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">{power}</p>
        <p className="text-xs text-gray-400">Efficiency: {efficiency}</p>
      </div>
    </div>
  );
};

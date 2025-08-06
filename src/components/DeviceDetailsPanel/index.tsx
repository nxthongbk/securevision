import './style.scss';
import PopupDeleteAlarmDevice from '~/pages/systemAdmin/SysDevicePage/Popup/PopupDeleteAlarmDevice';

interface Field {
  label: string;
  key: string;
}

interface DeviceDetailsPanelProps {
  device: any;
  fields: Field[];
  backgroundImage: string;
  panelClassName?: string;
  customRows?: React.ReactNode;
  isFireAlarm?: boolean;
}

// function useStreamChecker({
//   setItemCam,
//   setIsChecking,
//   setIsStreamReady,
//   handleStream,
// }: {
//   setItemCam: (cam: any) => void;
//   setIsChecking: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   setIsStreamReady: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   handleStream: (type: 'START' | 'STOP', ipV4: string) => void;
// }) {
//   return useCallback(
//     async (cam: any) => {
//       const ip = cam?.IPv4;
//       if (!ip) return;

//       setIsChecking(prev => ({ ...prev, [ip]: true }));
//       setIsStreamReady(prev => ({ ...prev, [ip]: false }));
//       handleStream('START', ip);

//       const streamUrl = `http://192.168.12.10:9090/stream/${ip.replace(/\./g, '_')}/index.m3u8`;
//       const maxAttempts = 10;
//       let attempt = 0;

//       const checkStreamReady = async () => {
//         try {
//           const res = await fetch(streamUrl, { method: 'HEAD' });
//           if (res.ok) {
//             setItemCam(cam);
//             setIsChecking(prev => ({ ...prev, [ip]: false }));
//             setIsStreamReady(prev => ({ ...prev, [ip]: true }));
//           } else {
//             throw new Error('Stream not ready');
//           }
//         } catch {
//           if (attempt < maxAttempts) {
//             attempt++;
//             setTimeout(checkStreamReady, 1000);
//           } else {
//             console.error('Stream failed to load after multiple attempts');
//             setIsChecking(prev => ({ ...prev, [ip]: false }));
//           }
//         }
//       };

//       checkStreamReady();
//     },
//     [setItemCam, setIsChecking, setIsStreamReady, handleStream]
//   );
// }

const safeValue = (value: any) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    if ('name' in value && typeof value.name === 'string') return value.name;
    return '';
  }
  return String(value);
};

const DeviceDetailsPanel = ({
  device,
  fields,
  backgroundImage,
  panelClassName = 'details-panel',
  customRows,
  isFireAlarm = false,
}: DeviceDetailsPanelProps) => {
  if (!device) return null;
  // const [itemCam, setItemCam] = useState(null);
  // const [isChecking, setIsChecking] = useState<Record<string, boolean>>({});
  // const [isStreamReady, setIsStreamReady] = useState<Record<string, boolean>>({});

  // const startStopStream = useMutation({
  //   mutationFn: (body: { ipV4: string; type: 'START' | 'STOP' }) => {
  //     if (body.type === 'START') {
  //       return controlCenterService.startStream({ ipV4: body.ipV4 });
  //     } else {
  //       return controlCenterService.stopStream({ ipV4: body.ipV4 });
  //     }
  //   },
  // });

  // const handleStream = (type: 'START' | 'STOP', ipV4: string) => {
  //   startStopStream.mutate({ ipV4, type });
  // };

  // const streamChecker = useStreamChecker({
  //   setItemCam,
  //   setIsChecking,
  //   setIsStreamReady,
  //   handleStream,
  // });

  const deviceProfileName =
    device.deviceProfile && device.deviceProfile.name ? device.deviceProfile.name : device.type;

  return (
    <div className={panelClassName} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="details-id-row">
        <span className="details-id">{safeValue(device.name ? device.name : device.id)}</span>
        <span
          className={`details-status-badge status-${
            device.alarmStatus
              ? safeValue(device.alarmStatus).toLowerCase()
              : safeValue(device.status).toLowerCase()
          }`}
        >
          {device.alarmStatus ? 'WARNING' : safeValue(device.status)}
        </span>
      </div>
      <div className="details-location">
        {safeValue(device.locationInfo?.name ?? device.location ?? 'TMA')}
      </div>
      <div className="details-row">
        <span className="details-label">TYPE</span>
        <span className="details-value">{safeValue(deviceProfileName)}</span>
      </div>
      {fields.map(field => (
        <div className="details-row" key={field.key}>
          <span className="details-label">{field.label}</span>
          <span className="details-value">{safeValue(device[field.key])}</span>
        </div>
      ))}
      {customRows}
      {isFireAlarm && (
        <>
          <div className="device-actions flex gap-4">
            <button className="btn clear-alarm">LIVESTREAM</button>
            <PopupDeleteAlarmDevice token={device?.token} />
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceDetailsPanel;

import './style.scss';
import dotIcon from '~/assets/images/png/Dot.png';
import spannerIcon from '~/assets/images/png/spanner.png';
import alertTriangleIcon from '~/assets/images/png/alertTriangle.png';
import blockedIcon from '~/assets/images/png/blocked.png';
import { useDownloadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';

interface DeviceCardProps {
  device: any;
  icon: string;
  typeLabel?: string;
  powerLabel?: string;
  deviceType: 'streetlight' | 'cctv';
}

const DeviceCardItem = ({
  device,
  icon,
  typeLabel = 'TYPE',
  powerLabel = 'POWER SUPPLY',
  deviceType,
}: DeviceCardProps) => {
  const imageFileId =
    deviceType === 'cctv' && device.deviceProfile?.imageUrl ? device.deviceProfile.imageUrl : '';

  const { imageUrl } =
    deviceType === 'cctv' ? useDownloadFileAvatar(imageFileId) : { imageUrl: '' };

  const deviceProfileName =
    deviceType === 'cctv' && device.deviceProfile?.name ? device.deviceProfile.name : '';

  const updatedAtString =
    deviceType === 'streetlight'
      ? device.power
      : device.updatedAt
        ? new Date(device.updatedAt)
            .toLocaleString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour12: false,
            })
            .replace(',', '')
        : '';

  const statusBadgeClass =
    'device-item-status-badge status-' +
    (device.alarmStatus === 'ALARM' ? 'alarm' : (device.status || '').toLowerCase());

  const cardClass = [
    'device-card-item',
    `status-${(device.status || '').toLowerCase()}`,
    device.alarmStatus === 'ALARM' ? 'alarm' : '',
    'bg',
  ]
    .filter(Boolean)
    .join(' ');

  const cctvImgSrc =
    imageUrl ||
    (device.deviceProfile?.imageUrl?.startsWith('http')
      ? device.deviceProfile.imageUrl
      : device.deviceProfile?.imageUrl
        ? `/images/${device.deviceProfile.imageUrl}`
        : icon);

  return (
    <div className={cardClass}>
      <div className="device-card-item-header">
        <div>
          <div className="device-item-id">
            {deviceType === 'cctv'
              ? typeof device.name === 'object'
                ? JSON.stringify(device.name)
                : String(device.name ?? 'CAM')
              : String(device.id)}
          </div>
          <div className="device-item-location">
            {deviceType === 'cctv'
              ? device.locationInfo &&
                typeof device.locationInfo === 'object' &&
                typeof device.locationInfo.name === 'string'
                ? device.locationInfo.name
                : String(device.locationInfo ?? 'TMA')
              : device.location &&
                  typeof device.location === 'object' &&
                  typeof device.location.name === 'string'
                ? device.location.name
                : String(device.location ?? '')}
          </div>
        </div>
        <img
          src={deviceType === 'cctv' ? cctvImgSrc : icon}
          alt=""
          className="device-card-item-icon"
        />
      </div>
      <div className="device-card-item-body">
        <div>
          <span className="type-label">{typeLabel}</span>
          <span className="type-value">
            {deviceType === 'cctv'
              ? typeof deviceProfileName === 'object'
                ? JSON.stringify(deviceProfileName)
                : String(deviceProfileName)
              : typeof device.type === 'object'
                ? JSON.stringify(device.type)
                : String(device.type ?? '')}
          </span>
        </div>
        <div>
          <span className="power-label">{powerLabel}</span>
          <span className="power-value">{String(updatedAtString ?? '')}</span>
        </div>
      </div>
      <div className={statusBadgeClass}>
        {device.status === 'Active' && <img src={dotIcon} alt="Active" className="status-dot" />}
        {(device.status === 'Error' || device.alarmStatus === 'ALARM') && (
          <img src={alertTriangleIcon} alt="Error" className="status-dot" />
        )}
        {device.status === 'Maintenance' && (
          <img src={spannerIcon} alt="Maintenance" className="status-dot" />
        )}
        {device.status === 'Offline' && (
          <img src={blockedIcon} alt="Offline" className="status-dot" />
        )}
        <span className="status-text">
          {String(device.alarmStatus === 'ALARM' ? 'WARNING' : (device.status ?? ''))}
        </span>
      </div>
    </div>
  );
};

export default DeviceCardItem;

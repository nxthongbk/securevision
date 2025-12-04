import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCustom from '~/components/DialogCustom';
import StatusChip from '~/components/StatusChip';
import { FormatTime } from '~/utils/formatDateTime';

export default function PopupDetail({
  open,
  alertDetail,
  onClose
}: {
  open: boolean;
  alertDetail: Record<string, any> | null;
  onClose: () => void;
}) {
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });

  const fields = [
    { label: 'ID', value: alertDetail.id, key: 'id' },
    { label: alarmTranslate('location'), value: alertDetail.location, key: 'location' },
    { label: alarmTranslate('alarm-device'), value: '000001', key: 'alarmDevice' },
    {
      label: alarmTranslate('start-time'),
      value: FormatTime(alertDetail.startTime),
      key: 'startTime'
    },
    {
      label: alarmTranslate('end-time'),
      value: '-',
      key: 'endTime'
    },
    {
      label: alarmTranslate('status'),
      value: alertDetail.status,
      key: 'status'
    }
  ];

  const renderField = ({ label, value, key }, order) => {
    let valueJSX: JSX.Element;

    switch (key) {
      case 'status':
        valueJSX = <StatusChip status={value} />;
        break;
      default:
        valueJSX = (
          <Typography variant='body3' className='flex-1'>
            {value}
          </Typography>
        );
    }

    return (
      <div
        key={key}
        className={`flex w-full px-[12px] py-[12px] ${order % 2 === 0 ? ' bg-[var(--grey-primary-60)] rounded-md' : ''}`}
      >
        <Typography variant='label3' className='w-[28%]'>
          {label}
        </Typography>
        {valueJSX}
      </div>
    );
  };

  return (
    <DialogCustom
      open={open}
      title={alarmTranslate('fire-alert-info')}
      maxWidth='600px'
      handleClose={onClose}
      content={
        <div className='flex flex-col gap-6 px-[16px] py-[24px] h-[370px]'>
          <div className='flex flex-col'>{fields.map((data, index) => renderField(data, index))}</div>
        </div>
      }
    />
  );
}

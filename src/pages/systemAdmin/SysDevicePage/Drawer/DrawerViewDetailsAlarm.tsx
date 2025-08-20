import { DrawerProps, Typography } from '@mui/material';
import DrawerViewDetails from '../../../../components/Drawer/DrawerViewDetails';
import { CardAlarmProps } from '../Card/CardAlarm';
import { useTranslation } from 'react-i18next';
import StatusChip from '~/components/StatusChip';

interface DrawerViewDetailsAlarmProps extends DrawerProps {
  data: CardAlarmProps;
}

interface Row {
  label: string;
  value: any;
}

export default function DrawerViewDetailsAlarm(props: DrawerViewDetailsAlarmProps) {
  const { data, ...rest } = props;
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

  const rows: Row[] = [
    { label: t('update-time'), value: data.updateTime },
    { label: t('type-alarm'), value: data.type },
    { label: t('device-status'), value: <StatusChip status={data.status} /> },
    { label: t('detail'), value: data.detail },
    { label: t('start-time'), value: data.startTime }
  ];

  return (
    <DrawerViewDetails title={t('alarm-details')} anchor='bottom' {...rest}>
      {rows.map(({ label, value }, idx) => {
        return (
          <div
            key={idx}
            className={`w-full flex justify-start items-start py-3 px-4 rounded-md ${idx % 2 === 0 ? ' bg-[var(--grey-primary-60)]' : ''}`}
          >
            <div className='w-[30%]'>
              <Typography variant='label2'>{label}</Typography>
            </div>
            <div className='w-[70%] flex justify-start items-center h-full'>
              <Typography variant='body2'>{value}</Typography>
            </div>
          </div>
        );
      })}
    </DrawerViewDetails>
  );
}

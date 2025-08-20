import { DrawerProps, Typography } from '@mui/material';
import DrawerViewDetails from '../../../../components/Drawer/DrawerViewDetails';
import { CardLatestTelemetryProps } from '../Card/CardLatestTelemetry';
import { useTranslation } from 'react-i18next';

interface DrawerViewLatestTelemetryDetailsProps extends DrawerProps {
  data: CardLatestTelemetryProps;
}

interface Row {
  label: string;
  value: any;
}

export default function DrawerViewLatestTelemetryDetails(props: DrawerViewLatestTelemetryDetailsProps) {
  const { data, ...rest } = props;
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

  const rows: Row[] = [
    { label: t('update-time'), value: data.time },
    { label: 'Key', value: data.key },
    { label: 'Value', value: data.value }
  ];

  return (
    <DrawerViewDetails title={t('telemetry-details')} anchor='bottom' {...rest}>
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

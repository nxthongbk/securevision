import { FormatTime } from '~/utils/formatDateTime';
import StatusChip from '~/components/StatusChip';
import { Typography, Box } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';

type Data = {
  key: string;
  label: string;
  value: string;
};

function TabInfo({ alertDetail }: Readonly<{ alertDetail: Record<string, any> }>) {
  const translate = (text: string) => translationCapitalFirst(text, 'alarm-page');

  const data: Data[] = [
    { key: 'id', label: 'ID', value: alertDetail.code },
    { key: 'location', label: translate('location'), value: alertDetail.locationInfo?.name ?? '-' },
    { key: 'type', label: translate('alert-type'), value: alertDetail.type ?? '-' },
    { key: 'status', label: translate('status'), value: alertDetail.status },
    {
      key: 'startTime',
      label: translate('start-time'),
      value: alertDetail.createdAlarmBy?.date ? FormatTime(alertDetail.createdAlarmBy.date) : '-'
    },
    {
      key: 'endTime',
      label: translate('end-time'),
      value: alertDetail.updatedAlarmBy?.date ? FormatTime(alertDetail.updatedAlarmBy.date) : '-'
    },
    { key: 'verifyBy', label: translate('verify-by'), value: alertDetail.updatedAlarmBy?.username ?? '-' },
    {
      key: 'timeVerify',
      label: translate('time-verify'),
      value: alertDetail.updatedAlarmBy?.date ? FormatTime(alertDetail.updatedAlarmBy.date) : '-'
    },
    { key: 'reason', label: translate('reason-cause'), value: alertDetail.reason ?? '-' }
  ];

  return (
    <Box className='w-full flex flex-col justify-start'>
      {data.map((item: Data, idx: number) => (
        <Box
          key={item.key}
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'start',
            alignItems: 'start',
            px: '16px', // Tailwind px-4
            py: '12px', // Tailwind py-3
            backgroundColor: idx % 2 === 0 ? '#03111b' : '#031423',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 0, // no rounding
          }}
        >
          <Box sx={{ width: '30%' }}>
            <Typography variant='label2' sx={{ color: 'white' }}>
              {item.label}
            </Typography>
          </Box>
          <Box sx={{ width: '70%' }}>
            {item.key === 'status' ? (
              <StatusChip status={item.value} />
            ) : (
              <Typography variant='body2' sx={{ color: 'white' }}>
                {item.value}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default TabInfo;

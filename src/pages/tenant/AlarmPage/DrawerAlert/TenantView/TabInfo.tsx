import { FormatTime } from '~/utils/formatDateTime';
import StatusChip from '~/components/StatusChip';
import { Typography } from '@mui/material';
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
    <div className='w-full flex flex-col justify-start'>
      {data?.map((item: Data, idx: number) => {
        return (
          <div
            key={item.key}
            className={`w-full flex justify-start items-start py-3 px-4 rounded-md ${idx % 2 === 0 ? ' bg-[var(--grey-primary-60)]' : ''}`}
          >
            <div className='w-[30%]'>
              <Typography variant='label2'>{item.label}</Typography>
            </div>
            <div className='w-[70%]'>
              {item.key === 'status' ? (
                <StatusChip status={item.value} />
              ) : (
                <Typography variant='body2'>{item.value}</Typography>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TabInfo;

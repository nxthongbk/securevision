import { FormatTime } from '~/utils/formatDateTime';
import StatusChip from '~/components/StatusChip';
import { Typography, Box } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import dayjs from 'dayjs';

type Data = {
  key: string;
  label: string;
  value: string;
};

function TabInfo({ alertDetail }: Readonly<{ alertDetail: Record<string, any> }>) {
  const translate = (text: string) => translationCapitalFirst(text, 'alarm-page');

  // 🔹 Pull first alarm once, so we don’t repeat lookups
  const alarm = alertDetail.alarms?.[0];

  const alarmDateTime = alarm?.createdAlarmBy?.date;
  const deviceId = alarm?.deviceInfo?.id;
  const formattedDate = alarmDateTime ? dayjs(alarmDateTime).format('YYYY-MM-DD_HH:mm:ss') : null;

  // 🔹 Video URL from alarm + device
  const videoUrl = formattedDate
    ? `https://scity-dev.innovation.com.vn/api/media/get_video?alarm_time=${formattedDate}&camera=camera-${deviceId}`
    : null;

  const data: Data[] = [
    {
      key: 'id',
      label: 'ID',
      value: alarm?.deviceInfo?.code ? String(alarm.deviceInfo.code).padStart(6, '0') : '-'
    },
    {
      key: 'location',
      label: translate('location'),
      value: alertDetail.locationInfo?.name ?? '-' // keep from alertDetail
    },
    { key: 'type', label: translate('alert-type'), value: alarm?.type ?? alertDetail.type ?? '-' },
    { key: 'status', label: translate('status'), value: alarm?.status ?? alertDetail.status ?? '-' },
    {
      key: 'startTime',
      label: translate('start-time'),
      value: alarm?.createdAlarmBy?.date ? FormatTime(alarm.createdAlarmBy.date) : '-'
    },
    {
      key: 'endTime',
      label: translate('end-time'),
      value: alarm?.updatedAlarmBy?.date ? FormatTime(alarm.updatedAlarmBy.date) : '-'
    },
    {
      key: 'verifyBy',
      label: translate('verify-by'),
      value: alarm?.updatedAlarmBy?.username ?? alertDetail.updatedAlarmBy?.username ?? '-'
    },
    {
      key: 'timeVerify',
      label: translate('time-verify'),
      value: alarm?.updatedAlarmBy?.date
        ? FormatTime(alarm.updatedAlarmBy.date)
        : alertDetail.updatedAlarmBy?.date
        ? FormatTime(alertDetail.updatedAlarmBy.date)
        : '-'
    },
    {
      key: 'reason',
      label: translate('reason-cause'),
      value: alertDetail.reason ?? '-' // keep from alertDetail
    }
  ];

  return (
    <Box className="w-full flex flex-col gap-6">
      {/* 🔹 Video Section */}
      {videoUrl && (
        <Box className="h-[253px] relative border border-gray-700 overflow-hidden rounded-xl">
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video className="w-full h-full" controls autoPlay loop>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Box>
      )}

      {/* 🔹 Info Section */}
      <Box className="w-full flex flex-col justify-start">
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
              borderRadius: 0
            }}
          >
            <Box sx={{ width: '30%' }}>
              <Typography variant="label2" sx={{ color: 'white' }}>
                {item.label}
              </Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              {item.key === 'status' ? (
                <StatusChip status={item.value} />
              ) : (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {item.value}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TabInfo;

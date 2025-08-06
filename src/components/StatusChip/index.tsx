import { Box, Stack, Typography } from '@mui/material';

import { DATA_STATUS } from './constant';
import { useTranslation } from 'react-i18next';

const statusColors = {
  [DATA_STATUS.SKIP]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.VERIFY]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  },
  [DATA_STATUS.ACTIVE]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  },
  [DATA_STATUS.BLOCKED]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.CLOSED]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.WARNING]: {
    backgroundColor: 'var(--red-80)',
    dotColor: 'var(--red-200)',
    hasDot: true
  },
  //device status
  [DATA_STATUS.USED]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  },
  [DATA_STATUS.UNUSED]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.IS_WARNING]: {
    backgroundColor: 'var(--red-80)',
    dotColor: 'var(--semantic-alert)',
    hasDot: true
  },
  [DATA_STATUS.STOP_WARNING]: {
    backgroundColor: 'var(--orange-80)',
    dotColor: 'var(--orange-400)',
    hasDot: true
  },
  [DATA_STATUS.LOST_CONNECT]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.CONNECTED]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  },
  [DATA_STATUS.PENDING]: {
    backgroundColor: 'var(--orange-80)',
    dotColor: 'var(--orange-500)',
    hasDot: true
  },
  [DATA_STATUS.IGNORE]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.ALARM]: {
    backgroundColor: 'var(--red-80)',
    dotColor: 'var(--red-200)',
    hasDot: true
  },
  [DATA_STATUS.DISCONNECTED]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.CONFIRM]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  },
  [DATA_STATUS.PENDING]: {
    backgroundColor: 'var(--orange-80)',
    dotColor: 'var(--orange-500)',
    hasDot: true
  },
  [DATA_STATUS.IGNORE]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.ALARM]: {
    backgroundColor: 'var(--red-80)',
    dotColor: 'var(--red-200)',
    hasDot: true
  },
  [DATA_STATUS.DISCONNECTED]: {
    backgroundColor: 'var(--grey-primary-80)',
    dotColor: 'var(--grey-primary-200)',
    hasDot: true
  },
  [DATA_STATUS.CONFIRM]: {
    backgroundColor: 'var(--green-100)',
    dotColor: 'var(--green-500)',
    hasDot: true
  }
};

const StatusChip = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const { backgroundColor, hasDot, dotColor } = statusColors[status] || {};
  if (!status) return '---';
  return (
    <Stack
      direction={'row'}
      className='flex flex-row gap-[5px] items-center px-[8px] py-[2px] rounded-full !text-[12px] w-fit'
      sx={{ backgroundColor }}
    >
      {hasDot && <Box className='w-[8px] h-[8px] rounded-full' sx={{ backgroundColor: dotColor }} />}
      <Typography variant='caption' className='text-nowrap'>
        {t(`status.${status?.toLowerCase()}`)}
      </Typography>
    </Stack>
  );
};

export default StatusChip;

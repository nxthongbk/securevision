import { Box, Stack, Typography } from '@mui/material';
import { DATA_STATUS } from './constant';
import { useTranslation } from 'react-i18next';

const statusColors = {
  [DATA_STATUS.SKIP]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.VERIFY]: {
    dotColor: '#00C853',
    borderColor: '#00C85366',
    hasDot: true
  },
  [DATA_STATUS.ACTIVE]: {
    dotColor: '#00C853',
    borderColor: '#00C85366',
    hasDot: true
  },
  [DATA_STATUS.BLOCKED]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.CLOSED]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.WARNING]: {
    dotColor: '#FF5252',
    borderColor: '#FF525266',
    hasDot: true
  },
  [DATA_STATUS.USED]: {
    dotColor: '#00C853',
    borderColor: '#00C85366',
    hasDot: true
  },
  [DATA_STATUS.UNUSED]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.IS_WARNING]: {
    dotColor: '#FF9800',
    borderColor: '#FF980066',
    hasDot: true
  },
  [DATA_STATUS.STOP_WARNING]: {
    dotColor: '#FFA726',
    borderColor: '#FFA72666',
    hasDot: true
  },
  [DATA_STATUS.LOST_CONNECT]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.CONNECTED]: {
    dotColor: '#00C853',
    borderColor: '#00C85366',
    hasDot: true
  },
  [DATA_STATUS.PENDING]: {
    dotColor: '#FB8C00',
    borderColor: '#FB8C0066',
    hasDot: true
  },
  [DATA_STATUS.IGNORE]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.ALARM]: {
    dotColor: '#FF1744',
    borderColor: '#FF174466',
    hasDot: true
  },
  [DATA_STATUS.DISCONNECTED]: {
    dotColor: '#999999',
    borderColor: '#99999966',
    hasDot: true
  },
  [DATA_STATUS.CONFIRM]: {
    dotColor: '#00C853',
    borderColor: '#00C85366',
    hasDot: true
  }
};

const StatusChip = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const { hasDot, dotColor, borderColor } = statusColors[status] || {};
  if (!status) return '---';

  return (
    <Stack
      direction="row"
      className="flex flex-row gap-[5px] items-center px-[8px] py-[2px] rounded-full !text-[12px] w-fit"
      sx={{
        border: `1px solid ${borderColor}`
      }}
    >
      {hasDot && (
        <Box
          className="w-[8px] h-[8px] rounded-full"
          sx={{ backgroundColor: dotColor }}
        />
      )}
      <Typography variant="caption" className="text-nowrap">
        {t(`status.${status?.toLowerCase()}`)}
      </Typography>
    </Stack>
  );
};

export default StatusChip;

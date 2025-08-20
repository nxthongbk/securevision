import Typography from '@mui/material/Typography';
import AvatarTableRow from '~/components/AvatarTableRow';
import { Stack } from '@mui/material';
import StatusChip from '~/components/StatusChip';
import CardCustom from '../../../../components/CardCustom';


export default function CardDeviceProfile({ iconCard, nameCard, codeCard, alarmStatus, action }: { iconCard: string, nameCard: string, codeCard: any, alarmStatus?: string, action?: any }) {
  return (
    <CardCustom>
      <Stack direction={'row'} gap={'12px'}>
        <AvatarTableRow
          sx={{ height: '64px', width: '64px', borderRadius: '8px' }}
          avatarUrl={iconCard}
        />
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {nameCard}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {codeCard}
          </Typography>
          {alarmStatus && <StatusChip status={alarmStatus} />}
        </Stack>
        <Stack>
          {action}
        </Stack>
      </Stack>
    </CardCustom>
  );
}

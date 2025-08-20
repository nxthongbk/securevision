import AvatarTableRow from '~/components/AvatarTableRow';
import CardCustom from '../../../../components/CardCustom';
import { Stack } from '@mui/material';
import StatusChip from '~/components/StatusChip';
import Typography from '@mui/material/Typography';

export default function CardProfile({
  avatarUrl,
  tenant,
  tenantId,
  status,
  action
}: {
  avatarUrl: string;
  tenant: string;
  tenantId: any;
  status?: string;
  action?: any;
}) {
  return (
    <CardCustom>
      <Stack direction={'row'} gap={'12px'}>
        <AvatarTableRow sx={{ height: '64px', width: '64px', borderRadius: '8px' }} avatarUrl={avatarUrl} />
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {tenant}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {tenantId}
          </Typography>
          {status && <StatusChip status={status} />}
        </Stack>
        <Stack>{action}</Stack>
      </Stack>
    </CardCustom>
  );
}

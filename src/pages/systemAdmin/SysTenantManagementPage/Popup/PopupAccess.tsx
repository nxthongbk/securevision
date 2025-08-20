import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { translationCapitalFirst } from '~/utils/translate';

export default function PopupAccessTenant({ tenantCode }: { tenantCode: string }) {
  return (
    <Link to={`/?tenantCode=${tenantCode}`}>
      <Typography variant='button3'>{translationCapitalFirst("access-tenant",'tenantPage')}</Typography>
    </Link>
  );
}

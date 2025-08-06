import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { translationCapitalFirst } from '~/utils/translate';

export default function PopupViewDevice({id}:{id:string}) {
  return (
    <Link to={`/device-management?deviceProfile=${id}`}>
      <Typography variant='button3'>{translationCapitalFirst('view-devices', 'deviceProfile')}</Typography>
    </Link>
  );
}

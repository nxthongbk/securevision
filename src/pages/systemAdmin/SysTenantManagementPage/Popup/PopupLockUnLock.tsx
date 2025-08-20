import { ListItemIcon, MenuItem, Typography } from '@mui/material';

import IconPhosphor from '~/assets/iconPhosphor';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { translationCapitalFirst } from '~/utils/translate';
import { useSetStatusTenant } from '../handleApi';

export default function PopupLockUnLockTenant({ props }: { props: any }) {
  const { id, status } = props;
  const { isPending, isSuccess, mutate } = useSetStatusTenant();

  const handleSubmit = async () => {
    await mutate({ id, status: status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' });
  };

  const renderBtn = () => {
    return status === 'ACTIVE' ? (
      <MenuItem>
        <div className='w-full flex justify-start items-center'>
          <ListItemIcon>
            <IconPhosphor iconName='LockSimple' size={20} />
          </ListItemIcon>
          <Typography variant='body3'>{translationCapitalFirst('lock', 'tenantPage')}</Typography>
        </div>
      </MenuItem>
    ) : (
      <MenuItem>
        <div className='w-full flex justify-start items-center'>
          <ListItemIcon>
            <IconPhosphor iconName='LockSimpleOpen' size={20} />
          </ListItemIcon>
          <Typography variant='body3'>{translationCapitalFirst('unlock', 'tenantPage')}</Typography>
        </div>
      </MenuItem>
    );
  };

  return (
    <PopupCoverDelete
      btnComponent={renderBtn()}
      handleSubmit={handleSubmit}
      isSuccess={isSuccess}
      isLoading={isPending}
      message={
        status === 'BLOCKED'
          ? translationCapitalFirst('unlock-account-tenant-message', 'tenantPage')
          : translationCapitalFirst('lock-account-tenant-message', 'tenantPage')
      }
      title={
        status === 'BLOCKED'
          ? translationCapitalFirst('unlock-account-tenant', 'tenantPage')
          : translationCapitalFirst('lock-account-tenant', 'tenantPage')
      }
    />
  );
}

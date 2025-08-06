import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import { useResetPasswordTenant } from '../handleApi';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
export default function PopupResrtPasswordTenant({ id, phone }: { id: string; phone: string }) {
  const { isPending, isSuccess, mutate } = useResetPasswordTenant();
  const handleSubmit = async () => {
    await mutate({ id, phone });
  };
  const renderBtn = () => {
    return (
      <MenuItem>
        <div className='flex justify-start w-full items-center'>
          <ListItemIcon>
            <IconPhosphor iconName='Password' size={20} />
          </ListItemIcon>
          <Typography variant='body3'>{translationCapitalFirst('reset-password', 'tenantPage')}</Typography>
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
      message={translationCapitalFirst('reset-password-account-tenant-message', 'tenantPage')}
      title={translationCapitalFirst('reset-password-account-tenant', 'tenantPage')}
    />
  );
}

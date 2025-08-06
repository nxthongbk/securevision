import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { useDeleteDeviceProfile } from '../handleApi';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import ButtonCustom from '~/components/ButtonCustom';

export default function PopupDelete({ id, totalDevices }: { id: string; totalDevices: number }) {
  const { isPending, isSuccess, mutate } = useDeleteDeviceProfile(id);
  const handleDelete = () => {
    mutate();
  };
  const allowDelete = totalDevices === 0;
  const title = translationCapitalFirst(
    allowDelete ? 'delete-device-profile' : 'not-able-delete-profile-title',
    'deviceProfile'
  );
  const message = translationCapitalFirst(
    allowDelete ? 'delete-device-profile-message' : 'not-able-delete-profile-message',
    'deviceProfile'
  );

  const renderGroupActionButton = (onClose) => {
    return (
      <ButtonCustom className='hover:bg-white' color='primary' variant='contained' onClick={onClose}>
        <Typography variant='button3' fontWeight={600}>
          {translationCapitalFirst('close', 'deviceProfile')}
        </Typography>
      </ButtonCustom>
    );
  };

  return (
    <PopupCoverDelete
      btnComponent={
        <MenuItem>
          <div className='flex justify-start items-center'>
            <ListItemIcon>
              <IconPhosphor iconName='TrashSimple' size={20} />
            </ListItemIcon>
            <Typography variant='body3'>{translationCapitalFirst('delete')}</Typography>
          </div>
        </MenuItem>
      }
      isSuccess={isSuccess}
      handleSubmit={handleDelete}
      title={title}
      message={message}
      isLoading={isPending}
      customGroupActionButton={allowDelete ? undefined : renderGroupActionButton}
    />
  );
}

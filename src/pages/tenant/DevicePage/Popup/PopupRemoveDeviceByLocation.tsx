import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import IconPhosphor from '~/assets/iconPhosphor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import deviceService from '~/services/device.service';
import handleNotificationMessege from '~/utils/notification';

export default function PopupRemoveDeviceByLocation({
  deviceToken,
  onChildClose
}: {
  deviceToken: string;
  onChildClose?: (isClose: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deviceService.unassignDevice(deviceToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    },
    onError: (error: any) => {
      handleNotificationMessege(error?.response?.data?.data ?? error.message);
    }
  });

  const handleUnAssignDevice = () => {
    mutation.mutate();
  };

  return (
    <PopupCoverDelete
      btnComponent={
        <MenuItem>
          <div className='flex justify-start items-center'>
            <ListItemIcon>
              <IconPhosphor iconName='X' size={20} />
            </ListItemIcon>
            <Typography variant='body3'>
              {translationCapitalFirst('remove-device-by-location', 'devicePage')}
            </Typography>
          </div>
        </MenuItem>
      }
      isSuccess={mutation?.isSuccess}
      handleSubmit={handleUnAssignDevice}
      title='devicePage.remove-device'
      message='devicePage.remove-device-message'
      isLoading={mutation?.isPending}
      handleClosePopup={() => onChildClose?.(true)}
    />
  );
}

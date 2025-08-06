import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import deviceService from '~/services/device.service';
import handleNotificationMessege from '~/utils/notification';
import { TrashSimple } from '@phosphor-icons/react';

export default function PopupRemoveNoti({ deviceToken }: { deviceToken: string }) {
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
          <div className='flex items-center justify-start'>
            <ListItemIcon>
              <TrashSimple></TrashSimple>
            </ListItemIcon>
            <Typography variant='body3'>
              {translationCapitalFirst('delete')}
            </Typography>
          </div>
        </MenuItem>
      }
      isSuccess={mutation?.isSuccess}
      handleSubmit={handleUnAssignDevice}
      title='devicePage.delete-notification'
      message='devicePage.message-notification'
      isLoading={mutation?.isPending}
    />
  );
}

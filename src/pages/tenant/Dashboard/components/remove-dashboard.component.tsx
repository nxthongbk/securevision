import PopupCoverDelete from '~/components/Modal/DeletePopup';
import { MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashSimple } from '@phosphor-icons/react';
import { dashboardService } from '~/services/dashboard.service';

export default function PopupRemoveDashboard({ dashboardId }: { dashboardId?: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => dashboardService.deleteDashboardById(dashboardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllDashboard'] });
    }
  });

  const handleUnAssignDevice = () => {
    mutation.mutate();
  };

  return (
    <PopupCoverDelete
      btnComponent={
        <MenuItem className='gap-2 !text-sm'>
          <TrashSimple size={20} /> Xoá
        </MenuItem>
      }
      isSuccess={mutation?.isSuccess}
      handleSubmit={handleUnAssignDevice}
      title='remove-title-dashboard'
      message='confirm-remove-dashboard'
      isLoading={mutation?.isPending}
    />
  );
}

import { useState } from 'react';
import { Typography } from '@mui/material';
import ButtonCustom from '~/components/ButtonCustom';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import alarmService from '~/services/alarm.service';
import handleNotificationMessege from '~/utils/notification';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PopupDeleteAlarmDevice({ id, token }: { id?: string; token?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });
  const queryClient = useQueryClient();

  const deleteByIdMutation = useMutation({
    mutationFn: ({ alarmId }: { alarmId: string }) => alarmService.deleteAlarmID(alarmId),
    onError: (error: any) => {
      handleNotificationMessege(error.response?.data?.data || error.message, 'error');
    },
    onSuccess: () => {
      handleNotificationMessege('Delete successful!', 'success');
      queryClient.invalidateQueries({ queryKey: ['getAlarmDevice'] });
      setIsSuccess(true); 
    }
  });


  const deleteByTokenMutation = useMutation({
    mutationFn: (token: string) => alarmService.deleteAlarmToken(token),
    onError: (error: any) => {
      handleNotificationMessege(error.response?.data?.data || error.message, 'error');
    },
    onSuccess: () => {
      handleNotificationMessege('Delete successful!', 'success');
      queryClient.invalidateQueries({ queryKey: ['getAlarmDevice'] });
      setIsSuccess(true); 
    }
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (id && !token) {
        await deleteByIdMutation.mutateAsync({ alarmId: id });
      } else if (token && !id) {
        await deleteByTokenMutation.mutateAsync(token);
      } else {
        handleNotificationMessege('Invalid parameters. Please provide either ID or Token.', 'error');
        setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const btnComponent = (
    <ButtonCustom
      variant='contained'
      className='gap-3'
      sx={{ backgroundColor: '#ff1f1f', color: '#3A3D41', height: 32 }}
      disabled={isLoading}
    >
      <Typography variant='button3' color={'white'}>
        {token ? t('delete-all-alarm-device') : t('delete-alarm-device')}
      </Typography>
    </ButtonCustom>
  );

  return (
    <PopupCoverDelete
      btnComponent={btnComponent}
      isSuccess={isSuccess}
      handleSubmit={handleDelete}
      title='devicePage.delete-alarm-device'
      message='devicePage.delete-alarm-device-message'
      isLoading={isLoading}
    />
  );
}

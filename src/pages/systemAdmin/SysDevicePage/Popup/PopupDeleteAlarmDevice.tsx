import { useMutation, useQueryClient } from '@tanstack/react-query';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import alarmService from '~/services/alarm.service';
import handleNotificationMessege from '~/utils/notification';
import { useState } from 'react';

export default function PopupDeleteAlarmDevice({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const turnOffAlarmMutation = useMutation({
    mutationFn: async ({ token, data }: { token: string; data: any }) =>
      await alarmService.createAlarm(token, data),

    onSuccess: () => {
      handleNotificationMessege('Turn off successful!', 'success');
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
      setIsSuccess(true);
    },
    onError: (error: any) => {
      handleNotificationMessege(error.response?.data?.data || error.message, 'error');
      setIsSuccess(false);
    },
  });

  const handleTurnOff = async () => {
    setIsLoading(true);
    const data = {
      type: 'Tắt cảnh báo',
      detail: 'tắt cảnh báo',
      alarm: true,
    };
    try {
      await turnOffAlarmMutation.mutateAsync({ token, data });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsSuccess(false);
    setIsLoading(false);
  };

  return (
    <PopupCoverDelete
      title="devicePage.turn-off-alarm"
      message=""
      isSuccess={isSuccess}
      isLoading={isLoading}
      handleSubmit={handleTurnOff}
      handleClosePopup={handleClosePopup}
      btnComponent={<button className="btn clear-alarm w-full text-left">TURN OFF ALARM</button>}
    />
  );
}

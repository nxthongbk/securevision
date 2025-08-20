import { useState } from 'react';
import { ListItemIcon, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ButtonCustom from '~/components/ButtonCustom';
import PopupCoverDelete from '~/components/Modal/DeletePopup';
import alarmService from '~/services/alarm.service';
import handleNotificationMessege from '~/utils/notification';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IconPhosphor from '~/assets/iconPhosphor';

export default function PopupTurnOffAlarmDevice({ type, token }: { type: string; token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });
  const queryClient = useQueryClient();

  const postTelemetryDeviceMutation = useMutation({
    mutationFn: async ({ token, data }: { token: string; data: any }) => await alarmService.createAlarm(token, data),

    onSuccess: () => {
      handleNotificationMessege('Turn off successful!', 'success');
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
      setIsSuccess(true);
    },
    onError: (error: any) => {
      handleNotificationMessege(error.response?.data?.data || error.message, 'error');
      setIsSuccess(false);
    }
  });

  const handleTurnOff = async () => {
    setIsLoading(true);
    try {
      const data = {
        type,
        detail: 'Tắt cảnh báo',
        alarm: false
      };
      await postTelemetryDeviceMutation.mutateAsync({ token, data });
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const btnComponent = isTablet ? (
    <Stack direction={"row"}>
      <ListItemIcon>
          <IconPhosphor iconName='X' size={20} />
      </ListItemIcon>
      <Typography variant='body3'>{t('turn-off')}</Typography>
    </Stack>
  ) : (
    <ButtonCustom
      variant='contained'
      className='gap-3'
      sx={{ backgroundColor: '#D9E1E8', height: 32 }}
      disabled={isLoading}
    >
      <Typography variant='button3' color={'black'}>
        {t('turn-off')}
      </Typography>
    </ButtonCustom>
  );

  return (
    <PopupCoverDelete
      btnComponent={btnComponent}
      isSuccess={isSuccess}
      handleSubmit={handleTurnOff}
      title='devicePage.turn-off-alarm'
      message=''
      isLoading={isLoading}
    />
  );
}

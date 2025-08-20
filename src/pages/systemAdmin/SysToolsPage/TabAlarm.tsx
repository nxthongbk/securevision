import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import HeaderPage from '~/components/HeaderPage';
import InputCustom from '~/components/InputCustom';
import JSONInput from 'react-json-editor-ajrm';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import alarmService from '~/services/alarm.service';
import handleNotificationMessege from '~/utils/notification';
import locale from 'react-json-editor-ajrm/locale/en';
import { postAlarmDeviceSchema } from '~/utils/yup';
import { translation } from '~/utils/translate';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

export default function TabAlarmTest() {
  const [keyPressUpdate, setKeyPressUpdate] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      token: '',
      telemetry: {
        type: 'Cảnh báo',
        detail: 'test cảnh báo ',
        alarm: true
      }
    },
    resolver: yupResolver(postAlarmDeviceSchema)
  });

  useEffect(() => {
    // Don't update
    setKeyPressUpdate(true);
  }, []);

  const postTelemetryDeviceMutation = useMutation({
    mutationFn: async ({ token, data }: { token: string; data: any }) => await alarmService.createAlarm(token, data),

    onSuccess: (res) => {
      handleNotificationMessege(res?.data, 'success');
    },
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    }
  });

  const onSubmit = (data) => {
    postTelemetryDeviceMutation.mutate({
      token: data?.token,
      data: data?.telemetry
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-6 h-full w-full'>
      <HeaderPage
        title={translation('Gửi cảnh báo')}
        btnPopup={
          <Button disabled={!isValid} type='submit' variant='contained' startIcon={<PaperPlaneTilt size={20} />}>
            {translation('Gửi')}
          </Button>
        }
      />
      <div className='mt-6 flex flex-col h-full gap-[6px]'>
        <InputCustom
          type='text'
          name='token'
          isError={Boolean(errors?.token)}
          control={control}
          isSpacingHelperText={true}
          classNameContainer='max-w-[800px]'
          label='Token'
          placeholder={translation('Nhập token thiết bị')}
          isRequired
          helperText={errors.token?.message}
        />
        {/* <InputCustom
          type='text'
          name='alarmId'
          isError={Boolean(errors?.alarmId)}
          control={control}
          isSpacingHelperText={true}
          classNameContainer='max-w-[800px]'
          label='alarmId'
          placeholder={translation('Nhập alarmId thiết bị')}
          isRequired
          helperText={errors.alarmId?.message}
        /> */}
        <div className='flex-1'>
          <Typography variant='label3' className='!mb-1'>
            Cảnh báo <span className='text-[var(--semantic-alert)]'>*</span>
          </Typography>
          <div className='w-full rounded-lg border border-[#C0C4C4] bg-white h-[85%] overflow-scroll'>
            <JSONInput
              id='tool-page-json-editor'
              placeholder={{
                type: 'Cảnh báo',
                detail: 'test cảnh báo ',
                alarm: true
              }}
              locale={locale}
              height='100%'
              width='100%'
              theme='mitsuketa_tribute'
              colors={{
                default: '#000000',
                background: '#ffffff',
                keys: '#000000',
                string: '#388023',
                number: '#388023'
              }}
              style={{
                body: {
                  fontSize: '16px !important'
                }
              }}
              onKeyPressUpdate={keyPressUpdate}
              onChange={(event) => {
                setValue('telemetry', event.json);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

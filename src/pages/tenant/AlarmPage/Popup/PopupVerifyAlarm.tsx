import * as yup from 'yup';

import { Check, X } from '@phosphor-icons/react';
import { Typography, useMediaQuery, useTheme } from '@mui/material';

import ButtonCustom from '~/components/ButtonCustom';
import DialogCustom from '~/components/DialogCustom';
import DrawerUpdate from '~/components/Drawer/DrawerUpdate';
import InputCustom from '~/components/InputCustom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useUpdateAlarmStatusOfLocation } from '../../ControlCenterPage/handleApi';
import { yupResolver } from '@hookform/resolvers/yup';

export default function PopupVerifyAlarm({
  open,
  onClose,
  alarmLocationId,
  tenantCode
}: {
  open: boolean;
  onClose: () => void;
  alarmLocationId: string;
  tenantCode: string;
}) {
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });
  const { mutate, isPending, isSuccess } = useUpdateAlarmStatusOfLocation();
  const queryClient = useQueryClient();
  const skipSchema = yup.object({
    cause: yup.string().required(alarmTranslate('please-select-reason'))
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit
  } = useForm<yup.InferType<typeof skipSchema>>({
    mode: 'onBlur',
    defaultValues: {
      cause: ''
    },
    resolver: yupResolver(skipSchema)
  });

  const handleSkip = handleSubmit((data) => {
    mutate({
      tenantCode,
      alarmLocationId,
      requestBody: {
        status: 'CONFIRM',
        reason: data.cause
      }
    });
    queryClient.invalidateQueries({ queryKey: ['getAlarmLocationInfo'] });
    onClose();
  });

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = alarmTranslate('verify-alert');

  return (
    <>
      {isTablet ? (
        <DrawerUpdate open={open} onClose={onClose} title={title} isValid={isValid} isSuccess={isSuccess} isLoading={isPending} onSubmit={handleSkip}>
          <InputCustom
            classNameContainer='w-full'
            isRequired
            label={alarmTranslate('cause')}
            control={control}
            name='cause'
            placeholder={alarmTranslate('enter-cause')}
            isError={!!errors.cause}
            helperText={errors?.cause?.message}
          />
        </DrawerUpdate>
      ) : (
        <DialogCustom
          open={open}
          title={title}
          maxWidth='600px'
          handleClose={onClose}
          footer={
            <div className='flex gap-4'>
              <ButtonCustom onClick={onClose} variant='outlined' startIcon={<X />} className='!font-semibold'>
                <Typography variant='button3'>{alarmTranslate('cancel')}</Typography>
              </ButtonCustom>
              <ButtonCustom onClick={handleSkip} variant='contained' startIcon={<Check />} disabled={!isValid}>
                <Typography variant='button3'>{alarmTranslate('save')}</Typography>
              </ButtonCustom>
            </div>
          }
          content={
            <div className='flex flex-col gap-6 px-[16px] py-[24px] h-[270px]'>
              <InputCustom
                classNameContainer='w-full'
                isRequired
                label={alarmTranslate('cause')}
                control={control}
                name='cause'
                placeholder={alarmTranslate('enter-cause')}
                isError={!!errors.cause}
                helperText={errors?.cause?.message}
              />
            </div>
          }
        />
      )}
    </>
  );
}

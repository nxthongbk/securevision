import { translationCapitalFirst } from '~/utils/translate';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAssignDeviceTolocation } from '../handleApi';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import SelectLocation from '../ComponentSelect/SelectLocation';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import * as yup from 'yup';

export default function PopupAddToLocation({
  deviceToken,
  onChildClose
}: {
  deviceToken: string;
  onChildClose?: (isClose: boolean) => void;
}) {
  const addDeviceToLocationSchema = yup.object({
    locationId: yup.string().required(translationCapitalFirst('field-is-required'))
  });

  const {
    control,
    formState: { isValid },
    handleSubmit
  } = useForm({
    defaultValues: {
      locationId: ''
    },
    resolver: yupResolver(addDeviceToLocationSchema)
  });

  const { isPending, isSuccess, mutate } = useAssignDeviceTolocation();

  const onSubmit: SubmitHandler<{ locationId: string }> = (data) => {
    mutate({ deviceToken, ...data });
  };
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col min-h-[30vh]'>
        {/* <SelectTenant control={control} /> */}
        <SelectLocation control={control} disabled={false} />
      </div>
    );
  };
  return (
    <PopupEditCover
      btnComponent={
        <MenuItem>
          <ListItemIcon>
            <IconPhosphor iconName='Plus' size={20} />
          </ListItemIcon>
          <Typography variant='body3'>{translationCapitalFirst('add-to-location', 'devicePage')}</Typography>
        </MenuItem>
      }
      isSuccess={isSuccess}
      handleClose={() => {
        onChildClose?.(true);
      }}
      title={translationCapitalFirst('add-device-to-location', 'devicePage')}
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={isPending}
    />
  );
}

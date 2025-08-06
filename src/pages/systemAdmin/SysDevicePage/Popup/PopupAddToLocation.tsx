import { translationCapitalFirst } from '~/utils/translate';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDeviceToLocationSchema } from '~/utils/yup';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import SelectTenant from '../ComponentSelect/SelectTenant';
import SelectLocation from '../ComponentSelect/SelectLocation';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import deviceService from '~/services/device.service';
interface IFormInput {
  tenantCode: string;
  locationId: string;
}
export default function PopupAddToLocation({ code }: { code: string }) {
  const queryClient = useQueryClient();

  const {
    control,
    formState: { isValid },
    handleSubmit,
    watch
  } = useForm({
    defaultValues: {
      locationId: '',
      tenantCode: ''
    },
    resolver: yupResolver(addDeviceToLocationSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: { tenantCode: string; locationId: string }) =>
      deviceService.assignDeviceToLocation(code, data.locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDataDevice'] });
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutation.mutate({ tenantCode: data.tenantCode, locationId: data.locationId });
  };
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col min-h-[30vh]'>
        <SelectTenant control={control} />
        <SelectLocation control={control} disabled={!watch('tenantCode')} tenantCode={watch('tenantCode')} />
      </div>
    );
  };
  return (
    <PopupEditCover
      btnComponent={
        <MenuItem>
          <div className='flex justify-center items-center'>
            <ListItemIcon>
              <IconPhosphor iconName='Plus' size={20} />
            </ListItemIcon>
            <Typography variant='body3'>{translationCapitalFirst('add-to-location', 'devicePage')}</Typography>
          </div>
        </MenuItem>
      }
      isSuccess={mutation.isSuccess}
      handleClose={() => {}}
      title={translationCapitalFirst('add-device-to-location', 'devicePage')}
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={mutation.isPending}
    />
  );
}

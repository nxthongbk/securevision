import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';
import { useGetLocations } from '~/pages/tenant/LocationPage/handleApi';
import { translationCapitalFirst } from '~/utils/translate';

const SelectLocation = ({ control, disabled = false, tenantCode }) => {
  const { data } = useGetLocations(0, 100, '', tenantCode);

  const optionDeviceProfile = useMemo(() => {
    const option = data?.data?.content?.map((item: any) => {
      return (
        <MenuItem value={item?.id} key={item?.id}>
          {item?.name}
        </MenuItem>
      );
    });
    return option;
  }, [data?.data]);
  return (
    <SelectCustom
      control={control}
      name='locationId'
      isRequired={true}
      label={translationCapitalFirst('location', 'devicePage')}
      placeholderText={translationCapitalFirst('select-location', 'devicePage')}
      children={optionDeviceProfile}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: '50vh',
            padding: '8px',
            '& .MuiMenuItem-root': {
              padding: 1,
              borderRadius: '6px'
            }
          }
        }
      }}
      disabled={disabled}
    />
  );
};
export default SelectLocation;

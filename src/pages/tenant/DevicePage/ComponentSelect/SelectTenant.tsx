import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';
import { useGetDataDeviceProfile } from '~/pages/systemAdmin/SysDeviceProfilePage/handleApi';
import { translationCapitalFirst } from '~/utils/translate';

const SelectTenant = ({ control }) => {
  const { dataDeviceProfile } = useGetDataDeviceProfile(0, 100, '', '');

  const optionDeviceProfile = useMemo(() => {
    const option = dataDeviceProfile?.data?.content?.map((item: any) => {
      return (
        <MenuItem value={item?.id} key={item?.id}>
          {item?.name}
        </MenuItem>
      );
    });
    return option;
  }, [dataDeviceProfile?.data]);
  return (
    <SelectCustom
      control={control}
      name='tenant'
      isRequired={true}
      label={translationCapitalFirst('tenant', 'devicePage')}
      placeholderText={translationCapitalFirst('select-tenant', 'devicePage')}
      children={optionDeviceProfile}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: '50vh',
            padding: '16px',
            '& .MuiMenuItem-root': {
              padding: 1,
              borderRadius: '6px'
            }
          }
        }
      }}
    />
  );
};
export default SelectTenant;

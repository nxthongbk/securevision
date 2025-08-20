import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';
import { translationCapitalFirst } from '~/utils/translate';

const SelectVehicle = ({
  control,
  isError,
  helperText,
  disabled = false
}: {
  control: any;
  isError: boolean;
  helperText: string;
  disabled?: boolean;
}) => {
  // TODO: Use list device instead of device profile
  const condition = [
    {
      id: '1',
      name: 'Lớn hơn'
    },
    {
      id: '2',
      name: 'Nhỏ hơn'
    }
  ];
  const optionDeviceProfile = useMemo(() => {
    const option = condition?.map((item: any) => {
      return (
        <MenuItem value={item?.id} key={item?.id}>
          {item?.name}
        </MenuItem>
      );
    });
    return option;
  }, []);

  return (
    <SelectCustom
      disabled={disabled}
      control={control}
      name='deviceId'
      isRequired
      isError={isError}
      helperText={helperText}
      label={translationCapitalFirst('vehicle')}
      placeholderText={translationCapitalFirst('select-condition')}
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
export default SelectVehicle;

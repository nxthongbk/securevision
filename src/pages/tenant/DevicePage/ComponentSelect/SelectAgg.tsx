import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';

const data = [
  {
    id: 'AVG',
    name: 'AVG'
  },
  {
    id: 'SUM',
    name: 'SUM'
  },
  {
    id: 'COUNT',
    name: 'COUNT'
  },
  {
    id: 'MIN',
    name: 'MIN'
  },
  {
    id: 'MAX',
    name: 'MAX'
  },
];

const SelectAgg = ({ control, isError, helperText }) => {

  // TODO: Use list device instead of device profile

  const optionDeviceProfile = useMemo(() => {
    const option = data.map((item: any) => {
      return (
        <MenuItem value={item?.id} key={item?.id}>
          {item?.name}
        </MenuItem>
      );
    });
    return option;
  }, [data]);

  return (
    <SelectCustom
      control={control}
      name='agg'
      isRequired
      isError={isError}
      helperText={helperText}
      label={"Agg"}
      placeholderText={"Chọn Agg"}
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
export default SelectAgg;

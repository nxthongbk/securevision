import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import SelectCustom from '~/components/SelectCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetLocations } from '../../LocationPage/handleApi';

const SelectLocation = ({ control, disabled }) => {
  const { data } = useGetLocations(0, 1000, '', '');

  const options = useMemo(() => {
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
      children={options}
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
      disabled={disabled}
    />
  );
};
export default SelectLocation;

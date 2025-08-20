import { MenuItem } from '@mui/material';
import SelectCustom from '~/components/SelectCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetCondition } from '../handleApi';
import { useMemo } from 'react';

const SelectCondition = ({
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
  const { condition } = useGetCondition();
  const optionDevice = useMemo(() => {
    const option = condition?.map((item: any) => {
      return (
        <MenuItem value={item?.type} key={item?.id}>
          {item?.name}
        </MenuItem>
      );
    });
    return option;
  }, [condition]);

  return (
    <SelectCustom
      disabled={disabled}
      control={control}
      name='condition'
      isRequired
      isError={isError}
      helperText={helperText}
      label={translationCapitalFirst('condition')}
      placeholderText={translationCapitalFirst('select-condition')}
      children={optionDevice}
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
export default SelectCondition;

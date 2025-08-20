import { MenuItem } from '@mui/material';
import SelectCustom from '~/components/SelectCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataDevice } from '../handleApi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const SelectDevice = ({
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
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  // TODO: Use list device instead of device profile
  const { data } = useGetDataDevice({ page: 0, size: 100, keyword: '' });

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
      disabled={disabled}
      control={control}
      name='deviceId'
      isRequired
      isError={isError}
      helperText={helperText}
      label={translationCapitalFirst('device')}
      placeholderText={deviceTranslate('select-device')}
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
export default SelectDevice;

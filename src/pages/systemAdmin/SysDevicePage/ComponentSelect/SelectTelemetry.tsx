import { Box, Chip, MenuItem } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import SelectCustom from '~/components/SelectCustom';
import { useTranslation } from 'react-i18next';

const SelectTelemetry = ({
  options,
  control,
  isError,
  helperText,
  deviceId,
  isMultiple = false,
  isNumber = true,
  disabled = false
}: {
  options: any;
  control: any;
  isError: boolean;
  helperText: string;
  deviceId: string;
  isMultiple?: boolean;
  isNumber?: boolean;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const [listOpntions, setListOptions] = useState(options);
  // TODO: Use list device instead of device profile
  function isStringNumber(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }
  const optionDeviceProfile = useMemo(() => {
    if (!options) {
      return [];
    }
    const listTelemetry = Object?.keys(options)?.map((key) => ({
      key,
      ...options[key]
    }));

    const option = isNumber
      ? listTelemetry
          .filter((item: any) => isStringNumber(item?.value))
          .map((item: any) => {
            return (
              <MenuItem value={item?.key} key={item?.key}>
                {item?.key}
              </MenuItem>
            );
          })
      : listTelemetry.map((item: any) => {
          return (
            <MenuItem value={item?.key} key={item?.key}>
              {item?.key}
            </MenuItem>
          );
        });
    return option;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOpntions]);
  useEffect(() => {
    setListOptions(options);
  }, [options, deviceId]);

  return isMultiple ? (
    <SelectCustom
      disabled={disabled}
      control={control}
      name={'telemetryIds'}
      isRequired
      label='Telemetry'
      isError={isError}
      helperText={helperText}
      placeholderText={t('choose-telemetry')}
      children={optionDeviceProfile}
      multiple={isMultiple}
      isSelectAll
      renderValue={(selected: any[]) => {
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected?.map((value) => <Chip key={value} label={value} />)}
          </Box>
        );
      }}
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
  ) : (
    <SelectCustom
      disabled={disabled}
      control={control}
      name={'telemetryId'}
      isRequired
      label='Telemetry'
      isError={isError}
      helperText={helperText}
      placeholderText={t('choose-telemetry')}
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
export default SelectTelemetry;

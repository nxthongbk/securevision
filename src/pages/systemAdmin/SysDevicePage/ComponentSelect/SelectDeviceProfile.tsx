import SelectSearchCustom from '~/components/SelectSearchCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataDeviceProfile } from '~/pages/systemAdmin/SysDeviceProfilePage/handleApi';
import { useMemo } from 'react';

const SelectDeviceProfile = ({ control, isError, helperText }) => {
  const { dataDeviceProfile } = useGetDataDeviceProfile(0, 100, '', '');

  const optionDeviceProfile = useMemo(() => {
    return dataDeviceProfile?.data?.content?.map((item: any) => ({
      label: item?.name,
      value: item?.id
    }));
  }, [dataDeviceProfile?.data]);
  return (
    <SelectSearchCustom
      control={control}
      name='deviceProfileId'
      isRequired={true}
      label={translationCapitalFirst('device-profile', 'deviceProfile')}
      placeholderText={translationCapitalFirst('select-device-profile', 'devicePage')}
      options={optionDeviceProfile}
      isError={isError}
      helperText={helperText}
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
    />
  );
};
export default SelectDeviceProfile;

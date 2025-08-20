import SelectSearchCustom from '~/components/SelectSearchCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataTenant } from '../../SysTenantManagementPage/handleApi';
import { useMemo } from 'react';

const SelectTenant = ({ control }) => {
  const { dataTenant } = useGetDataTenant({ keyword: '', page: 0, size: 1000, status: 'ACTIVE' });

  const optionDeviceProfile = useMemo(() => {
    return dataTenant?.data?.content?.map((item: any) => ({
      label: item?.name,
      value: item?.code
    }));
  }, [dataTenant?.data]);
  return (
    <SelectSearchCustom
      control={control}
      name='tenantCode'
      isRequired={false}
      label={translationCapitalFirst('tenant', 'devicePage')}
      placeholderText={translationCapitalFirst('select-tenant', 'devicePage')}
      options={optionDeviceProfile}
      MenuProps={{
        PaperProps: {
          sx: {
            maxWidth: '568px',
            maxHeight: '35vh',
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
export default SelectTenant;

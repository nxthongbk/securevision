import { useLocation, useNavigate } from 'react-router-dom';

import SelectSearchCustom from '~/components/SelectSearchCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataTenant } from '~/pages/systemAdmin/SysTenantManagementPage/handleApi';
import { useMemo } from 'react';

const SelectTenant = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get('tenantCode');
  const navigate = useNavigate();
  const { dataTenant } = useGetDataTenant({ keyword: '', page: 0, size: 1000 });
  const handleChange = (code: string) => {
    navigate(`/?tenantCode=${code}`);
  };
  const optionDeviceProfile = useMemo(() => {
    return dataTenant?.data?.content?.map((item: any) => ({
      label: item?.name,
      value: item?.code
    }));
  }, [dataTenant?.data]);
  return (
    <SelectSearchCustom
      options={optionDeviceProfile}
      onChange={(_, selectedOption) => {
        handleChange(selectedOption as string);
      }}
      defaultValue={optionDeviceProfile?.find((option) => option.value === tenantCode)?.value}
      placeholderText={translationCapitalFirst('select-tenant', 'devicePage')}
      isRequired={true}
      isError={false}
      helperText='Please select a tenant.'
      isSelectAll={true}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: '50vh'
          }
        }
      }}
    />
  );
};
export default SelectTenant;

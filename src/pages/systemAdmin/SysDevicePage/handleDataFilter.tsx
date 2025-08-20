import { useEffect, useState } from 'react';
import { OptionInterface } from '~/components/DataGrid/DataGridHeader';
import { useGetDataTenant } from '../SysTenantManagementPage/handleApi';
import { useGetLocations } from '~/pages/tenant/LocationPage/handleApi';
import { t } from 'i18next';
import { useGetDataDeviceProfile } from '../SysDeviceProfilePage/handleApi';

export const useDataFilterTenant = () => {
  const [optionsTenant, setOptionsTenant] = useState<OptionInterface[]>([]);
  const { dataTenant } = useGetDataTenant({ keyword: '', page: 0, size: 1000, status: 'ACTIVE' });
  useEffect(() => {
    if (dataTenant?.data) {
      const options: OptionInterface[] = dataTenant?.data?.content?.map((item: any) => {
        return { id: item?.id, value: item?.code, name: item?.name };
      });
      setOptionsTenant(options);
    }
  }, [dataTenant?.data]);

  return { optionsTenant };
};

export const useDataFilterLocation = (tenantId: string) => {
  const [optionsLocation, setOptionsLocation] = useState<OptionInterface[]>([]);
  const { data } = useGetLocations(0, 50, '', tenantId);
  useEffect(() => {
    if (data?.data) {
      const options: OptionInterface[] = data?.data?.content?.map((item: any) => {
        return { id: item?.id, value: item?.id, name: item?.name };
      });

      if (options?.length) {
        setOptionsLocation(options);
      } else {
        setOptionsLocation([{ id: 'no-option', value: '', name: t('devicePage.no-option-location') }]);
      }
    }

    if (!tenantId) {
      setOptionsLocation([{ id: 'no-seletc', value: '', name: t('devicePage.no-select-tenant') }]);
    }
  }, [data?.data]);

  return { optionsLocation };
};

export const useDataFilterDeviceProfile = () => {
  const [optionsDeviceProfile, setOptionsDeviceProfile] = useState<OptionInterface[]>([]);
  const { dataDeviceProfile } = useGetDataDeviceProfile(0, 1000, '', '');
  useEffect(() => {
    if (dataDeviceProfile?.data) {
      const options: OptionInterface[] = dataDeviceProfile?.data?.content?.map((item: any) => {
        return { id: item?.id, value: item?.id, name: item?.name };
      });
      setOptionsDeviceProfile(options);
    }
  }, [dataDeviceProfile?.data]);

  return { optionsDeviceProfile };
};

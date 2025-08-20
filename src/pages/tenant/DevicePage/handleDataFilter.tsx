import { useEffect, useState } from 'react';
import { OptionInterface } from '~/components/DataGrid/DataGridHeader';
import { useGetLocations } from '~/pages/tenant/LocationPage/handleApi';
import { t } from 'i18next';
import { useGetDataDeviceProfile } from '~/pages/systemAdmin/SysDeviceProfilePage/handleApi';

export const useDataFilterLocation = () => {
  const [optionsLocation, setOptionsLocation] = useState<OptionInterface[]>([]);
  const { data } = useGetLocations(0, 50, '', '');
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

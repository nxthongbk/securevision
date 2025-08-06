import { SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
import { translation, translationCapitalFirst } from '~/utils/translate';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDataFilterDeviceProfile, useDataFilterLocation, useDataFilterTenant } from './handleDataFilter';

import CardDevice from './Card/CardDevice';
import ColumnsTable from './Column';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import { FilterInterface } from '~/components/DataGrid/DataGridHeader';
import HandleScrollPage from '~/components/HandleScrollPage';
import { IRowTableDeviceInterface } from '~/@types/deviceType/device.type';
import ListCard from '../../../components/ListCard';
import PaginationComponent from '~/components/DataGrid/Pagination';
import PopoverButton from './Popover/ButtonComponent/PopoverButton';
import { useGetDataDevice } from './handleApi';
import { useLocation } from 'react-router-dom';

export default function SysDevicePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const [keyword, setKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(30);
  const [page, setPage] = useState<number>(1);
  // useState
  const [curTenant, setCurTenant] = useState<string>('');
  const [curLocation, setCurLocation] = useState<string>('');
  const [curDeviceProfile, setCurDeviceProfile] = useState<string>(params.get('deviceProfile') || '');
  const [curStatus, setCurStatus] = useState<string>('');
  const [curAlarmStatus, setCurAlarmStatus] = useState<string[]>([]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const { isLoading, data } = useGetDataDevice({
    page: page - 1,
    size,
    keyword,
    tenantCode: curTenant,
    deviceProfileId: curDeviceProfile,
    locationId: curLocation,
    status: curStatus,
    alarmStatusList: curAlarmStatus
  });

  const dataTable: IRowTableDeviceInterface[] = useMemo(() => {
    if (data) {
      const results = data?.content?.map((item: any) => {
        return {
          id: item?.id,
          code: String(item?.code).padStart(4, '0'),
          token: item?.token,
          status: item?.status,
          action: item?.id,
          deviceProfileId: item?.deviceProfile?.id,
          deviceProfileName: item?.deviceProfile?.name || '---',
          deviceProfileImageUrl: item?.deviceProfile?.imageUrl,
          deviceName: item?.name || '---',
          tenant: item?.tenantInfo,
          location: item?.locationInfo,
          alarmStatus: item?.alarmStatus,
          dataIndex: item
        };
      });
      return results;
    } else {
      return [];
    }
  }, [data]);

  const total = data?.total || 0;

  // const onRowClick = (params: GridRowParams) => {
  //   // console.log(params);
  // };

  // --------------- FILTER-------------

  //useData--

  const { optionsTenant } = useDataFilterTenant();
  const { optionsLocation } = useDataFilterLocation(curTenant);
  const { optionsDeviceProfile } = useDataFilterDeviceProfile();

  // handle filter------

  const handleChooseTenant = (e: SelectChangeEvent<string>) => {
    setCurTenant(e?.target?.value);
  };

  const handleChooseLocation = (e: SelectChangeEvent<string>) => {
    setCurLocation(e?.target?.value);
  };

  const handleChooseDeviceProfile = (e: SelectChangeEvent<string>) => {
    setCurDeviceProfile(e?.target?.value);
  };

  const handleChooseStatus = (e: SelectChangeEvent<string>) => {
    setCurStatus(e?.target?.value);
  };

  const handleChooseAlarmStatus = (e: SelectChangeEvent<string>) => {
    setCurAlarmStatus([...e?.target?.value]);
  };

  // --List filter ---
  const filter: FilterInterface[] = [
    {
      id: 'tenant',
      label: translate('tenant'),
      onChange: handleChooseTenant,
      value: curTenant,
      isHiddenPlacehoder: !curTenant,
      placeholder: translate('select-tenant'),
      option: optionsTenant
    },
    {
      id: 'loaction',
      label: 'devicePage.device-location',
      onChange: handleChooseLocation,
      value: curLocation,
      isHiddenPlacehoder: !curLocation,
      placeholder: translate('select-location'),
      option: optionsLocation
    },
    {
      id: 'device-profile',
      label: 'deviceProfile.device-profile',
      onChange: handleChooseDeviceProfile,
      value: curDeviceProfile,
      isHiddenPlacehoder: !curDeviceProfile,
      placeholder: 'deviceProfile.device-profile',
      option: optionsDeviceProfile
    },
    {
      id: 'device-status',
      label: 'devicePage.device-status',
      onChange: handleChooseStatus,
      value: curStatus,
      isHiddenPlacehoder: !curDeviceProfile,
      placeholder: 'deviceProfile.device-profile',
      option: [
        { id: '1', value: 'CONNECTED', name: translate('connected') },
        { id: '2', value: 'DISCONNECTED', name: translate('disconnected') }
      ]
    },
    {
      id: 'device-alarm-status',
      label: 'devicePage.device-alarm-status',
      onChange: handleChooseAlarmStatus,
      value: curAlarmStatus,
      isHiddenPlacehoder: !curDeviceProfile,
      placeholder: 'deviceProfile.device-profile',
      option: [
        { id: '1', value: 'ALARM', name: translation('alarm', 'status') },
        { id: '2', value: 'PENDING', name: translation('pending', 'status') },
        { id: '3', value: 'IGNORE', name: translation('ignore', 'status') },
        { id: '4', value: 'CONFIRM', name: translation('confirm', 'status') }
      ],
      multiselect: true
    }
  ];

  const handleResetFilter = () => {
    setCurDeviceProfile('');
    setCurLocation('');
    setCurStatus('');
    setCurTenant('');
    setCurAlarmStatus([]);
    // setKeyword('');
  };

  const checkDisableFilter: boolean = useMemo(() => {
    if (curDeviceProfile || curLocation || curStatus || curTenant || curAlarmStatus) return false;
    return true;
  }, [curDeviceProfile, curLocation, curStatus, curTenant, curAlarmStatus]);

  const handleCheckPage = useCallback(() => {
    if (keyword || curDeviceProfile || curLocation || curStatus || curTenant || curAlarmStatus) setPage(1);
  }, [keyword, curDeviceProfile, curLocation, curStatus, curTenant, curAlarmStatus]);

  useEffect(() => {
    handleCheckPage();
  }, [handleCheckPage]);

  return (
    <HandleScrollPage
      props={{
        title: translationCapitalFirst('devices-management', 'devicePage'),
        btnPopup: <PopoverButton />
      }}
    >
      <DataGridHeader
        isSearch
        keyword={keyword}
        setKeyword={setKeyword}
        filter={filter}
        handleResetFilter={handleResetFilter}
        disableResetFilter={checkDisableFilter}
        title={translationCapitalFirst('devices-management', 'devicePage')}
        btnPopup={<PopoverButton />}
      />
      {isTablet ? (
        <ListCard>
          {dataTable.map((row) => (
            <CardDevice key={row.id} {...row} />
          ))}
          <PaginationComponent page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
        </ListCard>
      ) : (
        <CustomDataGrid
          rows={dataTable}
          columns={ColumnsTable()}
          page={page}
          setPage={setPage}
          // handleRowClick={onRowClick}
          size={size}
          setSize={setSize}
          total={total}
          rowHeight={56}
          emptyMessage={
            keyword || filter
              ? translationCapitalFirst('no-search-data', 'devicePage')
              : translationCapitalFirst('no-data', 'devicePage')
          }
          explainName={translationCapitalFirst('devices', 'devicePage')}
          loading={isLoading}
        />
      )}
    </HandleScrollPage>
  );
}

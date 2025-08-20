import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { FilterInterface } from '~/components/DataGrid/DataGridHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ColumnsTable from './Column';
import HandleScrollPage from '~/components/HandleScrollPage';
import { useGetDataDevice } from './handleApi';
import { useTranslation } from 'react-i18next';
import { useDataFilterDeviceProfile, useDataFilterLocation } from './handleDataFilter';
import { SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
import { IRowTableDeviceInterface } from '~/@types/deviceType/device.type';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '~/utils/hooks/usePermission';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import ForbiddenPage from '~/pages/common/403';
import { translation } from '~/utils/translate';
import ListCard from '~/components/ListCard';
import PaginationComponent from '~/components/DataGrid/Pagination';
import CardDevice from './Card/CardDevice';

export default function DevicePage() {
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(30);
  const [page, setPage] = useState<number>(1);
  // useState
  const [curLocation, setCurLocation] = useState<string>(params.get('locationId') || '');
  const [curDeviceProfile, setCurDeviceProfile] = useState<string>('');
  const [curStatus, setCurStatus] = useState<string>('');
  const [curAlarmStatus, setCurAlarmStatus] = useState<string>()

  const { tenantCode } = useTenantCode();

  const { isLoading, data } = useGetDataDevice({
    page: page - 1,
    size,
    keyword,
    deviceProfileId: curDeviceProfile,
    locationId: curLocation,
    status: curStatus,
    alarmStatus: curAlarmStatus,
  });

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const dataTable: IRowTableDeviceInterface[] = useMemo(() => {
    if (data?.data) {
      const results = data?.data?.content?.map((item: any) => {
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
  }, [data?.data]);

  const total = data?.data?.total || 0;

  // --------------- FILTER-------------

  //useData--

  const { optionsLocation } = useDataFilterLocation();
  const { optionsDeviceProfile } = useDataFilterDeviceProfile();

  // handle filter------

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
    setCurAlarmStatus(e?.target?.value || undefined);
  };

  // --List filter ---

  const handleResetFilter = () => {
    setCurDeviceProfile('');
    setCurLocation('');
    setCurStatus('');
    setCurAlarmStatus(undefined);
  };

  const checkDisableFilter: boolean = useMemo(() => {
    if (curDeviceProfile || curLocation || curStatus || curAlarmStatus) return false;
    return true;
  }, [curDeviceProfile, curLocation, curStatus, curAlarmStatus]);

  const handleCheckPage = useCallback(() => {
    if (keyword || curDeviceProfile || curLocation || curStatus || curAlarmStatus) setPage(1);
  }, [keyword, curDeviceProfile, curLocation, curStatus, curAlarmStatus]);

  const { hasView, hasEdit } = usePermissions('VIEW_DEVICE', 'UPDATE_DEVICE', tenantCode);

  useEffect(() => {
    handleCheckPage();
  }, [handleCheckPage]);

  if (!hasEdit && !hasView) {
    return (
      <HandleScrollPage
        props={{
          title: deviceTranslate('devices-management')
        }}
      >
        <ForbiddenPage />
      </HandleScrollPage>
    );
  }

  const filter: FilterInterface[] = [
    {
      id: 'loaction',
      label: deviceTranslate('location'),
      onChange: handleChooseLocation,
      value: curLocation,
      isHiddenPlacehoder: !curLocation,
      placeholder: deviceTranslate('select-location'),
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
        { id: '1', value: 'CONNECTED', name: translation('connected', 'devicePage') },
        { id: '2', value: 'DISCONNECTED', name: translation('disconnected', 'devicePage') },
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
        { id: '1', value: 'ALARM', name: translation("alarm", "status") },
        { id: '2', value: 'PENDING', name: translation("pending", "status") },
        { id: '3', value: 'IGNORE', name: translation("ignore", "status") },
        { id: '4', value: 'CONFIRM', name: translation("confirm", "status") },
      ]
    },
  ];
  return (
    <HandleScrollPage
      props={{
        title: deviceTranslate('devices-management')
      }}
    >
      <DataGridHeader
        isSearch
        keyword={keyword}
        setKeyword={setKeyword}
        filter={filter}
        filterFullwidth
        disableResetFilter={checkDisableFilter}
        handleResetFilter={handleResetFilter}
        title={deviceTranslate('devices-management')}
      />
      {isTablet ? (
        <ListCard>
          {dataTable.map(row => <CardDevice key={row.id} {...row} />)}
          <PaginationComponent page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
        </ListCard>
      ) : (
        <CustomDataGrid
          rows={dataTable}
          columns={ColumnsTable(hasEdit)}
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          total={total}
          rowHeight={56}
          emptyMessage={ (keyword || filter)
            ? deviceTranslate('no-search-data')
            : deviceTranslate('no-data')}
          explainName={deviceTranslate('devices')}
          loading={isLoading}
          columnsVisible={{
            token: false
          }}
        />
      )}
    </HandleScrollPage>
  );
}

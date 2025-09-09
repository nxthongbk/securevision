import { AlarmStatus, FireAlertItem, statusFilterOptions } from './utils';
import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';

import { AppContext } from '~/contexts/app.context';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import HandleScrollPage from '~/components/HandleScrollPage';
import PopupAlertInfor from './Popup/PopupInfor';
import PopupSkipAlarm from './Popup/PopupSkipAlarm';
import PopupVerifyAlarm from './Popup/PopupVerifyAlarm';
import ResizableHeader from '~/components/DataGrid/ResizableHeader';
import { ResizableHeaderFilter } from '~/components/DataGrid/ResizableHeader/type';
import { SOCKET_URL } from '~/utils/constant';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import dayjs from 'dayjs';
import { useFireAlertColumns } from './useFireAlertColumns';
import { useGetAlarmLocations } from './handleApi';
import { useGetLocations } from '../LocationPage/handleApi';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '~/utils/hooks/usePermission';
import ForbiddenPage from '~/pages/common/403';

function AlarmPage() {
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });

  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('laptop'));

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(30);
  const [page, setPage] = useState<number>(1);

  // Add Socket
  const socket = new SockJS(SOCKET_URL);
  const queryClient = useQueryClient();
  const timeoutId = useRef<NodeJS.Timeout>();
  const { userInfo } = useContext(AppContext);

  // Table Filter
  const [startTs, setStartTs] = useState<dayjs.Dayjs | null>(null);
  const [endTs, setEndTs] = useState<dayjs.Dayjs | null>(null);
  const [status, setStatus] = useState<AlarmStatus | ''>('');
  const [locationFilter, setLocationFilter] = useState<string>(params.get('locationId') || '');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Drawer & Popup State
  const [openDetailDrawer, setOpenDetailDrawer] = useState<boolean>(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [openSkipPopup, setOpenSkipPopup] = useState<boolean>(false);

  const [selectedAlarmLocationId, setSelectedAlarmLocationId] = useState<string>('');

  const { tenantCode } = useTenantCode();
  const { data, isLoading } = useGetAlarmLocations(
    page - 1,
    size,
    keyword,
    tenantCode,
    locationFilter,
    status,
    startTs ? startTs.valueOf() : '',
    endTs ? endTs.valueOf() : ''
  );
  const { data: locations } = useGetLocations(0, 100, '', tenantCode);

  function onDetail(alarmLocationId: string) {
    setSelectedAlarmLocationId(alarmLocationId);
    setOpenDetailDrawer(true);
  }
  function onSkip(alarmLocationId: string) {
    setSelectedAlarmLocationId(alarmLocationId);
    setOpenSkipPopup(true);
  }
  function onVerify(alarmLocationId: string) {
    setSelectedAlarmLocationId(alarmLocationId);
    setOpenVerifyPopup(true);
  }

  const { hasView, hasEdit } = usePermissions('VIEW_ALARM', 'UPDATE_ALARM', tenantCode);

  const { columns } = useFireAlertColumns(onDetail, onSkip, onVerify, isLaptop, hasEdit);

  const handleChangeStartTime = (dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    setPage(1);
    const [startDate, endDate] = dateRange;
    setStartTs(startDate ?? null);
    setEndTs(endDate ?? null);
  };

  const handleResetFilter = () => {
    setStatus('');
    setStartTs(null);
    setEndTs(null);
    setTypeFilter('');
    setLocationFilter('');
  };

  const tableRows = useMemo(() => {
    const rows = (data?.data?.content || []).map((item: FireAlertItem, index: number) => ({
      id: item.id,
      code: String(item?.code ?? index + 1).padStart(4, '0'),
      location: item.locationInfo?.name,
      type: item?.type,
      startTime: item?.createdAlarmBy?.date,
      endTime: item?.updatedAlarmBy?.date,
      verifyAt: item?.updatedAlarmBy?.date,
      verifyBy: item?.updatedAlarmBy?.username,
      status: item?.status,
      reason: item?.reason,
      dataIndex: item
    }));
    return rows;
  }, [data?.data?.content]);

  useEffect(() => {
    const topic = '/topic/' + userInfo?.tenant?.id;
    const connectHeaders = {};
    let stompClient = Stomp.over(socket);

    if (!stompClient.connected) {
      stompClient.connect(connectHeaders, () => {
        stompClient.subscribe(topic, (message) => {
          const body = JSON.parse(message.body);
          if (body.hasNewAlarm) {
            timeoutId.current = setTimeout(() => {
              Promise.all([
                queryClient.invalidateQueries({ queryKey: ['getAlarmLocationByAlarmLocationId'] }),
                queryClient.invalidateQueries({ queryKey: ['getAlarmLocations'] })
              ]);
            }, 1200);
          }
        });
      });
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId.current);
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          stompClient = null;
        });
      }
    };
  }, []);

  const totalRecords = data?.data?.total || 0;

  const locationOptions = useMemo(() => {
    const content = locations?.data?.content || [];
    const options = content.map((item) => ({ id: String(item?.id).padStart(4, '0'), name: item.name, value: item.id }));
    return options;
  }, [locations]);

  const filter: ResizableHeaderFilter[] = [
    {
      id: 'location',
      label: alarmTranslate('location'),
      onChange(e: ChangeEvent<HTMLSelectElement>) {
        setLocationFilter(e?.target?.value);
      },
      value: locationFilter,
      isHiddenPlacehoder: !locationFilter,
      placeholder: alarmTranslate('select-location'),
      option: locationOptions,
      sizes: {
        miniLaptop: 4,
        laptop: 4,
        desktop: 3.04
      }
    },
    {
      id: 'choose-status',
      label: 'alarm-page.status',
      onChange(e: SelectChangeEvent<string>) {
        setStatus(e.target.value as AlarmStatus);
        setPage(1);
      },
      value: status,
      isHiddenPlacehoder: status === '',
      placeholder: 'alarm-page.select-status',
      option: statusFilterOptions,
      sizes: {
        miniLaptop: 4,
        laptop: 4,
        desktop: 2
      }
    },
    {
      id: 'choose-due-date',
      label: 'alarm-page.start-time',
      isDateRangeFilter: true,
      onChange: handleChangeStartTime,
      value: {
        startTime: startTs,
        endTime: endTs
      },
      placeholder: 'allocation.due-date',
      option: []
    }
  ];

  const disableResetFiter = !(status !== '' || startTs || endTs || locationFilter || typeFilter);

  if (!hasEdit && !hasView) {
    return (
      <HandleScrollPage props={{ title: alarmTranslate('management') }}>
        <ForbiddenPage />
      </HandleScrollPage>
    );
  }

  return (
    <HandleScrollPage props={{ title: "alarmTranslate('management') "}}>
      <ResizableHeader
        isSearch
        keyword={keyword}
        setKeyword={setKeyword}
        filter={filter}
        handleResetFilter={handleResetFilter}
        disableResetFilter={disableResetFiter}
        title={alarmTranslate('management')}
      />
      <CustomDataGrid
        rows={tableRows}
        columns={columns}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        total={totalRecords}
        rowHeight={56}
        emptyMessage={alarmTranslate('no-data')}
        explainName={alarmTranslate('line')}
        loading={isLoading}
        columnsVisible={{
          startTime: isLaptop
        }}
      />
      {openDetailDrawer && (
        <PopupAlertInfor
          tenantCode={tenantCode}
          open={openDetailDrawer}
          onClose={() => setOpenDetailDrawer(false)}
          alarmLocationId={selectedAlarmLocationId}
          onVerify={onVerify}
          onSkip={onSkip}
          hasEdit={hasEdit}
        />
      )}
      {openVerifyPopup && (
        <PopupVerifyAlarm
          tenantCode={tenantCode}
          alarmLocationId={selectedAlarmLocationId}
          open={openVerifyPopup}
          onClose={() => setOpenVerifyPopup(false)}
        />
      )}
      {openSkipPopup && (
        <PopupSkipAlarm
          tenantCode={tenantCode}
          alarmLocationId={selectedAlarmLocationId}
          open={openSkipPopup}
          onClose={() => setOpenSkipPopup(false)}
        />
      )}
    </HandleScrollPage>
  );
}

export default AlarmPage;

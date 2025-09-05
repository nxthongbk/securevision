import { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { Divider, Stack, Typography } from '@mui/material';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { FormatTime } from '~/utils/formatDateTime';
import IconPhosphor from '~/assets/iconPhosphor';
import StatusChip from '~/components/StatusChip';
import { translationCapitalFirst } from '~/utils/translate';
import { useMemo } from 'react';

function TabAlertDevice({ deviceAlarms }) {
  const translate = (text: string) => translationCapitalFirst(text, 'alarm-page');

  const rows = useMemo(() => {
    return deviceAlarms.map((alarm) => ({
      id: alarm.id,
      code: alarm.deviceInfo?.code ? String(alarm.deviceInfo.code).padStart(6, '0') : '',
      updateTime: alarm.updatedAlarmBy?.date,
      device: alarm.label,
      status: alarm.status,
      startTime: alarm.createdAlarmBy?.date,
      endTime: alarm.updatedAlarmBy?.date
    }));
  }, [deviceAlarms]);

  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <div className='flex flex-1'>
        <CustomDataGrid
          rows={rows}
          columns={ColumnsAttribute()}
          total={rows.length}
          emptyMessage={translate('no-data')}
          explainName={translate('alarm-device')}
          loading={false}
          showPagination={false}
        />
      </div>
    </div>
  );
}

const ColumnsAttribute = () => {
  const renderHeader = (params: GridColumnHeaderParams) => (
    <Typography variant='label3'>{params.colDef.headerName}</Typography>
  );

  const translate = (text: string) => translationCapitalFirst(text, 'alarm-page');
  const columns: GridColDef[] = [
    {
      field: 'updateTime',
      headerName: translate('update-time'),
      editable: false,
      sortable: true,
      hideSortIcons: true,
      headerClassName: 'table-grid__header',
      width: 200,
      renderHeader: (params) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='label3'>{params.colDef.headerName} </Typography>
          <IconPhosphor iconName='ArrowsDownUp' size={20} color='var(--primary)' />
        </Stack>
      ),
      renderCell: (params) => (params.value ? FormatTime(new Date(params.value)) : '')
    },
    {
      field: 'code',
      headerName: 'ID',
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      width: 100,
      renderHeader
    },
    {
      field: 'device',
      headerName: translate('device'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      flex: 3,
      renderHeader
    },
    {
      field: 'status',
      headerName: translate('status'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      width: 150,
      renderHeader,
      renderCell: (params) => <StatusChip status={params.value} />
    },
    {
      field: 'time',
      headerName: translate('end'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      width: 180,
      renderHeader: () => {
        return (
          <Stack className='w-full'>
            <Typography variant='label3'>{translate('start-time')}</Typography>
            <Typography variant='label3'>{translate('end-time')}</Typography>
          </Stack>
        );
      },
      renderCell: (params) => {
        return (
          <Stack className='w-full'>
            <Typography variant='body3'>{params.row.startTime ? FormatTime(params.row.startTime) : '-'}</Typography>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Typography variant='body3'>{params.row.endTime ? FormatTime(params.row.endTime) : '-'}</Typography>
          </Stack>
        );
      }
    }
  ];

  return columns;
};
export default TabAlertDevice;

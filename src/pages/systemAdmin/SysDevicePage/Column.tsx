import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { translationCapitalFirst } from '~/utils/translate';
import PopupDelete from './Popup/PopupDelete';
import DropDownActionTable from '~/components/DropdownActionTable';
import PopupDeviceInfor from './Popup/PopupInfor';
// import PopupUnAssignDevice from './Popup/PopupRemoveDeviceByLocation';
import StatusChip from '~/components/StatusChip';
// import PopupAddToLocation from './Popup/PopupAddToLocation';
import AvatarTableRow from '~/components/AvatarTableRow';
import StatusConnect from '~/components/StatusConnect';

export default function ColumnsTable() {
  const renderListMenu = (params: any) => {
    return [
      // { key: 'addtolocation', component: <PopupAddToLocation code={params?.code} /> },
      { key: 'delete', component: <PopupDelete id={params?.id} /> }
    ];
  };

  const columnTable: GridColDef[] = [
    {
      width: 100,
      field: 'code',
      headerName: translationCapitalFirst('device-id', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      width: 100,
      field: 'token',
      headerName: translationCapitalFirst('device-token', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Typography variant='body3' className='truncate-text'>
            {params.value}
          </Typography>
        );
      }
    },
    {
      minWidth: 160,
      field: 'deviceName',
      headerName: translationCapitalFirst('devices', 'devicePage'),
      flex: 2.75,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Typography variant='body3' className='truncate-text'>
            {params.value}
          </Typography>
        );
      }
    },
    {
      minWidth: 160,
      field: 'deviceProfileName',
      headerName: translationCapitalFirst('device-profile', 'deviceProfile'),
      flex: 2.75,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Stack direction={'row'} alignItems={'center'} spacing={'6px'}>
            <AvatarTableRow sx={{ width: '32px', height: '32px' }} avatarUrl={params.row?.deviceProfileImageUrl} />
            <Typography variant='body3' className='truncate-text'>
              {params.value}
            </Typography>
          </Stack>
        );
      }
    },
    {
      minWidth: 160,
      field: 'tenant',
      headerName: translationCapitalFirst('tenant', 'devicePage'),
      flex: 2.75,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Typography variant='body3' className='truncate-text'>
            {params?.value?.name || '---'}
          </Typography>
        );
      }
    },
    {
      minWidth: 160,
      field: 'location',
      headerName: translationCapitalFirst('device-location', 'devicePage'),
      flex: 2.75,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Typography variant='body3' className='truncate-text'>
            {params?.value?.name || '---'}
          </Typography>
        );
      }
    },
    {
      width: 79,
      field: 'status',
      headerName: translationCapitalFirst('connect', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      align: 'center',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return <StatusConnect isConnect={params.value === 'CONNECTED'} />;
      }
    },
    {
      width: 140,
      field: 'alarmStatus',
      headerName: translationCapitalFirst('warning', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        // TODO: Holding API Update
        return <StatusChip status={params.value} />;
      }
    },

    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      width: 186,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (_params) => {
        return (
          <DropDownActionTable
            childrent={() => renderListMenu(_params.row)}
            mainBtn={<PopupDeviceInfor props={_params.row?.dataIndex} />}
          />
        );
      }
    }
  ];
  return columnTable;
}

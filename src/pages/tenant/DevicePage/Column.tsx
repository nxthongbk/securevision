import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { translationCapitalFirst } from '~/utils/translate';
import DropDownActionTable from '~/components/DropdownActionTable';
import PopupDeviceInfor from './Popup/PopupInfor';
import PopupRemoveDeviceByLocation from './Popup/PopupRemoveDeviceByLocation';
import StatusChip from '~/components/StatusChip';
import PopupAddToLocation from './Popup/PopupAddToLocation';
import AvatarTableRow from '~/components/AvatarTableRow';
import StatusConnect from '~/components/StatusConnect';

export default function ColumnsTable(hasEdit: boolean) {
  const renderListMenu = (params: Record<string, any>, onCloseChild: (isOpen: boolean) => void) => {
    if (params?.location) {
      return [
        {
          key: 'remove-location',
          component: <PopupRemoveDeviceByLocation deviceToken={params?.token} onChildClose={onCloseChild} />
        }
      ];
    } else {
      return [
        {
          key: 'addtolocation',
          component: <PopupAddToLocation deviceToken={params?.token} onChildClose={onCloseChild} />
        }
      ];
    }
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
      minWidth: 140,
      field: 'deviceName',
      headerName: translationCapitalFirst('devices', 'devicePage'),
      flex: 4.07,
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
      minWidth: 140,
      field: 'deviceProfileName',
      headerName: translationCapitalFirst('device-profile', 'deviceProfile'),
      flex: 4.07,
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
      minWidth: 130,
      field: 'location',
      headerName: translationCapitalFirst('device-location', 'devicePage'),
      flex: 4.07,
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
      width: 120,
      field: 'status',
      headerName: translationCapitalFirst('connect', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return <StatusConnect isConnect={params.value === 'CONNECTED'} />;
      }
    },
    {
      width: 120,
      field: 'alarmStatus',
      headerName: translationCapitalFirst('warning', 'devicePage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
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
            showMenuOptions={hasEdit}
            childrent={(onChildClose) => renderListMenu(_params.row, onChildClose)}
            //showMenuOptions={userRole === UserRole.SYSADMIN || false}
            mainBtn={<PopupDeviceInfor hasEdit={hasEdit} props={_params.row.dataIndex} />}
          />
        );
      }
    }
  ];
  return columnTable;
}

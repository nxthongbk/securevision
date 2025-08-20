import { Button, Stack, Typography } from '@mui/material';

import AvatarTableDeviceProfile from './AvatarDeviceProfile';
import DropDownActionTable from '~/components/DropdownActionTable';
import { GridColDef } from '@mui/x-data-grid';
import IconPhosphor from '~/assets/iconPhosphor';
import PopupDelete from './Popup/PopupDelete';
import PopupInforDeviceProfile from './Popup/PopupInfor';
import PopupViewDevice from './Popup/PopupViewDevice';
import { translationCapitalFirst } from '~/utils/translate';

type ColProp = {
  openPopup: boolean;
  handleOpenInfo: (row: any) => void;
};
export default function ColumnsTable(props: ColProp) {
  const { handleOpenInfo, openPopup } = props;
  const columnTable: GridColDef[] = [
    {
      minWidth: 150,
      field: 'stt',
      headerName: 'ID',
      flex: 1,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      minWidth: 150,
      field: 'name',
      headerName: translationCapitalFirst('device-profile-name', 'deviceProfile'),
      flex: 3,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Stack spacing={1} direction={'row'} alignItems={'center'}>
            <AvatarTableDeviceProfile avatarUrl={params?.row?.imageUrl} sx={{ width: '32px', height: '32px' }} />
            <Typography variant='body3' className='truncate-text'>
              {params.value}
            </Typography>
          </Stack>
        );
      }
    },
    {
      minWidth: 150,
      field: 'typeName',
      headerName: translationCapitalFirst('type-device', 'deviceProfile'),
      flex: 1,
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
      minWidth: 150,
      field: 'totalDevices',
      headerName: translationCapitalFirst('total-device', 'deviceProfile'),
      flex: 1,
      editable: false,
      sortable: false,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <Typography variant='body3' className='truncate-text'>
            {params.value?.total}
          </Typography>
        );
      }
    },

    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      minWidth: 180,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (_params) => {
        return (
          <DropDownActionTable
            childrent={() => [
              {
                key: 'view-device',
                component: (
                  <PopupInforDeviceProfile
                    footerBtn={<Button
                      variant='contained'
                      color='primary'
                      startIcon={<IconPhosphor iconName='PencilSimple' size={20} color='white' />}
                      onClick={() => {
                        handleOpenInfo(_params.row);
                      }}
                    >
                      <Typography variant='button3' color='white'>
                        {translationCapitalFirst('update')}
                      </Typography>
                    </Button>}
                    openInfo={openPopup}
                    stt={_params.row?.id}
                    imageUrl={_params.row?.imageUrl}
                    name={_params.row?.name}
                    signalWaitingTime={_params.row?.signalWaitingTime}
                    totalDevices={_params.row.totalDevices}
                    type={_params.row?.type}
                    description={_params.row?.description}
                  />
                )
              },
              // {
              //   key: 'edit',
              //   component: <PopupEdit id={_params.value} deviceProfileName={_params?.row?.deviceProfileName} />
              // },
              {
                key: 'delete',
                component: <PopupDelete id={_params.value} totalDevices={_params.row?.totalDevices?.total} />
              }
            ]}
            mainBtn={<PopupViewDevice id={_params.value} />}
          />
        );
      }
    }
  ];
  return columnTable;
}

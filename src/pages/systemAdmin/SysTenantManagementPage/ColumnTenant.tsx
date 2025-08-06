import { Button, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { translationCapitalFirst } from '~/utils/translate';
import PopupAccessTenant from './Popup/PopupAccess';
import PopupLockUnLockTenant from './Popup/PopupLockUnLock';
import PopupResrtPasswordTenant from './Popup/PopupForgetPassword';
import StatusChip from '~/components/StatusChip';
import DropDownActionTable from '~/components/DropdownActionTable';
import PopupInforTenant from './Popup/PopupInfor';
import AvatarTableTenant from './AvatarTenant';
import IconPhosphor from '~/assets/iconPhosphor';
import EllipsisTypography from '~/components/EllipsisTypography';
type ColProp = {
  openPopup: boolean;
  handleOpenInfo: (row: any) => void;
};
export default function ColumnTenent(props: ColProp) {
  const { handleOpenInfo, openPopup } = props;

  const column: GridColDef[] = [
    {
      width: 80,
      field: 'tenantId',
      headerName: translationCapitalFirst('tenant-code', 'tenantPage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      minWidth: 200,
      field: 'tenant',
      headerName: translationCapitalFirst('tenant', 'tenantPage'),
      flex: 2,
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell(params) {
        return (
          <div className='flex items-center justify-start gap-1'>
            <AvatarTableTenant sx={{ height: '32px', width: '32px' }} avatarUrl={params.row.avatarUrl} />
            <EllipsisTypography variant='label3' lines={2}>
              {params.value}
            </EllipsisTypography>
          </div>
        );
      }
    },
    {
      minWidth: 160,
      field: 'userName',
      headerName: translationCapitalFirst('user-name', 'tenantPage'),

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
    // {
    //   minWidth: 200,
    //   field: 'address',
    //   headerName: translationCapitalFirst('address', 'locationPage'),
    //   flex: 2,
    //   editable: false,
    //   sortable: false,
    //   headerClassName: 'table-grid__header',
    //   renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    // },
    {
      minWidth: 160,
      field: 'phoneNumber',
      headerName: translationCapitalFirst('phone-number', 'tenantPage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      minWidth: 240,
      field: 'email',
      headerName: translationCapitalFirst('email', 'tenantPage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      minWidth: 125,
      field: 'status',
      headerName: translationCapitalFirst('status', 'tenantPage'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return <StatusChip status={params?.value} />;
      }
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      minWidth: 214,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return (
          <DropDownActionTable
            mainBtn={<PopupAccessTenant tenantCode={params.row.code} />}
            childrent={() => [
              {
                key: 'infor',
                component: (
                  <PopupInforTenant
                    props={{
                      openInfo: openPopup,
                      footerBtn: (
                        <Button
                          variant='contained'
                          color='primary'
                          startIcon={<IconPhosphor iconName='PencilSimple' size={20} color='white' />}
                          onClick={() => {
                            handleOpenInfo(params.row);
                          }}
                        >
                          <Typography variant='button3' color='white'>
                            {translationCapitalFirst('update')}
                          </Typography>
                        </Button>
                      ),
                      ...params.row
                    }}
                  />
                )
              },
              // { key: 'edit', component: <PopupEditTenant props={params.row} /> },
              { key: 'lock-unlock', component: <PopupLockUnLockTenant props={params.row} /> },
              {
                key: 'reset-password',
                component: <PopupResrtPasswordTenant id={params.value} phone={params.row.phoneNumber} />
              }
            ]}
          />
        );
      }
    }
  ];

  return column;
}

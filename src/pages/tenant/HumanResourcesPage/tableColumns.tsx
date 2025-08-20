import { Box, Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { LockSimple, LockSimpleOpen, TrashSimple } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActionMenu from '~/components/ActionMenu';
import AvatarTableRow from '~/components/AvatarTableRow';
import EllipsisTypography from '~/components/EllipsisTypography';
import StatusChip from '~/components/StatusChip';
import { DATA_STATUS } from '~/components/StatusChip/constant';

export function useHRTableColumns(
  isMiniLaptop: boolean,
  onDetail: (data) => void,
  onDelete: () => void,
  onChangeStatus: (status) => void,
  hasEdit: boolean
) {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const menuOptions = useMemo(
    () => (staffId, status) =>
      hasEdit
        ? [
            {
              icon: <TrashSimple size={20} />,
              title: hrPageTranslate('delete'),
              onClick: () => {
                setSelectedStaffId(staffId);
                onDelete();
              }
            },
            {
              icon: status === DATA_STATUS.ACTIVE ? <LockSimple size={20} /> : <LockSimpleOpen size={20} />,
              title: hrPageTranslate(status === DATA_STATUS.ACTIVE ? 'lock' : 'unlock'),
              onClick: () => {
                setSelectedStaffId(staffId);
                onChangeStatus(status === DATA_STATUS.ACTIVE ? 'lock' : 'unlock');
              }
            }
          ]
        : [],
    [hasEdit, hrPageTranslate, onChangeStatus, onDelete]
  );

  const tableColumns: GridColDef[] = useMemo(
    () => [
      {
        width: 100,
        field: 'staffCode',
        headerName: 'ID',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 150,
        flex: 1.5,
        field: 'userName',
        headerName: hrPageTranslate('username'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return <Typography variant='body3'>{params.value}</Typography>;
        }
      },
      {
        minWidth: 200,
        flex: 3.55,
        field: 'fullName',
        headerName: capitalize(hrPageTranslate('fullname')),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Box className='flex gap-[6px] items-center'>
              <AvatarTableRow
                sx={{ width: '32px', height: '32px', borderRadius: '4px !important' }}
                avatarUrl={params?.row?.avatarUrl}
              />
              <Stack>
                <EllipsisTypography variant='body3' lines={2}>
                  {params.value}
                </EllipsisTypography>
                {isMiniLaptop && (
                  <EllipsisTypography variant='caption1' lines={1}>
                    {params.row?.phone}
                  </EllipsisTypography>
                )}
              </Stack>
            </Box>
          );
        }
      },
      {
        width: 150,
        field: 'phone',
        headerName: hrPageTranslate('phone'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 160,
        flex: 3.55,
        field: 'location',
        headerName: hrPageTranslate('location'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 150,
        flex: 2,
        field: 'permissionGroupName',
        headerName: hrPageTranslate('permission-group-name'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        width: 124,
        field: 'status',
        headerName: hrPageTranslate('status'),
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
        headerName: hrPageTranslate('action'),
        width: 190,
        editable: false,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => {
          const { id, status, dataIndex } = params?.row || {};
          return (
            <ActionMenu
              label={hrPageTranslate('view-information')}
              onClick={() => {
                setSelectedStaffId(id);
                onDetail(dataIndex);
              }}
              menuOptions={menuOptions(id, status)}
              paperSx={{
                minWidth: 'unset !important'
              }}
            />
          );
        }
      }
    ],
    [hrPageTranslate, isMiniLaptop, menuOptions, onDetail]
  );
  return { tableColumns, selectedStaffId };
}

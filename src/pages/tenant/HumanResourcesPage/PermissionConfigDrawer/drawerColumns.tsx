import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { TrashSimple } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconPhosphor from '~/assets/iconPhosphor';
import ActionMenu from '~/components/ActionMenu';
import EllipsisTypography from '~/components/EllipsisTypography';

export function useDrawerColumns(onDetail: () => void, onDelete: (staffCount: number) => void) {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const [permissionGroupId, setPermissionGroupId] = useState<string | null>(null);

  const menuOptions = useMemo(
    () => (permissionGroupId, staffCount) => [
      {
        icon: <TrashSimple size={20} />,
        title: hrPageTranslate('delete'),
        onClick: () => {
          setPermissionGroupId(permissionGroupId);
          onDelete(staffCount);
        }
      }
    ],
    [hrPageTranslate, onDelete]
  );

  const tableColumns: GridColDef[] = useMemo(
    () => [
      {
        minWidth: 120,
        flex: 1.5,
        field: 'code',
        headerName: 'ID',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => (
          <Typography variant='body3'>{params.value && String(params.value).padStart(4, '0')}</Typography>
        )
      },
      {
        minWidth: 200,
        flex: 5.24,
        field: 'configName',
        headerName: hrPageTranslate('config-name'),
        editable: false,
        sortable: true,
        hideSortIcons: true,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => (
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={44}>
            <Typography variant='label3' alignSelf={'flex-start'}>
              {params.colDef.headerName}{' '}
            </Typography>{' '}
            <IconPhosphor iconName='ArrowsDownUp' size={20} color='var(--primary)' className='self-end' />{' '}
          </Stack>
        ),
        renderCell(params) {
          return (
            <EllipsisTypography variant='body3' lines={2}>
              {params.value}
            </EllipsisTypography>
          );
        }
      },
      {
        width: 120,
        field: 'staffCount',
        headerName: hrPageTranslate('staff-count'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        field: 'action',
        headerName: hrPageTranslate('action'),
        width: 186,
        editable: false,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => {
          const { id, staffCount } = params?.row || {};

          return (
            <ActionMenu
              label={hrPageTranslate('view-config')}
              onClick={() => {
                setPermissionGroupId(id);
                onDetail();
              }}
              menuOptions={menuOptions(id, staffCount)}
              paperSx={{
                minWidth: 'unset !important'
              }}
            />
          );
        }
      }
    ],
    [hrPageTranslate, menuOptions, onDetail]
  );
  return { tableColumns, permissionGroupId };
}

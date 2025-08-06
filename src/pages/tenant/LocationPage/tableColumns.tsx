import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Cpu, Info, TrashSimple, UsersThree } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ActionMenu from '~/components/ActionMenu';
import AvatarTableRow from '~/components/AvatarTableRow';
import EllipsisTypography from '~/components/EllipsisTypography';
import ROUTES from '~/constants/routes.constant';
import { UserRole } from '~/utils/constant';

export function useLocationTableColumns(
  userRole: string,
  onDelete: () => void,
  onDetail: () => void,
  hasEdit: boolean
) {
  const navigate = useNavigate();
  const [locationTranslate] = useTranslation('', { keyPrefix: 'locationPage' });
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const isAdmin = userRole === UserRole.SYSADMIN;

  const tenantMenuOptions = useMemo(
    () => (locationId) => {
      const options = [
        {
          icon: <Info size={20} />,
          title: locationTranslate('view-information'),
          onClick: () => {
            setSelectedLocationId(locationId);
            onDetail();
          }
        },
        {
          icon: <Cpu size={20} />,
          title: locationTranslate('device-management'),
          onClick: () => {
            navigate(ROUTES.DEVICE?.concat(`?locationId=${locationId}`));
          }
        },
        {
          icon: <UsersThree size={20} />,
          title: locationTranslate('human-resource-management'),
          onClick: () => {
            navigate(ROUTES.HUMAN_RESOURCES?.concat(`?locationId=${locationId}`));
          }
        }
      ];
      hasEdit &&
        options.push({
          icon: <TrashSimple size={20} />,
          title: locationTranslate('delete'),
          onClick: () => {
            setSelectedLocationId(locationId);
            onDelete();
          }
        });
      return options;
    },
    [hasEdit, locationTranslate, navigate, onDelete, onDetail]
  );

  const sysAdminMenuOptions = useMemo(
    () => (locationId, tenantCode) => [
      {
        icon: <Info size={20} />,
        title: locationTranslate('view-information'),
        onClick: () => {
          setSelectedLocationId(locationId);
          onDetail();
        }
      },
      {
        icon: <Cpu size={20} />,
        title: locationTranslate('device-management'),
        onClick: () => {
          navigate(`/device?tenantCode=${tenantCode}&locationId=${locationId}`);
        }
      },
      {
        icon: <UsersThree size={20} />,
        title: locationTranslate('human-resource-management'),
        onClick: () => {
          navigate(`/human-resources?tenantCode=${tenantCode}&locationId=${locationId}`);
        }
      },
      {
        icon: <TrashSimple size={20} />,
        title: locationTranslate('delete'),
        onClick: () => {
          setSelectedLocationId(locationId);
          onDelete();
        }
      }
    ],
    [locationTranslate, navigate, onDelete, onDetail]
  );

  const tableColumns: GridColDef[] = useMemo(
    () => [
      {
        width: 100,
        field: 'id',
        headerName: 'ID',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 200,
        flex: 4.94,
        field: 'locationName',
        headerName: locationTranslate('location-capitalize'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Stack direction='row' gap='6px' alignItems='center'>
              <AvatarTableRow
                sx={{ width: '32px', height: '32px', borderRadius: '4px !important' }}
                avatarUrl={params?.row?.imageUrl}
              />
              <Typography variant='label3'>{params.value}</Typography>
            </Stack>
          );
        }
      },
      {
        minWidth: 160,
        flex: 2,
        field: 'info',
        headerName: locationTranslate('manager'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          const { operatorName, operatorPhone } = params.row;
          return (
            <Stack>
              <Typography variant='body3'>{operatorName}</Typography>
              <Typography variant='caption1' color='var(--text-secondary)'>
                {operatorPhone}
              </Typography>
            </Stack>
          );
        }
      },
      {
        minWidth: 200,
        flex: 4.94,
        field: 'address',
        headerName: capitalize(locationTranslate('address')),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <EllipsisTypography variant='body3' lines={2}>
              {params.value}
            </EllipsisTypography>
          );
        }
      },
      {
        width: 110,
        field: 'deviceCode',
        headerName: locationTranslate('total-device'),
        editable: false,
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          const { totalDevices } = params.row;
          return <Typography variant='body3'>{totalDevices}</Typography>;
        }
      },

      {
        field: 'action',
        headerName: locationTranslate('action'),
        width: 212,
        editable: false,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => {
          const navigatePath = isAdmin
            ? `/fire-alerts?tenantCode=${params?.row?.tenantCode}&locationId=${params.row?.locationId}`
            : ROUTES.FIRE_ALERTS?.concat(`?locationId=${params.row?.locationId}`);

          return (
            <ActionMenu
              label={locationTranslate('fire-alert-management')}
              onClick={() => {
                navigate(navigatePath);
              }}
              menuOptions={
                isAdmin
                  ? sysAdminMenuOptions(params.row?.locationId, params?.row?.tenantCode)
                  : tenantMenuOptions(params.row?.locationId)
              }
            />
          );
        }
      }
    ],
    [isAdmin, locationTranslate, navigate, sysAdminMenuOptions, tenantMenuOptions]
  );
  return { tableColumns, selectedLocationId };
}

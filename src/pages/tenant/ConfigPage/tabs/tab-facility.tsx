import { useMemo, useState } from 'react';
import { Stack, Typography, Switch } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { EnvelopeSimple, Phone, Chat } from '@phosphor-icons/react';
// import SmsIcon from '~/assets/images/svg/sms.svg';
import ZaloIcon from '~/assets/images/svg/zalo.svg';
import { useTranslation } from 'react-i18next';

export function TabFacility() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);
  const { t } = useTranslation();

  const [enabledChannels, setEnabledChannels] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: true,
  });

  const handleToggle = (id: number) => {
    setEnabledChannels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalRecords = 4;

  const tableColumns: GridColDef[] = useMemo(
    () => [
      {
        width: 80,
        field: 'id',
        headerName: '#',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 150,
        flex: 0.5,
        field: 'icon',
        headerName: t('config.header-medium'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => (
          <Stack direction='row' gap='6px' alignItems='center'>
            {params.value}
          </Stack>
        )
      },
      {
        minWidth: 200,
        flex: 4.94,
        field: 'description',
        headerName: t('config.header-description'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => {
          const lines = params.value.split('\n');
          return (
            <Stack direction='column' gap='2px'>
              <Typography variant='body2' className='font-semibold text-[#00BCFF]'>{lines[0]}</Typography>
              {lines[1] && <Typography variant='body3' className='text-[#CCCCCC]'>{lines[1]}</Typography>}
            </Stack>
          );
        }
      },
      {
        minWidth: 120,
        flex: 1,
        field: 'enabled',
        headerName: t('config.header-toggle'),
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell: (params) => (
          <Switch
            checked={enabledChannels[params.row.id] || false}
            onChange={() => handleToggle(params.row.id)}
            color='primary'
          />
        )
      }
    ],
    [enabledChannels]
  );

  const iconStyle = 'flex items-center justify-center w-10 h-10 rounded-md shadow-lg border border-[#00BCFF] text-[#00BCFF]';

  const tableRows = [
    {
      id: 1,
      description: `${t('config.call-alerts')}\n${t('config.call-description')}`,
      icon: (
        <div className={iconStyle}>
          <Phone weight='fill' size={20} />
        </div>
      )
    },
    {
      id: 2,
      description: `${t('config.email-alerts')}\n${t('config.email-description')}`,
      icon: (
        <div className={iconStyle}>
          <EnvelopeSimple weight='fill' size={20} />
        </div>
      )
    },
    {
      id: 3,
      description: `${t('config.SMS-alerts')}\n${t('config.SMS-description')}`,
      icon: (
        <div className={iconStyle}>
          <Chat weight='fill' size={20} /> {/* SMS represented with Chat icon */}
        </div>
      )
    },
    {
      id: 4,
      description: `${t('config.zalo-alerts')}\n${t('config.zalo-description')}`,
      icon: (
        <div className={iconStyle}>
          <img src={ZaloIcon} className='w-5 h-5' />
        </div>
      )
    }
  ];

  return (
    <div>
      <CustomDataGrid
        rows={tableRows}
        columns={tableColumns}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        total={totalRecords}
        rowHeight={64} // for two lines
        loading={false}
        showPagination={false}
      />
    </div>
  );
}

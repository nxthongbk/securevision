import { useState } from 'react';
import DrawerHeader from '../SearchComponent';
import { Stack, Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import PopupDeleteAlarmDevice from '../../Popup/PopupDeleteAlarmDevice';
import StatusChip from '~/components/StatusChip';
import IconPhosphor from '~/assets/iconPhosphor';
import PopupCloseAlarmDevice from '../../Popup/PopupCloseAlarmDevice';

export default function TabAlarmDevice() {
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);
  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} />
      <div className='flex flex-1'>
        <CustomDataGrid
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          rows={[
            { id: '111', key: '123', status: 'CLOSED', action: '123' },
            { id: '1112', key: '2123', status: 'WARNING', action: '123' }
          ]}
          columns={ColumnsAttribute()}
          total={20}
          explainName='cảnh báo'
        />
      </div>
    </div>
  );
}

const ColumnsAttribute = () => {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const columns: GridColDef[] = [
    {
      minWidth: 200,
      flex: 1,
      field: 'startTime',
      headerName: translate('start-time'),
      editable: false,
      sortable: true,
      hideSortIcons: true,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='label3'>{params.colDef.headerName} </Typography>
          <IconPhosphor iconName='ArrowsDownUp' size={20} color='var(--primary)' />
        </Stack>
      )
    },
    {
      flex: 1,
      field: 'startAccount',
      headerName: translate('start-account'),
      editable: false,
      sortable: true,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      flex: 1,
      field: 'closeTime',
      headerName: translate('close-time'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      flex: 1,
      field: 'closeAccount',
      headerName: translate('close-account'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      flex: 1,
      field: 'status',
      headerName: translate('device-status'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return <StatusChip status={params.row.status} />;
      }
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      minWidth: 146,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (_params) => {
        return _params.row.status === 'CLOSED' ? (
          <PopupDeleteAlarmDevice id='1234' />
        ) : (
          <PopupCloseAlarmDevice id='123' />
        );
      }
    }
  ];

  return columns;
};

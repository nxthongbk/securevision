import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import IconPhosphor from '~/assets/iconPhosphor';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetLatestTelemetry } from '../../handleApi';
import DrawerHeader from '../SearchComponent';

interface IProps {
  deviceId: string;
}

export default function TabLastTelemetrySysAdminView(props: IProps) {
  const { deviceId } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);

  const { data: initLatestTelemetry, isFetching } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId
  });

  const { rows, length } = useSocketLatestTelemetry({
    dependency: [deviceId],
    topic: `/topic/${deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });

  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} />
      <div className='flex flex-1'>
        <CustomDataGrid
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          rows={rows}
          columns={ColumnsAttribute()}
          total={length}
          explainName='telemetry'
          loading={isFetching}
        />
      </div>
    </div>
  );
}

const ColumnsAttribute = () => {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'time',
      headerName: translate('update-time'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      flex: 1,
      field: 'key',
      headerName: translate('key'),
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
      flex: 2,
      field: 'value',
      headerName: translate('value'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    }
  ];

  return columns;
};

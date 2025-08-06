import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import IconPhosphor from '~/assets/iconPhosphor';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import { translationCapitalFirst } from '~/utils/translate';
import DrawerHeader from './SearchComponent';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import { useDataTab } from './useDataTab';
import { getFinalLatestTelemetryValue } from './utils';
import TooltipEllipsisTypography from '~/components/EllipsisTypography/TooltipEllipsisTypography';

interface IProps {
  deviceId: string;
}

export default function TabLastTelemetry(props: IProps) {
  const pageSiezOption = [
    {
      value: 10,
      text: `10 / ${translationCapitalFirst('page')}`
    },
    {
      value: 30,
      text: `30 / ${translationCapitalFirst('page')}`
    },
    {
      value: 50,
      text: `50 / ${translationCapitalFirst('page')}`
    },
    {
      value: 100,
      text: `100 / ${translationCapitalFirst('page')}`
    }
  ];
  const { deviceId } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const { heightWindow } = useWindowDimensions();

  const { data: initLatestTelemetry, isFetching } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: deviceId
  });

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const { rows } = useSocketLatestTelemetry({
    dependency: [deviceId],
    topic: `/topic/${deviceId}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });

  const { resultData, total } = useDataTab({ data: rows, page, size, keyword });

  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} />
      <div className='flex' style={{ height: `${heightWindow - 230}px` }}>
        <CustomDataGrid
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          rows={resultData}
          columns={ColumnsAttribute()}
          total={total}
          loading={isFetching}
          explainName='telemetry'
          pageSizeOptions={pageSiezOption}
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
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        try {
          const final = getFinalLatestTelemetryValue(JSON.parse(params.value)) as string;
          return (
            <TooltipEllipsisTypography lines={2} tooltipMaxWidth={460}>
              {final}
            </TooltipEllipsisTypography>
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
  ];

  return columns;
};

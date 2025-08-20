import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconPhosphor from '~/assets/iconPhosphor';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import { useGetLatestTelemetry } from '../../handleApi';
import DrawerHeader from '../SearchComponent';
import { useDataTab } from '~/pages/systemAdmin/SysDevicePage/DrawerDevice/useDataTab';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import { translationCapitalFirst } from '~/utils/translate';
import { getFinalLatestTelemetryValue } from '~/pages/systemAdmin/SysDevicePage/DrawerDevice/utils';
import TooltipEllipsisTypography from '~/components/EllipsisTypography/TooltipEllipsisTypography';
import EditWarning from './popup/EditWarning';

interface IProps {
  deviceId: string;
}

function TabLastTelemetry(props: IProps) {
  const { deviceId } = props;
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { heightWindow } = useWindowDimensions();

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

  const columns: GridColDef[] = [
    {
      width: 180,
      field: 'time',
      headerName: deviceTranslate('update-time'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      flex: 3,
      field: 'key',
      headerName: deviceTranslate('key'),
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
      flex: 3,
      field: 'warning',
      headerName: deviceTranslate('warning'),
      editable: false,
      sortable: true,
      hideSortIcons: true,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='label3'>{params.colDef.headerName} </Typography>
        </Stack>
      )
    },
    {
      flex: 4.96,
      field: 'value',
      headerName: deviceTranslate('value'),
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
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      width: 146,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return <EditWarning deviceId={deviceId} telemetryId={params.row.key} />;
      }
    }
  ];

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
    <div className='w-full flex flex-col gap-4 flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} />
      <div className='flex' style={{ height: `${heightWindow - 230}px` }}>
        <CustomDataGrid
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          rows={resultData}
          columns={columns}
          total={total}
          explainName='telemetry'
          loading={isFetching}
          pageSizeOptions={pageSiezOption}
        />
      </div>
    </div>
  );
}

export default TabLastTelemetry;

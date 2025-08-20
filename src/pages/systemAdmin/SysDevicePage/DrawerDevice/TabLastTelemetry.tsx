import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import CardLatestTelemetry from '../Card/CardLatestTelemetry';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DrawerHeader from './SearchComponent';
import EditWarning from './popup/EditWarning';
import { GridColDef } from '@mui/x-data-grid';
import IconPhosphor from '~/assets/iconPhosphor';
import ListCard from '../../../../components/ListCard';
import TooltipEllipsisTypography from '~/components/EllipsisTypography/TooltipEllipsisTypography';
import { getFinalLatestTelemetryValue } from './utils';
import { translationCapitalFirst } from '~/utils/translate';
import { useDataTab } from './useDataTab';
import { useGetAlarmConfigByDeviceID } from '../handleApi';
import { useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';

interface IProps {
  deviceId: string;
  deviceName?: string;
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

  const { deviceId, deviceName } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');

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

  const { alarmConfig } = useGetAlarmConfigByDeviceID(deviceId);
  const mergedData = useMemo(() => {
    return rows?.map((telemetry) => {
      const alarmRow = alarmConfig?.find((alarm) => telemetry.key === alarm.telemetry);
      if (alarmRow) {
        let condition = '';
        switch (alarmRow?.condition) {
          case 'GREATER_THAN':
            condition = `>${alarmRow?.value?.e}`;
            break;
          case 'LESS_THAN':
            condition = `<${alarmRow?.value?.e}`;
            break;
          case 'EQUAL_TO':
            condition = `=${alarmRow?.value?.e}`;
            break;
          case 'OUT_OF_RANGE':
            condition = `<${alarmRow?.value?.e1}, >${alarmRow?.value?.e2}`;
            break;
          case 'IN_RANGE':
            condition = `>=${alarmRow?.value?.e1}, <=${alarmRow?.value?.e2}`;
            break;
          default:
            condition = '';
        }
        return {
          ...telemetry,
          warning: `${alarmRow?.alarmType} ${condition} | ${alarmRow?.duration}ms`,
          hasWarning: true
        };
      }
      return { ...telemetry, hasWarning: false };
    });
  }, [rows, alarmConfig]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const { resultData, total } = useDataTab({ data: mergedData, page, size, keyword });
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
      flex: 1.2,
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
    },
    {
      flex: 1.2,
      field: 'warning',
      headerName: translate('warning'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return (
          <TooltipEllipsisTypography lines={2} tooltipMaxWidth={460}>
            {params?.value}
          </TooltipEllipsisTypography>
        );
      }
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      width: 180,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        return (
          <EditWarning
            deviceId={deviceId}
            telemetryId={params.row.key}
            deviceName={deviceName}
            warning={params.row.hasWarning}
          />
        );
      }
    }
  ];

  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} />
      {isTablet ? (
        <ListCard>
          {resultData.map((data) => (
            <CardLatestTelemetry key={data.id} {...data} />
          ))}
        </ListCard>
      ) : (
        <div className='flex' style={{ height: `${heightWindow - 230}px` }}>
          <CustomDataGrid
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            rows={resultData}
            columns={columns}
            total={total}
            loading={isFetching}
            explainName='telemetry'
            pageSizeOptions={pageSiezOption}
          />
        </div>
      )}
    </div>
  );
}

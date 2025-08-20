import { useMemo, useState } from 'react';
// import DrawerHeader from '../SearchComponent';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import StatusChip from '~/components/StatusChip';
import IconPhosphor from '~/assets/iconPhosphor';
import { FormatTime } from '~/utils/formatDateTime';
import { useGetAlarmDevice } from '~/pages/systemAdmin/SysDevicePage/handleApi';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import PopupTurnOffAlarmDevice from '../../Popup/PopupTurnOfffAlarmDevice';
import ListCard from '~/components/ListCard';
import CardAlarm from '../../Card/CardAlarm';

export default function TabAlarmDevice({ token }: { token: string }) {
  const { heightWindow } = useWindowDimensions();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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

  const { data, total } = useGetAlarmDevice({ token, page: page - 1, size });
  const rows = useMemo(() => {
    let result = [];
    if (data?.data?.content) {
      result = data?.data?.content?.map((item: any) => {
        return {
          id: item?.id,
          updateTime: FormatTime(item?.updatedAlarmBy?.date) || '-',
          startTime: FormatTime(item?.createdAlarmBy?.date) || '-',
          // closeTime: FormatTime(item?.updatedAlarmBy?.date) || '-',
          status: item?.status,
          type: item?.type,
          detail: item?.detail,
          action: item
        };
      });
    }
    return result;
  }, [data?.data]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <div className='w-full flex flex-col gap-4  flex-1'>
      {isTablet ? (
        <ListCard>
          {rows.map(row => <CardAlarm key={row.id} token={token} {...row}/>)}
        </ListCard>
      ) : (
        <div className='flex flex-1' style={{ height: `${heightWindow - 230}px` }}>
          <CustomDataGrid
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            rows={rows}
            columns={ColumnsAttribute(token)}
            total={total || 0}
            explainName={translationCapitalFirst('warning', 'devicePage')}
            pageSizeOptions={pageSiezOption}
          />
        </div>
      )}
    </div>
  );
}

const ColumnsAttribute = (token: string) => {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const columns: GridColDef[] = [
    {
      width: 200,
      field: 'updateTime',
      headerName: translate('update-time'),
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
      minWidth: 160,
      flex: 1.5,
      field: 'type',
      headerName: translate('type-alarm'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },

    {
      minWidth: 140,
      flex: 1.2,
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
      minWidth: 160,
      flex: 2.08,
      field: 'detail',
      headerName: translate('detail'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      width: 180,
      field: 'closeTime',
      headerName: translate('end'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: () => (
        <Stack direction={'column'} alignItems={'start'} justifyContent={'start'}>
          <Typography variant='label3'>{translate('start-time')}</Typography>
          <Typography variant='label3'>{translate('end-time')}</Typography>
        </Stack>
      ),
      renderCell: (_params) => {
        return (
          <Stack direction={'column'} alignItems={'start'} justifyContent={'start'}>
            <Typography variant='body3'>{_params.row.startTime}</Typography>
            <div className='h-[0px] w-full border-t-[2px]' />
            <Typography variant='body3'>{_params.row.updateTime}</Typography>
          </Stack>
        );
      }
    },
    {
      field: 'turn-off',
      headerName: translate('function'),
      width: 180,
      editable: false,
      sortable: false,
      align: 'center',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        if (params.row.status !== "ALARM") return undefined;
        return <PopupTurnOffAlarmDevice type={params.row.type} token={token} />;
      }
    }
    // {
    //   field: 'action',
    //   headerName: translationCapitalFirst('action'),
    //   minWidth: 120,
    //   editable: false,
    //   sortable: false,
    //   align: 'left',
    //   headerAlign: 'left',
    //   headerClassName: 'table-grid__header',
    //   renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
    //   renderCell: (_params) => {
    //     return _params.row.status === 'CLOSED' && <PopupVerifyAlarm id='1234' />;
    //   }
    // }
  ];

  return columns;
};

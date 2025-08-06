import { useMemo, useState } from 'react';
// import DrawerHeader from '../SearchComponent';
import { Box, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { FormatTime } from '~/utils/formatDateTime';
import { useGetAlarmDevice } from '~/pages/systemAdmin/SysDevicePage/handleApi';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import DropDownActionTable from '~/components/DropdownActionTable';
import EditNotification from './popup/EditNotification';
import { EnvelopeSimple, Phone } from '@phosphor-icons/react';
import SkypeIcon from '~/assets/images/svg/skype.svg';
import SmsIcon from '~/assets/images/svg/sms.svg';
import ZaloIcon from '~/assets/images/svg/zalo.svg';
import ListCard from '~/components/ListCard';
import CardNotification from '../../Card/CardNotification';
import IconPhosphor from '~/assets/iconPhosphor';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import DrawerUpsertNotification from '../../Drawer/DrawerUpsertNotification';
const tableRows = [
  {
    id: 1, description: 'Gọi đến số điện thoại', icon: <button className="flex items-center p-1 px-2 border border-red-500 rounded-md shadow-lg hover:border-red-600">
      <Phone weight='fill' size={20} className="mr-2 text-red-500" />
      <span>Call</span>
    </button>
  },
  {
    id: 2, description: 'Gửi thư qua Email', icon: (
      <button className="flex items-center p-1 px-2 border border-orange-500 rounded-md shadow-lg hover:border-orange-600">
        <EnvelopeSimple weight='fill' size={20} className="mr-2 text-orange-500" />
        <span>Email</span>
      </button>
    )
  },
  {
    id: 3, description: 'Gửi tin nhắn qua Skype', icon: (
      <button className="flex items-center p-1 px-2 border border-[#00B2FF] rounded-md shadow-lg hover:border-blue-500">
        <img src={SkypeIcon} className='w-5 h-5 mr-2' />
        <span>Skype</span>
      </button>
    )
  },
  {
    id: 4, description: 'Gửi tin nhắn qua SMS', icon: (
      <button className="flex items-center p-1 px-2 border border-green-500 rounded-md shadow-lg hover:border-green-600">
        <img src={SmsIcon} className='w-5 h-5 mr-2 ' />
        <span>SMS</span>
      </button>
    )
  },
  {
    id: 5, description: 'Gửi tin nhắn qua Zalo', icon: (
      <button className="flex items-center p-1 px-2 border border-[#0053CC] rounded-md shadow-lg hover:border-blue-600">
        <img src={ZaloIcon} className='w-5 h-5 mr-2' />
        <span>Zalo</span>
      </button>
    )
  }
]
export default function TabNotification({ token, deviceId }: { token: string, deviceId: any }) {
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
    <div className='flex flex-col flex-1 w-full gap-4'>
      {isTablet ? (
        <Stack gap={1}>
          <Box sx={{marginLeft: "auto"}}>
            <DrawerWrapper>
              <DrawerWrapper.Trigger>
                <IconButton>
                  <IconPhosphor iconName='Plus' size={21} />  
                </IconButton>
              </DrawerWrapper.Trigger>
              <DrawerWrapper.Main>
                <DrawerUpsertNotification isUpdating={false} deviceId={deviceId} />
              </DrawerWrapper.Main>
            </DrawerWrapper>
          </Box>
          <ListCard>
            {rows.map(row => <CardNotification key={row.id} {...row} token={token} telemetryId={row.key} />)}
          </ListCard>
        </Stack>
      ) : (
        <div className='flex flex-1' style={{ height: `${heightWindow - 230}px` }}>
          <CustomDataGrid
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            rows={rows}
            columns={ColumnsAttribute(deviceId)}
            total={total || 0}
            explainName={translationCapitalFirst('warning', 'devicePage')}
            pageSizeOptions={pageSiezOption}
          />
        </div>
      )}
    </div>
  );
}
const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * tableRows.length);
  return tableRows[randomIndex]?.icon;
};
const ColumnsAttribute = (deviceId) => {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const columns: GridColDef[] = [
    {
      width: 150,
      field: 'updateTime',
      headerName: translate('vehicle'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='label3'>{params.colDef.headerName} </Typography>
        </Stack>
      ),
      renderCell: (_params) => {
        return getRandomIcon();
      }
    },

    {
      minWidth: 150,
      flex: 1.5,
      field: 'type',
      headerName: translate('unit'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      minWidth: 160,
      flex: 2.08,
      field: 'detail',
      headerName: translate('content'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },

    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      width: 152,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (_params) => {
        return <DropDownActionTable
          showMenuOptions={true}

          //showMenuOptions={userRole === UserRole.SYSADMIN || false}
          mainBtn={<EditNotification deviceId={deviceId} telemetryId={_params.row.key} />}
        />;
      }
    }
  ];

  return columns;
};

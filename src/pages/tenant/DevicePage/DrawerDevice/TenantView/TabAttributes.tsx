import { IconButton, ListItemIcon, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuAutoClose, { MenuItemAutoClose } from '~/components/MenuOptions/MenuAutoClose';
import { isBoolean, isObject, sortBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import ButtonCustom from '~/components/ButtonCustom';
import CardAttributes from '../../Card/CardAttributes';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { DotsThree } from '@phosphor-icons/react';
import DrawerHeader from '../SearchComponent';
import DrawerUpsertAtrribute from '../../Drawer/DrawerUpsertAtrribute';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import DropDownActionTable from '~/components/DropdownActionTable';
import { FormatTime } from '~/utils/formatDateTime';
import { GridColDef } from '@mui/x-data-grid';
import IconPhosphor from '~/assets/iconPhosphor';
import ListCard from '~/components/ListCard';
import MenuWrapper from '~/components/MenuOptions/MenuWrapper';
import PopupDeleteAttributeDevice from '../../Popup/PopupDeleteAttributeDevice';
import PopupUpsertAttribute from '../../Popup/PopupUpsertAttribute';
import TooltipEllipsisTypography from '~/components/EllipsisTypography/TooltipEllipsisTypography';
import { translationCapitalFirst } from '~/utils/translate';
import { useDataTab } from '~/pages/systemAdmin/SysDevicePage/DrawerDevice/useDataTab';
import { useGetAttributes } from '../../handleApi';
import { useQueryClient } from '@tanstack/react-query';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';

export default function TabAttributesDevice({ deviceId }: { deviceId: string }) {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
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
  const queryClient = useQueryClient();

  const { data } = useGetAttributes('DEVICE', deviceId);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const tableRows = useMemo(() => {
    if (data?.data?.data) {
      const responseData = data.data.data || {};
      const keyNames = Object.keys(responseData);
      const rows = keyNames.map((key, index) => ({
        id: index,
        deviceId: data?.data?.deviceId,
        key,
        value: responseData[key]?.value,
        time: responseData[key]?.ts,
        allAttributes: responseData
      }));
      const sortedRows = sortBy(rows, (row) => row.key.toLowerCase());
      return sortedRows;
    }
    return [];
  }, [data]);

  const { resultData, total } = useDataTab({ data: tableRows, page, size, keyword });

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const handleRefreshClick = () => {
    queryClient.invalidateQueries({ queryKey: ['getAttributes'] })
  }

  const btnComonent = isTablet ? (
    <DrawerWrapper>
      <MenuWrapper>
        <MenuWrapper.Trigger>
          <IconButton>
            <DotsThree />
          </IconButton>
        </MenuWrapper.Trigger>
        <MenuWrapper.Main>
          <MenuAutoClose open={false}>
            <MenuItemAutoClose>
              <DrawerWrapper.Trigger>
                <Stack direction={"row"}>
                  <ListItemIcon>
                    <IconPhosphor iconName='Plus' size={20} />
                  </ListItemIcon>
                  <Typography variant='body3'>{translationCapitalFirst('add')}</Typography>
                </Stack>
              </DrawerWrapper.Trigger>
            </MenuItemAutoClose>
            <MenuItemAutoClose>
              <Stack direction={"row"} onClick={handleRefreshClick}>
                <ListItemIcon>
                  <IconPhosphor iconName='ArrowCounterClockwise' size={20} />
                </ListItemIcon>
                <Typography variant='body3'>{translate('refresh')}</Typography>
              </Stack>
            </MenuItemAutoClose>
          </MenuAutoClose>
        </MenuWrapper.Main>
      </MenuWrapper>
      <DrawerWrapper.Main>
        <DrawerUpsertAtrribute isUpdating={false} deviceId={deviceId} />
      </DrawerWrapper.Main>
    </DrawerWrapper>
  ) : (
    <div className='flex items-center gap-4'>
      <ButtonCustom
        variant='outlined'
        sx={{ gap: '6px' }}
        onClick={handleRefreshClick}
      >
        <IconPhosphor iconName='ArrowCounterClockwise' size={20} />
        <Typography variant='button3'>{translate('refresh')}</Typography>
      </ButtonCustom>
    </div>
  );
  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} btnComponent={btnComonent} />
      {isTablet ? (
        <ListCard>
          {resultData.map(row => <CardAttributes key={row.id} {...row} />)}
        </ListCard>
      ) : (
        <div className='flex' style={{ height: `${heightWindow - 230}px` }}>
          <CustomDataGrid
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            rows={resultData}
            columns={ColumnsAttribute()}
            total={total}
            explainName='attributes'
            pageSizeOptions={pageSiezOption}
          />
        </div>
      )}
    </div>
  );
}

const ColumnsAttribute = () => {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const columns: GridColDef[] = [
    {
      width: 180,
      field: 'time',
      headerName: translate('update-time'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => (params.value ? FormatTime(new Date(params.value)) : '')
    },
    {
      flex: 3,
      field: 'key',
      headerName: translate('key'),
      editable: false,
      sortable: true,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='label3'>{params.colDef.headerName} </Typography>
          <IconPhosphor iconName='ArrowsDownUp' size={20} color='var(--primary)' />
        </Stack>
      ),
      hideSortIcons: true
    },
    {
      flex: 4.96,
      field: 'value',
      headerName: translate('value'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (params) => {
        const isObj = isObject(params.value);
        const cellValue = isObj
          ? JSON.stringify(params.value)
          : isBoolean(params.value)
            ? `${params.value}`
            : params.value;
        return (
          <TooltipEllipsisTypography lines={2} tooltipMaxWidth={460}>
            {cellValue}
          </TooltipEllipsisTypography>
        );
      }
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      width: 160,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: (_params) => {
        const { deviceId, key, value } = _params.row || {};
        return (
          <DropDownActionTable
            childrent={() => [
              {
                key: 'delete-attribute',
                component: <PopupDeleteAttributeDevice deviceId={deviceId} keyAtrribute={key} />
              }
            ]}
            mainBtn={<PopupUpsertAttribute deviceId={deviceId} keyName={key} value={value} isEdit />}
          />
        );
      }
    }
  ];

  return columns;
};

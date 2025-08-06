import { useEffect, useMemo, useState } from 'react';
import { IconButton, ListItemIcon, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { isBoolean, isObject, sortBy } from 'lodash';
import DrawerHeader from './SearchComponent';
import ButtonCustom from '~/components/ButtonCustom';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DropDownActionTable from '~/components/DropdownActionTable';
import PopupDeleteAttributeDevice from '../Popup/PopupDeleteAttributeDevice';
import { useGetAttributes } from '../handleApi';
import PopupUpsertAttribute from '../Popup/PopupUpsertAttribute';
import { FormatTime } from '~/utils/formatDateTime';
import useWindowDimensions from '~/utils/hooks/useWIndowDimensions';
import { useDataTab } from './useDataTab';
import TooltipEllipsisTypography from '~/components/EllipsisTypography/TooltipEllipsisTypography';
import ListCard from '../../../../components/ListCard';
import CardAttributes from '../Card/CardAttributes';
import MenuWrapper from '../../../../components/MenuOptions/MenuWrapper';
import { DotsThree } from '@phosphor-icons/react';
import MenuAutoClose, { MenuItemAutoClose } from '../../../../components/MenuOptions/MenuAutoClose';
import DrawerWrapper from '../../../../components/Drawer/DrawerWrapper';
import DrawerUpsertAtrribute from '../Drawer/DrawerUpsertAtrribute';

export default function TabAttributesDevice({ deviceId }: { deviceId: string }) {
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
  const { heightWindow } = useWindowDimensions();
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const queryClient = useQueryClient();
  const [openAddAttributePopup, setOpenAddAttributePopup] = useState(false);

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
        className='gap-1'
        onClick={handleRefreshClick}
      >
        <IconPhosphor iconName='ArrowCounterClockwise' size={20} />
        <Typography variant='button3'>{translate('refresh')}</Typography>
      </ButtonCustom>
      <ButtonCustom variant='contained' className='gap-1' onClick={() => setOpenAddAttributePopup(true)}>
        <IconPhosphor iconName='Plus' size={20} />
        <Typography variant='button3'>{translationCapitalFirst('add-new')}</Typography>
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
      {openAddAttributePopup && (
        <PopupUpsertAttribute
          deviceId={deviceId}
          onClose={() => setOpenAddAttributePopup(false)}
          forceOpen={openAddAttributePopup}
        />
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
      flex: 3.44,
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
        return <TooltipEllipsisTypography lines={2}>{cellValue}</TooltipEllipsisTypography>;
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

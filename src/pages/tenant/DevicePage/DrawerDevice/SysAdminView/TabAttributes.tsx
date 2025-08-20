import { Stack, Typography } from '@mui/material';

import ButtonCustom from '~/components/ButtonCustom';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DrawerHeader from '../SearchComponent';
import DropDownActionTable from '~/components/DropdownActionTable';
import { GridColDef } from '@mui/x-data-grid';
import IconPhosphor from '~/assets/iconPhosphor';
import PopupDeleteAttributeDevice from '../../Popup/PopupDeleteAttributeDevice';
import PopupUpdateAttributesDevice from '../../Popup/PopupUpdateAttribute';
import { translationCapitalFirst } from '~/utils/translate';
import { useState } from 'react';

export default function TabAttributesDevice() {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);

  const btnComonent = (
    <div className='flex items-center gap-4'>
      <ButtonCustom variant='outlined'>
        <IconPhosphor iconName='ArrowCounterClockwise' size={20} />
        <Typography variant='button3'>{translate('refresh')}</Typography>
      </ButtonCustom>
      <ButtonCustom variant='contained'>
        <IconPhosphor iconName='Plus' size={20} />
        <Typography variant='button3'>{translationCapitalFirst('add-new')}</Typography>
      </ButtonCustom>
    </div>
  );
  return (
    <div className='w-full  flex flex-col gap-4  flex-1'>
      <DrawerHeader keyword={keyword} setKeyword={setKeyword} btnComponent={btnComonent} />
      <div className='flex flex-1'>
        <CustomDataGrid
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          rows={[
            { id: '111', key: '123' },
            { id: '311', key: '133' }
          ]}
          columns={ColumnsAttribute()}
          total={20}
          explainName='attributes'
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
      flex: 1,
      field: 'value',
      headerName: translate('value'),
      editable: false,
      sortable: false,
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
    },
    {
      field: 'action',
      headerName: translationCapitalFirst('action'),
      minWidth: 160,
      editable: false,
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'table-grid__header',
      renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
      renderCell: () => {
        return (
          <DropDownActionTable
            childrent={() => [
              {
                key: 'delete-attribute',
                component: <PopupDeleteAttributeDevice deviceId={'124124'} keyAtrribute={'124124'} />
              }
            ]}
            mainBtn={<PopupUpdateAttributesDevice id='123456' props={{ key: 'FZ_kama', value: '12345678' }} />}
          />
        );
      }
    }
  ];

  return columns;
};

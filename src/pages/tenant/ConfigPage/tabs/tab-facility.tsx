import { useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import { EnvelopeSimple, Phone } from '@phosphor-icons/react';
import SkypeIcon from '~/assets/images/svg/skype.svg';
import SmsIcon from '~/assets/images/svg/sms.svg';
import ZaloIcon from '~/assets/images/svg/zalo.svg';

export function TabFacility() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(30);
  const totalRecords = 5;
  const tableColumns: GridColDef[] = useMemo(
    () => [
      {
        width: 80,
        field: 'id',
        headerName: '#',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>
      },
      {
        minWidth: 150,
        flex: 0.5,
        field: 'icon',
        headerName: "Phương tiện",
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Stack direction='row' gap='6px' alignItems='center'>
              {params.value}
            </Stack>
          );
        }
      },
      {
        minWidth: 200,
        flex: 4.94,
        field: 'description',
        headerName: 'Mô tả',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Stack direction='row' gap='6px' alignItems='center'>
              <Typography variant='body3'>{params.value}</Typography>
            </Stack>
          );
        }
      },
    ],
    []
  );
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
  return (
    <div>
      <CustomDataGrid
        rows={tableRows}
        columns={tableColumns}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        total={totalRecords}
        rowHeight={56}
        loading={false}
        showPagination={false}
      />
    </div>
  )
}




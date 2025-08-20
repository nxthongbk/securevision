import { useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';

export function TabCondition() {
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
        minWidth: 180,
        flex: 0.5,
        field: 'name',
        headerName: 'Tên điều kiện',
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
        maxWidth: 150,
        flex: 4.94,
        field: 'condition',
        headerName: "Mô tả",
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Stack direction='row' gap='6px' alignItems='left'>
              <Typography variant='body3'>{params.value}</Typography>
            </Stack>
          );
        }
      },
      {
        minWidth: 200,
        flex: 4.94,
        field: 'description',
        editable: false,
        sortable: false,
        headerClassName: 'table-grid__header',
        renderHeader: (params) => <Typography variant='label3'>{params.colDef.headerName}</Typography>,
        renderCell(params) {
          return (
            <Stack direction='row' gap='6px' alignItems='left'>
              <Typography variant='body3'>{params.value}</Typography>
            </Stack>
          );
        }
      },
    ],
    []
  );
  const tableRows = [
    { id: 1, name: 'Lớn hơn', condition: 'X > e', description: 'Khi biến lớn hơn giá trị mong đợi' },
    { id: 2, name: 'Nhỏ hơn', condition: ' X < e', description: 'Khi biến nhỏ hơn giá trị mong đợi' },
    { id: 3, name: 'Bằng', condition: 'X = e', description: 'Khi biến bằng giá trị mong đợi' },
    { id: 4, name: 'Ngoài phạm vi', condition: 'X < e1; X > e2', description: 'Khi biến nằm ngoài khoảng giá trị mong đợi' },
    { id: 5, name: 'Trong phạm vi', condition: 'e1 <= X <= e2', description: 'Khi biến nằm trong khoảng giá trị mong đợi' }
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




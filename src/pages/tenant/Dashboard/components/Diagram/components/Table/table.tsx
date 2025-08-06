import {
  Box,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface TableCustomProps {
  isLoading?: boolean;
  dataSource?: any[];
  columns?: Array<{
    title: string;
    dataIndex: string;
    key: string;
    render?: (value: any, record: any, index: number) => React.ReactNode;
  }>;
  total?: number;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  unfooter?: boolean;
  pagination?: boolean;
  scroll?: boolean | { x?: number; y?: number };
  isRowPerPage?: boolean;
  expandable?: any;
  onExpand?: (expanded: boolean, record: any) => void;
}

const TableCustom: React.FC<TableCustomProps> = ({
  isLoading,
  dataSource = [],
  columns = [],
  total,
  page,
  pageSize,
  setPage,
  setPageSize,
  unfooter = true
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage - 1);
    navigate({
      pathname: location.pathname,
      search: `page=${newPage}&pageSize=${pageSize}`
    });
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newPageSize = event.target.value as number;
    setPageSize(newPageSize);
    navigate({
      pathname: location.pathname,
      search: `page=${page + 1}&pageSize=${newPageSize}`
    });
  };

  return (
    <Box position='relative'>
      <TableContainer className='table-wrapper'>
        <Table className='table-container' stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? (
                    column.render(undefined, undefined, 0)
                  ) : (
                    <TableSortLabel>{column.title}</TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map((data, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(data[column.dataIndex], data, index) : data[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {unfooter && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  colSpan={columns.length}
                  count={total}
                  rowsPerPage={pageSize}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: false
                  }}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  ActionsComponent={() => (
                    <Pagination
                      count={Math.ceil(total / pageSize)}
                      page={page + 1}
                      onChange={handlePageChange}
                      showFirstButton
                      showLastButton
                    />
                  )}
                  labelRowsPerPage={t('rows-per-page')}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('of')} ${count}`}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {isLoading && (
        <Box className='table-loading' display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress size={40} />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(TableCustom);

import './style.scss';

import { LinearProgress, Stack, SxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { CustomDataGridProps } from './module';
import { DataGrid } from '@mui/x-data-grid';
import PaginationComponent from './Pagination';
import { Theme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const CustomDataGrid = (props: CustomDataGridProps) => {
  const { t } = useTranslation();
  // const { height } = useWindowDimensions();

  const {
    handleRowClick,
    setSize,
    rows = [],
    columns = [],
    page = 1,
    setPage,

    showPagination = true,
    explainName,
    total,
    loading,
    size = 30,

    checkboxSelection,
    onSelectionModelChange,
    disableVirtual,
    experimentalFeatures,
    columnGroupingModel,
    headerHeight = 48,
    rowHeight = 56,
    emptyMessage = t('no-data'),
    columnsVisible = undefined,
    pageSizeOptions
  } = props;

  const [sizeOfPage, setSizeOfPage] = useState(size);
  const [showedRows, setShowedRows] = useState([]);

  useEffect(() => {
    setShowedRows(rows as []);
  }, [sizeOfPage, rows, page, columns]);

  //Xử lý sự kiện khi người dùng scroll ngang cái table
  const handleScroll = (event: Event) => {
    const selectCheckboxHeader = document.querySelector('.MuiDataGrid-columnHeaderCheckbox');
    //const actionHeader = document.querySelector('.MuiDataGrid-columnHeader[data-field="action"]')

    if (selectCheckboxHeader) {
      selectCheckboxHeader.setAttribute(
        'style',
        `
          transform: translateX(${(event.target as HTMLElement).scrollLeft}px) !important;
          width: 50px;
          border-right: 1px solid var(--border-color);
        `
      );
    }
    //if (actionHeader) {}
  };

  useEffect(() => {
    const addScrollEvent = () => {
      const element = document.querySelector('.MuiDataGrid-virtualScroller');
      if (element) {
        element.addEventListener('scroll', handleScroll);
      }
    };

    setTimeout(() => {
      addScrollEvent();
    }, 100);

    return () => {
      const element = document.querySelector('.MuiDataGrid-virtualScroller');
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  function CustomNoRowsOverlay() {
    return (
      <Stack
        p='8px 16px'
        width='100%'
        justifyContent='center'
        borderBottom='1px solid var(--grey-neutral-100)'
        boxSizing='border-box'
        className='empty-record-message'
        sx={{ overflow: 'hidden' }}
      >
        <Typography variant='body3'>{emptyMessage}</Typography>
      </Stack>
    );
  }

  return (
    <div className='flex-1 table__wrapper flex justify-between flex-col border rounded-lg '>
      <DataGrid
        sortingOrder={['desc', 'asc']}
        onRowSelectionModelChange={onSelectionModelChange}
        checkboxSelection={checkboxSelection}
        onRowClick={handleRowClick}
        rows={showedRows}
        columns={columns}
        rowHeight={rowHeight}
        disableRowSelectionOnClick
        disableVirtualization={disableVirtual}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          loadingOverlay: LinearProgress
        }}
        columnHeaderHeight={headerHeight}
        sx={{
          display: 'flex',
          ...dataGridCustomStyle,
          height: '100%',
          fontSize: '14px !important'
        }}
        loading={loading}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        hideFooter
        hideFooterPagination
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'row-white' : 'row-grey')}
        experimentalFeatures={experimentalFeatures}
        columnGroupingModel={columnGroupingModel}
        columnVisibilityModel={columnsVisible}
      />
      {/* Pagination */}
      {showPagination && total !== undefined && total > 0 && (
        <PaginationComponent
          page={page}
          setPage={setPage}
          setSize={setSize}
          setSizeOfPage={setSizeOfPage}
          total={total}
          explainName={explainName}
          sizeOfPage={sizeOfPage}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
};

export default CustomDataGrid;

const dataGridCustomStyle: SxProps<Theme> = {
  '& .MuiDataGrid-cell': {
    borderRight: 'none',
    padding: '0px 16px',
    whiteSpace: 'wrap !important',
    '& .MuiTypography-root': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      wordBreak: 'break-word'
    }
  },
  borderRadius: 0,
  border: 'none',
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'var(--blue-80)' // Change this to your desired hover color
  }
};

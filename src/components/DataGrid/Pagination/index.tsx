import { MenuItem, MenuProps, Pagination, PaginationItem, Select, Stack, SxProps, Typography } from '@mui/material';

import { Theme } from '@emotion/react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const PaginationComponent = ({
  page,
  setPage,
  setSize,
  setSizeOfPage,
  total,
  explainName,
  sizeOfPage,
  pageSizeOptions
}: any) => {
  const { t } = useTranslation();
  const totalPage: number = useMemo(() => Math.ceil(total / sizeOfPage), [total, sizeOfPage]);

  const handleChangePage = (_, value: number) => {
    setPage(value);
  };

  const handleSelectPageSizeChange = (e: any) => {
    setSizeOfPage(e.target.value);
    setSize(e.target.value);
    setPage(1);
  };

  const pageSize =
    pageSizeOptions !== undefined && pageSizeOptions.length > 0
      ? pageSizeOptions
      : [
          {
            value: 30,
            text: `30 / ${t('page')}`
          },
          {
            value: 50,
            text: `50 / ${t('page')}`
          },
          {
            value: 100,
            text: `100 / ${t('page')}`
          }
        ];

  const menuProps: Partial<MenuProps> = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    }
  };

  return (
    <Stack direction='row' className='pagination' justifyContent='space-between' alignItems='center'>
      {explainName && (
        <Typography variant='body3'>
          {total} {explainName}
        </Typography>
      )}

      <Stack direction='row' gap={2} alignItems='center'>
        <Pagination
          count={totalPage}
          page={page}
          hidePrevButton={page === 1}
          hideNextButton={page === totalPage}
          onChange={handleChangePage}
          shape='rounded'
          color='primary'
          renderItem={(item) => <PaginationItem slots={{ previous: CaretLeft, next: CaretRight }} {...item} />}
        />
        {/* Page size */}
        <Select
          sx={selectPageSizeCustomStyle}
          onChange={handleSelectPageSizeChange}
          value={sizeOfPage}
          IconComponent={CaretDown}
          MenuProps={menuProps}
          renderValue={() => (
            <Typography variant='body3' marginTop={0.4} sx={{ fontSize: '14px' }}>
              {`${sizeOfPage} / ${t('page')}`}
            </Typography>
          )}
        >
          {pageSize.map((item: any, index: any) => (
            <MenuItem value={item.value} key={index} sx={{ fontSize: '14px' }}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};

export default PaginationComponent;

const selectPageSizeCustomStyle: SxProps<Theme> = {
  width: '120px',
  height: '32px',
  borderRadius: '8px',
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border-color)'
  },
  '& .Mui-hovered': {
    backgroundColor: 'red !important'
  },
  '&.MuiInputBase-root': {
    height: '32px',
    borderRadius: '6px'
  },
  '& .MuiSelect-icon': {
    height: '20px',
    width: '20px'
  }
};

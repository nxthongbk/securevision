import {  Pagination, PaginationItem, Stack,  } from '@mui/material';
// import { Theme } from '@emotion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

const PaginationComponent = ({
  page,
  setPage,
  // setSize,
  // setSizeOfPage,
  total,
  sizeOfPage,
  // pageSizeOptions
}: any) => {
  // const { t } = useTranslation();
  const totalPage: number = useMemo(() => Math.ceil(total / sizeOfPage), [total, sizeOfPage]);

  const handleChangePage = (_, value: number) => {
    setPage(value);
  };

  // const handleSelectPageSizeChange = (e: any) => {
  //   setSizeOfPage(e.target.value);
  //   setSize(e.target.value);
  //   setPage(1);
  // };

  // const pageSize =
  //   pageSizeOptions !== undefined && pageSizeOptions.length > 0
  //     ? pageSizeOptions
  //     : [
  //         {
  //           value: 30,
  //           text: `30 / ${t('page')}`
  //         },
  //         {
  //           value: 50,
  //           text: `50 / ${t('page')}`
  //         },
  //         {
  //           value: 100,
  //           text: `100 / ${t('page')}`
  //         }
  //       ];

  // const menuProps: Partial<MenuProps> = {
  //   anchorOrigin: {
  //     vertical: 'top',
  //     horizontal: 'left'
  //   },
  //   transformOrigin: {
  //     vertical: 'bottom',
  //     horizontal: 'left'
  //   }
  // };

  return (
    <Stack direction='row' className='pagination' justifyContent='center' alignItems='center'>
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
        {/* Page size selector */}
        {/* <select
          style={{ height: 32, borderRadius: 6, fontSize: 14 }}
          value={sizeOfPage}
          onChange={handleSelectPageSizeChange}
        >
          {pageSize.map((item: any, index: any) => (
            <option value={item.value} key={index}>
              {item.text}
            </option>
          ))}
        </select> */}
      </Stack>
    </Stack>
  );
};

export default PaginationComponent;

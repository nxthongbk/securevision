import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  buttonClasses,
  menuItemClasses
} from '@mui/material';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';
import SearchBox from '../../SearchBox';
import DateRangePicker from '../../DatePicker';
import { useEffect, useRef, useState } from 'react';
import { ResizableHeaderProps } from './type';
import HeaderPage from '~/components/HeaderPage';
import ButtonCustom from '~/components/ButtonCustom';
import { Funnel } from '@phosphor-icons/react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ResizableHeader = ({
  filter,
  isSearch,
  keyword,
  disableResetFilter,
  handleResetFilter,
  setKeyword,
  filterFullwidth = false,
  title,
  btnPopup
}: ResizableHeaderProps) => {
  const { t } = useTranslation();
  const [menuWidth, setMenuWidth] = useState<'auto' | number>('auto');
  const selectRef = useRef<HTMLDivElement>(null);
  const [isShowFilter, setIsShowFilter] = useState(false);

  useEffect(() => {
    function updateSize() {
      selectRef.current && setMenuWidth(selectRef.current.offsetWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const miniLaptopGridSize = filterFullwidth && filter?.length ? 12 / (filter.length + 1) : 2.4;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <HeaderPage title={title} btnPopup={btnPopup} />
        <div className='flex items-center gap-2'>
          {isSearch && (
            <Grid item mobile={6} miniLaptop={3.2} laptop={2.8}>
              <Stack direction='column' width={'100%'} gap={1}>
                <Box width={'100%'} component={'div'} display={'flex'} justifyContent={'space-between'}>
                  <Box width='100%'>
                    <SearchBox keyword={keyword} setKeyword={setKeyword} />
                  </Box>
                </Box>
              </Stack>
            </Grid>
          )}
          {filter && (
            <>
              <ButtonCustom
                className='h-[40px]'
                variant='outlined'
                onClick={() => setIsShowFilter(!isShowFilter)}
                startIcon={<Funnel />}
              >
                {t('filter')}
              </ButtonCustom>
            </>
          )}
        </div>
      </div>
      {isShowFilter && (
        <Grid
          container
          className='w-full justify-start items-center  bg-[var(--grey-neutral-60)] p-2 rounded-lg gap-3 mt-6'
        >
          <Typography variant='label3' color={'var(--text-primary)'}>
            {t('filter')}
          </Typography>
          {/* Addtional filter */}
          {filter?.map((item) => {
            if (item.isRangeFilter) {
              return (
                <Grid
                  item
                  mobile={12}
                  miniLaptop={miniLaptopGridSize}
                  sx={{
                    maxWidth: { miniLaptop: '259px !important', mobile: '100%' }
                  }}
                  key={item.id}
                >
                  <Stack direction='column' gap={1} key={item?.id}>
                    <Box display='flex' gap='6px' alignItems='center'>
                      <TextField
                        type='number'
                        placeholder={t('from')}
                        value={item.value?.from}
                        name='from'
                        onChange={item.onChange}
                        inputProps={{
                          style: {
                            fontSize: '14px'
                          }
                        }}
                        className='bg-white hide-arrows-input-number'
                        sx={{
                          flexBasis: { miniLaptop: '45%', mobile: '48.5%' }
                        }}
                      />
                      {' - '}
                      <TextField
                        type='number'
                        value={item.value?.to}
                        placeholder={t('to')}
                        name='to'
                        onChange={item.onChange}
                        inputProps={{
                          style: {
                            fontSize: '14px'
                          }
                        }}
                        className='bg-white hide-arrows-input-number'
                        sx={{
                          flexBasis: { miniLaptop: '55%', mobile: '48.5%' }
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              );
            }
            if (item.isDateRangeFilter) {
              return (
                <Grid key={item.id} item mobile={6} miniLaptop={3.5} laptop={2.8} desktop={miniLaptopGridSize}>
                  <Stack direction='column' gap={1} key={item?.id}>
                    <Box>
                      <DateRangePicker
                        valueStart={item?.value?.startTime}
                        valueEnd={item?.value?.endTime}
                        onChange={item?.onChange}
                        hasTimeSelection={false}
                      />
                    </Box>
                  </Stack>
                </Grid>
              );
            }
            return (
              <div className='grid grid-cols-7  items-center   bg-white border rounded-lg w-[320px] px-4 pr-0'>
                <div className='col-span-2' >
                  <Typography variant='body3' className='text-[var(--tertiary)]'>
                    {t(item?.label)}:
                  </Typography>
                </div>
                <div className='col-span-5'>
                  <Select
                    value={item?.value}
                    onChange={item?.onChange}
                    sx={{
                      boxShadow: 'none',
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                      '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        border: 0
                      },
                      '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 0
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        boxShadow: 'none',
                        border: 0,
                        borderWidth: '0 !important'
                      },
                      '& .MuiOutlinedInput-input': {
                        fontWeight: 600,
                        paddingLeft: '0px',
                        paddingRight: '0px',
                      },

                    }}
                    className='border-none !pl-0'
                    MenuProps={
                      item.isLazyLoad
                        ? {
                          PaperProps: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP
                            },
                            onScroll: item.onScroll
                          }
                        }
                        : {
                          slotProps: {
                            paper: {
                              sx: {
                                [`& .${menuItemClasses.root}`]: { whiteSpace: 'normal' },
                                width: menuWidth
                              }
                            }
                          }
                        }
                    }
                  >
                    {item?.value && (
                      <MenuItem
                        key={'default'}
                        value=''
                        sx={{
                          mb: '5px',
                          borderRadius: '0px !important',
                          borderBottom: '1px solid var(--divider-color)',
                          backgroundColor: 'var(--white) !important',
                          '&:hover': {
                            backgroundColor: 'var(--white) !important'
                          }
                        }}
                      >
                        <Typography variant='button3' color={'var(--primary)'}>
                          {t('unselect')}
                        </Typography>
                      </MenuItem>
                    )}
                    {item?.option?.map((item: any) => (
                      <MenuItem key={item.id} value={item.value} sx={{ fontSize: '14px' }}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            );
          })}

          {filter && (
            <Grid
              item
              mobile={6}
              laptop={6}
              desktop={1.5}
              display='flex'
              justifyContent={{
                mobile: 'start'
              }}
            >
              <Button
                variant='text'
                disabled={disableResetFilter}
                color='primary'
                onClick={() => {
                  if (handleResetFilter) {
                    handleResetFilter();
                  }
                }}
                sx={{
                  [`&.${buttonClasses.disabled}`]: {
                    backgroundColor: 'transparent',
                    color: 'var(--grey-neutral-400)'
                  },
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                <Stack direction='row' alignItems='center' gap={0.75}>
                  <ArrowCounterClockwise size={19.4} />
                  <Typography variant='button2'>{t('Đặt lại bộ lọc')}</Typography>
                </Stack>
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default ResizableHeader;

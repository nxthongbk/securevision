import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  buttonClasses,
  menuItemClasses,
  useMediaQuery
} from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
// import AvatarPopper from '~/layouts/MainLayout/components/SideBar/AvatarPopper';
import ButtonCustom from '../ButtonCustom';
import DateRangePicker from '../DatePicker';
import { Funnel } from '@phosphor-icons/react';
import HeaderPage from '../HeaderPage';
import IconPhosphor from '~/assets/iconPhosphor';
import SearchBox from '../SearchBox';
import theme from '~/assets/theme';
import { useTranslation } from 'react-i18next';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export interface FilterInterface {
  id: string;
  label: string;
  isHiddenPlacehoder?: boolean;
  value: any;
  onChange(e: any): void;
  placeholder: string;
  option: OptionInterface[];
  isRangeFilter?: boolean;
  isDateRangeFilter?: boolean;
  multiselect?: boolean
  isLazyLoad?: boolean;
  onScroll?: (e: any) => Promise<void>;
}

export interface OptionInterface {
  id: string;
  value: any;
  name: string;
}
interface Props {
  filter?: FilterInterface[];
  disableResetFilter?: boolean;
  handleResetFilter?(): void;
  filterFullwidth?: boolean;
  isSearch: boolean;
  setKeyword?: any;
  keyword?: string;
  // title: string; // Removed
  btnPopup?: ReactNode;
}

const DataGridHeader = ({
  filter,
  isSearch,
  keyword,
  disableResetFilter,
  handleResetFilter,
  setKeyword,
  filterFullwidth = false,
  // title, // Removed
  btnPopup
}: Props) => {
  const { t } = useTranslation();
  const [menuWidth, setMenuWidth] = useState<'auto' | number>('auto');
  const selectRef = useRef<HTMLDivElement>(null);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('tablet'));

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
    <>
      <div className='hidden w-full miniLaptop:block'>
        {/* Singular row header */}
        <div className='flex items-center justify-between'>
          {/* Search box on the left */}
          {isSearch && (
            <Grid item mobile={6} miniLaptop={3.2} laptop={2.8}>
              <SearchBox keyword={keyword} setKeyword={setKeyword} />
            </Grid>
          )}

          {/* Filters and buttons on the right */}
          <div className='flex items-center gap-4'>
            {filter && (
              <ButtonCustom
                className='h-[40px]'
                variant='outlined'
                sx={{ fontWeight: "bold" }}
                onClick={() => setIsShowFilter(!isShowFilter)}
                startIcon={<Funnel />}
              >
                {t('filter')}
              </ButtonCustom>
            )}
            {btnPopup && (
              <>
                <Divider
                  className='hidden sm:block'
                  orientation='vertical'
                  sx={{
                    width: '3px',
                    display: {
                      miniLaptop: 'flex',
                      mobile: 'none'
                    }
                  }}
                  flexItem
                />
                {btnPopup}
              </>
            )}
          </div>
        </div>

        {/* Additional filter section */}
        {isShowFilter && (
          <Grid
            container
            className='w-full justify-start items-center bg-[var(--grey-neutral-60)] p-2 rounded-lg gap-3 mt-6'
          >
            {/* <Typography variant='label3' color={'var(--text-primary)'}>
              {t('filter')}
            </Typography> */}
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
                          inputProps={{ style: { fontSize: '14px' } }}
                          className='bg-white hide-arrows-input-number'
                          sx={{ flexBasis: { miniLaptop: '45%', mobile: '48.5%' } }}
                        />
                        {' - '}
                        <TextField
                          type='number'
                          value={item.value?.to}
                          placeholder={t('to')}
                          name='to'
                          onChange={item.onChange}
                          inputProps={{ style: { fontSize: '14px' } }}
                          className='bg-white hide-arrows-input-number'
                          sx={{ flexBasis: { miniLaptop: '55%', mobile: '48.5%' } }}
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
                        />
                      </Box>
                    </Stack>
                  </Grid>
                );
              }
              return (
                <div key={item.id} className='grid grid-cols-8 items-center bg-white border rounded-lg w-[320px] px-4 pr-0'>
                  <div className='col-span-3'>
                    <Typography variant='body3' className='text-[var(--tertiary)]'>
                      {t(item?.label)}:
                    </Typography>
                  </div>
                  <div className='col-span-5'>
                    <Select
                      multiple={item?.multiselect}
                      value={item?.value}
                      onChange={item?.onChange}
                      sx={{
                        boxShadow: 'none',
                        '.MuiOutlinedInput-notchedOutline': { border: 0 },
                        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: 0 },
                        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { boxShadow: 'none', border: 0, borderWidth: '0 !important' },
                        '& .MuiOutlinedInput-input': { fontWeight: 600, paddingLeft: '0px', paddingRight: '0px' }
                      }}
                      className='border-none !pl-0'
                      MenuProps={
                        item.isLazyLoad
                          ? { PaperProps: { style: { maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP }, onScroll: item.onScroll } }
                          : { slotProps: { paper: { sx: { [`& .${menuItemClasses.root}`]: { whiteSpace: 'normal' }, width: menuWidth } } } }
                      }
                    >
                      {item?.option?.map((option: any) => (
                        <MenuItem key={option.id} value={option.value} sx={{ width: '220px', fontSize: '14px', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              );
            })}

            {filter && (
              <Grid item mobile={6} laptop={6} desktop={1.5} display='flex' justifyContent={{ mobile: 'start' }}>
                <Button
                  variant='text'
                  disabled={disableResetFilter}
                  color='primary'
                  onClick={() => handleResetFilter && handleResetFilter()}
                  sx={{
                    [`&.${buttonClasses.disabled}`]: { backgroundColor: 'transparent', color: 'var(--grey-neutral-400)' },
                    '&:hover': { textDecoration: 'none' }
                  }}
                >
                  <Stack direction='row' alignItems='center' gap={0.75}>
                    <ArrowCounterClockwise size={19.4} />
                    <Typography sx={{ fontWeight: "bold" }} variant='button2'>{t('Đặt lại bộ lọc')}</Typography>
                  </Stack>
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </div>

      <div className='flex flex-col w-full gap-6 miniLaptop:hidden'>
        {/* Mobile header row */}
        <div className='flex items-center justify-between'>
          {/* Search box on left */}
          {isSearch && <Box flex={1}><SearchBox keyword={keyword} setKeyword={setKeyword} /></Box>}

          {/* Buttons / filters on right */}
          <div className='flex items-center gap-2'>
            {btnPopup && (
              <>
                <Divider
                  className='hidden sm:block'
                  orientation='vertical'
                  sx={{ width: '3px', display: { miniLaptop: 'flex', mobile: 'none' } }}
                  flexItem
                />
                {btnPopup}
              </>
            )}
            {filter && (
              <Button
                variant='text'
                color='primary'
                onClick={() => setIsShowFilter(!isShowFilter)}
                sx={{
                  [`&.${buttonClasses.disabled}`]: { backgroundColor: 'transparent', color: 'var(--primary)' },
                  '&:hover': { textDecoration: 'none' }
                }}
              >
                <Stack direction='row' alignItems='center' gap={0.75}>
                  <Typography sx={{ fontWeight: "bold" }} variant='button3'>{t('filter')}</Typography>
                </Stack>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile filter dialog */}
        {isShowFilter && isSmallScreen && (
          <Dialog fullScreen open={isShowFilter} onClose={() => setIsShowFilter(false)} maxWidth="desktop" fullWidth>
            <DialogContent sx={{ padding: '0', boxSizing: 'content-box' }}>
              <Box className='flex flex-col justify-between h-screen'>
                <Box className='flex items-center justify-between p-4'>
                  {/* <Typography color='var(--text-primary)' variant='h6'>
                    {t('filter')}
                  </Typography> */}
                  <IconButton aria-label='close' onClick={() => setIsShowFilter(false)}>
                    <IconPhosphor iconName='X' size={20} />
                  </IconButton>
                </Box>
                <Divider sx={{ borderBottom: '1px solid var(--border-color)', width: '100%' }} />
                <Box className='flex-1 p-4 py-6 overflow-y-auto'>
                  {/* Filters same as desktop */}
                  <Grid container className='items-center justify-start w-full gap-3 rounded-lg'>
                    {/* filter map same as above */}
                  </Grid>
                </Box>
                <Divider sx={{ borderBottom: '1px solid var(--border-color)', width: '100%' }} />
                <Box className='flex items-center justify-between gap-3 p-4'>
                  <ButtonCustom
                    variant='outlined'
                    disabled={disableResetFilter}
                    onClick={() => handleResetFilter && handleResetFilter()}
                    className='w-1/2'
                    startIcon={<ArrowCounterClockwise size={19.4} />}
                  >
                    <Typography sx={{ fontWeight: "bold" }} variant='button3'>{t('Đặt lại')}</Typography>
                  </ButtonCustom>
                  <ButtonCustom
                    className='w-1/2'
                    variant='contained'
                    color='primary'
                    type='submit'
                    onClick={() => setIsShowFilter(false)}
                    startIcon={<IconPhosphor iconName='Check' size={18} />}
                    disabled={disableResetFilter}
                  >
                    <Typography variant='button3' fontWeight={600}>{t('apply')}</Typography>
                  </ButtonCustom>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default DataGridHeader;

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  menuItemClasses,
  Popover
} from '@mui/material';
// import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';
import SearchBox from '../../SearchBox';
import DateRangePicker from '../../DatePicker';
import { useState } from 'react';
import { ResizableHeaderProps } from './type';
// import HeaderPage from '~/components/HeaderPage';
// import ButtonCustom from '~/components/ButtonCustom';
// import { Funnel } from '@phosphor-icons/react';
import dayjs from 'dayjs';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;

const ResizableHeader = ({
  filter,
  isSearch,
  keyword,
  // disableResetFilter,
  // handleResetFilter,
  setKeyword,
  // filterFullwidth = false,
  // title,
  // btnPopup
}: ResizableHeaderProps) => {
  const { t } = useTranslation();
  // const [menuWidth, setMenuWidth] = useState<'auto' | number>('auto');
  // const selectRef = useRef<HTMLDivElement>(null);
  // const [isShowFilter, setIsShowFilter] = useState(true); 
  
  // useEffect(() => {
  //   function updateSize() {
  //     selectRef.current && setMenuWidth(selectRef.current.offsetWidth);
  //   }
  //   window.addEventListener('resize', updateSize);
  //   updateSize();
  //   return () => window.removeEventListener('resize', updateSize);
  // }, []);

  // const miniLaptopGridSize =
  //   filterFullwidth && filter?.length ? 12 / (filter.length + 1) : 2.4;

  return (
    <div className="w-full">
      {/* 🔹 If you want to hide the title row, just comment HeaderPage */}
      {/* <HeaderPage title={title} btnPopup={btnPopup} /> */}

      {/* 🔹 Filters Row */}
      {/* {isShowFilter && ( */}
        <Grid
          container
          className="w-full justify-between items-center  p-2 gap-3"
        >
          {/* Search box (left side) */}
          {isSearch && (
            <Grid item mobile={6} miniLaptop={3.2} laptop={2.8}>
              <SearchBox keyword={keyword} setKeyword={setKeyword} />
            </Grid>
          )}

          {/* Filters (right side) */}
          <Grid item className="flex gap-3 items-center ml-auto">
            {filter?.map((item) => {
              if (item.isRangeFilter) {
                return (
                  <Box key={item.id} className="flex gap-2 items-center">
                    <TextField
                      type="number"
                      placeholder={t('from')}
                      value={item.value?.from}
                      name="from"
                      onChange={item.onChange}
                      size="small"
                      sx={{
                        background: '#0B1118',
                        input: { color: 'white', fontSize: 13 },
                        width: 80
                      }}
                    />
                    <Typography color="white">-</Typography>
                    <TextField
                      type="number"
                      placeholder={t('to')}
                      value={item.value?.to}
                      name="to"
                      onChange={item.onChange}
                      size="small"
                      sx={{
                        background: '#0B1118',
                        input: { color: 'white', fontSize: 13 },
                        width: 80
                      }}
                    />
                  </Box>
                );
              }

              if (item.isDateRangeFilter) {
                // ✅ Time filter redesign
                const [anchorEl, setAnchorEl] =
                  useState<null | HTMLElement>(null);
                const [tempValue, setTempValue] = useState(item.value);

                const open = Boolean(anchorEl);
                const handleClick = (event: any) => {
                  setTempValue(item.value); // preload existing
                  setAnchorEl(event.currentTarget);
                };
                const handleClose = () => setAnchorEl(null);

                // const handleApply = () => {
                //   item.onChange(tempValue);
                //   handleClose();
                // };

                // const handleReset = () => {
                //   setTempValue({ startTime: null, endTime: null });
                //   item.onChange({ startTime: null, endTime: null });
                //   handleClose();
                // };

                const label =
                  item.value?.startTime && item.value?.endTime
                    ? `${dayjs(item.value.startTime).format(
                        'DD/MM/YYYY'
                      )} - ${dayjs(item.value.endTime).format('DD/MM/YYYY')}`
                    : `${t(item.label)}: All`;

                return (
                  <Box key={item.id}>
                    <Button
                      onClick={handleClick}
                      sx={{
                        color: 'white',
                        borderRadius: 0,
                        border: '1px solid #00BCFFCC', // same as dropdown border
                        textTransform: 'none',
                        fontSize: 13,
                        height: 32,
                        minWidth: 150,
                        px: 2,
                        py: 2.45,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {label}
                    </Button>
                    <Popover
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      PaperProps={{
                        sx: {
                          background: '#0B1118',
                          color: 'white',
                          p: 2,
                          borderRadius: 0
                        }
                      }}
                    >
                      <DateRangePicker
                        valueStart={tempValue?.startTime}
                        valueEnd={tempValue?.endTime}
                        onChange={setTempValue}
                        // hasTimeSelection={false}
                      />
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        gap={1}
                        mt={2}
                      >
                        
                      </Stack>
                    </Popover>
                  </Box>
                );
              }

              // ✅ Normal dropdown filters
              return (
                <Select
                  key={item.id}
                  size="small"
                  value={item?.value ?? ''}
                  onChange={item?.onChange}
                  displayEmpty
                  
                  sx={{
                  fontSize: 13,
                  color: 'white',
                  height: 32,
                  minWidth: 150,
                  '.MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#00BCFFCC', // your desired color
                    borderWidth: 1,          // thickness of the border
                    borderRadius: 0          // remove rounding
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00BCFFCC', // keep same color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00BCFFCC', // keep same color on focus
                  },
                  '&.MuiSelect-select': {
                    py: 0.5,
                    px: 1,
                  }
                }}
                  MenuProps={{
                    slotProps: {
                      paper: {
                        sx: {
                          background: '#0B1118', // dropdown background
                          borderRadius: 0,       // remove dropdown corners
                          [`& .${menuItemClasses.root}`]: {
                            fontSize: 13,
                            color: 'white',
                            borderRadius: 0,     // remove item corners
                            '&.Mui-selected': {
                              backgroundColor: "#031423 !important", 
                              color: 'white'
                            },
                            '&.Mui-selected:hover': {
                              backgroundColor: '#031423 !important' // keep on hover
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: 13, color: 'white' }}>
                    {t(item.label)}: All
                  </MenuItem>
                  {item?.option?.map((opt: any) => (
                    <MenuItem
                      key={opt.id}
                      value={opt.value}
                      sx={{ fontSize: 13, color: 'white' }}
                    >
                      {t(opt.name)}
                    </MenuItem>
                  ))}
                </Select>
              );
            })}
          </Grid>
        </Grid>
      {/* )} */}
    </div>
  );
};

export default ResizableHeader;

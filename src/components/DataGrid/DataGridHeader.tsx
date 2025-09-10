import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  // Stack,
  TextField,
  Typography,
  menuItemClasses
} from '@mui/material';
import { ReactNode } from 'react';
// import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
// import ButtonCustom from '../ButtonCustom';
// import DateRangePicker from '../DatePicker';
import SearchBox from '../SearchBox';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

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
  multiselect?: boolean;
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
  isSearch: boolean;
  setKeyword?: any;
  keyword?: string;
  btnPopup?: ReactNode;
}

const DataGridHeader = ({
  filter,
  isSearch,
  keyword,
  // disableResetFilter,
  // handleResetFilter,
  setKeyword,
  btnPopup
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <Grid
        container
        className="w-full items-center gap-3 p-2"
        justifyContent="space-between"
        wrap="nowrap"
      >
        {/* 🔹 Search box on left */}
        {isSearch && (
          <Grid item>
            <SearchBox keyword={keyword} setKeyword={setKeyword} />
          </Grid>
        )}
        
        {/* 🔹 Filters inline */}
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
            const label =
              item.value?.startTime && item.value?.endTime
                ? `${dayjs(item.value.startTime).format('DD/MM/YYYY')} - ${dayjs(
                    item.value.endTime
                  ).format('DD/MM/YYYY')}`
                : `${t(item.label)}: All`;

            return (
              <Button
                key={item.id}
                sx={{
                  color: 'white',
                  borderRadius: 0,
                  border: '1px solid #00BCFFCC',
                  textTransform: 'none',
                  fontSize: 13,
                  height: 32,
                  minWidth: 150,
                  px: 2
                }}
              >
                {label}
              </Button>
            );
          }

          return (
            <Select
              key={item.id}
              size="small"
              multiple={item?.multiselect}
              value={item?.value ?? ''}
              onChange={item?.onChange}
              displayEmpty
              sx={{
                fontSize: 13,
                color: 'white',
                height: 32,
                // minWidth: 150,
                maxWidth:150,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00BCFFCC',
                  borderWidth: 1,
                  borderRadius: 0
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00BCFFCC'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00BCFFCC'
                },
                '& .MuiSelect-select': {
                  py: 0.5,
                  px: 1
                }
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      background: '#0B1118',
                      borderRadius: 0,
                      [`& .${menuItemClasses.root}`]: {
                        fontSize: 13,
                        color: 'white',
                        '&.Mui-selected': {
                          backgroundColor: '#031423 !important',
                          color: 'white'
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#031423 !important'
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

        {/* 🔹 Reset Button */}
        {/* {filter && (
          <Button
            variant="text"
            disabled={disableResetFilter}
            color="primary"
            onClick={() => handleResetFilter && handleResetFilter()}
            sx={{
              [`&.Mui-disabled`]: {
                backgroundColor: 'transparent',
                color: 'var(--grey-neutral-400)'
              },
              '&:hover': { textDecoration: 'none' }
            }}
          >
            <Stack direction="row" alignItems="center" gap={0.75}>
              <ArrowCounterClockwise size={19.4} />
              <Typography sx={{ fontWeight: 'bold' }} variant="button2">
                {t('Đặt lại bộ lọc')}
              </Typography>
            </Stack>
          </Button>
        )} */}

        {/* 🔹 Extra Button */}
        {btnPopup && <Box>{btnPopup}</Box>}
        </Grid>
      </Grid>
    </div>
  );
};

export default DataGridHeader;

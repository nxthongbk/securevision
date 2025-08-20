import { useState } from 'react';
import { TextFieldVariants, Typography } from '@mui/material';
import { CalendarBlank } from '@phosphor-icons/react';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

const CustomDatePicker = ({ hasTimeSelection, open, value, onClose, onClick, onChange, disabled, minDateTime }) => {
  const commonProps = {
    open,
    value,
    onClose,
    onChange,
    disabled,
    slotProps: {
      textField: {
        onClick,
        variant: 'standard' as TextFieldVariants,
        InputProps: {
          endAdornment: null,
          disableUnderline: true,
          className: 'input-field'
        },
        sx: {
          '& input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: 'none',
            textTransform: 'lowercase',
            fontSize: '14px'
          }
        }
      }
    }
  };

  return hasTimeSelection ? (
    <DateTimePicker {...commonProps} className='text-[--text-primary]' minDateTime={minDateTime} />
  ) : (
    <DatePicker {...commonProps} className='text-[--text-primary]' />
  );
};

const DateRangePicker = ({ valueStart, valueEnd, onChange, disabled = false, hasTimeSelection = true }) => {
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    onChange?.([date, endDate]);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
    onChange?.([startDate, date]);
  };

  const minEndDateTime = startDate || dayjs();

  return (
    <div>
      <div
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          height: '40px'
        }}
        className='bg-white px-4 grid grid-cols-12 items-center'
      >
        <div className='w-fit col-span-3'>
          <Typography variant='body3' sx={{ color: 'var(--tertiary)', fontSize: '14px' }}>
            Thời gian:
          </Typography>
        </div>
        <div className='flex justify-end col-span-3'>
          <LocalizationProvider adapterLocale='en-gb' dateAdapter={AdapterDayjs}>
            <CustomDatePicker
              hasTimeSelection={hasTimeSelection}
              open={openStartDatePicker}
              value={valueStart}
              onClose={() => setOpenStartDatePicker(false)}
              onClick={() => setOpenStartDatePicker(true)}
              onChange={handleStartDateChange}
              disabled={disabled}
              minDateTime={undefined}
            />
          </LocalizationProvider>
        </div>
        <div className='px-1 col-span-1'>-</div>
        <div className='col-span-3'>
          <LocalizationProvider adapterLocale='en-gb' dateAdapter={AdapterDayjs}>
            <CustomDatePicker
              hasTimeSelection={hasTimeSelection}
              open={openEndDatePicker}
              value={valueEnd}
              onClose={() => setOpenEndDatePicker(false)}
              onClick={() => setOpenEndDatePicker(true)}
              onChange={handleEndDateChange}
              disabled={disabled}
              minDateTime={minEndDateTime}
            />
          </LocalizationProvider>
        </div>
        <div className='justify-self-end col-span-2'>
          <CalendarBlank size={22} color='var(--tertiary)' />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

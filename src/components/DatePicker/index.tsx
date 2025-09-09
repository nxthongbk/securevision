import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CalendarBlank } from "@phosphor-icons/react";
import {
  DateCalendar,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

interface DateRangePickerProps {
  valueStart?: dayjs.Dayjs | null;
  valueEnd?: dayjs.Dayjs | null;
  onChange?: (range: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
  disabled?: boolean;
}

const DateRangePicker = ({
  valueStart,
  valueEnd,
  onChange,
  disabled = false,
}: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    valueStart ?? null
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    valueEnd ?? null
  );

  const handleApply = () => {
    onChange?.([startDate, endDate]);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    onChange?.([null, null]);
  };

  return (
    <Box
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        p: 2,
        background: "#0B1118",
        color: "white",
        width: "100%",
        maxWidth: 600,
      }}
    >
      {/* Header */}
      <Box
        sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
      >
        <CalendarBlank size={20} color="var(--tertiary)" />
        <Typography variant="body2" sx={{ color: "var(--tertiary)" }}>
          Thời gian
        </Typography>
      </Box>

      {/* Two Calendars Inline */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <LocalizationProvider
          adapterLocale="en-gb"
          dateAdapter={AdapterDayjs}
        >
          <DateCalendar
            disabled={disabled}
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </LocalizationProvider>

        <LocalizationProvider
          adapterLocale="en-gb"
          dateAdapter={AdapterDayjs}
        >
          <DateCalendar
            disabled={disabled}
            value={endDate}
            minDate={startDate || undefined}
            onChange={(date) => setEndDate(date)}
          />
        </LocalizationProvider>
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mt: 2,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          sx={{ color: "white", borderColor: "var(--tertiary)" }}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          size="small"
          variant="contained"
          sx={{ background: "var(--primary)" }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default DateRangePicker;

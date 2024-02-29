import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface BasicDateTimePickerProps {
  label?: string;
  value: Dayjs | null;
  onHandleValueChange?: (value: Dayjs | null) => void;
  backgroundColor?: string;
  disabled?: boolean;
}

const CustomDateTimePicker = ({
  label,
  value,
  onHandleValueChange,
  backgroundColor,
  disabled
}: BasicDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onHandleValueChange}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            style: {
              backgroundColor: backgroundColor || "white"
            }
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;

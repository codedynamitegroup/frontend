import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";

interface BasicDateTimePickerProps {
  label?: string;
  value: Dayjs | null;
  onHandleValueChange?: (value: Dayjs | null) => void;
  backgroundColor?: string;
}

const CustomDatePicker = ({
  label,
  value,
  onHandleValueChange,
  backgroundColor
}: BasicDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
        <DatePicker
          label={label}
          value={value}
          onChange={onHandleValueChange}
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
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

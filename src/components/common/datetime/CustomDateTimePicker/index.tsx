import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import i18next from "i18next";
import { useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";

interface BasicDateTimePickerProps {
  label?: string;
  value: Moment | null;
  onHandleValueChange?: (value: Moment | null) => void;
  backgroundColor?: string;
  disabled?: boolean;
  width?: string;
}

const CustomDateTimePicker = ({
  label,
  value,
  onHandleValueChange,
  backgroundColor,
  disabled = false,
  width
}: BasicDateTimePickerProps) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const momentLocale = useMemo(() => {
    return moment.locale(currentLang);
  }, [currentLang]);

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={momentLocale}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onHandleValueChange}
        disabled={disabled}
        format={currentLang === "vi" ? "dddd DD/MM/YYYY hh:mm A" : "dddd MM/DD/YYYY hh:mm A"}
        slotProps={{
          textField: {
            size: "small",
            sx: {
              backgroundColor: backgroundColor || "white",
              width: width || "100%"
            }
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;

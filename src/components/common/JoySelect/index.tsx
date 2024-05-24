import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { AnyComponent } from "@fullcalendar/core/preact";

interface PropsData {
  value: string;
  onChange: (newValue: AnyComponent) => void;
  options: { value: string; label: string }[];
  borderRadius?: string;
  height?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
}

const JoySelect = (props: PropsData) => {
  const { value, onChange, options, borderRadius, height, fontFamily, fontSize, fontWeight } =
    props;

  return (
    <Select
      value={value}
      onChange={(event, newValue: any) => onChange(newValue)}
      sx={{
        borderRadius: borderRadius || "12px",
        height: height || "40px",
        fontFamily: fontFamily || "Roboto,sans-serif",
        fontSize: fontSize || "14px",
        fontWeight: fontWeight || "400"
      }}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default JoySelect;

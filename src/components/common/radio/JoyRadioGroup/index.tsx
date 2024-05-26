import { Radio, RadioGroup } from "@mui/joy";

interface JoyRadioGroupProps {
  values: { value: boolean; label: string }[] | { value: string; label: string }[];
  size?: "sm" | "md" | "lg";
  variant?: "plain" | "outlined" | "soft" | "solid";
  color?: "primary" | "neutral" | "danger" | "success" | "warning";
  orientation?: "horizontal" | "vertical";

  value: string;
  onChange: (value: string) => void;

  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
}

const JoyRadioGroup = (props: JoyRadioGroupProps) => {
  const {
    values,
    size,
    variant,
    color,
    orientation,
    fontSize,
    fontWeight,
    fontFamily,
    onChange,
    value
  } = props;
  return (
    <RadioGroup orientation={orientation} size={size} variant={variant} value={value}>
      {values.map((value, index) => (
        <Radio
          key={index}
          value={value.value}
          label={value.label}
          onChange={(event: any) => onChange(event.target.value)}
          color={color}
          sx={{
            "& .MuiRadio-label": {
              fontFamily: fontFamily || "Roboto,sans-serif",
              fontSize: fontSize || "14px",
              fontWeight: fontWeight || "400"
            }
          }} // Add your custom styles here
        />
      ))}
    </RadioGroup>
  );
};

export default JoyRadioGroup;

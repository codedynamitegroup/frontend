import { Radio, RadioGroup, Sheet } from "@mui/joy";
import { Box } from "@mui/material";

interface JoyRadioGroupProps {
  values: { value: boolean; label: string }[] | { value: string; label: string }[] | undefined;
  size?: "sm" | "md" | "lg";
  variant?: "plain" | "outlined" | "soft" | "solid";
  color?: "primary" | "neutral" | "danger" | "success" | "warning";
  orientation?: "horizontal" | "vertical";

  value: string;
  onChange: (value: string) => void;

  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  numbering?: string | null;
  overlay?: boolean;
  disabled?: boolean;
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
    value,
    numbering,
    overlay,
    disabled
  } = props;
  return (
    <RadioGroup orientation={orientation} size={size} variant={variant} value={value}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "& > div": { p: 1, borderRadius: "12px", display: "flex" }
        }}
      >
        {values?.map((value, index) =>
          overlay ? (
            <Sheet variant='outlined' key={index}>
              <Radio
                overlay
                checkedIcon={
                  numbering && (
                    <Box
                      sx={{
                        width: "inherit",
                        height: "inherit",
                        backgroundColor: "#e2ecf5"
                      }}
                      borderRadius={"1000px"}
                      border={"2px solid #0b6bcb"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      padding={"5px"}
                      fontWeight={"500"}
                    >
                      <Box>{numbering !== "n123" ? getLabel(index, numbering) : index + 1}</Box>
                    </Box>
                  )
                }
                uncheckedIcon={
                  numbering && (
                    <span>{numbering !== "n123" ? getLabel(index, numbering) : index + 1}</span>
                  )
                }
                value={value.value}
                label={value.label}
                onChange={(event: any) => onChange(event.target.value)}
                color={color}
                sx={{
                  "& .MuiRadio-label": {
                    fontFamily: fontFamily || "Montserrat",
                    fontSize: fontSize || "14px",
                    fontWeight: fontWeight || "400"
                  }
                }} // Add your custom styles here
              />
            </Sheet>
          ) : (
            <Radio
              disabled={disabled}
              checked={index === 0 ? true : false}
              checkedIcon={
                numbering && (
                  <Box
                    sx={{
                      width: "inherit",
                      height: "inherit",
                      backgroundColor: "#e2ecf5"
                    }}
                    borderRadius={"1000px"}
                    border={"2px solid #0b6bcb"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    padding={"5px"}
                    fontWeight={"500"}
                  >
                    <Box>{numbering !== "n123" ? getLabel(index, numbering) : index + 1}</Box>
                  </Box>
                )
              }
              uncheckedIcon={
                numbering && (
                  <span>{numbering !== "n123" ? getLabel(index, numbering) : index + 1}</span>
                )
              }
              key={index}
              value={value.value}
              label={value.label}
              onChange={(event: any) => onChange(event.target.value)}
              color={color}
              sx={{
                "& .MuiRadio-label": {
                  fontFamily: fontFamily || "Montserrat",
                  fontSize: fontSize || "14px",
                  fontWeight: fontWeight || "400"
                }
              }} // Add your custom styles here
            />
          )
        )}
      </Box>
    </RadioGroup>
  );
};

function getLabel(index: number, numberingType: string) {
  const type = numberingType === "abc" ? "a" : "A";
  const startCharCode = type.charCodeAt(0);
  const alphabetLength = 26;

  if (index < alphabetLength) {
    // Single letter label
    return String.fromCharCode(startCharCode + index);
  } else {
    // Double letter label
    const firstLetter = String.fromCharCode(startCharCode + Math.floor(index / alphabetLength) - 1);
    const secondLetter = String.fromCharCode(startCharCode + (index % alphabetLength));
    return firstLetter + secondLetter;
  }
}

export default JoyRadioGroup;

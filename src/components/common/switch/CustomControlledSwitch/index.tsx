import * as React from "react";
import Switch from "@mui/material/Switch";

interface CustomControlledSwitchProps {
  checked: boolean;
  handleChange: (label: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps: { "aria-label": string };
}

export default function CustomControlledSwitch({
  checked,
  handleChange,
  inputProps
}: CustomControlledSwitchProps) {
  return (
    <Switch
      checked={checked}
      onChange={(event) => handleChange(inputProps["aria-label"], event)}
      inputProps={inputProps}
    />
  );
}

import React from "react";
import { FormControl, FormControlTypeMap, InputLabel, MenuItem, Select } from "@mui/material";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";

interface BasicSelectProps extends DefaultComponentProps<FormControlTypeMap<{}, "div">> {
  labelId: string;
  value: string;
  onHandleChange: (value: string) => void;
  label?: string;
  items?: { value: string; label: string }[];
  disabled?: boolean;
  backgroundColor?: string;
}

const BasicSelect = ({
  labelId,
  value,
  onHandleChange,
  label,
  items,
  disabled,
  backgroundColor,
  ...props
}: BasicSelectProps) => {
  return (
    <FormControl sx={{ marginTop: "15px", minWidth: 120 }} fullWidth size='small' {...props}>
      <InputLabel id={labelId}>{label || ""}</InputLabel>
      <Select
        style={{
          backgroundColor: backgroundColor || "#D9E2ED"
        }}
        labelId={labelId}
        id='select-id'
        value={value}
        label={label}
        onChange={(e) => onHandleChange(e.target.value as string)}
        fullWidth
        disabled={disabled}
        classes={{
          root: clsx(classes.inputTextfield)
        }}
      >
        {items?.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BasicSelect;

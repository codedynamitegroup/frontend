import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface BasicRadioGroupProps {
  ariaLabel: string;
  value?: any;
  handleChange?: (value?: any) => void;
  items?: {
    value: string;
    label: string;
  }[];
}

const BasicRadioGroup = ({ ariaLabel, value, handleChange, items }: BasicRadioGroupProps) => {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      name={ariaLabel}
      value={value}
      onChange={(e) => handleChange && handleChange(e.target.value)}
    >
      {items?.map((item, index) => (
        <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
      ))}
    </RadioGroup>
  );
};

export default BasicRadioGroup;

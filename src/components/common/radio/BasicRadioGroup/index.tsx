import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface BasicRadioGroupProps {
  ariaLabel: string;
  value?: any;
  handleChangeQuestionType?: (value?: any) => void;
  items?: {
    value: string;
    label: string;
  }[];
}

const BasicRadioGroup = ({
  ariaLabel,
  value,
  handleChangeQuestionType,
  items
}: BasicRadioGroupProps) => {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      name={ariaLabel}
      value={value}
      onChange={(e) => handleChangeQuestionType && handleChangeQuestionType(e.target.value)}
    >
      {items?.map((item, index) => (
        <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
      ))}
    </RadioGroup>
  );
};

export default BasicRadioGroup;

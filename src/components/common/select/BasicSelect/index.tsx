import React from "react";
import {
  FormControl,
  FormControlTypeMap,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField
} from "@mui/material";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";

interface ItemProps {
  value: string;
  label: string;
  customNode?: React.ReactNode;
}

interface BasicSelectProps extends DefaultComponentProps<FormControlTypeMap<{}, "div">> {
  labelId: string;
  value: string;
  onHandleChange: (value: string) => void;
  label?: string;
  items?: ItemProps[];
  disabled?: boolean;
  readOnly?: boolean;
  backgroundColor?: string;
  searchAble?: boolean;
  width?: string;
  borderRadius?: string;
}

const BasicSelect = ({
  searchAble,
  labelId,
  value,
  onHandleChange,
  label,
  items,
  disabled,
  readOnly,
  backgroundColor,
  width,
  borderRadius,

  ...props
}: BasicSelectProps) => {
  var defaultValue: ItemProps | null = null;
  if (items) defaultValue = items[0];
  return (
    <FormControl sx={{ minWidth: 120, width: width || "100%" }} fullWidth size='small' {...props}>
      <InputLabel id={labelId}>{label || ""}</InputLabel>
      {searchAble ? (
        <Autocomplete
          fullWidth
          disablePortal
          disabled={disabled}
          readOnly={readOnly}
          id='combo-box-demo'
          options={items || []}
          renderOption={(prop, option, state, ownerState) => (
            <li {...prop}>{option.customNode || option.label}</li>
          )}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} />}
        />
      ) : (
        <Select
          style={{
            backgroundColor: backgroundColor || "white",
            borderRadius: borderRadius || 0
          }}
          labelId={labelId}
          id='select-id'
          value={value}
          label={label}
          onChange={(e) => onHandleChange(e.target.value as string)}
          fullWidth
          disabled={disabled}
          readOnly={readOnly}
          classes={{
            root: clsx(classes.inputTextfield)
          }}
        >
          {items?.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.customNode || item.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default BasicSelect;

import { FormControl, Grid, OutlinedInput, OutlinedInputProps } from "@mui/material";
import classes from "./styles.module.scss";
import { memo } from "react";
import clsx from "clsx";
import TextTitle from "components/text/TextTitle";
import ErrorMessage from "components/text/ErrorMessage";
interface InputsProps extends OutlinedInputProps {
  title?: string;
  type?: string;
  titleRequired?: boolean;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  value?: string | number;
  inputRef?: any;
  autoComplete?: string;
  errorMessage?: string | null;
  optional?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundColor?: string;
  maxWith?: string;
}

const TimeLeftTextField = memo((props: InputsProps) => {
  const {
    title,
    type,
    placeholder,
    name,
    defaultValue,
    value,
    inputRef,
    errorMessage,
    autoComplete,
    readOnly,
    disabled,
    onChange,
    backgroundColor,
    maxWith
  } = props;
  const { ref: refInput, ...inputProps } = inputRef || { ref: null };
  return (
    <>
      <FormControl
        className={classes.inputContainer}
        sx={{
          width: "fit-content"
        }}
      >
        <Grid container spacing={1} columns={12}>
          <Grid item xs={title ? 12 : 0} md={title ? 3 : 0}>
            {title && <TextTitle>{title}</TextTitle>}
          </Grid>
          <Grid item xs={title ? 12 : 12} md={title ? 9 : 12}>
            <OutlinedInput
              placeholder={placeholder}
              fullWidth
              size='small'
              readOnly={readOnly}
              disabled={disabled}
              name={name}
              type={type}
              classes={{
                root: clsx(classes.inputTextfield, {
                  [classes.inputInvalid]: !!errorMessage
                })
              }}
              style={{
                backgroundColor: backgroundColor || "white",
                maxWidth: maxWith || "none"
              }}
              defaultValue={defaultValue}
              value={value}
              autoComplete={autoComplete}
              onChange={onChange}
              {...inputProps}
              inputRef={refInput}
            />
          </Grid>
        </Grid>
      </FormControl>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
});

export default TimeLeftTextField;

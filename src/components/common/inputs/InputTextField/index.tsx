import { FormControl, Grid, OutlinedInput, OutlinedInputProps } from "@mui/material";
import classes from "./styles.module.scss";
import { memo } from "react";
import clsx from "clsx";
import ErrorMessage from "components/text/ErrorMessage";
import TitleWithInfoTip from "components/text/TitleWithInfo";

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
  errorMessage?: string | null | undefined;
  optional?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundColor?: string;
  fullWidth?: boolean;
  maxWith?: string;
  error?: boolean;
  tooltipDescription?: string;
  infoComponent?: React.ReactNode;
  required?: boolean;
  titleFontSize?: string;
  width?: string;
}

const InputTextField = memo((props: InputsProps) => {
  const {
    title,
    titleRequired,
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
    fullWidth,
    maxWith,
    error,
    tooltipDescription,
    titleFontSize,
    width
  } = props;
  const { ref: refInput, ...inputProps } = inputRef || { ref: null };
  return (
    <>
      <FormControl
        className={classes.inputContainer}
        sx={{
          width: `${fullWidth ? "100%" : "auto"}`,
          ...props.sx
        }}
      >
        <Grid container spacing={1} columns={12}>
          <Grid item xs={title ? 12 : 0} md={title ? 3 : 0}>
            {title && (
              <TitleWithInfoTip
                fontSize={titleFontSize}
                title={title}
                titleRequired={titleRequired}
                tooltipDescription={tooltipDescription}
              />
            )}
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
              error={error}
              classes={{
                root: clsx(classes.inputTextfield, {
                  [classes.inputInvalid]: !!errorMessage
                })
              }}
              style={{
                backgroundColor: backgroundColor || "white",
                maxWidth: maxWith || "none",
                width: width || "auto"
              }}
              defaultValue={defaultValue}
              value={value}
              autoComplete={autoComplete}
              onChange={onChange}
              {...inputProps}
              inputRef={refInput}
            />
          </Grid>
          <Grid item xs={title ? 12 : 0} md={title ? 3 : 0}>
            <></>
          </Grid>
          <Grid item xs={title ? 12 : 12} md={title ? 9 : 12}>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
});

export default InputTextField;

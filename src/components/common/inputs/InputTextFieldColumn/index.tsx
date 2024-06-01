import { Grid, OutlinedInput, OutlinedInputProps } from "@mui/material";
import { memo } from "react";
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
  error?: boolean;
  tooltipDescription?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
}

const InputTextFieldColumn = memo((props: InputsProps) => {
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
    error,
    tooltipDescription,
    titleRequired,
    fontFamily,
    fontSize,
    fontWeight
  } = props;
  const { ref: refInput, ...inputProps } = inputRef || { ref: null };
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {title && (
            <TitleWithInfoTip
              title={title}
              titleRequired={titleRequired}
              tooltipDescription={tooltipDescription}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <OutlinedInput
            placeholder={placeholder}
            fullWidth
            size='small'
            readOnly={readOnly}
            disabled={disabled}
            name={name}
            type={type}
            error={error}
            style={{
              backgroundColor: backgroundColor || "white"
            }}
            defaultValue={defaultValue}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            {...inputProps}
            inputRef={inputRef}
            sx={{
              borderRadius: "12px",
              fontFamily: fontFamily || "Roboto,sans-serif",
              fontSize: fontSize || "14px",
              fontWeight: fontWeight || "400",
              boxShadow: "0px 1px 2px 0px rgba(21, 21, 21, 0.08)"
            }}
          />
        </Grid>
        <Grid item xs={title ? 12 : 0} md={0}>
          <></>
        </Grid>
        <Grid item xs={title ? 12 : 12}>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Grid>
      </Grid>
    </>
  );
});

export default InputTextFieldColumn;

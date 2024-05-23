import { Box, Grid, OutlinedInput, OutlinedInputProps, Tooltip, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import { memo } from "react";
import ErrorMessage from "components/text/ErrorMessage";
import InfoTooltip from "components/common/infoTooltip";
import TitleWithInfoTip from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/TitleWithInfo";

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
    titleRequired
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
            inputRef={refInput}
            sx={{ borderRadius: "12px" }}
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

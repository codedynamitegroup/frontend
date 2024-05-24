import SearchIcon from "@mui/icons-material/Search";
import { Divider, Grid, InputAdornment, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import classes from "./styles.module.scss";

interface PropsData {
  value: string;
  setValue: any;
  options: CertificateCourseEntity[];
  onHandleChange: any;
  placeHolder?: string;
  maxWidth?: string;
  size?: "small" | "medium";
  renderOption?: (props: any, option: CertificateCourseEntity, { inputValue }: any) => JSX.Element;
}

export default function CustomAutocomplete({
  value,
  setValue,
  options,
  onHandleChange,
  placeHolder,
  maxWidth,
  size = "small",
  renderOption
}: PropsData) {
  const certificateCourseState = useSelector((state: RootState) => state.certifcateCourse);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isLoading = React.useMemo(() => certificateCourseState.isLoading, [certificateCourseState]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  console.log("options", options);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onHandleChange(value);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [onHandleChange, value]);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <Paper
          className={classes.container}
          style={{
            width: "100%"
          }}
        >
          <Autocomplete
            id='free-solo-demo'
            freeSolo
            sx={{
              width: "100%"
            }}
            size={size}
            loading={isLoading}
            options={options}
            getOptionLabel={(option: string | CertificateCourseEntity) => {
              return typeof option === "string" ? option : option.name;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                value={value}
                onChange={handleOnChange}
                placeholder={placeHolder ? placeHolder : t("common_search")}
                autoComplete='off'
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                      <Divider className={classes.searchDivider} orientation='vertical' />
                    </InputAdornment>
                  )
                }}
              />
            )}
            renderOption={renderOption}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

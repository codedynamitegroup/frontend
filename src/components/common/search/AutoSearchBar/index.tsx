import { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Cancel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Icon from "@mui/material/Icon";

import classes from "./styles.module.scss";
import { Divider, Grid, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";

interface PropsData {
  value: string;
  setValue: any;
  onHandleChange: any;
  placeHolder?: string;
  maxWidth?: string;
}

const AutoSearchBar = ({ value, setValue, onHandleChange, placeHolder, maxWidth }: PropsData) => {
  const { t } = useTranslation();

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  const handleRemoveAllTextButton = () => {
    setValue("");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onHandleChange(value);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [onHandleChange, value]);

  return (
    <Grid
      container
      className={classes.gridContainer}
      style={{
        maxWidth: maxWidth ? maxWidth : "600px"
      }}
    >
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <FormControl className={classes.formWrapper}>
          <Paper
            className={classes.container}
            style={{
              width: "100%"
            }}
          >
            <InputBase
              className={classes.inputField}
              placeholder={placeHolder ? placeHolder : t("common_search")}
              onChange={handleOnChange}
              value={value}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon />
                  <Divider className={classes.searchDivider} orientation='vertical' />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  {value === null || value === "" ? (
                    <IconButton className={classes.button} disabled edge='end'>
                      <Icon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={handleRemoveAllTextButton}
                      className={classes.button}
                      edge='end'
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              }
            />
          </Paper>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default AutoSearchBar;

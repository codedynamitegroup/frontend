import { useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Cancel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Icon from "@mui/material/Icon";

import classes from "./styles.module.scss";
import { Divider, Grid, InputAdornment, Paper } from "@mui/material";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // To store the timeout

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout
    }
    timeoutRef.current = setTimeout(() => {
      onHandleChange(value);
    }, 800);
  };

  const handleRemoveAllTextButton = () => {
    setValue("");
    onHandleChange("");
  };

  useEffect(() => {
    // Cleanup function to clear the timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

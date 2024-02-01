import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Cancel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Icon from "@mui/material/Icon";

import classes from "./styles.module.scss";
import { Divider, Grid, InputAdornment } from "@mui/material";

interface PropsData {
  onSearchClick: any;
  placeHolder?: string;
}

const SearchBar = (props: PropsData) => {
  const { onSearchClick, placeHolder } = props;
  const [iconButtonVisibility, setIconButtonVisibility] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setSearchText(e.target.value);
  };
  const handleClickSearchButton = () => {
    onSearchClick(searchText);
  };
  const handleRemoveAllTextButton = () => {
    setSearchText("");
    setIconButtonVisibility(false);
  };

  useEffect(() => {
    if (searchText === null || searchText === "") setIconButtonVisibility(false);
    else setIconButtonVisibility(true);
  }, [searchText]);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <FormControl className={classes.formWrapper}>
          <Paper className={classes.container}>
            <InputBase
              className={classes.inputField}
              placeholder={placeHolder ? placeHolder : "Tìm kiếm"}
              onChange={handleOnChange}
              value={searchText}
              startAdornment={
                <InputAdornment position='start'>
                  <Tooltip title='Nhấn để tìm' arrow disableInteractive>
                    <IconButton onClick={handleClickSearchButton}>
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>

                  <Divider className={classes.searchDivider} orientation='vertical' />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  {iconButtonVisibility ? (
                    <IconButton
                      onClick={handleRemoveAllTextButton}
                      className={classes.button}
                      edge='end'
                    >
                      <RemoveIcon />
                    </IconButton>
                  ) : (
                    <IconButton className={classes.button} disabled edge='end'>
                      <Icon />
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

export default SearchBar;

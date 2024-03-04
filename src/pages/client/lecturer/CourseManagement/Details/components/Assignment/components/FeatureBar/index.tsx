import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent
} from "@mui/material";
import classes from "./style.module.scss";
import ExportIcon from "@mui/icons-material/SystemUpdateAlt";
import { useState } from "react";
import SearchBar from "components/common/search/SearchBar";
import Button, { BtnType } from "components/common/buttons/Button";

interface FeatureBarProps {
  colSearchLabel?: string;
  shuffleQuestionsLabel?: string;
  colItems?: {
    label: string;
    value: string;
  }[];
}

const FeatureBar = ({ colSearchLabel, shuffleQuestionsLabel, colItems }: FeatureBarProps) => {
  const searchBarHandler = (val: string) => {
    console.log(val);
  };
  const [colSearchVal, setColSearchVal] = useState("name");
  const colSearchChangeHandler = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setColSearchVal(event.target.value);
  };

  return (
    <Paper className={classes.container}>
      <Box className={classes.searchWrapper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SearchBar onSearchClick={searchBarHandler} maxWidth='100%' />
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.colSearchContainer}>
              <InputLabel id='colSearch'>{colSearchLabel}</InputLabel>
              <Select
                labelId='colSearch'
                id='colSearchSelect'
                value={colSearchVal}
                onChange={colSearchChangeHandler}
              >
                {colItems?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FeatureBar;

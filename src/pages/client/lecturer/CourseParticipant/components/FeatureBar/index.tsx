import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent
} from "@mui/material";
import classes from "./style.module.scss";
import SearchBar from "components/common/SearchBar";
import ExportIcon from "@mui/icons-material/SystemUpdateAlt";
import { useState } from "react";

const CourseParticipantFeatureBar = () => {
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
        <SearchBar onSearchClick={searchBarHandler} />

        <FormControl className={classes.colSearchContainer}>
          <InputLabel id='colSearch'>Tìm kiếm theo cột</InputLabel>
          <Select
            labelId='colSearch'
            id='colSearchSelect'
            value={colSearchVal}
            onChange={colSearchChangeHandler}
            label='Tìm kiếm theo cột'
          >
            <MenuItem value={"name"}>Tên</MenuItem>
            <MenuItem value={"emai"}>Email</MenuItem>
            <MenuItem value={"role"}>Chức vụ</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button startIcon={<ExportIcon />} variant='outlined' className={classes.exportButton}>
        Xuất dữ liệu
      </Button>
    </Paper>
  );
};

export default CourseParticipantFeatureBar;

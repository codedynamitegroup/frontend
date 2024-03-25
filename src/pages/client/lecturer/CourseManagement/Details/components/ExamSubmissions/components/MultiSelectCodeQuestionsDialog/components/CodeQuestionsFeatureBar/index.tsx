import {
  Box,
  FormControl,
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

const CodeQuestionsFeatureBar = () => {
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

      <Button
        btnType={BtnType.Primary}
        startIcon={<ExportIcon sx={{ color: "white" }} />}
        sx={{ marginLeft: "15px", marginBottom: "10px" }}
      >
        Xuất dữ liệu
      </Button>
    </Paper>
  );
};

export default CodeQuestionsFeatureBar;

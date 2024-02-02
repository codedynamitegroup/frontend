import {
  Box,
  Button,
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

const QuestionsFeatureBar = () => {
  const searchBarHandler = (val: string) => {
    console.log(val);
  };
  const [colSearchVal, setColSearchVal] = useState("name");
  const colSearchChangeHandler = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setColSearchVal(event.target.value);
  };

  const [isShuffleQuestions, setIsShuffleQuestions] = useState(false);

  const handleShuffleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShuffleQuestions(event.target.checked);
  };

  return (
    <Paper className={classes.container}>
      <Box className={classes.searchWrapper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SearchBar onSearchClick={searchBarHandler} />
          </Grid>
          <Grid item xs={4}>
            <FormControl className={classes.colSearchContainer}>
              <InputLabel id='colSearch'>Tìm kiếm theo cột</InputLabel>
              <Select
                labelId='colSearch'
                id='colSearchSelect'
                value={colSearchVal}
                onChange={colSearchChangeHandler}
                label='Tìm kiếm theo cột'
              >
                <MenuItem value={"name"}>Tên câu hỏi</MenuItem>
                <MenuItem value={"emai"}>Kiểu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isShuffleQuestions}
                  onChange={handleShuffleQuestionsChange}
                  name='shuffleQuestions'
                  color='primary'
                />
              }
              label='Trộn câu hỏi'
            />
          </Grid>
        </Grid>
      </Box>
      <Button startIcon={<ExportIcon />} variant='outlined' className={classes.exportButton}>
        Xuất dữ liệu
      </Button>
    </Paper>
  );
};

export default QuestionsFeatureBar;

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

interface QuestionsFeatureBarProps {
  colSearchLabel?: string;
  shuffleQuestionsLabel?: string;
  colItems?: {
    label: string;
    value: string;
  }[];
}

const QuestionsFeatureBar = ({
  colSearchLabel,
  shuffleQuestionsLabel,
  colItems
}: QuestionsFeatureBarProps) => {
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
          {shuffleQuestionsLabel && (
            <Grid
              item
              xs={3}
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
                  />
                }
                label={shuffleQuestionsLabel || "Xáo trộn câu hỏi"}
              />
            </Grid>
          )}
        </Grid>
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

export default QuestionsFeatureBar;

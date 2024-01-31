import { Box, Paper } from "@mui/material";
import classes from "./style.module.scss";
import SearchBar from "components/common/SearchBar";

const CourseParticipantFeatureBar = () => {
  const searchBarHandler = (val: string) => {
    console.log(val);
  };

  return (
    <Paper>
      <SearchBar onSearchClick={searchBarHandler} />
    </Paper>
  );
};

export default CourseParticipantFeatureBar;

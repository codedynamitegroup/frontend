import React from "react";
import Grid from "@mui/material/Grid";
import SearchBar from "components/common/SearchBar";

const LecturerCourseManagement = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  return (
    <Grid>
      <SearchBar onSearchClick={searchHandle} />
    </Grid>
  );
};

export default LecturerCourseManagement;

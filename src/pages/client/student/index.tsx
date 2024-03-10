import { Box, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import SideBarStudent from "components/common/sidebars/SidebarStudent";
import { Route, Routes } from "react-router";
import StudentCourses from "./CourseManagement";
import StudentEventCalendar from "./StudentEventCalendar";
import StudentCourseDetail from "./CourseManagement/Details";
type Props = {};

const StudentCoursesManagement = (props: Props) => {
  return (
    <Grid className={classes.root}>
      <SideBarStudent>
        <Box className={classes.container}>
          <Box className={classes.body}>
            <Routes>
              <Route path={"courses"} element={<StudentCourses />} />
              <Route path={"courses/:courseId/*"} element={<StudentCourseDetail />} />
              <Route path={"calendar"} element={<StudentEventCalendar />} />
            </Routes>
          </Box>
        </Box>
      </SideBarStudent>
    </Grid>
  );
};

export default StudentCoursesManagement;

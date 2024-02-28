import React from "react";
import SearchBar from "components/common/search/SearchBar";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import { Grid } from "@mui/material";
import Heading3 from "components/text/Heading3";
import Heading2 from "components/text/Heading2";
import Heading1 from "components/text/Heading1";
import AssignmentResource from "./components/Resource";
import MenuPopup from "components/common/menu/MenuPopup";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";

const LecturerCourseAssignment = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };
  const navigate = useNavigate();

  const onCreateNewAssignment = async (popupState: any) => {
    navigate(routes.lecturer.assignment.create);
    popupState.close();
  };

  const onCreateNewExam = async (popupState: any) => {
    navigate(routes.lecturer.exam.create);
    popupState.close();
  };

  return (
    <Box className={classes.assignmentBody}>
      <Heading1>Danh sách bài tập</Heading1>
      <Grid container>
        <Grid item xs={7}>
          <SearchBar onSearchClick={searchHandle} />
        </Grid>
        <Grid item xs={5}>
          <MenuPopup
            popupId='add-question-popup'
            triggerButtonText='Thêm mới'
            triggerButtonProps={{
              width: "150px"
            }}
            btnType={BtnType.Primary}
            menuItems={[
              {
                label: "Tạo bài tập",
                onClick: onCreateNewAssignment
              },
              {
                label: "Tạo bài kiểm tra",
                onClick: onCreateNewExam
              }
            ]}
          />
        </Grid>
      </Grid>
      <Box className={classes.assignmentsWrapper}>
        <Box className={classes.topic}>
          <Heading3>Bài tập</Heading3>
          <AssignmentResource resourceTitle='Bài tập 1' resourceEndedDate='12/12/2022' />
          <AssignmentResource resourceTitle='Bài tập 2' resourceEndedDate='12/12/2023' />
        </Box>
        <Box className={classes.topic}>
          <Heading3>Bài kiểm tra</Heading3>
          <AssignmentResource resourceTitle='Bài kiểm tra 1' resourceEndedDate='12/12/2022' />
          <AssignmentResource resourceTitle='Bài kiểm tra 2' resourceEndedDate='12/12/2023' />
        </Box>
      </Box>
    </Box>
  );
};

export default LecturerCourseAssignment;

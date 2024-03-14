import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { BtnType } from "components/common/buttons/Button";
import MenuPopup from "components/common/menu/MenuPopup";
import SearchBar from "components/common/search/SearchBar";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import AssignmentResource, { ResourceType } from "./components/Resource";
import classes from "./styles.module.scss";
import { useState } from "react";
import ReusedCourseResourceDialog from "./components/ReuseResourceDialog/CourseDialog";
import ReusedResourceDialog from "./components/ReuseResourceDialog/ResourceDialog";
import { useTranslation } from "react-i18next";

const LecturerCourseAssignment = () => {
  const { t } = useTranslation();
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

  const [isReusedCourseResourceOpen, setIsReusedCourseResourceOpen] = useState(false);

  const onOpenReusedCourseResourceDialog = async (popupState: any) => {
    setIsReusedCourseResourceOpen(true);
    popupState.close();
  };

  const onCloseReusedCourseResourceDialog = () => {
    setIsReusedCourseResourceOpen(false);
  };

  const [isReusedResourceOpen, setIsReusedResourceOpen] = useState(false);

  const onOpenReusedResourceDialog = async () => {
    setIsReusedCourseResourceOpen(false);
    setIsReusedResourceOpen(true);
  };

  const onCloseReusedResourceDialog = () => {
    setIsReusedCourseResourceOpen(false);
    setIsReusedResourceOpen(false);
  };

  const onBackReusedCourseResourceDialog = () => {
    setIsReusedCourseResourceOpen(true);
    setIsReusedResourceOpen(false);
  };
  return (
    <>
      <Box className={classes.assignmentBody}>
        <Heading1 translation-key='course_detail_assignment_list'>
          {t("course_detail_assignment_list")}
        </Heading1>
        <Grid container>
          <Grid item xs={7}>
            <SearchBar onSearchClick={searchHandle} />
          </Grid>
          <Grid item xs={5}>
            <MenuPopup
              popupId='add-question-popup'
              triggerButtonText={t("course_lecturer_assignment_add_new")}
              triggerButtonProps={{
                width: "150px"
              }}
              btnType={BtnType.Primary}
              menuItems={[
                {
                  label: t("course_lecturer_assignment_create_new_assignment"),
                  onClick: onCreateNewAssignment
                },
                {
                  label: t("course_lecturer_assignment_create_exam"),
                  onClick: onCreateNewExam
                },
                {
                  label: t("course_lecturer_assignment_reuse_resource"),
                  onClick: onOpenReusedCourseResourceDialog
                }
              ]}
              translation-key={[
                "course_lecturer_assignment_add_new",
                "course_lecturer_assignment_create_new_assignment",
                "course_lecturer_assignment_create_exam",
                "course_lecturer_assignment_reuse_resource"
              ]}
            />
          </Grid>
        </Grid>
        <Box className={classes.assignmentsWrapper}>
          <Box className={classes.topic}>
            <Heading3 translation-key>{t("course_detail_assignment")}</Heading3>
            <AssignmentResource resourceTitle='Bài tập 1' resourceEndedDate='12/12/2022' />
            <AssignmentResource resourceTitle='Bài tập 2' resourceEndedDate='12/12/2023' />
          </Box>
          <Box className={classes.topic}>
            <Heading3 translation-key='course_detail_exam'>{t("course_detail_exam")}</Heading3>
            <AssignmentResource
              resourceTitle='Bài kiểm tra 1'
              resourceEndedDate='12/12/2022'
              type={ResourceType.exam}
            />
            <AssignmentResource
              resourceTitle='Bài kiểm tra 2'
              resourceEndedDate='12/12/2023'
              type={ResourceType.exam}
            />
          </Box>
        </Box>
      </Box>
      <ReusedCourseResourceDialog
        title={t("course_list_title")}
        onOpenReuseResourceDialog={onOpenReusedResourceDialog}
        open={isReusedCourseResourceOpen}
        handleClose={onCloseReusedCourseResourceDialog}
        translation-key='course_list_title'
      />
      <ReusedResourceDialog
        title={t("course_lecturer_resource_list")}
        open={isReusedResourceOpen}
        cancelText={t("common_back")}
        onHandleCancel={onBackReusedCourseResourceDialog}
        handleClose={onCloseReusedResourceDialog}
        translation-key={["course_lecturer_resource_list", "common_back"]}
      />
    </>
  );
};

export default LecturerCourseAssignment;

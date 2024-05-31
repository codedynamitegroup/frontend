import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { BtnType } from "components/common/buttons/Button";
import MenuPopup from "components/common/menu/MenuPopup";
import SearchBar from "components/common/search/SearchBar";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import AssignmentResource, { ResourceType } from "./components/Resource";
import classes from "./styles.module.scss";
import { useEffect, useMemo, useState } from "react";
import ReusedCourseResourceDialog from "./components/ReuseResourceDialog/CourseDialog";
import ReusedResourceDialog from "./components/ReuseResourceDialog/ResourceDialog";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { setExams } from "reduxes/courseService/exam";
import { AssignmentService } from "services/courseService/AssignmentService";
import { setAssignments } from "reduxes/courseService/assignment";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";

const LecturerCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examState = useSelector((state: RootState) => state.exam);
  const questionCreate = useSelector((state: RootState) => state.questionCreate);

  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);

  const handleGetExams = async (id: string) => {
    try {
      const response = await ExamService.getExamsByCourseId(id);
      dispatch(setExams(response));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAssignments = async (id: string) => {
    try {
      const response = await AssignmentService.getAssignmentsByCourseId(id);
      dispatch(setAssignments(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetExams(courseId ?? "");
    handleGetAssignments(courseId ?? "");
    console.log("examState", examState.exams);
  }, []);

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
    navigate(routes.lecturer.exam.create.replace(":courseId", courseId?.toString() ?? ""));
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
              triggerButtonText={i18next.format(t("common_add_new"), "firstUppercase")}
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
                "common_add_new",
                "course_lecturer_assignment_create_new_assignment",
                "course_lecturer_assignment_create_exam",
                "course_lecturer_assignment_reuse_resource"
              ]}
            />
          </Grid>
        </Grid>
        <Box className={classes.assignmentsWrapper}>
          <Box className={classes.topic}>
            <Heading3 translation-key='course_detail_assignment'>
              {t("course_detail_assignment")}
            </Heading3>
            {assignmentState.assignments.map((assignment: AssignmentEntity) => (
              <AssignmentResource
                courseId={courseId}
                examId={assignment.id}
                resourceTitle={assignment.title}
                resourceEndedDate={assignment.timeClose}
                intro={assignment.intro}
                type={ResourceType.assignment}
              />
            ))}
          </Box>
          <Box className={classes.topic}>
            <Heading3 translation-key='course_detail_exam'>{t("course_detail_exam")}</Heading3>
            {examState.exams.map((exam) => (
              <AssignmentResource
                courseId={courseId ?? ""}
                examId={exam.id}
                resourceTitle={exam.name}
                resourceEndedDate={exam.timeClose}
                intro={exam.intro}
                type={ResourceType.exam}
              />
            ))}
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

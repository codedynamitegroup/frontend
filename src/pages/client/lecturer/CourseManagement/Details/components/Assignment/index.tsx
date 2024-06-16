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
import { useEffect, useMemo, useState, useCallback } from "react";
import ReusedCourseResourceDialog from "./components/ReuseResourceDialog/CourseDialog";
import ReusedResourceDialog from "./components/ReuseResourceDialog/ResourceDialog";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { setExamList, setExams } from "reduxes/courseService/exam";
import { AssignmentService } from "services/courseService/AssignmentService";
import assignment, { setAssignments } from "reduxes/courseService/assignment";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";
import { ExamEntity } from "models/courseService/entity/ExamEntity";
import { clearExamCreate } from "reduxes/coreService/questionCreate";

const LecturerCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examState = useSelector((state: RootState) => state.exam);
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const { courseId } = useParams<{ courseId: string }>();

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
    console.log("CCC");
    handleGetExams(courseId ?? "");
    handleGetAssignments(courseId ?? "");
  }, [courseId]);

  const handleDeleteAssignment = useCallback(
    async (id: string) => {
      try {
        console.log("HEHE");
        const response = await AssignmentService.deleteAssignment(id);
        if (response) {
          const result = assignmentState.assignments.filter((e) => e.id !== id);
          dispatch(setAssignments({ assignments: result }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [assignmentState.assignments, dispatch]
  );

  const handleDeleteExam = useCallback(
    async (id: string) => {
      try {
        const response = await ExamService.deleteExam(id);
        if (response) {
          const result = examState.exams.exams.filter((e) => e.id !== id);
          dispatch(setExamList({ exams: result }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [examState.exams.exams, dispatch]
  );

  const { t } = useTranslation();
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };
  const navigate = useNavigate();

  const onCreateNewAssignment = (popupState: any) => {
    navigate(routes.lecturer.assignment.create.replace(":courseId", courseId?.toString() ?? ""));
    popupState.close();
  };

  const onCreateNewExam = (popupState: any) => {
    dispatch(clearExamCreate());
    navigate(routes.lecturer.exam.create.replace(":courseId", courseId?.toString() ?? ""));
    popupState.close();
  };

  const [isReusedCourseResourceOpen, setIsReusedCourseResourceOpen] = useState(false);

  const onOpenReusedCourseResourceDialog = (popupState: any) => {
    setIsReusedCourseResourceOpen(true);
    popupState.close();
  };

  const onCloseReusedCourseResourceDialog = () => {
    setIsReusedCourseResourceOpen(false);
  };

  const [isReusedResourceOpen, setIsReusedResourceOpen] = useState(false);

  const onOpenReusedResourceDialog = () => {
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
            {assignmentState.assignments &&
              assignmentState.assignments.map((assignment: AssignmentEntity) => (
                <AssignmentResource
                  key={assignment.id}
                  courseId={courseId}
                  examId={assignment.id}
                  resourceTitle={assignment.title}
                  resourceOpenDate={assignment.timeOpen}
                  resourceEndedDate={assignment.timeClose}
                  intro={assignment.intro}
                  type={ResourceType.assignment}
                  onDelete={handleDeleteAssignment}
                />
              ))}
          </Box>
          <Box className={classes.topic}>
            <Heading3 translation-key='course_detail_exam'>{t("course_detail_exam")}</Heading3>
            {examState.exams.exams.map((exam) => (
              <AssignmentResource
                key={exam.id}
                courseId={courseId}
                examId={exam.id}
                resourceTitle={exam.name}
                resourceOpenDate={exam.timeOpen}
                resourceEndedDate={exam.timeClose}
                intro={exam.intro}
                type={ResourceType.exam}
                onDelete={handleDeleteExam}
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

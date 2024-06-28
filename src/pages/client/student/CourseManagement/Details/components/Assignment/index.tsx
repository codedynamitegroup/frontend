import SearchBar from "components/common/search/SearchBar";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import { CircularProgress, Grid } from "@mui/material";
import Heading3 from "components/text/Heading3";
import Heading1 from "components/text/Heading1";
import { useNavigate } from "react-router";
import { routes } from "routes/routes";
import AssignmentResource from "./Resource";
import { ResourceType } from "pages/client/lecturer/CourseManagement/Details/components/Assignment/components/Resource";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { setExams, setLoadingExams } from "reduxes/courseService/exam";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { AssignmentService } from "services/courseService/AssignmentService";
import { setAssignments, setLoadingAssignments } from "reduxes/courseService/assignment";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";

const StudentCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examState = useSelector((state: RootState) => state.exam);
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const { courseId } = useParams<{ courseId: string }>();

  const handleGetExams = useCallback(
    async (id: string) => {
      if (id === examState.courseId && examState.exams) {
        return;
      }
      dispatch(setLoadingExams(true));
      try {
        const response = await ExamService.getExamsByCourseId(id);
        dispatch(
          setExams({
            exams: response.exams,
            courseId: id,
            currentPage: response.currentPage,
            totalItems: response.totalItems,
            totalPages: response.totalPages
          })
        );
      } catch (error) {
        console.error(error);
      }
      dispatch(setLoadingExams(false));
    },
    [dispatch, examState.courseId, examState.exams]
  );

  const handleGetAssignments = useCallback(
    async (id: string) => {
      if (id === assignmentState.courseId && assignmentState.assignments.length > 0) {
        return;
      }
      dispatch(setLoadingAssignments(true));
      try {
        const response = await AssignmentService.getAssignmentsByCourseId(id);
        dispatch(
          setAssignments({
            assignments: response.assignments,
            courseId: id
          })
        );
      } catch (error) {
        console.error(error);
      }
      dispatch(setLoadingAssignments(false));
    },
    [dispatch, assignmentState.courseId, assignmentState.assignments]
  );

  useEffect(() => {
    if (courseId) {
      Promise.all([handleGetExams(courseId), handleGetAssignments(courseId)]);
    }
  }, [courseId, handleGetAssignments, handleGetExams]);

  const { t } = useTranslation();
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };
  const navigate = useNavigate();

  return (
    <Box className={classes.assignmentBody}>
      <Heading1 translation-key='course_detail_assignment_list'>
        {t("course_detail_assignment_list")}
      </Heading1>
      <Grid container>
        <Grid item xs={12}>
          <SearchBar onSearchClick={searchHandle} />
        </Grid>
      </Grid>
      <Box className={classes.assignmentsWrapper}>
        <Box className={classes.topic}>
          <Heading3 translation-key='course_detail_assignment'>
            {t("course_detail_assignment")}
          </Heading3>
          {assignmentState.isLoading === true ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "10px"
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            assignmentState.assignments.length > 0 &&
            assignmentState.assignments.map((assignment: AssignmentEntity) => (
              <AssignmentResource
                courseId={courseId}
                examId={assignment.id}
                resourceTitle={assignment.title}
                resourceOpenDate={assignment.timeOpen}
                resourceEndedDate={assignment.timeClose}
                intro={assignment.intro}
                type={ResourceType.assignment}
              />
            ))
          )}
        </Box>
        <Box className={classes.topic}>
          <Heading3 translation-key='course_detail_exam'>{t("course_detail_exam")}</Heading3>
          {examState.isLoading === true ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "10px"
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            examState.exams.exams.length > 0 &&
            examState.exams.exams.map((exam) => (
              <AssignmentResource
                courseId={courseId}
                examId={exam.id}
                resourceTitle={exam.name}
                resourceOpenDate={exam.timeOpen}
                resourceEndedDate={exam.timeClose}
                intro={exam.intro}
                type={ResourceType.exam}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourseAssignment;

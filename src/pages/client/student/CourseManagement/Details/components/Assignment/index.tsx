import SearchBar from "components/common/search/SearchBar";
import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
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
import { setExams } from "reduxes/courseService/exam";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const StudentCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examState = useSelector((state: RootState) => state.exam);

  const { courseId } = useParams<{ courseId: string }>();

  const handleGetExams = async (id: string) => {
    try {
      const response = await ExamService.getExamsByCourseId(id);
      dispatch(setExams(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetExams(courseId ?? "");
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
    navigate(routes.lecturer.exam.create);
    popupState.close();
  };

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
          <AssignmentResource resourceTitle='Bài tập 1' resourceEndedDate='12/12/2022' />
          <AssignmentResource resourceTitle='Bài tập 2' resourceEndedDate='12/12/2023' />
        </Box>
        <Box className={classes.topic}>
          <Heading3 translation-key='course_detail_exam'>{t("course_detail_exam")}</Heading3>
          {examState.exams.map((exam) => (
            <AssignmentResource
              courseId={courseId}
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
  );
};

export default StudentCourseAssignment;

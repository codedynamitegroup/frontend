import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Divider, Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { millisToFormatTimeString } from "utils/time";
import ExamAttemptSummaryTable from "./components/ExamAttemptSummaryTable";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import { ExamEntity, ExamOverview, ReduxExamEntity } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setExamDetail, setExamOverview } from "reduxes/courseService/exam";
import { setExamData } from "reduxes/TakeExam";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Card from "@mui/joy/Card";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import { EHtmlStatusCode } from "models/general";
import CourseErrorPage from "pages/client/student/CourseError";
import { Helmet } from "react-helmet";

const StudentCourseExamDetails = () => {
  const { t } = useTranslation();
  const { examId } = useParams<{ examId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam);
  const startAt = useSelector((state: RootState) => state.takeExam.startAt);
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [timeOpenString, setTimeOpenString] = useState<Date>(new Date());
  const [timeCloseString, setTimeCloseString] = useState<Date>(new Date());
  const [errorPage, setErrorPage] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");

  const [exam, setExam] = useState<ExamEntity>({
    id: "",
    courseId: "",
    name: "",
    scores: 0,
    maxScores: 0,
    timeOpen: new Date(),
    timeClose: new Date(),
    timeLimit: 0,
    intro: "",
    overdueHanding: "",
    canRedoQuestions: false,
    maxAttempts: 0,
    shuffleAnswers: false,
    gradeMethod: "",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleGetExamById = async (id: string) => {
    try {
      const response = await ExamService.getExamById(id);
      setExam(response);
      dispatch(setExamDetail(response));
    } catch (error: any) {
      if (error.code === EHtmlStatusCode.notFound || error.code === EHtmlStatusCode.serverError) {
        setErrorPage(true);
        setErrorTitle(t("course_error_exam_not_found"));
      }
    }
  };

  const handleGetSubmissions = async (examId: string, userId: string) => {
    try {
      const response = await ExamService.getAllAttemptByExamIdAndUserId(examId, userId);
      console.log("all attempts", response);
      // dispatch(setExamOverview(response));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetExamById(examId ?? examState.examDetail.id);
      await handleGetSubmissions(
        examId ?? examState.examDetail.id,
        "2d7ed5a0-fb21-4927-9a25-647c17d29668"
      );
      setMainSkeleton(false);
    };
    fetchInitialData();

    const tempTimeOpen = new Date(exam.timeOpen) ? new Date(exam.timeOpen) : new Date();
    const tempTimeClose = new Date(exam.timeClose) ? new Date(exam.timeClose) : new Date();
    setTimeOpenString(tempTimeOpen);
    setTimeCloseString(tempTimeClose);
  }, []);

  const navigate = useNavigate();

  const startAttemptButtonHandler = () => {
    const timeOpen = exam.timeOpen ? new Date(exam.timeOpen) : new Date();
    const timeClose = exam.timeClose ? new Date(exam.timeClose) : new Date();
    const createdAt = exam.createdAt ? new Date(exam.createdAt) : new Date();
    const updatedAt = exam.updatedAt ? new Date(exam.updatedAt) : new Date();

    const examStateData: ReduxExamEntity = {
      id: exam.id,
      courseId: exam.courseId,
      name: exam.name,
      scores: exam.scores,
      maxScores: exam.maxScores,
      timeOpen: timeOpen.toISOString(),
      timeClose: timeClose.toISOString(),
      timeLimit: exam.timeLimit,
      intro: exam.intro,
      overdueHanding: exam.overdueHanding,
      canRedoQuestions: exam.canRedoQuestions,
      maxAttempts: exam.maxAttempts,
      shuffleAnswers: exam.shuffleAnswers,
      gradeMethod: exam.gradeMethod,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    };
    dispatch(setExamData(examStateData));
    navigate(
      routes.student.exam.take
        .replace(":courseId", courseId || examState.examDetail.courseId)
        .replace(":examId", examId || examState.examDetail.id)
    );
  };

  const monthNames = [
    t("common_january"),
    t("common_february"),
    t("common_march"),
    t("common_april"),
    t("common_may"),
    t("common_june"),
    t("common_july"),
    t("common_august"),
    t("common_september"),
    t("common_october"),
    t("common_november"),
    t("common_december")
  ];

  const weekdayNames = [
    t("common_sunday"),
    t("common_monday"),
    t("common_tuesday"),
    t("common_wednesday"),
    t("common_thursday"),
    t("common_friday"),
    t("common_saturday")
  ];

  return errorPage ? (
    <CourseErrorPage errorTitle={errorTitle} />
  ) : (
    <Box className={classes.assignmentBody}>
      <Helmet translation-key='course_detail_exam'>
        <title>
          {t("course_detail_exam")}
          {" | "}
          {exam.name}
        </title>
      </Helmet>
      <Heading1>{exam.name}</Heading1>

      <Button
        variant='soft'
        color='neutral'
        onClick={() => {
          navigate(
            routes.student.course.assignment.replace(":courseId", examState.examDetail.courseId)
          );
        }}
        startDecorator={<ChevronLeftIcon />}
        translation-key='common_back'
        sx={{
          width: "fit-content"
        }}
      >
        {t("common_back")}
      </Button>
      <Card
        variant='outlined'
        color='neutral'
        sx={{
          padding: "10px"
          // backgroundColor: "#F8F9FA"
        }}
      >
        <Grid container>
          <Grid item xs={12} md={12}>
            <Stack direction='row' spacing={1.5} alignItems={"center"}>
              <StartRoundedIcon sx={{ color: "#707070", fontSize: "20px" }} />
              <Stack direction='row' spacing={0.5}>
                <ParagraphBody
                  fontWeight={"bolder"}
                  translation-key='course_assignment_detail_open_time'
                  color={"#434343"}
                  fontSize={"12px"}
                >
                  {`${t("course_assignment_detail_open_time")}: `}
                </ParagraphBody>
                <ParagraphBody color={"#434343"} fontSize={"12px"}>
                  {" "}
                  {t("common_show_time", {
                    weekDay: weekdayNames[timeOpenString.getDay()],
                    day: timeOpenString.getDate(),
                    month: monthNames[timeOpenString.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                    year: timeOpenString.getFullYear(),
                    time: `${timeOpenString.getHours() < 10 ? `0${timeOpenString.getHours()}` : timeOpenString.getHours()}:${timeOpenString.getMinutes() < 10 ? `0${timeOpenString.getMinutes()}` : timeOpenString.getMinutes()}`
                  })}
                </ParagraphBody>
              </Stack>
              <MoreHorizRoundedIcon
                sx={{
                  color: "#707070",
                  fontSize: "20px"
                }}
              />{" "}
              <Stack direction='row' spacing={0.5}>
                <ParagraphBody
                  fontWeight={"bolder"}
                  color={"#434343"}
                  fontSize={"12px"}
                  translation-key='course_assignment_detail_close_time'
                >
                  {`${t("course_assignment_detail_close_time")}: `}
                </ParagraphBody>
                <ParagraphBody color={"#434343"} fontSize={"12px"}>
                  {t("common_show_time", {
                    weekDay: weekdayNames[timeCloseString.getDay()],
                    day: timeCloseString.getDate(),
                    month: monthNames[timeCloseString.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                    year: timeCloseString.getFullYear(),
                    time: `${timeCloseString.getHours() < 10 ? `0${timeCloseString.getHours()}` : timeCloseString.getHours()}:${timeCloseString.getMinutes() < 10 ? `0${timeCloseString.getMinutes()}` : timeCloseString.getMinutes()}`
                  })}
                </ParagraphBody>
              </Stack>{" "}
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Box className={classes.assignmentDescription}>
        <div dangerouslySetInnerHTML={{ __html: exam.intro }}></div>
      </Box>
      <Button
        onClick={startAttemptButtonHandler}
        sx={{
          width: "fit-content"
        }}
      >
        {startAt ? t("exam_detail_continue") : t("exam_detail_start")}
      </Button>
      <Card
        variant='soft'
        color='neutral'
        sx={{
          padding: "10px"
          // backgroundColor: "#F8F9FA"
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction='row' spacing={1.5} alignItems={"center"}>
            <AccessTimeRoundedIcon
              sx={{
                color: "#707070",
                fontSize: "20px"
              }}
            />
            <Stack direction='row' spacing={0.5}>
              <ParagraphBody
                translation-key='exam_detail_time_limit'
                fontWeight={"bolder"}
                color={"#434343"}
                fontSize={"12px"}
              >
                {t("exam_detail_time_limit")}
                {": "}
              </ParagraphBody>
              <ParagraphBody color={"#434343"} fontSize={"12px"}>
                {exam.timeLimit ?? 0}
              </ParagraphBody>
            </Stack>
          </Stack>

          <Stack direction='row' spacing={1.5} alignItems={"center"}>
            <GradeRoundedIcon
              sx={{
                color: "#707070",
                fontSize: "20px"
              }}
            />
            <Stack direction='row' spacing={0.5}>
              <ParagraphBody
                translation-key='exam_detail_grading_method'
                fontWeight={"bolder"}
                color={"#434343"}
                fontSize={"12px"}
              >
                {t("exam_detail_grading_method")}
                {": "}
              </ParagraphBody>
              <ParagraphBody color={"#434343"} fontSize={"12px"}>
                {exam.gradeMethod === "QUIZ_GRADEHIGHEST"
                  ? t("exam_detail_grading_method_high_score")
                  : exam.gradeMethod === "QUIZ_GRADEAVERAGE"
                    ? t("exam_detail_grading_method_average_score")
                    : exam.gradeMethod === "QUIZ_ATTEMPTFIRST"
                      ? t("exam_detail_grading_method_first_submit")
                      : exam.gradeMethod === "QUIZ_ATTEMPTLAST"
                        ? t("exam_detail_grading_method_last_submit")
                        : ""}
              </ParagraphBody>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Heading2 translation-key='exam_detail_summary_previous_attempt'>
        {t("exam_detail_summary_previous_attempt")}
      </Heading2>
      <ExamAttemptSummaryTable
        examId={examId || examState.examDetail.id}
        courseId={courseId || examState.examDetail.courseId}
        headers={[
          t("exam_detail_summary_attempt"),
          t("exam_detail_summary_state"),
          `${t("exam_detail_summary_score")} / ${exam.maxScores}`,
          t("exam_detail_summary_review")
        ]}
        rows={[
          {
            no: "1",
            state: "Đã nộp",
            grade: "10.0",
            submitted_at: dayjs().toString()
          },
          {
            no: "2",
            state: "Chưa nộp",
            grade: "Chưa có điểm",
            submitted_at: dayjs().toString()
          },
          {
            no: "3",
            state: "Chưa nộp",
            grade: "Chưa có điểm",
            submitted_at: dayjs().toString()
          }
        ]}
      />
      <Heading2 translation-key='exam_detail_grading_method_high_score'>
        {t("exam_detail_grading_method_high_score")}
        {": "}
        <span style={{ color: "red" }}>tempscore</span>
        {" / "}
        {exam.maxScores}
      </Heading2>
    </Box>
  );
};

export default StudentCourseExamDetails;

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Divider, Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { millisToFormatTimeString } from "utils/time";
import ExamAttemptSummaryTable from "./components/ExamAttemptSummaryTable";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import {
  ExamEntity,
  ExamOverview,
  ExamSubmissionDetail,
  ReduxExamEntity
} from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setExamDetail, setExamOverview } from "reduxes/courseService/exam";
import { setExamData } from "reduxes/TakeExam";
import ButtonBack from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Card from "@mui/joy/Card";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import { EHtmlStatusCode } from "models/general";
import CourseErrorPage from "pages/client/student/CourseError";
import { Helmet } from "react-helmet";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import i18next from "i18next";
import { CircularProgress } from "@mui/joy";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";
import GradingExamTable from "./components/GradingExamTable";

const LecturerCourseExamDetails = () => {
  const { t } = useTranslation();
  const { examId } = useParams<{ examId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam);
  const startAt = useSelector((state: RootState) => state.takeExam.startAt);
  const [examSubmissions, setExamSubmissions] = useState<ExamSubmissionDetail[]>([]);
  const [mainSkeleton, setMainSkeleton] = useState(true);
  const [timeOpenString, setTimeOpenString] = useState<Date>(new Date());
  const [timeCloseString, setTimeCloseString] = useState<Date>(new Date());
  const [errorPage, setErrorPage] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [highestScore, setHighestScore] = useState<number>(0);
  const user: User = useSelector(selectCurrentUser);

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

  const [examOverviews, setExamOverviews] = useState<ExamOverview>({
    // examSubmissionResponse: [],
    numberOfStudents: 0,
    submitted: 0
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

  const handleGetOverviews = async (id: string) => {
    try {
      const response = await ExamService.getOverviewsByExamId(id);
      setExamOverviews(response);
      dispatch(setExamOverview(response));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetSubmissions = async (examId: string, userId: string) => {
    try {
      const response = await ExamService.getAllAttemptByExamIdAndUserId(examId, userId);
      setExamSubmissions(response);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateHighestGrade = () => {
    let highestGrade = 0;

    if (exam.gradeMethod === "QUIZ_GRADEHIGHEST") {
      const tempMark = Math.max(...examSubmissions.map((submission) => submission.markTotal));
      highestGrade = (tempMark / (exam.scores || 1)) * (exam.maxScores || 0);
    } else if (exam.gradeMethod === "QUIZ_GRADEAVERAGE") {
      highestGrade =
        examSubmissions.reduce((acc, submission) => acc + submission.markTotal, 0) /
        examSubmissions.length;
    } else if (exam.gradeMethod === "QUIZ_ATTEMPTFIRST") {
      highestGrade = examSubmissions[0].markTotal;
    }
    if (exam.gradeMethod === "QUIZ_ATTEMPTLAST") {
      highestGrade = examSubmissions[examSubmissions.length - 1].markTotal;
    }

    setHighestScore(highestGrade);
  };

  useEffect(() => {
    calculateHighestGrade();
  }, [examSubmissions]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetExamById(examId ?? examState.examDetail.id);
      await handleGetOverviews(examId ?? examState.examDetail.id);
      await handleGetSubmissions(examId ?? examState.examDetail.id, user.userId);
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
      routes.lecturer.exam.review
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
      <ButtonBack
        variant='soft'
        color='neutral'
        onClick={() => {
          navigate(
            routes.lecturer.course.assignment.replace(":courseId", examState.examDetail.courseId)
          );
        }}
        startDecorator={<ChevronLeftIcon />}
        translation-key='common_back'
        sx={{
          width: "fit-content"
        }}
      >
        {t("common_back")}
      </ButtonBack>
      <Heading1>{exam.name}</Heading1>
      <Box className={classes.assignmentDescription}>
        <div dangerouslySetInnerHTML={{ __html: exam.intro }}></div>
      </Box>
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
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' spacing={1.5} alignItems={"center"}>
        <ButtonBack
          disabled={examSubmissions.length === exam.maxAttempts && exam.maxAttempts !== 0}
          onClick={startAttemptButtonHandler}
          sx={{
            width: "fit-content",
            height: "fit-content"
          }}
        >
          {startAt ? t("exam_detail_test") : t("exam_detail_start")}
        </ButtonBack>
      </Stack>

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
                {millisToFormatTimeString((exam.timeLimit ?? 0) * 1000, i18next.language)}
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
          <Stack direction='row' spacing={1.5} alignItems={"center"}>
            <ReplayRoundedIcon
              sx={{
                color: "#707070",
                fontSize: "20px"
              }}
            />
            <Stack direction='row' spacing={0.5}>
              <ParagraphBody
                fontWeight={"bolder"}
                color={"#434343"}
                fontSize={"12px"}
                translation-key='exam_detail_max_attempt'
              >
                {`${exam.maxAttempts === 0 ? t("exam_detail_attempt_unlimited") : t("exam_detail_max_attempt")}: `}
              </ParagraphBody>
              <ParagraphBody color={"#434343"} fontSize={"12px"}>
                {exam.maxAttempts}
              </ParagraphBody>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Heading2 translation-key='common_overview'>{t("common_overview")}</Heading2>
      <GradingExamTable
        rows={[
          // {
          //   header: t("course_lecturer_assignment_hide"),
          //   data: "Không"
          // },
          {
            header: t("course_lecturer_assignment_student_num"),
            data: examOverviews.numberOfStudents.toString()
          },
          {
            header: t("course_lecturer_assignment_submitted"),
            data: examOverviews.submitted.toString()
          },
          {
            header: t("course_lecturer_assignment_need_grading"),
            data: (examOverviews.numberOfStudents - examOverviews.submitted).toString()
          }
          // {
          //   header: t("common_time_left"),
          //   data: "1 ngày 2 giờ"
          // }
        ]}
        translation-key={[
          "course_lecturer_assignment_hide",
          "course_lecturer_assignment_student_num",
          "course_lecturer_assignment_submitted",
          "course_lecturer_assignment_need_grading",
          "common_time_left"
        ]}
      />
      <Box
        sx={{
          display: "flex",
          gap: "20px"
        }}
      >
        <Button
          btnType={BtnType.Outlined}
          onClick={() => {
            navigate(
              routes.lecturer.exam.submissions
                .replace(":courseId", exam.courseId)
                .replace(":examId", exam.id)
            );
          }}
        >
          <ParagraphBody translation-key='course_lecturer_assignment_see_submit'>
            {t("course_lecturer_assignment_see_submit")}
          </ParagraphBody>
        </Button>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.exam.grading);
          }}
        >
          <ParagraphBody translation-key='course_lecturer_assignment_grading'>
            {t("course_lecturer_assignment_grading")}
          </ParagraphBody>
        </Button>
      </Box>

      <Heading2 translation-key='exam_detail_summary_previous_attempt'>
        {t("exam_detail_summary_previous_attempt")}
      </Heading2>
      <ExamAttemptSummaryTable
        examId={examId || examState.examDetail.id}
        courseId={courseId || examState.examDetail.courseId}
        headers={[
          t("exam_detail_summary_attempt"),
          t("exam_detail_summary_state"),
          `${t("exam_detail_mark")} / ${exam.scores}`,
          `${t("common_final_grade")} / ${exam.maxScores}`,
          t("exam_detail_summary_review")
        ]}
        rows={examSubmissions}
        examMark={exam.scores || 0}
        examGrade={exam.maxScores || 0}
      />
      {examSubmissions.length !== 0 && (
        <Heading2 translation-key='exam_detail_grading_method_high_score'>
          {t("exam_detail_grading_method_high_score")}
          {": "}
          <span style={{ color: "red" }}>{highestScore}</span>
          {" / "}
          {exam.maxScores}
        </Heading2>
      )}
    </Box>

    //   <Button
    //     btnType={BtnType.Primary}
    //     onClick={() => {
    //       navigate(
    //         routes.lecturer.course.assignment.replace(":courseId", examState.examDetail.courseId)
    //       );
    //     }}
    //     startIcon={
    //       <ChevronLeftIcon
    //         sx={{
    //           color: "white"
    //         }}
    //       />
    //     }
    //     width='fit-content'
    //   >
    //     <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
    //   </Button>
    //   <Heading1>{exam.name}</Heading1>
    //   <Card
    //     className={classes.pageActivityHeader}
    //     sx={{
    //       padding: "10px",
    //       backgroundColor: "#F8F9FA"
    //     }}
    //   >
    //     <Grid container direction='row' alignItems='center' gap={1}>
    //       <Grid item>
    //         <ParagraphSmall fontWeight={"600"} translation-key='course_assignment_detail_open_time'>
    //           {t("course_assignment_detail_open_time")}:
    //         </ParagraphSmall>
    //       </Grid>
    //       <Grid item>
    //         <ParagraphBody> {dayjs(exam.timeOpen).format("DD/MM/YYYY HH:mm")} </ParagraphBody>
    //       </Grid>
    //     </Grid>
    //     <Grid container direction='row' alignItems='center' gap={1}>
    //       <Grid item>
    //         <ParagraphSmall
    //           fontWeight={"600"}
    //           translation-key='course_assignment_detail_close_time'
    //         >
    //           {t("course_assignment_detail_close_time")}:
    //         </ParagraphSmall>
    //       </Grid>
    //       <Grid item>
    //         <ParagraphBody>{dayjs(exam.timeClose).format("DD/MM/YYYY HH:mm")}</ParagraphBody>
    //       </Grid>
    //     </Grid>
    //     <Grid container direction='row' alignItems='center' gap={1}>
    //       <Grid item>
    //         <ParagraphSmall fontWeight={"600"} translation-key='common_do_time'>
    //           {t("common_do_time")}:
    //         </ParagraphSmall>
    //       </Grid>
    //       <Grid item>
    //         <ParagraphBody>{millisToFormatTimeString(exam.timeLimit ?? 0)}</ParagraphBody>
    //       </Grid>
    //     </Grid>
    //     <Divider
    //       style={{
    //         marginTop: "10px",
    //         marginBottom: "10px"
    //       }}
    //     />
    //     <Box className={classes.assignmentDescription}>
    //       <div dangerouslySetInnerHTML={{ __html: exam.intro }}></div>
    //       <ParagraphBody>
    //         Cách thức tính điểm:{" "}
    //         <b>
    //           {" "}
    //           {exam.gradeMethod === "QUIZ_GRADEHIGHEST"
    //             ? "Điểm cao nhất"
    //             : exam.gradeMethod === "QUIZ_GRADEAVERAGE"
    //               ? "Trung bình cộng"
    //               : exam.gradeMethod === "QUIZ_ATTEMPTFIRST"
    //                 ? "Lần nộp đầu tiên"
    //                 : exam.gradeMethod === "QUIZ_ATTEMPTLAST"
    //                   ? "Lần nộp cuối cùng"
    //                   : ""}
    //         </b>
    //       </ParagraphBody>
    //       {/* <CustomFileList
    //         files={[
    //           {
    //             id: "1",
    //             name: "test1.jpg",
    //             size: 1024,
    //             type: "image/jpg",
    //             uploadStatus: "success",
    //             downloadUrl:
    //               "https://res.cloudinary.com/doofq4jvp/image/upload/v1707044303/ulvrbytveqv8injpzliy.jpg"
    //           },
    //           {
    //             id: "2",
    //             name: "dummy.pdf",
    //             size: 1024,
    //             type: "application/pdf",
    //             uploadStatus: "success",
    //             downloadUrl:
    //               "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    //           }
    //         ]}
    //       /> */}
    //     </Box>
    //   </Card>
    //   <Box
    //     sx={{
    //       display: "flex",
    //       gap: "20px"
    //     }}
    //   >
    //     <Button
    //       btnType={BtnType.Outlined}
    //       onClick={() => {
    //         navigate(
    //           routes.lecturer.exam.submissions
    //             .replace(":courseId", exam.courseId)
    //             .replace(":examId", exam.id)
    //         );
    //       }}
    //     >
    //       <ParagraphBody translation-key='course_lecturer_assignment_see_submit'>
    //         {t("course_lecturer_assignment_see_submit")}
    //       </ParagraphBody>
    //     </Button>
    //     <Button
    //       btnType={BtnType.Primary}
    //       onClick={() => {
    //         navigate(routes.lecturer.exam.grading);
    //       }}
    //     >
    //       <ParagraphBody translation-key='course_lecturer_assignment_grading'>
    //         {t("course_lecturer_assignment_grading")}
    //       </ParagraphBody>
    //     </Button>
    //   </Box>
    //   <Heading2>
    //     {`${t("common_overview")} ${i18next.format(t("course_lecturer_assignment_grading"), "lowercase")}`}
    //   </Heading2>
    //   <GradingExamTable
    //     rows={[
    //       // {
    //       //   header: t("course_lecturer_assignment_hide"),
    //       //   data: "Không"
    //       // },
    //       {
    //         header: t("course_lecturer_assignment_student_num"),
    //         data: examOverviews.numberOfStudents.toString()
    //       },
    //       {
    //         header: t("course_lecturer_assignment_submitted"),
    //         data: examOverviews.submitted.toString()
    //       },
    //       {
    //         header: t("course_lecturer_assignment_need_grading"),
    //         data: (examOverviews.numberOfStudents - examOverviews.submitted).toString()
    //       }
    //       // {
    //       //   header: t("common_time_left"),
    //       //   data: "1 ngày 2 giờ"
    //       // }
    //     ]}
    //     translation-key={[
    //       "course_lecturer_assignment_hide",
    //       "course_lecturer_assignment_student_num",
    //       "course_lecturer_assignment_submitted",
    //       "course_lecturer_assignment_need_grading",
    //       "common_time_left"
    //     ]}
    //   />
    //   <Heading2 translation-key='course_management_exam_previous'>
    //     {t("course_management_exam_previous")}
    //   </Heading2>
    //   <ExamAttemptSummaryTable
    //     headers={[
    //       t("course_management_exam_try_time"),
    //       t("common_status"),
    //       `${t("common_score")} / ${exam.maxScores}`,
    //       t("common_see_evaluating")
    //     ]}
    //     rows={[
    //       {
    //         no: "Xem trước",
    //         state: "Đã nộp",
    //         grade: "10.0",
    //         submitted_at: dayjs().toString()
    //       },
    //       {
    //         no: "Xem trước",
    //         state: "Chưa nộp",
    //         grade: "Chưa có điểm",
    //         submitted_at: dayjs().toString()
    //       },
    //       {
    //         no: "Xem trước",
    //         state: "Chưa nộp",
    //         grade: "Chưa có điểm",
    //         submitted_at: dayjs().toString()
    //       }
    //     ]}
    //     translation-key={[
    //       "common_score",
    //       "course_management_exam_try_time",
    //       "common_status",
    //       "common_see_evaluating"
    //     ]}
    //   />
    //   <Heading2 translation-key='course_management_exam_max_score'>
    //     {t("course_management_exam_max_score")}:{" "}
    //     <span style={{ color: "red" }}>{exam.maxScores}</span>
    //   </Heading2>
    //   <Button
    //     btnType={BtnType.Primary}
    //     onClick={() => {
    //       navigate(routes.lecturer.exam.preview);
    //     }}
    //     width='fit-content'
    //   >
    //     <ParagraphBody translation-key='course_management_exam_preview'>
    //       {t("course_management_exam_preview")}
    //     </ParagraphBody>
    //   </Button>
    // </Box>
  );
};

export default LecturerCourseExamDetails;

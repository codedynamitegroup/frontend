import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Card, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
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
import { ExamEntity, ExamOverview } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setExamDetail, setExamOverview } from "reduxes/courseService/exam";
import { setExamData } from "reduxes/TakeExam";

const StudentCourseExamDetails = () => {
  const { examId } = useParams<{ examId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam);
  const startAt = useSelector((state: RootState) => state.takeExam.startAt);

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
    numberOfStudents: 0,
    submitted: 0
  });

  const handleGetExamById = async (id: string) => {
    try {
      const response = await ExamService.getExamById(id);
      setExam(response);
      dispatch(setExamDetail(response));
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetExamById(examId ?? examState.examDetail.id);
      await handleGetOverviews(examId ?? examState.examDetail.id);
    };
    fetchInitialData();
  }, []);

  const navigate = useNavigate();

  const startAttemptButtonHandler = () => {
    dispatch(setExamData(exam));
    navigate(
      routes.student.exam.take
        .replace(":courseId", courseId || examState.examDetail.courseId)
        .replace(":examId", examId || examState.examDetail.id)
    );
  };

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(
            routes.student.course.assignment.replace(":courseId", examState.examDetail.courseId)
          );
        }}
        startIcon={
          <ChevronLeftIcon
            sx={{
              color: "white"
            }}
          />
        }
        width='fit-content'
      >
        <ParagraphBody>Quay lại</ParagraphBody>
      </Button>
      <Heading1>{exam.name}</Heading1>
      <Card
        className={classes.pageActivityHeader}
        sx={{
          padding: "10px",
          backgroundColor: "#F8F9FA"
        }}
      >
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian mở:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              <ParagraphBody> {dayjs(exam.timeOpen).format("DD/MM/YYYY HH:mm")} </ParagraphBody>
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian đóng:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              <ParagraphBody>{dayjs(exam.timeClose).format("DD/MM/YYYY HH:mm")}</ParagraphBody>
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian làm bài:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>{millisToFormatTimeString(exam.timeLimit ?? 0)}</ParagraphBody>
          </Grid>
        </Grid>
        <Divider
          style={{
            marginTop: "10px",
            marginBottom: "10px"
          }}
        />
        <Box className={classes.assignmentDescription}>
          <div dangerouslySetInnerHTML={{ __html: exam.intro }}></div>
          <ParagraphBody>
            Cách thức tính điểm:{" "}
            <b>
              {" "}
              {exam.gradeMethod === "QUIZ_GRADEHIGHEST"
                ? "Điểm cao nhất"
                : exam.gradeMethod === "QUIZ_GRADEAVERAGE"
                  ? "Trung bình cộng"
                  : exam.gradeMethod === "QUIZ_ATTEMPTFIRST"
                    ? "Lần nộp đầu tiên"
                    : exam.gradeMethod === "QUIZ_ATTEMPTLAST"
                      ? "Lần nộp cuối cùng"
                      : ""}
            </b>
          </ParagraphBody>
          {/* <CustomFileList
            files={[
              {
                id: "1",
                name: "test1.jpg",
                size: 1024,
                type: "image/jpg",
                uploadStatus: "success",
                downloadUrl:
                  "https://res.cloudinary.com/doofq4jvp/image/upload/v1707044303/ulvrbytveqv8injpzliy.jpg"
              },
              {
                id: "2",
                name: "dummy.pdf",
                size: 1024,
                type: "application/pdf",
                uploadStatus: "success",
                downloadUrl:
                  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              }
            ]}
          /> */}
        </Box>
      </Card>
      <Heading2>Tóm tắt những lần làm bài trước</Heading2>
      <ExamAttemptSummaryTable
        headers={["Lần thử", "Trạng thái", "Điểm / 10.0", "Xem đánh giá"]}
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
      <Heading2>
        Điểm cao nhất: <span style={{ color: "red" }}>{exam.maxScores}</span>
      </Heading2>
      <Button btnType={BtnType.Primary} onClick={startAttemptButtonHandler} width='fit-content'>
        <ParagraphBody>{startAt ? "Tiếp tục làm bài" : "Bắt đầu làm bài"}</ParagraphBody>
      </Button>
    </Box>
  );
};

export default StudentCourseExamDetails;

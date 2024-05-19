import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Card, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { millisToHoursAndMinutesString } from "utils/time";
import ExamAttemptSummaryTable from "./components/ExamAttemptSummaryTable";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import { ExamEntity } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";

const StudentCourseExamDetails = () => {
  const { examId } = useParams<{ examId: string }>();
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await handleGetExamById(examId ?? "");
    };
    fetchInitialData();
  }, []);

  const navigate = useNavigate();
  const examDescriptionRawHTML = `
    <div>
    <p>Đây là mô tả bài kiểm tra</p>
    </div>
    `;

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.student.course.assignment);
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
            <ParagraphBody>{millisToHoursAndMinutesString(exam.timeLimit ?? 0)}</ParagraphBody>
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
            Cách thức tính điểm: <b> {exam.gradeMethod} </b>
          </ParagraphBody>
          <CustomFileList
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
          />
        </Box>
      </Card>
      <Heading2>Tóm tắt những lần làm bài trước</Heading2>
      <ExamAttemptSummaryTable
        headers={["Lần thử", "Trạng thái", "Điểm / 20.0", "Xem đánh giá"]}
        rows={[
          {
            no: "1",
            state: "Đã nộp",
            grade: "20.0",
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
        Điểm cao nhất: <span style={{ color: "red" }}>20.0</span>
      </Heading2>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.student.exam.take);
        }}
        width='fit-content'
      >
        <ParagraphBody>Làm bài kiểm tra</ParagraphBody>
      </Button>
    </Box>
  );
};

export default StudentCourseExamDetails;

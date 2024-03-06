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
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { millisToHoursAndMinutesString } from "utils/time";
import ExamAttemptSummaryTable from "./components/ExamAttemptSummaryTable";
import GradingExamTable from "./components/GradingExamTable";
import classes from "./styles.module.scss";

const LecturerCourseExamDetails = () => {
  const navigate = useNavigate();
  const examOpenTime = dayjs();
  const examCloseTime = dayjs();
  const examLimitTimeInMillis = 1000000;
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
          navigate(routes.lecturer.course.assignment);
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
      <Heading1>Bài kiểm tra 1</Heading1>
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
              {examOpenTime?.toDate().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian đóng:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {examCloseTime?.toDate().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian làm bài:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>{millisToHoursAndMinutesString(examLimitTimeInMillis)}</ParagraphBody>
          </Grid>
        </Grid>
        <Divider
          style={{
            marginTop: "10px",
            marginBottom: "10px"
          }}
        />
        <Box className={classes.assignmentDescription}>
          <div dangerouslySetInnerHTML={{ __html: examDescriptionRawHTML }}></div>
          <ParagraphBody>
            Cách thức tính điểm: <b>Điểm cao nhất</b>
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
                .replace(":assignmentId", "1")
                .replace(":courseId", "1")
            );
          }}
        >
          <ParagraphBody>Xem danh sách bài nộp</ParagraphBody>
        </Button>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.exam.grading);
          }}
        >
          <ParagraphBody>Chấm điểm</ParagraphBody>
        </Button>
      </Box>
      <Heading2>Tổng quan chấm điểm</Heading2>
      <GradingExamTable
        rows={[
          {
            header: "Ẩn khỏi sinh viên",
            data: "Có"
          },
          {
            header: "Số lượng sinh viên",
            data: "1"
          },
          {
            header: "Đã nộp",
            data: "1"
          },
          {
            header: "Cần chấm điểm",
            data: "1"
          },
          {
            header: "Thời gian còn lại",
            data: "1 ngày 2 giờ"
          }
        ]}
      />
      <Heading2>Tóm tắt những lần làm bài trước</Heading2>
      <ExamAttemptSummaryTable
        headers={["Lần thử", "Trạng thái", "Điểm / 20.0", "Xem đánh giá"]}
        rows={[
          {
            no: "Xem trước",
            state: "Đã nộp",
            grade: "20.0",
            submitted_at: dayjs().toString()
          },
          {
            no: "Xem trước",
            state: "Chưa nộp",
            grade: "Chưa có điểm",
            submitted_at: dayjs().toString()
          },
          {
            no: "Xem trước",
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
          navigate(routes.lecturer.exam.preview);
        }}
        width='fit-content'
      >
        <ParagraphBody>Xem trước bài kiểm tra</ParagraphBody>
      </Button>
    </Box>
  );
};

export default LecturerCourseExamDetails;

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Card, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import AssignmentTable from "./components/AssignmentTable";
import classes from "./styles.module.scss";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";

const LecturerCourseAssignmentDetails = () => {
  const navigate = useNavigate();
  const assignmentOpenTime = dayjs();
  const assignmentCloseTime = dayjs();
  const assignmentDescriptionRawHTML = `
    <div>
    <p>Đây là mô tả bài tập</p>
    </div>
    `;
  const activityInstructionsRawHTML = `
    <div>
    <p>Đây là hướng dẫn bài tập</p>
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
      <Heading1>Bài tập 1</Heading1>
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
              {assignmentOpenTime
                ?.toDate()
                .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian đóng:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {assignmentCloseTime
                ?.toDate()
                .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Divider
          style={{
            marginTop: "10px",
            marginBottom: "10px"
          }}
        />
        <Box className={classes.assignmentDescription}>
          <div dangerouslySetInnerHTML={{ __html: assignmentDescriptionRawHTML }}></div>
          <div
            style={{
              marginBottom: "10px"
            }}
            dangerouslySetInnerHTML={{ __html: activityInstructionsRawHTML }}
          ></div>
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
              routes.lecturer.assignment.submissions
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
            navigate(routes.lecturer.assignment.grading);
          }}
        >
          <ParagraphBody>Chấm điểm</ParagraphBody>
        </Button>
      </Box>
      <Heading2>Tổng quan chấm điểm</Heading2>
      <AssignmentTable
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
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.student.assignment.submit);
        }}
        width='fit-content'
      >
        <ParagraphBody>Thêm bài nộp</ParagraphBody>
      </Button>
    </Box>
  );
};

export default LecturerCourseAssignmentDetails;

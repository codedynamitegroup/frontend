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
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LecturerCourseExamDetails = () => {
  const { t } = useTranslation();
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
        <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
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
            <ParagraphSmall fontWeight={"600"} translation-key='course_assignment_detail_open_time'>
              {t("course_assignment_detail_open_time")}:
            </ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {examOpenTime?.toDate().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall
              fontWeight={"600"}
              translation-key='course_assignment_detail_close_time'
            >
              {t("course_assignment_detail_close_time")}:
            </ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {examCloseTime?.toDate().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"} translation-key='common_do_time'>
              {t("common_do_time")}:
            </ParagraphSmall>
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
      <Heading2>
        {`${t("common_overview")} ${i18next.format(t("course_lecturer_assignment_grading"), "lowercase")}`}
      </Heading2>
      <GradingExamTable
        rows={[
          {
            header: t("course_lecturer_assignment_hide"),
            data: "Có"
          },
          {
            header: t("course_lecturer_assignment_student_num"),
            data: "1"
          },
          {
            header: t("course_lecturer_assignment_submitted"),
            data: "1"
          },
          {
            header: t("course_lecturer_assignment_need_grading"),
            data: "1"
          },
          {
            header: t("common_time_left"),
            data: "1 ngày 2 giờ"
          }
        ]}
        translation-key={[
          "course_lecturer_assignment_hide",
          "course_lecturer_assignment_student_num",
          "course_lecturer_assignment_submitted",
          "course_lecturer_assignment_need_grading",
          "common_time_left"
        ]}
      />
      <Heading2 translation-key='course_management_exam_previous'>
        {t("course_management_exam_previous")}
      </Heading2>
      <ExamAttemptSummaryTable
        headers={[
          t("course_management_exam_try_time"),
          t("common_status"),
          `${t("common_score")} / 20.0`,
          t("common_see_evaluating")
        ]}
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
        translation-key={[
          "common_score",
          "course_management_exam_try_time",
          "common_status",
          "common_see_evaluating"
        ]}
      />
      <Heading2 translation-key='course_management_exam_max_score'>
        {t("course_management_exam_max_score")}: <span style={{ color: "red" }}>20.0</span>
      </Heading2>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.lecturer.exam.preview);
        }}
        width='fit-content'
      >
        <ParagraphBody translation-key='course_management_exam_preview'>
          {t("course_management_exam_preview")}
        </ParagraphBody>
      </Button>
    </Box>
  );
};

export default LecturerCourseExamDetails;

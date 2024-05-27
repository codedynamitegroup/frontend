import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Card, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { AssignmentService } from "services/courseService/AssignmentService";
import { setAssignmentDetails } from "reduxes/courseService/assignment";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AssignmentTable from "./components/AssignmentTable";
import Heading2 from "components/text/Heading2";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import {
  setSubmissionAssignmentDetails,
  setSubmissionAssignments
} from "reduxes/courseService/submission_assignment";

type Column = {
  header: string;
  data: string | JSX.Element;
};

const StudentCourseAssignmentDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const dispatch = useDispatch();

  const handleGetAssignmentDetails = async (id: string) => {
    try {
      const response = await AssignmentService.getAssignmentById(id);
      dispatch(setAssignmentDetails(response));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSubmissionAssignment = async (userId: string, assignmentId: string) => {
    try {
      const response = await SubmissionAssignmentService.getSubmissionAssignmentById(
        userId,
        assignmentId
      );
      dispatch(setSubmissionAssignmentDetails(response));
    } catch (error) {
      console.log(error);
    }
  };
  console.log("assignmentState", submissionAssignmentState.submissionAssignmentDetails);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      await handleGetAssignmentDetails(assignmentId ?? "");
    };

    fetchAssignmentDetails();
    handleGetSubmissionAssignment("e931c5c8-9d98-41ea-ad33-1c0b0483e676", assignmentId ?? "");
  }, []);

  function calculateTimeDifference(
    date1: Date,
    date2: Date
  ): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    // Tạo đối tượng Date cho giờ hiện tại

    // Tính toán khoảng thời gian giữa giờ đã cho và giờ hiện tại (mili giây)
    const diffInMs = date1.getTime() - date2.getTime();

    // Kiểm tra nếu giờ đã cho là trước giờ hiện tại

    // Tính số ngày, số giờ, số phút và số giây từ khoảng thời gian này
    const msInADay = 24 * 60 * 60 * 1000; // Mili giây trong một ngày
    const msInAnHour = 60 * 60 * 1000; // Mili giây trong một giờ
    const msInAMinute = 60 * 1000; // Mili giây trong một phút
    const msInASecond = 1000; // Mili giây trong một giây

    const days = Math.floor(diffInMs / msInADay);
    const hours = Math.floor((diffInMs % msInADay) / msInAnHour);
    const minutes = Math.floor((diffInMs % msInAnHour) / msInAMinute);
    const seconds = Math.floor((diffInMs % msInAMinute) / msInASecond);

    return {
      days: Math.abs(days),
      hours: Math.abs(hours),
      minutes: Math.abs(minutes),
      seconds: Math.abs(seconds)
    };
  }

  const timeCloseDate = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());
  const timeRemaining = calculateTimeDifference(timeCloseDate, new Date());
  const submitTimeDate = new Date(
    submissionAssignmentState.submissionAssignmentDetails?.submitTime ?? new Date()
  );
  const submitTime = calculateTimeDifference(timeCloseDate, submitTimeDate);
  const formatTime = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
    if (time.days > 0) {
      return time.days + " " + t("days") + " " + time.hours + " " + t("hours");
    } else if (time.hours > 0) {
      return time.hours + " " + t("hours") + " " + time.minutes + " " + t("minutes");
    } else {
      return time.minutes + " " + t("minutes") + " " + time.seconds + " " + t("seconds");
    }
  };

  let columns: Column[] = [
    {
      header: t("course_student_assignment_submission_status"),
      data: submissionAssignmentState.submissionAssignmentDetails?.submitTime
        ? t("course_student_assignment_submission_status_submitted")
        : t("course_student_assignment_submission_status_not_submitted")
    },
    {
      header: t("course_student_assignment_grading_status"),
      data: submissionAssignmentState.submissionAssignmentDetails?.isGraded
        ? t("course_student_assignment_submission_status_graded")
        : t("course_student_assignment_submission_status_not_grading")
    },
    {
      header: t("course_student_assignment_time_remaining"),
      data: submissionAssignmentState.submissionAssignmentDetails?.submitTime
        ? "Assignment was submitted " + formatTime(submitTime) + " ago"
        : timeRemaining.days === 0 &&
            timeRemaining.hours === 0 &&
            timeRemaining.minutes === 0 &&
            timeRemaining.seconds === 0
          ? "Assignment has ended"
          : new Date(assignmentState.assignmentDetails?.timeClose ?? new Date()) < new Date()
            ? "Assignment is overdue by: " + formatTime(timeRemaining)
            : formatTime(timeRemaining)
    },
    {
      header: t("course_student_assignment_last_modified"),
      data: submissionAssignmentState.submissionAssignmentDetails?.timemodefied
        ? dayjs(submissionAssignmentState.submissionAssignmentDetails?.timemodefied).format(
            "DD/MM/YYYY hh:mm:ss A"
          )
        : "-"
    }
  ];

  if (submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentFile) {
    columns.push({
      header: t("course_student_assignment_file_submission"),
      data: (
        <CustomFileList
          files={
            submissionAssignmentState.submissionAssignmentDetails.submissionAssignmentFile.files.map(
              (attachment) => ({
                id: attachment.id,
                name: attachment.fileName,
                downloadUrl: attachment.fileUrl,
                size: attachment.fileSize,
                type: attachment.mimetype,
                lastModified: new Date(attachment.timemodified).toLocaleString("en-US", {
                  timeZone: "Asia/Ho_Chi_Minh"
                })
              })
            ) ?? [] // provide an empty array if introAttachments is undefined
          }
          treeView={false}
        />
      )
    });
  }
  if (submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentOnlineText) {
    columns.push({
      header: t("course_student_assignment_online_text_submission"),
      data: (
        <div
          dangerouslySetInnerHTML={{
            __html:
              submissionAssignmentState.submissionAssignmentDetails.submissionAssignmentOnlineText
                .content || ``
          }}
        ></div>
      )
    });
  }

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.student.course.assignment.replace(":courseId", courseId ?? ""));
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
        <ParagraphBody translation-key='common_backk'>{t("common_back")}</ParagraphBody>
      </Button>
      <Heading1>{assignmentState.assignmentDetails?.title}</Heading1>
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
              {dayjs(assignmentState.assignmentDetails?.timeOpen)?.format("DD/MM/YYYY hh:mm:ss A")}
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
              {dayjs(assignmentState.assignmentDetails?.timeClose)?.format("DD/MM/YYYY hh:mm:ss A")}
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
          <div
            dangerouslySetInnerHTML={{ __html: assignmentState.assignmentDetails?.intro || `` }}
          ></div>
          <div
            style={{
              marginBottom: "10px"
            }}
            dangerouslySetInnerHTML={{ __html: assignmentState.assignmentDetails?.activity || `` }}
          ></div>
          <div
            style={{
              marginBottom: "10px"
            }}
            dangerouslySetInnerHTML={{ __html: assignmentState.assignmentDetails?.activity || `` }}
          ></div>
          <CustomFileList
            files={assignmentState.assignmentDetails?.introAttachments?.map((attachment: any) => ({
              id: attachment.id,
              name: attachment.fileName,
              downloadUrl: attachment.fileUrl,
              size: attachment.fileSize,
              type: attachment.mimetype,
              lastModified: new Date(attachment.timemodified).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh"
              })
            }))}
          />
        </Box>
      </Card>
      <Heading2 translation-key={["course_student_assignment_submission_status"]}>
        {t("course_student_assignment_submission_status")}
      </Heading2>
      <AssignmentTable
        rows={columns}
        translation-key={[
          "course_student_assignment_submission_status",
          "course_student_assignment_grading_status",
          "course_student_assignment_time_remaining",
          "course_student_assignment_last_modified",
          "course_student_assignment_file_submission"
        ]}
      />
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(
            routes.student.assignment.submit
              .replace(":assignmentId", assignmentId ?? "")
              .replace(":courseId", courseId ?? "")
          );
        }}
        width='fit-content'
      >
        <ParagraphBody translation-key='course_assignment_detail_submit'>
          {t("course_assignment_detail_submit")}
        </ParagraphBody>
      </Button>
    </Box>
  );
};

export default StudentCourseAssignmentDetails;

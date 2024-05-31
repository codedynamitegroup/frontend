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
import AssignmentTable from "./components/GradingAssignmentTable";
import classes from "./styles.module.scss";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { useTranslation } from "react-i18next";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import {
  setAmountSubmission,
  setAmountSubmissionToGrade,
  setSubmissionAssignmentDetails,
  setSubmissionAssignments
} from "reduxes/courseService/submission_assignment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useParams } from "react-router-dom";
import { AssignmentService } from "services/courseService/AssignmentService";
import { setAssignmentDetails } from "reduxes/courseService/assignment";
import { useEffect } from "react";

import images from "config/images";
import { CourseUserService } from "services/courseService/CourseUserService";
import { setAmountStudent } from "reduxes/courseService/courseUser";

const LecturerCourseAssignmentDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const courseUserState = useSelector((state: RootState) => state.courseUser);
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

  const handleCountStudentInCourse = async (courseId: string) => {
    try {
      const response = await CourseUserService.countStudentByCourseId(courseId);
      console.log(response);
      dispatch(setAmountStudent({ amountStudent: response }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCountSubmissionToGrade = async (assignmentId: string) => {
    try {
      const response = await SubmissionAssignmentService.countSubmissionToGrade(assignmentId);
      dispatch(setAmountSubmissionToGrade({ amountSubmissionToGrade: response }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleCountSubmission = async (assignmentId: string) => {
    try {
      const response = await SubmissionAssignmentService.countAllSubmission(assignmentId);
      dispatch(setAmountSubmission({ amountSubmission: response }));
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

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      await handleGetAssignmentDetails(assignmentId ?? "");
    };

    fetchAssignmentDetails();
    handleCountStudentInCourse(courseId ?? "");
    handleCountSubmissionToGrade(assignmentId ?? "");
    handleCountSubmission(assignmentId ?? "");
    handleGetSubmissionAssignment("9090d7b2-3b20-46a8-9700-6ea8699c7696", assignmentId ?? "");
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

  const checkTimeSubmission = (): number => {
    if (!submissionAssignmentState.submissionAssignmentDetails?.submitTime) return 0;
    let submitTime = new Date(
      submissionAssignmentState.submissionAssignmentDetails?.submitTime ?? new Date()
    );
    let timeClose = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());
    if (submitTime < timeClose) {
      return 1;
    }
    return 2;
  };

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""));
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
          <ParagraphBody translation-key='course_lecturer_assignment_see_submit'>
            {t("course_lecturer_assignment_see_submit")}
          </ParagraphBody>
        </Button>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.assignment.grading);
          }}
        >
          <ParagraphBody translation-key='course_lecturer_assignment_grading'>
            {t("course_lecturer_assignment_grading")}
          </ParagraphBody>
        </Button>
      </Box>
      <Heading2 translation-key={["course_lecturer_assignment_grading", "common_over"]}>
        {t("course_lecturer_assignment_grading")}
      </Heading2>
      <AssignmentTable
        rows={[
          {
            header: t("course_lecturer_assignment_student_num"),
            data: courseUserState.amountStudent.toString()
          },
          {
            header: t("course_lecturer_assignment_submitted"),
            data: submissionAssignmentState.amountSubmission.toString()
          },
          {
            header: t("course_lecturer_assignment_need_grading"),
            data: submissionAssignmentState.amountSubmissionToGrade.toString()
          },
          {
            header: t("common_time_left"),
            data: checkTimeSubmission() === 1 ? formatTime(submitTime) : "Assignment is due"
          }
        ]}
        translation-key={[
          "course_lecturer_assignment_hide",
          "common_time_left",
          "course_lecturer_assignment_student_num",
          "course_lecturer_assignment_need_grading",
          "common_over"
        ]}
      />
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.lecturer.assignment.preview_submit);
        }}
        width='fit-content'
      >
        <ParagraphBody translation-key='course_lecturer_assignment_preview_submit'>
          {t("course_lecturer_assignment_preview_submit")}
        </ParagraphBody>
      </Button>
    </Box>
  );
};

export default LecturerCourseAssignmentDetails;

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

import images from "config/images";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";
import { CourseUserService } from "services/courseService/CourseUserService";
import useAuth from "hooks/useAuth";
import { AssignmentResourceEntity } from "models/courseService/entity/AssignmentResourceEntity";

type Column = {
  header: string;
  data: string | JSX.Element;
  status?: number;
};

const StudentCourseAssignmentDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const dispatch = useDispatch();
  const { loggedUser } = useAuth();

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
      const response = await SubmissionAssignmentService.getSubmissionAssignmentByUserIdAsignmentId(
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
    handleGetSubmissionAssignment(loggedUser?.userId, assignmentId ?? "");
  }, [assignmentId]);

  function calculateTimeDifference(
    date1: Date,
    date2: Date
  ): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    // Tính toán sự khác biệt giữa hai ngày, đảm bảo kết quả luôn là số dương
    const diffInMs = Math.abs(date1.getTime() - date2.getTime());

    const msInADay = 24 * 60 * 60 * 1000;
    const msInAnHour = 60 * 60 * 1000;
    const msInAMinute = 60 * 1000;
    const msInASecond = 1000;

    // Tính toán số ngày, giờ, phút và giây từ sự khác biệt tính bằng milliseconds
    const days = Math.floor(diffInMs / msInADay);
    const hours = Math.floor((diffInMs % msInADay) / msInAnHour);
    const minutes = Math.floor((diffInMs % msInAnHour) / msInAMinute);
    const seconds = Math.floor((diffInMs % msInAMinute) / msInASecond);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  const timeCloseDate = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());
  const timeRemaining = calculateTimeDifference(timeCloseDate, new Date());
  const submitTimeDate = new Date(
    submissionAssignmentState.submissionAssignmentDetails?.submitTime ?? new Date()
  );
  const submitTime = calculateTimeDifference(submitTimeDate, timeCloseDate);
  console.log(timeRemaining);

  const checkTimeSubmission = (): number => {
    let timeClose = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());

    let submitTime = submissionAssignmentState.submissionAssignmentDetails?.submitTime
      ? new Date(submissionAssignmentState.submissionAssignmentDetails.submitTime)
      : null;

    if (!submitTime) {
      return new Date() > timeClose ? 0 : 3;
    }

    if (submitTime <= timeClose) {
      return 1;
    }
    return 2;
  };

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
        : t("course_student_assignment_submission_status_not_submitted"),
      status: submissionAssignmentState.submissionAssignmentDetails?.submitTime ? 1 : 3
    },
    {
      header: t("course_student_assignment_grading_status"),
      data: submissionAssignmentState.submissionAssignmentDetails?.isGraded
        ? t("course_student_assignment_submission_status_graded")
        : t("course_student_assignment_submission_status_not_grading"),
      status: submissionAssignmentState.submissionAssignmentDetails?.isGraded ? 1 : 3
    },
    {
      header: t("course_student_assignment_time_remaining"),
      data:
        checkTimeSubmission() === 1
          ? t("assignment_submitted") + formatTime(submitTime) + t("early")
          : checkTimeSubmission() === 2
            ? t("assignment_submitted_late") + formatTime(submitTime) + t("late")
            : checkTimeSubmission() === 0
              ? t("assignment_overdue") + formatTime(timeRemaining)
              : formatTime(timeRemaining),

      status: checkTimeSubmission()
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

  if (
    submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentFiles &&
    submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentFiles.length !== 0
  ) {
    columns.push({
      header: t("course_student_assignment_file_submission"),
      data: (
        <CustomFileList
          files={
            submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentFiles.map(
              (attachment) => {
                let f: File = new File([""], attachment.fileName, {
                  lastModified: new Date(attachment.timemodified).getTime()
                });
                return {
                  id: attachment.id,
                  name: attachment.fileName,
                  downloadUrl: attachment.fileUrl,
                  size: attachment.fileSize,
                  type: attachment.mimetype,
                  file: f
                };
              }
            ) ?? [] // provide an empty array if introAttachments is undefined
          }
          treeView={false}
        />
      )
    });
  }

  function addAttributesAndStylesToImages(html: string, className: string, css: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const images = doc.getElementsByTagName("img");
    for (let img of images) {
      img.classList.add(className);
    }

    const style = doc.createElement("style");
    style.textContent = css;
    doc.head.appendChild(style);

    return doc.documentElement.outerHTML;
  }

  const css = `
.custom-class {
    max-width: 100%;
    padding: 10px;
    height: auto;
}
`;

  if (submissionAssignmentState.submissionAssignmentDetails?.content) {
    columns.push({
      header: t("course_student_assignment_online_text_submission"),
      data: (
        <div
          dangerouslySetInnerHTML={{
            __html:
              addAttributesAndStylesToImages(
                submissionAssignmentState.submissionAssignmentDetails.content,
                "custom-class",
                css
              ) || ``
          }}
        ></div>
      )
    });
  }

  let gradeColumn: Column[] = [
    {
      header: t("course_student_assignment_grade"),
      data:
        (submissionAssignmentState.submissionAssignmentDetails?.isGraded &&
          submissionAssignmentState.submissionAssignmentDetails?.submissionGrade.grade
            .toFixed(2)
            .toString() +
            " / " +
            assignmentState.assignmentDetails?.maxScore.toFixed(2).toString()) ||
        "-"
    },
    {
      header: t("course_student_assignment_grade_on"),
      data: (
        <div>
          {submissionAssignmentState.submissionAssignmentDetails?.submissionGrade
            ? dayjs(
                submissionAssignmentState.submissionAssignmentDetails?.submissionGrade.timeModified
              ).format("DD/MM/YYYY hh:mm:ss A")
            : "-"}
        </div>
      )
    },
    {
      header: t("course_student_assignment_feedback"),
      data: (
        <div
          dangerouslySetInnerHTML={{
            __html: submissionAssignmentState.submissionAssignmentDetails?.feedback || ``
          }}
        ></div>
      )
    }
  ];

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
        <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
      </Button>
      <Box className={classes.assignmentTitle}>
        <img
          className={classes.assignmentIcon}
          src={images.course.courseAssignment}
          alt='assignment'
        />
        <Heading1>{assignmentState.assignmentDetails?.title}</Heading1>
      </Box>
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
            files={assignmentState.assignmentDetails?.introAttachments?.map(
              (attachment: AssignmentResourceEntity) => {
                let f: File = new File([""], attachment.fileName, {
                  lastModified: new Date(attachment.timemodified).getTime()
                });
                return {
                  id: attachment.id,
                  name: attachment.fileName,
                  downloadUrl: attachment.fileUrl,
                  size: attachment.fileSize,
                  type: attachment.mimetype,
                  file: f
                };
              }
            )}
          />
        </Box>
      </Card>
      {submissionAssignmentState.submissionAssignmentDetails?.submitTime && (
        <Box>
          <Button
            className={classes.cancelBtn}
            onClick={() => {
              navigate(
                routes.student.assignment.edit_submit
                  .replace(":assignmentId", assignmentId ?? "")
                  .replace(":courseId", courseId ?? "")
              );
            }}
            width='fit-content'
            style={{ marginRight: "10px" }}
          >
            <ParagraphBody
              fontSize={"13.5px"}
              fontWeight={520}
              translation-key='course_assignment_detail_edit_submit'
            >
              {t("course_assignment_detail_edit_submit")}
            </ParagraphBody>
          </Button>
          <Button className={classes.cancelBtn} onClick={() => {}} width='fit-content'>
            <ParagraphBody
              fontSize={"13.5px"}
              fontWeight={520}
              translation-key='course_assignment_detail_remove_submit'
            >
              {t("course_assignment_detail_remove_submit")}
            </ParagraphBody>
          </Button>
        </Box>
      )}
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
          "course_student_assignment_file_submission",
          "assignment_submitted",
          "assignment_overdue",
          "assignment_submitted_late",
          "late",
          "early"
        ]}
      />
      {submissionAssignmentState.submissionAssignmentDetails?.isGraded && (
        <>
          <Heading2 translation-key={["course_student_assignment_grade"]}>
            {t("course_student_assignment_grade")}
          </Heading2>
          <AssignmentTable
            rows={gradeColumn}
            translation-key={[
              "course_student_assignment_grade",
              "course_student_assignment_feedback"
            ]}
          />
        </>
      )}
      {(!submissionAssignmentState?.submissionAssignmentDetails?.submitTime ||
        assignmentState.assignmentDetails?.moodleId) && (
        <Button
          className={classes.saveBtn}
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
      )}
    </Box>
  );
};

export default StudentCourseAssignmentDetails;

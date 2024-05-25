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
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AssignmentTable from "./components/AssignmentTable";
import Heading2 from "components/text/Heading2";

const StudentCourseAssignmentDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const dispatch = useDispatch();

  const handleGetAssignmentDetails = async (id: string) => {
    try {
      const response = await AssignmentService.getAssignmentById(id);
      dispatch(setAssignmentDetails(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAssignmentDetails(assignmentId ?? "");
  }, []);

  console.log("assignmentState", assignmentState.assignmentDetails);
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
              {dayjs(assignmentState.assignmentDetails?.timeOpen)
                ?.toDate()
                .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
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
              {dayjs(assignmentState.assignmentDetails?.timeClose)
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
          <div
            dangerouslySetInnerHTML={{ __html: assignmentState.assignmentDetails?.intro || `` }}
          ></div>
          {assignmentState.assignmentDetails?.introFiles?.map((file) => {
            return (
              <a href={file} target='_blank' rel='noreferrer' key={file}>
                {file.split("/").pop()}
              </a>
            );
          })}
          <div
            style={{
              marginBottom: "10px"
            }}
            dangerouslySetInnerHTML={{ __html: assignmentState.assignmentDetails?.activity || `` }}
          ></div>
          {assignmentState.assignmentDetails?.introAttachments?.map((attachment) => {
            // Lấy tên file từ URL
            const filename = attachment.split("/").pop();
            const filenameFinal = decodeURIComponent(filename || "");
            return (
              <a href={attachment} target='_blank' rel='noreferrer' key={attachment}>
                {filenameFinal}
              </a>
            );
          })}
        </Box>
      </Card>
      <Heading2 translation-key={["course_student_assignment_submission_status"]}>
        {t("course_student_assignment_submission_status")}
      </Heading2>
      <AssignmentTable
        rows={[
          {
            header: t("course_student_assignment_submission_status"),
            data: t("course_student_assignment_submission_status_not_submitted")
          },
          {
            header: t("course_student_assignment_grading_status"),
            data: t("course_student_assignment_submission_status_not_grading")
          },
          {
            header: t("course_student_assignment_time_remaining"),
            data: "3 days 13 hours remaining"
          },
          {
            header: t("course_student_assignment_last_modified"),
            data: "-"
          },
          {
            header: t("course_student_assignment_file_submission"),
            data: "hehe.jpg"
          }
        ]}
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

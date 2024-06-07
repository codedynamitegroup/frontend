import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import Heading1 from "components/text/Heading1";
import { Height } from "@mui/icons-material";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSubmissionAssignments } from "reduxes/courseService/submission_assignment";
import { RootState } from "store";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AssignmentService } from "services/courseService/AssignmentService";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { SubmissionAssignmentFileEntity } from "models/courseService/entity/SubmissionAssignmentFileEntity";
import { AssignmentResourceEntity } from "models/courseService/entity/AssignmentResourceEntity";
import assignment from "reduxes/courseService/assignment";

export default function AssignmentGrading() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [assignmentTypes, setAssignmentTypes] = React.useState(["Tự luận", "Nộp tệp"]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState("");
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const { courseId, assignmentId, submissionId } = useParams<{
    courseId: string;
    assignmentId: string;
    submissionId: string;
  }>();
  const [assignmentSubmissionStudent, setAssignmentSubmissionStudent] = React.useState(
    submissionId?.toString() ?? ""
  );

  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const dispatch = useDispatch();

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const handleGetSubmissionAssignmentByAssignment = useCallback(
    async (assignmentId: string) => {
      dispatch(setLoading(true));
      try {
        const response =
          await SubmissionAssignmentService.getSubmissionAssignmentByAssignmentId(assignmentId);
        dispatch(setSubmissionAssignments(response));
      } catch (error) {
        console.error("Failed to fetch submission assignment", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (assignmentId) {
      handleGetSubmissionAssignmentByAssignment(assignmentId);
    }
  }, [assignmentId, handleGetSubmissionAssignmentByAssignment]);

  useEffect(() => {
    if (assignmentSubmissionStudent) {
      navigate(
        routes.lecturer.assignment.grading
          .replace(":assignmentId", assignmentId ?? "")
          .replace(":courseId", courseId ?? "")
          .replace(":submissionId", assignmentSubmissionStudent)
      );
    }
  }, [assignmentSubmissionStudent, assignmentId, courseId, navigate]);

  useEffect(() => {
    if (submissionAssignmentState.submissionAssignments) {
      const grade =
        submissionAssignmentState.submissionAssignments.find(
          (submission) => submission.id === assignmentSubmissionStudent
        )?.grade ?? -1;
      setAssignmentMaximumGrade(grade === -1 ? "" : grade.toString());
      setAssignmentFeedback(
        submissionAssignmentState.submissionAssignments.find(
          (submission) => submission.id === assignmentSubmissionStudent
        )?.content ?? ""
      );
    }
  }, [submissionAssignmentState.submissionAssignments, assignmentSubmissionStudent]);

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      {submissionAssignmentState.isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "10px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            className={classes.toolbar}
            sx={{
              backgroundColor: "white",
              marginTop: `${headerHeight}px`,
              padding: "16px"
            }}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.management)}
                >
                  Quản lý khoá học
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.information)}
                >
                  CS202 - Nhập môn lập trình
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() =>
                    navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""))
                  }
                >
                  Danh sách bài tập
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() =>
                    navigate(
                      routes.lecturer.assignment.detail
                        .replace(":assignmentId", assignmentId ?? "")
                        .replace(":courseId", courseId ?? "")
                    )
                  }
                >
                  {submissionAssignmentState.submissionAssignments[0]?.assignmentName}
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall colorname='--blue-500'>Đánh giá</ParagraphSmall>
              </Box>
            </Toolbar>
          </Box>
          <Box className={classes.contentContainer}>
            <Container className={classes.drawerFieldContainer}>
              <TextTitle translation-key='common_student'>{t("common_student")}</TextTitle>
              <BasicSelect
                labelId='select-assignment-submission-student-label'
                value={assignmentSubmissionStudent}
                onHandleChange={(value) => setAssignmentSubmissionStudent(value)}
                items={submissionAssignmentState.submissionAssignments.map((submission) => ({
                  value: submission.id,
                  label: submission.user.fullName,
                  customNode: (
                    <Box>
                      <TextTitle fontWeight={"500"}>{submission.user.fullName}</TextTitle>
                      <ParagraphBody colorname='--gray-500'>{submission.user.email}</ParagraphBody>
                    </Box>
                  )
                }))}
                backgroundColor='#D9E2ED'
              />
            </Container>
            <Container
              sx={{
                backgroundColor: "white",
                marginTop: "16px",
                height: "fit-content",
                padding: "16px"
              }}
              className={classes.gradeContainer}
            >
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_grading_assignment_type'>
                  {t("course_lecturer_grading_assignment_type")}
                </TextTitle>
                <ChipMultipleFilter
                  label=''
                  defaultChipList={["Tự luận", "Nộp tệp"]}
                  filterList={assignmentTypes}
                  onFilterListChangeHandler={setAssignmentTypes}
                  readOnly={true}
                  backgroundColor='white'
                />
              </Box>
              <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                <TextTitle translation-key='course_lecturer_submission_online_text'>
                  {t("course_lecturer_submission_online_text")}
                </TextTitle>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      submissionAssignmentState.submissionAssignments.find(
                        (submission) => submission.id === assignmentSubmissionStudent
                      )?.submissionAssignmentOnlineText?.content ??
                      `<span style="color: red;">${t("no_data")}</span>`
                  }}
                />
              </Box>
              <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                <TextTitle translation-key='course_lecturer_submission_file'>
                  {t("course_lecturer_submission_file")}
                </TextTitle>
                {submissionAssignmentState.submissionAssignments.find(
                  (submission) => submission.id === assignmentSubmissionStudent
                )?.submissionAssignmentFile?.files ? (
                  <CustomFileList
                    files={
                      submissionAssignmentState.submissionAssignments
                        .find((submission) => submission.id === assignmentSubmissionStudent)
                        ?.submissionAssignmentFile?.files.map(
                          (attachment: AssignmentResourceEntity) => ({
                            id: attachment.id,
                            name: attachment.fileName,
                            downloadUrl: attachment.fileUrl,
                            size: attachment.fileSize,
                            type: attachment.mimetype,
                            lastModified: new Date(attachment.timemodified).toLocaleString(
                              "en-US",
                              {
                                timeZone: "Asia/Ho_Chi_Minh"
                              }
                            )
                          })
                        ) ?? []
                    }
                    treeView={false}
                  />
                ) : (
                  <span style={{ color: "red" }}>{t("no_data")}</span>
                )}
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_score_on_range'>
                  {t("course_lecturer_score_on_range", { range: 100 })}
                </TextTitle>
                <InputTextField
                  type='number'
                  value={assignmentMaximumGrade}
                  onChange={(e) => setAssignmentMaximumGrade(e.target.value)}
                  placeholder='Nhập điểm tối đa'
                  backgroundColor='white'
                />
              </Box>
              <Box className={classes.feedbackContainer}>
                <TextTitle translation-key='course_lecturer_grade_comment'>
                  {t("course_lecturer_grade_comment")}
                </TextTitle>
                <Box className={classes.textEditor}>
                  <TextEditor
                    style={{
                      marginTop: "10px",
                      height: "300px" // Updated height for TextEditor
                    }}
                    value={assignmentFeedback}
                    onChange={setAssignmentFeedback}
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        </>
      )}
      <Box className={classes.stickyBottom}>
        <Button
          variant='contained'
          color='primary'
          className={classes.btnGrade}
          onClick={() => {
            console.log("Grade");
          }}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Grid>
  );
}

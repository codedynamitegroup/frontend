import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Stack
} from "@mui/material";
import Header from "components/Header";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSubmissionAssignments } from "reduxes/courseService/submission_assignment";
import { RootState } from "store";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { UpdateSubmissionAssignment } from "models/courseService/entity/update/UpdateSubmissionAssignment";
import { CreateSubmissionGradeCommand } from "models/courseService/entity/create/CreateSubmissionGradeCommand";
import { SubmissionGradeService } from "services/courseService/SubmissionGradeService";
import { UpdateSubmissionGradeCommand } from "models/courseService/entity/update/UpdateSubmissionGradeCommand";
import { AssignmentResourceEntity } from "models/courseService/entity/AssignmentResourceEntity";
import ParagraphBody from "components/text/ParagraphBody";
import CustomBreadCrumb from "components/common/Breadcrumb";
import useBoxDimensions from "hooks/useBoxDimensions";

export default function AssignmentGrading() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [assignmentTypes, setAssignmentTypes] = React.useState([
    t("common_submission_type_file"),
    t("common_submission_type_online_text")
  ]);
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
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);

  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const assignmentState = useSelector((state: RootState) => state.assignment);
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

  const handleSave = async (continueToNext = false) => {
    const submissionGrade = submissionAssignmentState.submissionAssignments.find(
      (submission) => submission.id === assignmentSubmissionStudent
    )?.submissionGrade;
    if (submissionGrade) {
      const updateSubmissionGrade: UpdateSubmissionGradeCommand = {
        grade: Number(assignmentMaximumGrade),
        timeModified: new Date().toISOString()
      };
      await SubmissionGradeService.updateSubmissionGrade(
        updateSubmissionGrade,
        submissionGrade.id ?? ""
      );
      const submissionAssignment: UpdateSubmissionAssignment = {
        feedback: assignmentFeedback
      };
      await SubmissionAssignmentService.update(submissionAssignment, submissionId ?? "");
    } else {
      const submissionGrade: CreateSubmissionGradeCommand = {
        submissionAssignmentId: submissionId ?? "",
        grade: Number(assignmentMaximumGrade),
        timeCreated: new Date().toISOString(),
        timeModified: new Date().toISOString()
      };
      await createSubmissionGrade(submissionGrade);
      const submissionAssignment: UpdateSubmissionAssignment = {
        isGraded: true,
        feedback: assignmentFeedback
      };
      await SubmissionAssignmentService.update(submissionAssignment, submissionId ?? "");
    }

    if (continueToNext) {
      navigateToNextStudent();
    }
  };

  const createSubmissionGrade = async (createSubmissionGrade: CreateSubmissionGradeCommand) => {
    try {
      const response = await SubmissionGradeService.createSubmissionGrade(createSubmissionGrade);
      if (response) {
        return response;
      }
    } catch (error) {
      console.error("Failed to create submission grade", error);
    }
  };

  const handleGetSubmissionAssignmentByAssignment = useCallback(
    async (assignmentId: string) => {
      dispatch(setLoading(true));
      try {
        const response =
          await SubmissionAssignmentService.getSubmissionAssignmentByAssignmentId(assignmentId);
        console.log(response);
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
    const fetchSubmissionAssignment = async () => {
      const response = await SubmissionAssignmentService.getSubmissionAssignmentById(
        assignmentSubmissionStudent
      );
      const grade = response.submissionGrade?.grade ?? -1;
      setAssignmentMaximumGrade(grade === -1 ? "" : grade.toString());
      setAssignmentFeedback(response?.feedback ?? "");
    };
    fetchSubmissionAssignment();
  }, [assignmentSubmissionStudent]);

  const navigateToNextStudent = () => {
    const currentIndex = submissionAssignmentState.submissionAssignments.findIndex(
      (submission) => submission.id === assignmentSubmissionStudent
    );
    const nextIndex = (currentIndex + 1) % submissionAssignmentState.submissionAssignments.length;
    const nextStudentId = submissionAssignmentState.submissionAssignments[nextIndex].id;
    setAssignmentSubmissionStudent(nextStudentId);
  };

  function addAttributesAndStylesToImages(html: string, className: string, css: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Thêm thuộc tính và class vào các thẻ <img>
    const images = doc.getElementsByTagName("img");
    for (let img of images) {
      img.classList.add(className);
    }

    // Tạo thẻ <style> và thêm CSS
    const style = doc.createElement("style");
    style.textContent = css;
    doc.head.appendChild(style);

    return doc.documentElement.outerHTML;
  }
  const css = `
.custom-class {
    max-width: 100%;
    height: auto;
}
`;
  const content = submissionAssignmentState.submissionAssignments.find(
    (submission) => submission.id === assignmentSubmissionStudent
  )?.content;

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
            className={classes.contentContainer}
            sx={{
              marginTop: `${headerHeight}px`
            }}
          >
            <Container
              sx={{
                padding: "0",
                display: "flex",
                justifyContent: "flex-start"
              }}
            >
              <CustomBreadCrumb
                breadCrumbData={[
                  {
                    navLink: routes.lecturer.course.management,
                    label: "Quản lý khoá học"
                  },
                  {
                    navLink: routes.lecturer.course.information.replace(
                      ":courseId",
                      courseId ?? ""
                    ),
                    label: "CS202 - Nhập môn lập trình"
                  },
                  {
                    navLink: routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""),
                    label: "Danh sách bài tập"
                  },
                  {
                    navLink: routes.lecturer.assignment.detail
                      .replace(":assignmentId", assignmentId ?? "")
                      .replace(":courseId", courseId ?? ""),
                    label: submissionAssignmentState.submissionAssignments[0]?.assignmentName
                  }
                ]}
                lastBreadCrumbLabel='Đánh giá'
              />
            </Container>{" "}
            <Container
              sx={{
                backgroundColor: "white",
                marginTop: "5px",
                height: "fit-content",
                padding: "16px"
              }}
              className={classes.gradeContainer}
            >
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
                backgroundColor='var(--gray-2)'
              />
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_grading_assignment_type'>
                  {t("course_lecturer_grading_assignment_type")}
                </TextTitle>
                <Stack
                  translation-key={[
                    "common_submission_type_file",
                    "common_submission_type_online_text"
                  ]}
                  direction='row'
                  spacing={1}
                >
                  {assignmentTypes.map((type) => {
                    return <Chip label={type} />;
                  })}
                </Stack>
              </Box>
              {assignmentState.assignmentDetails?.type === "BOTH" ? (
                <>
                  <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                    <TextTitle translation-key='course_lecturer_submission_online_text'>
                      {t("course_lecturer_submission_online_text")}
                    </TextTitle>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content
                          ? addAttributesAndStylesToImages(content, "custom-class", css)
                          : `<span style="color: red;">${t("no_data")}</span>`
                      }}
                    />
                  </Box>

                  <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                    <TextTitle translation-key='course_lecturer_submission_file'>
                      {t("course_lecturer_submission_file")}
                    </TextTitle>
                    {submissionAssignmentState.submissionAssignments.find(
                      (submission) => submission.id === assignmentSubmissionStudent
                    )?.submissionAssignmentFiles.length != 0 ? (
                      <CustomFileList
                        files={
                          submissionAssignmentState.submissionAssignments
                            .find((submission) => submission.id === assignmentSubmissionStudent)
                            ?.submissionAssignmentFiles?.map(
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
                            ) ?? []
                        }
                        treeView={false}
                      />
                    ) : (
                      <span style={{ color: "red" }}>{t("no_data")}</span>
                    )}
                  </Box>
                </>
              ) : assignmentState.assignmentDetails?.type === "FILE" ? (
                <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                  <TextTitle translation-key='course_lecturer_submission_file'>
                    {t("course_lecturer_submission_file")}
                  </TextTitle>
                  {submissionAssignmentState.submissionAssignments.find(
                    (submission) => submission.id === assignmentSubmissionStudent
                  )?.submissionAssignmentFiles.length != 0 ? (
                    <CustomFileList
                      files={
                        submissionAssignmentState.submissionAssignments
                          .find((submission) => submission.id === assignmentSubmissionStudent)
                          ?.submissionAssignmentFiles?.map(
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
                          ) ?? []
                      }
                      treeView={false}
                    />
                  ) : (
                    <span style={{ color: "red" }}>{t("no_data")}</span>
                  )}
                </Box>
              ) : (
                <Box className={classes.drawerFieldContainer} translation-key='no_data'>
                  <TextTitle translation-key='course_lecturer_submission_online_text'>
                    {t("course_lecturer_submission_online_text")}
                  </TextTitle>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content
                        ? addAttributesAndStylesToImages(content, "custom-class", css)
                        : `<span style="color: red;">${t("no_data")}</span>`
                    }}
                  />
                </Box>
              )}
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='course_lecturer_score_on_range'>
                  {t("course_lecturer_score_on_range", { range: 100 })}
                </TextTitle>
                <InputTextField
                  type='number'
                  value={assignmentMaximumGrade}
                  onChange={(e) => setAssignmentMaximumGrade(e.target.value)}
                  placeholder='Nhập điểm'
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
          onClick={() => handleSave()}
        >
          Lưu thay đổi
        </Button>
        <Button
          variant='contained'
          color='primary'
          className={classes.btnGrade}
          onClick={() => handleSave(true)}
        >
          Lưu và tiếp tục
        </Button>
        {/* <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={openSuccessSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSuccessSnackbar(false)}
        >
          <Alert
            severity='success'
            sx={{ width: "100%" }}
            onClose={() => setOpenSuccessSnackbar(false)}
          >
            {"Chấm thành công"}
          </Alert>
        </Snackbar> */}
      </Box>
    </Grid>
  );
}

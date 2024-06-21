import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { ReactComponent as SubmissionLogoSvg } from "assets/img/paper-upload-svgrepo-com.svg";
import Header from "components/Header";
import BasicAccordion from "components/common/accordion/BasicAccordion";
import Button, { BtnType } from "components/common/buttons/Button";
import FileUploader from "components/editor/FileUploader";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import dayjs from "dayjs";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./styles.module.scss";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import useBoxDimensions from "hooks/useBoxDimensions";
import { routes } from "routes/routes";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { AssignmentService } from "services/courseService/AssignmentService";
import { setAssignmentDetails } from "reduxes/courseService/assignment";
import { ExtFile } from "@files-ui/react";
import AdvancedDropzoneDemo from "components/editor/FileUploader";
import { Close } from "@mui/icons-material";
import { SubmissionAssignmentFileService } from "services/courseService/SubmissionAssignmentFileService";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import useAuth from "hooks/useAuth";
import { SubmissionAssignmentEntity } from "models/courseService/entity/SubmissionAssignmentEntity";
import { setSubmissionAssignmentDetails } from "reduxes/courseService/submission_assignment";
import { CreateSubmissionAssignmentCommand } from "models/courseService/entity/create/CreateSubmissionAssignmentCommand";
import { CreateSubmissionAssignmentFile } from "models/courseService/entity/create/CreateSubmissionAssignmentFile";
import { UpdateSubmissionAssignment } from "models/courseService/entity/update/UpdateSubmissionAssignment";
import CustomBreadCrumb from "components/common/Breadcrumb";

export default function SubmitAssignment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const assignmentState = useSelector((state: RootState) => state.assignment);
  const courseState = useSelector((state: RootState) => state.course);
  const dispatch = useDispatch();
  const [extFiles, setExtFiles] = React.useState<ExtFile[]>([]);
  const [textEditorContent, setTextEditorContent] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);

  const [wordCount, setWordCount] = React.useState(0);

  const countWords = (text: string) => {
    const wordsArray = text.trim().split(/\s+/);
    const count = wordsArray.filter((word) => word !== "").length;
    return count;
  };

  const handleChange = (content: string) => {
    setTextEditorContent(content);
    setWordCount(countWords(content));
  };

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
      if (response) {
        dispatch(setSubmissionAssignmentDetails(response));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { loggedUser } = useAuth();

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });

  const createSubmissionAssignmentFile = async (file: CreateSubmissionAssignmentFile) => {
    try {
      const response = await SubmissionAssignmentFileService.create(file);
      if (response) {
        console.log("Create submission assignment file successfully");
        return response;
      }
    } catch (error: any) {
      console.error("Failed to create submission assignment file", error);
    }
  };

  const updateSubmissionAssignmentFile = async (
    file: CreateSubmissionAssignmentFile,
    id: string
  ) => {
    try {
      const response = await SubmissionAssignmentFileService.update(file, id);
      if (response) {
        console.log("Update submission assignment file successfully");
        return response;
      }
    } catch (error: any) {
      console.error("Failed to update submission assignment file", error);
    }
  };

  const deleteSubmissionAssignmentFile = async (id: string) => {
    try {
      const response = await SubmissionAssignmentFileService.deleteById(id);
      if (response) {
        console.log("Delete submission assignment file successfully");
        return response;
      }
    } catch (error: any) {
      console.error("Failed to delete submission assignment file", error);
    }
  };

  const createSubmissionAssignment = async (
    submissionAssignment: CreateSubmissionAssignmentCommand
  ) => {
    try {
      const response =
        await SubmissionAssignmentService.createSubmissionAssignment(submissionAssignment);
      if (response) {
        console.log("Create submission assignment successfully");
        return response;
      }
    } catch (error: any) {
      console.error("Failed to create submission assignment", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (assignmentState.assignmentDetails?.type === "BOTH") {
      let plainText = textEditorContent.replace(/<[^>]+>/g, "");
      if (plainText.trim() === "" && extFiles.length === 0) {
        setError("Please provide content in the TextEditor or upload a file.");
        setTimeout(() => setError(""), 3000); // Reset error after 1 second
        return;
      }
    } else if (assignmentState.assignmentDetails?.type === "TEXT_ONLINE") {
      let plainText = textEditorContent.replace(/<[^>]+>/g, "");
      if (plainText.trim() === "") {
        setError("Please provide content in the TextEditor.");
        setTimeout(() => setError(""), 3000); // Reset error after 1 second
        return;
      } else if (wordCount > Number(assignmentState.assignmentDetails?.wordLimit)) {
        setError("Word limit exceeded.");
        setTimeout(() => setError(""), 3000); // Reset error after 1 second
        return;
      }
    } else {
      if (extFiles.length === 0) {
        setError("Please upload a file.");
        return;
      }
    }
    try {
      let fileArray: CreateSubmissionAssignmentFile[] = [];
      let submissionAssignmentFileIdArray: string[] = [];
      let submissionAssignmentResponse;
      if (!submissionAssignmentState.submissionAssignmentDetails) {
        for (const file of extFiles) {
          const submissionAssignmentFile: CreateSubmissionAssignmentFile = {
            fileName: file.name || "",
            fileUrl: file.downloadUrl || "",
            fileSize: file.size || 0,
            mimetype: file.type || "",
            timemodified: new Date().toISOString()
          };
          const submissionAssignmentFileResponse =
            await createSubmissionAssignmentFile(submissionAssignmentFile);
          fileArray.push(submissionAssignmentFile);
          submissionAssignmentFileIdArray.push(submissionAssignmentFileResponse.id);
        }

        const submissionAssignment: CreateSubmissionAssignmentCommand = {
          assignmentId: assignmentId ?? "",
          userId: loggedUser.userId ?? "",
          content: textEditorContent ? textEditorContent : null,
          isGraded: false,
          feedback: null,
          submitTime: new Date().toISOString(),
          timemodified: new Date().toISOString()
        };
        submissionAssignmentResponse = await createSubmissionAssignment(submissionAssignment);
      } else {
        const existingFiles =
          submissionAssignmentState.submissionAssignmentDetails.submissionAssignmentFiles || [];

        const filesToCreate = extFiles.filter(
          (file) => !existingFiles.some((existingFile) => existingFile.id === file.id)
        );
        const filesToDelete = existingFiles.filter(
          (existingFile) => !extFiles.some((file) => file.id === existingFile.id)
        );

        for (const file of filesToDelete) {
          await deleteSubmissionAssignmentFile(file.id);
        }

        for (const file of filesToCreate) {
          const submissionAssignmentFile: CreateSubmissionAssignmentFile = {
            fileName: file.name || "",
            fileUrl: file.downloadUrl || "",
            fileSize: file.size || 0,
            mimetype: file.type || "",
            timemodified: new Date().toISOString()
          };
          const submissionAssignmentFileResponse =
            await createSubmissionAssignmentFile(submissionAssignmentFile);
          fileArray.push(submissionAssignmentFile);
          submissionAssignmentFileIdArray.push(submissionAssignmentFileResponse.id);
        }

        const submissionAssignment: UpdateSubmissionAssignment = {
          content: textEditorContent ? textEditorContent : null,
          timemodified: new Date().toISOString()
        };

        submissionAssignmentResponse = await SubmissionAssignmentService.update(
          submissionAssignment,
          submissionAssignmentState.submissionAssignmentDetails.id
        );
      }

      if (submissionAssignmentResponse && fileArray.length != 0) {
        for (let i = 0; i < fileArray.length; i++) {
          const file = {
            ...fileArray[i],
            submissionAssignmentId: submissionAssignmentResponse.id
          };
          const response = await updateSubmissionAssignmentFile(
            file,
            submissionAssignmentFileIdArray[i]
          );
        }
      }
      setError("");
      navigate(
        routes.student.assignment.detail
          .replace(":assignmentId", assignmentId ?? "")
          .replace(":courseId", courseId ?? "")
      );
    } catch (error) {
      console.error(error);
    }
  };
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  console.log(submissionAssignmentState.submissionAssignmentDetails);

  useEffect(() => {
    const fetchSubmissionAssignment = async () => {
      if (
        submissionAssignmentState?.submissionAssignmentDetails == null &&
        lastSegment === "edit" &&
        loggedUser?.userId
      ) {
        await handleGetSubmissionAssignment(loggedUser?.userId, assignmentId ?? "");
      }
    };

    fetchSubmissionAssignment();
  }, [loggedUser?.userId]);

  useEffect(() => {
    if (submissionAssignmentState?.submissionAssignmentDetails) {
      setExtFiles(
        submissionAssignmentState.submissionAssignmentDetails?.submissionAssignmentFiles?.map(
          (file) => {
            let f: File = new File([""], file.fileName, {
              lastModified: new Date().getTime()
            });
            return {
              id: file.id,
              name: file.fileName,
              size: file.fileSize,
              type: file.mimetype,
              downloadUrl: file.fileUrl,
              imageUrl: file.fileUrl,
              file: f,
              uploadStatus: "success"
            };
          }
        ) || []
      );
      setTextEditorContent(submissionAssignmentState?.submissionAssignmentDetails?.content || "");
    }
  }, [submissionAssignmentState?.submissionAssignmentDetails]);

  useEffect(() => {
    if (!assignmentState.assignmentDetails) {
      handleGetAssignmentDetails(assignmentId ?? "");
    }
  }, []);

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
                    label: courseState.courseDetail?.name || ""
                  },
                  {
                    navLink: routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""),
                    label: "Danh sách bài tập"
                  },
                  {
                    navLink: routes.lecturer.assignment.detail
                      .replace(":assignmentId", assignmentId ?? "")
                      .replace(":courseId", courseId ?? ""),
                    label: assignmentState.assignmentDetails?.title || ""
                  }
                ]}
                lastBreadCrumbLabel='Nộp bài làm'
              />
            </Container>
            <Container>
              <Box
                component='form'
                className={classes.formBody}
                autoComplete='off'
                onSubmit={handleSubmit}
              >
                <Grid container direction='row' alignItems='center' gap={2}>
                  <Grid item>
                    <Card
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        padding: "5px",
                        backgroundColor: "primary.main",
                        width: "50px"
                      }}
                    >
                      <SubmissionLogoSvg height='40px' />
                    </Card>
                  </Grid>
                  <Grid item>
                    <Heading1 fontWeight={"500"}>
                      {assignmentState.assignmentDetails?.title}
                    </Heading1>
                  </Grid>
                </Grid>
                <Card
                  className={classes.pageActivityHeader}
                  sx={{
                    padding: "10px",
                    backgroundColor: "var(--gray-2)"
                  }}
                >
                  <Grid container direction='row' alignItems='center' gap={1}>
                    <Grid item>
                      <ParagraphSmall
                        fontWeight={"600"}
                        translation-key='course_assignment_detail_open_time'
                      >
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
                      dangerouslySetInnerHTML={{
                        __html: assignmentState.assignmentDetails?.intro || ``
                      }}
                    ></div>
                    <div
                      style={{
                        marginBottom: "10px"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: assignmentState.assignmentDetails?.activity || ``
                      }}
                    ></div>
                  </Box>
                </Card>
                <Box
                  sx={{
                    position: "relative"
                  }}
                >
                  {error && (
                    <Alert
                      translation-key={[
                        "course_student_assignment_word_limit_notification",
                        "course_student_assignment_submit_nothing"
                      ]}
                      severity='error'
                      sx={{
                        top: -15,
                        width: "100%",
                        zIndex: 9999 // Adjust the z-index as needed
                      }}
                      action={
                        <IconButton
                          aria-label='close'
                          color='inherit'
                          size='small'
                          onClick={() => {
                            setError("");
                          }}
                        >
                          <Close fontSize='inherit' />
                        </IconButton>
                      }
                    >
                      {textEditorContent.replace(/<[^>]+>/g, "").trim() === ""
                        ? t("course_student_assignment_submit_nothing")
                        : t("course_student_assignment_word_limit_notification", {
                            maxWord: assignmentState.assignmentDetails?.wordLimit,
                            wordCount: wordCount
                          })}
                    </Alert>
                  )}
                  <Box className={classes.formBody}>
                    {assignmentState.assignmentDetails?.type === "BOTH" ? (
                      <>
                        <Grid className={classes.submitWrapper} container spacing={1}>
                          <Grid item xs={3}>
                            <TextTitle translation-key='common_essay'>
                              {t("common_essay")}
                            </TextTitle>
                          </Grid>
                          <Grid item xs={9} className={classes.textEditor}>
                            <TextEditor
                              className={classes.textEditor}
                              value={textEditorContent}
                              onChange={setTextEditorContent}
                            />
                          </Grid>
                          <Grid item xs={3} style={{ marginTop: "50px" }}>
                            <TextTitle translation-key='course_student_assignment_file_submission'>
                              {t("course_student_assignment_file_submission")}
                            </TextTitle>
                          </Grid>
                          <Grid item xs={9} style={{ marginTop: "50px" }}>
                            <AdvancedDropzoneDemo
                              extFiles={extFiles}
                              setExtFiles={setExtFiles}
                              maxFiles={Number(assignmentState.assignmentDetails?.maxUploadFiles)}
                              maxFileSize={Number(assignmentState.assignmentDetails?.maxFileSize)}
                            />{" "}
                          </Grid>
                        </Grid>
                      </>
                    ) : assignmentState.assignmentDetails?.type === "FILE" ? (
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <TextTitle translation-key='course_student_assignment_file_submission'>
                            {t("course_student_assignment_file_submission")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={8}>
                          <AdvancedDropzoneDemo
                            extFiles={extFiles}
                            setExtFiles={setExtFiles}
                            maxFiles={Number(assignmentState.assignmentDetails?.maxUploadFiles)}
                            maxFileSize={Number(assignmentState.assignmentDetails?.maxFileSize)}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <TextTitle translation-key='common_essay'>{t("common_essay")}</TextTitle>
                        </Grid>
                        <Grid item xs={8}>
                          <TextEditor
                            className={classes.textEditor}
                            value={textEditorContent}
                            onChange={handleChange}
                            roundedBorder
                            openDialog
                          />
                          <ParagraphSmall textAlign={"end"} translation-key='common_word_count'>
                            {wordCount} {t("common_word_count")}
                          </ParagraphSmall>
                        </Grid>
                      </Grid>
                    )}
                  </Box>

                  <Box className={classes.stickyBottom}>
                    <Button
                      type='submit'
                      className={classes.saveBtn}
                      btnType={BtnType.Primary}
                      translation-key='common_save_changes'
                    >
                      {t("common_save_changes")}
                    </Button>
                    <Button
                      className={classes.cancelBtn}
                      onClick={() => navigate(-1)}
                      translation-key='common_cancel'
                    >
                      {t("common_cancel")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </>
      )}
    </Grid>
  );
}

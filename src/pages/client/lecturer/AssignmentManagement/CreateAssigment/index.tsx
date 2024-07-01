import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import * as React from "react";

import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Snackbar,
  Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "components/Header";
import LoadButton from "components/common/buttons/LoadingButton";
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import BasicSelect from "components/common/select/BasicSelect";
import FileUploader from "components/editor/FileUploader";
import TextEditor from "components/editor/TextEditor";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { ExtFile } from "@files-ui/react";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Heading2 from "components/text/Heading2";
import { NavigateNext } from "@mui/icons-material";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Heading3 from "components/text/Heading3";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import i18next from "i18next";
import { CreateAssignmentCommand } from "models/courseService/entity/create/CreateAssignmentCommand";
import { AssignmentService } from "services/courseService/AssignmentService";
import { useParams } from "react-router-dom";
import { CreateIntroAttachmentCommand } from "models/courseService/entity/create/CreateIntroAttachmentCommand";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";
import { UpdateAssignmentCommand } from "models/courseService/entity/update/UpdateAssignmentCommand";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface FormData {
  name: string;
  intro: string;
  activity: string;
}

interface IFormDataType {
  name: string;
  intro?: string;
  activity?: string;
  maxScore: number;
  timeOpen: string;
  timeClose: string;
  wordLimit?: string;
  maxUploadedFile: string;
  maxFileSize: string;
}

export default function AssignmentCreated() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);
  const [collapseOpen, setCollapseOpen] = useState(true);
  const [submissionTimeCollapseOpen, setSubmissionTimeCollapseOpen] = useState(false);
  const [submissionTypeCollapseOpen, setSubmissionTypeCollapseOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const [textSubmission, setTextSubmission] = useState<boolean>(false);
  const [fileSubmission, setFileSubmission] = useState<boolean>(true);
  const [allowSubmissionAfterEndTime, setAllowSubmissionAfterEndTime] = useState<boolean>(true);
  const [assignment, setAssignment] = useState<AssignmentEntity | null>(null);

  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const courseState = useSelector((state: RootState) => state.course);

  const handleTextSubmissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSubmission(event.target.checked);
  };

  const handleFileSubmissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileSubmission(event.target.checked);
  };

  const handleGetAssignmentDetails = async (id: string) => {
    try {
      const response = await AssignmentService.getAssignmentById(id);
      if (response) {
        setAssignment(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (i18n.language !== currentLang && errors?.name) {
      trigger();
      setCurrentLang(i18n.language);
    }
  }, [i18n.language]);

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("assignment_name_required"),
      intro: yup.string(),
      activity: yup.string(),
      maxScore: yup.number().required("assignment_management_max_score_required"),
      timeOpen: yup.string().required("assignment_management_allow_submission_from_date_required"),
      timeClose: yup.string().required("assignment_management_submission_due_date_required"),
      wordLimit: yup.string(),
      maxUploadedFile: yup.string().required("assignment_management_max_uploaded_file_required"),
      maxFileSize: yup.string().required("assignment_management_max_file_size_required")
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      intro: "",
      activity: "",
      maxScore: 100,
      timeOpen: moment.utc().add(0, "days").toISOString(),
      timeClose: moment.utc().add(7, "days").toISOString(),
      wordLimit: "",
      maxUploadedFile: "20",
      maxFileSize: "40000"
    }
  });

  const createIntroAttachment = useCallback(
    async (introAttachment: CreateIntroAttachmentCommand) => {
      try {
        const response = await AssignmentService.createIntroAttachment(introAttachment);
        if (response) {
          console.log("Create intro attachment successfully");
          return response;
        }
      } catch (error) {
        console.log(error);
      }
      return null;
    },
    []
  );

  const updateIntroAttachment = useCallback(
    async (introAttachment: CreateIntroAttachmentCommand, assignmentId: string) => {
      try {
        const response = await AssignmentService.updateIntroAttachment(
          introAttachment,
          assignmentId
        );
        if (response) {
          console.log("Update intro attachment successfully");
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const createAssignment = useCallback(async (assignmentData: CreateAssignmentCommand) => {
    try {
      const response = await AssignmentService.createAssignment(assignmentData);
      if (response) {
        console.log("Create assignment successfully");
        return response;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }, []);

  const updateAssignment = useCallback(
    async (assignment: UpdateAssignmentCommand, assignmentId: string) => {
      try {
        const response = await AssignmentService.updateAssignment(assignment, assignmentId);
        if (response) {
          console.log("Update assignment successfully");
          return response;
        }
      } catch (error) {
        console.log(error);
      }
      return null;
    },
    []
  );

  const deleteIntroAttachment = useCallback(async (id: string) => {
    try {
      const response = await AssignmentService.deleteIntroAttachment(id);
      if (response) {
        console.log("Delete all intro attachment successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const submitHandler = async (data: any) => {
    if (!textSubmission && !fileSubmission) {
      setShake(true);
      setTimeout(() => setShake(false), 2000); // Reset shake a
      return;
    }
    setLoading(true);
    const formSubmittedData: IFormDataType = { ...data };
    const {
      name,
      intro,
      activity,
      maxScore,
      timeOpen,
      timeClose,
      wordLimit,
      maxUploadedFile,
      maxFileSize
    } = formSubmittedData;

    let introAttachments: CreateIntroAttachmentCommand[] = [];
    let attachmentIdArray: string[] = [];

    try {
      if (assignment) {
        const existingAttachments = assignment.introAttachments || [];

        const filesToCreate = extFiles.filter(
          (file) => !existingAttachments.some((existingFile) => existingFile.id === file.id)
        );
        const filesToDelete = existingAttachments.filter(
          (existingFile) => !extFiles.some((file) => file.id === existingFile.id)
        );

        for (const file of filesToDelete) {
          await deleteIntroAttachment(file.id);
        }

        // Create new files
        for (const file of filesToCreate) {
          const attachmentData = {
            fileName: file.name || "",
            fileUrl: file.downloadUrl || "",
            fileSize: file.size || 0,
            mimeType: file.type || "",
            timeModified: new Date().toISOString()
          };
          const attachmentResponse = await createIntroAttachment(attachmentData);
          if (attachmentResponse) {
            introAttachments.push(attachmentData);
            attachmentIdArray.push(attachmentResponse.id);
          }
        }
      } else {
        for (const file of extFiles) {
          const attachmentData = {
            fileName: file.name || "",
            fileUrl: file.downloadUrl || "",
            fileSize: file.size || 0,
            mimeType: file.type || "",
            timeModified: new Date().toISOString()
          };

          const attachmentResponse = await createIntroAttachment(attachmentData);
          if (attachmentResponse) {
            introAttachments.push(attachmentData);
            attachmentIdArray.push(attachmentResponse.id);
          }
        }
      }
      let assignmentResponse;
      if (assignment) {
        console.log(assignment.id);
        assignmentResponse = await updateAssignment(
          {
            title: name,
            intro,
            activity,
            wordLimit,
            maxUploadFiles: maxUploadedFile,
            maxFileSize,
            maxScore,
            timeOpen,
            timeClose,
            type:
              textSubmission && fileSubmission ? "BOTH" : textSubmission ? "TEXT_ONLINE" : "FILE",
            visible: true,
            allowSubmitLate: allowSubmissionAfterEndTime
          },
          assignment.id
        );
      } else {
        assignmentResponse = await createAssignment({
          courseId: courseId ?? "",
          title: name,
          intro,
          activity,
          wordLimit,
          maxUploadFiles: maxUploadedFile,
          maxFileSize,
          maxScore,
          timeOpen,
          timeClose,
          type: textSubmission && fileSubmission ? "BOTH" : textSubmission ? "TEXT_ONLINE" : "FILE",
          visible: true,
          allowSubmitLate: allowSubmissionAfterEndTime
        });
      }

      if (assignmentResponse && introAttachments.length > 0) {
        for (let i = 0; i < introAttachments.length; i++) {
          const temp = {
            ...introAttachments[i],
            assignmentId: assignmentResponse.assignmentId
          };
          console.log("temp", temp);
          await updateIntroAttachment(temp, attachmentIdArray[i]);
        }
      }
    } catch (error) {
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
      setOpenSuccessSnackbar(true);
      setTimeout(() => {
        navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""));
      }, 2000);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      handleGetAssignmentDetails(assignmentId);
    }
  }, []);

  useEffect(() => {
    if (assignment) {
      console.log(assignment);
      setValue("name", assignment.title);
      setValue("intro", assignment.intro);
      setValue("activity", assignment.activity);
      setValue("maxScore", assignment.maxScore);
      setValue(
        "timeOpen",
        assignment.timeOpen instanceof Date
          ? assignment.timeOpen.toISOString()
          : assignment.timeOpen
      );
      setValue(
        "timeClose",
        assignment.timeClose instanceof Date
          ? assignment.timeClose.toISOString()
          : assignment.timeClose
      );
      setValue("wordLimit", assignment.wordLimit);
      setValue("maxUploadedFile", assignment.maxUploadFiles);
      setValue("maxFileSize", assignment.maxFileSize);
      if (assignment.type === "BOTH") {
        setTextSubmission(true);
        setFileSubmission(true);
      } else if (assignment.type === "TEXT_ONLINE") {
        setTextSubmission(true);
        setFileSubmission(false);
      } else {
        setTextSubmission(false);
        setFileSubmission(true);
      }
      setExtFiles(
        assignment?.introAttachments.map((file) => {
          let f: File = new File([""], file.fileName, {
            type: file.mimetype,
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
        })
      );
    }
    setAllowSubmissionAfterEndTime(assignment?.allowSubmitLate ?? true);
  }, [assignment]);

  useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const header2Ref = useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({ ref: header2Ref });

  const maxNumberOfUploadedFilesOptionsData = Array.from({ length: 20 }, (_, index) => ({
    value: (index + 1).toString(),
    label: (index + 1).toString()
  }));

  const maxBytesList = [
    { value: "10", label: "10 KB" },
    { value: "50", label: "50 KB" },
    { value: "100", label: "100 KB" },
    { value: "500", label: "500 KB" },
    { value: "1000", label: "1 MB" },
    { value: "2000", label: "2 MB" },
    { value: "5000", label: "5 MB" },
    { value: "10000", label: "10 MB" },
    { value: "20000", label: "20 MB" },
    { value: "40000", label: "40 MB" }
  ];

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  return (
    <Grid className={classes.root}>
      <Header />
      <Box sx={{ marginTop: `${sidebarStatus.headerHeight}px` }} className={classes.container}>
        <Container>
          <Toolbar className={classes.toolBar}>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.management)}
                translation-key='common_course_management'
              >
                {t("common_course_management")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() =>
                  navigate(routes.lecturer.course.information.replace(":courseId", courseId ?? ""))
                }
              >
                {courseState.courseDetail?.name}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() =>
                  navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""))
                }
                translation-key='course_detail_assignment_list'
              >
                {t("course_detail_assignment_list")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              {assignment ? (
                <ParagraphSmall
                  colorname='--blue-500'
                  translation-key='assignment_management_update_assignment'
                >
                  {t("assignment_management_update_assignment")}
                </ParagraphSmall>
              ) : (
                <ParagraphSmall
                  colorname='--blue-500'
                  translation-key='assignment_management_create_assignment'
                >
                  {t("assignment_management_create_assignment")}
                </ParagraphSmall>
              )}
            </Box>
          </Toolbar>
          <form
            className={classes.mainContent}
            style={{
              height: `calc(100% - ${header2Height + sidebarStatus.headerHeight}px)`,
              marginTop: `${header2Height}px`
            }}
            onSubmit={handleSubmit(submitHandler)}
          >
            {assignment ? (
              <Heading2 translation-key='assignment_management_update_assignment'>
                {t("assignment_management_update_assignment")}
              </Heading2>
            ) : (
              <Heading2 translation-key='assignment_management_create_assignment'>
                {t("assignment_management_create_assignment")}
              </Heading2>
            )}

            <Box className={classes.generalInfo}>
              <Box display='flex' alignItems='center' margin={1}>
                {collapseOpen ? (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setCollapseOpen(!collapseOpen)}
                  >
                    <ExpandLessIcon style={{ fontSize: 30 }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setCollapseOpen(!collapseOpen)}
                  >
                    <NavigateNext style={{ fontSize: 30 }} />
                  </IconButton>
                )}
                <Heading3 fontWeight={500} translation-key='common_general'>
                  {t("common_general")}
                </Heading3>
              </Box>
              <Collapse in={collapseOpen} timeout='auto' unmountOnExit>
                <Box
                  display='flex'
                  flexDirection={"column"}
                  alignItems='center'
                  gap={2}
                  marginLeft={3}
                  marginBottom={2}
                >
                  <Controller
                    defaultValue=''
                    control={control}
                    name='name'
                    rules={{ required: true }}
                    render={({ field: { ref, ...field } }) => (
                      <InputTextFieldColumn
                        titleAlignment='horizontal'
                        error={Boolean(errors?.name)}
                        errorMessage={errors.name?.message}
                        title={t("common_assignment_name")}
                        type='text'
                        placeholder={t("common_assignment_enter_name")}
                        titleRequired={true}
                        translation-key={[
                          "common_assignment_name",
                          "common_assignment_enter_name",
                          "assignment_name_required"
                        ]}
                        inputRef={ref}
                        {...field}
                      />
                    )}
                  />
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}>
                      <ParagraphSmall translation-key='common_assignment_description'>
                        {t("common_assignment_description")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      className={classes.textEditor}
                      translation-key='common_enter_description'
                    >
                      <Controller
                        control={control}
                        name='intro'
                        render={({ field }) => (
                          <TextEditor
                            openDialog
                            roundedBorder
                            placeholder={t("common_enter_description") + "..."}
                            onChange={field.onChange}
                            value={field.value || ""} // use empty string as default value when field.value is null
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}>
                      <ParagraphSmall translation-key='common_assignment_guide'>
                        {t("common_assignment_guide")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      className={classes.textEditor}
                      translation-key='common_enter_guideline'
                    >
                      <Controller
                        control={control}
                        name='activity'
                        render={({ field }) => (
                          <TextEditor
                            openDialog
                            roundedBorder
                            placeholder={t("common_enter_guideline") + "..."}
                            {...field}
                            value={field.value || ""} // use empty string as default value when field.value is null
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}>
                      <ParagraphSmall translation-key='asingment_management_attach_file'>
                        {t("asingment_management_attach_file")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid item xs={9}>
                      <FileUploader extFiles={extFiles} setExtFiles={setExtFiles} />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
            <Divider />
            <Box className={classes.submissionTime}>
              <Box display='flex' alignItems='center' margin={1}>
                {submissionTimeCollapseOpen ? (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setSubmissionTimeCollapseOpen(!submissionTimeCollapseOpen)}
                  >
                    <ExpandLessIcon style={{ fontSize: 30 }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setSubmissionTimeCollapseOpen(!submissionTimeCollapseOpen)}
                  >
                    <NavigateNext style={{ fontSize: 30 }} />
                  </IconButton>
                )}
                <Heading3 translation-key='common_time_setting' fontWeight={500}>
                  {t("common_time_setting")}
                </Heading3>
              </Box>
              <Collapse in={submissionTimeCollapseOpen} timeout='auto' unmountOnExit>
                <Box
                  display='flex'
                  flexDirection={"column"}
                  alignItems='center'
                  gap={2}
                  marginLeft={3}
                  marginBottom={2}
                >
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}>
                      <ParagraphSmall translation-key='asingment_management_allow_time'>
                        {t("asingment_management_allow_time")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid item xs={9}>
                      <Controller
                        control={control}
                        name='timeOpen'
                        rules={{ required: true }}
                        render={({ field: { ref, ...field } }) => (
                          <CustomDateTimePicker
                            value={moment(field.value)}
                            onHandleValueChange={(newValue) => {
                              if (newValue) {
                                setValue("timeOpen", newValue.toISOString());
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}>
                      <ParagraphSmall translation-key='asingment_management_deadline'>
                        {t("asingment_management_deadline")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid item xs={9}>
                      <Controller
                        control={control}
                        name='timeClose'
                        rules={{ required: true }}
                        render={({ field: { ref, ...field } }) => (
                          <CustomDateTimePicker
                            value={moment(field.value)}
                            onHandleValueChange={(newValue) => {
                              if (newValue) {
                                setValue("timeClose", newValue.toISOString());
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={9}>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel
                          translation-key='common_allow_submission_after_end_time'
                          control={
                            <Checkbox
                              checked={allowSubmissionAfterEndTime}
                              onChange={(e) => setAllowSubmissionAfterEndTime(e.target.checked)}
                              name='textSubmission'
                            />
                          }
                          label={t("common_allow_submission_after_end_time")}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
            <Divider />
            <Box className={classes.submissionType}>
              <Box display='flex' alignItems='center' margin={1}>
                {submissionTypeCollapseOpen ? (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setSubmissionTypeCollapseOpen(!submissionTypeCollapseOpen)}
                  >
                    <ExpandLessIcon style={{ fontSize: 30 }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => setSubmissionTypeCollapseOpen(!submissionTypeCollapseOpen)}
                  >
                    <NavigateNext style={{ fontSize: 30 }} />
                  </IconButton>
                )}
                <Heading3 translation-key='common_submission_type' fontWeight={500}>
                  {t("common_submission_type")}
                </Heading3>
              </Box>
              <Collapse in={submissionTypeCollapseOpen} timeout='auto' unmountOnExit>
                <Box
                  display='flex'
                  flexDirection={"column"}
                  gap={2}
                  marginLeft={3}
                  marginBottom={2}
                >
                  <Grid container>
                    <Grid item xs={3} alignContent={"center"}>
                      <ParagraphSmall translation-key='common_submission_type'>
                        {t("common_submission_type")}
                      </ParagraphSmall>
                    </Grid>
                    <Grid item xs={9} style={{ position: "relative" }}>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel
                          translation-key='common_submission_type_online_text'
                          control={
                            <Checkbox
                              checked={textSubmission}
                              onChange={handleTextSubmissionChange}
                              name='textSubmission'
                            />
                          }
                          label={t("common_submission_type_online_text")}
                        />
                        <FormControlLabel
                          translation-key='common_submission_type_file'
                          control={
                            <Checkbox
                              checked={fileSubmission}
                              onChange={handleFileSubmissionChange}
                              name='fileSubmission'
                            />
                          }
                          label={t("common_submission_type_file")}
                        />
                      </FormGroup>
                      {shake && (
                        <Alert
                          className={shake ? classes.shake : classes.slideUp}
                          severity='error'
                          sx={{
                            position: "absolute",
                            top: -50,
                            zIndex: 9999 // Adjust the z-index as needed
                          }}
                        >
                          {"Hãy chọn loại bài tập"}
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                  {textSubmission && (
                    <Controller
                      control={control}
                      name='wordLimit'
                      render={({ field }) => (
                        <InputTextFieldColumn
                          translation-key='common_enter_word_limit'
                          widthInput='200px'
                          error={Boolean(errors?.wordLimit)}
                          errorMessage={errors.wordLimit?.message}
                          titleAlignment='horizontal'
                          title={t("common_word_limit")}
                          type='number'
                          placeholder={t("common_enter_word_limit")}
                          {...field}
                          value={field.value || ""} // use empty string as default value when field.value is null
                        />
                      )}
                    />
                  )}
                  {fileSubmission && (
                    <Grid container>
                      <Grid item xs={3} alignContent={"center"}>
                        <ParagraphSmall translation-key='common_max_upload_file'>
                          {t("common_max_upload_file")}
                        </ParagraphSmall>
                      </Grid>
                      <Grid item xs={9}>
                        <Controller
                          control={control}
                          defaultValue='40000'
                          name='maxUploadedFile'
                          render={({ field: { onChange, value } }) => (
                            <BasicSelect
                              labelId='maxUploadedFile'
                              width='50px'
                              borderRadius='12px'
                              title='Max number of uploaded files'
                              onHandleChange={onChange}
                              value={value}
                              items={maxNumberOfUploadedFilesOptionsData}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {fileSubmission && (
                    <Grid container>
                      <Grid item xs={3} alignContent={"center"}>
                        <ParagraphSmall translation-key='common_max_submission_file_size'>
                          {t("common_max_submission_file_size")}
                        </ParagraphSmall>
                      </Grid>
                      <Grid item xs={9}>
                        <Controller
                          control={control}
                          name='maxFileSize'
                          render={({ field: { onChange, value } }) => (
                            <BasicSelect
                              labelId='maxFileSize'
                              width='50px'
                              borderRadius='12px'
                              title='Maximum submission size'
                              value={value}
                              onHandleChange={onChange}
                              items={maxBytesList}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Controller
                    control={control}
                    name='maxScore'
                    render={({ field }) => (
                      <InputTextFieldColumn
                        widthInput='200px'
                        titleAlignment='horizontal'
                        title={t("assignment_management_max_score")}
                        type='number'
                        placeholder='Nhập điểm tối đa'
                        error={Boolean(errors.maxScore)}
                        errorMessage={errors.maxScore?.message}
                        {...field}
                      />
                    )}
                  />
                </Box>
              </Collapse>
            </Box>
            <Divider />
            <Box className={classes.action}>
              <Box display='flex' justifyContent='center' gap={2}>
                <LoadButton
                  variant='contained'
                  loading={loading}
                  type='submit'
                  translation-key='common_save'
                >
                  {t("common_save")}
                </LoadButton>
                <Button
                  type='button'
                  color='inherit'
                  onClick={() => navigate(routes.lecturer.course.assignment)}
                  translation-key='common_cancel'
                >
                  {t("common_cancel")}
                </Button>
              </Box>
            </Box>
          </form>
        </Container>
      </Box>
      <Snackbar
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
          {assignment ? t("update_successful_assignment") : t("create_successful_assignment")}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity='error' sx={{ width: "100%" }} onClose={() => setOpenErrorSnackbar(false)}>
          {t("create_failed_assignment")}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

import { Grid, Stack, Divider, Box, CircularProgress } from "@mui/material";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import CodeEditor from "components/editor/CodeEditor";
import CodeIcon from "@mui/icons-material/Code";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import ReactQuill from "react-quill";
import { decodeBase64 } from "utils/base64";
import { CodeQuestion } from "models/coreService/entity/QuestionEntity";
import { convert } from "html-to-text";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useMemo, useState } from "react";
import { feedbackCodeByAI, ISourceCodeSubmission } from "services/AIService/FeedbackCodeByAI";
import { ICodeQuestion } from "pages/client/user/DetailProblem/components/Submission/components/DetailSubmission";
import JoyButton from "@mui/joy/Button";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import { Controller, useForm } from "react-hook-form";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import TextEditor from "components/editor/TextEditor";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GradeSubmission } from "models/courseService/entity/SubmissionGradeEntity";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { routes } from "routes/routes";

interface Props {
  page: number;
  questionCode?: CodeQuestionEntity;
  coreQuestionCode: CodeQuestion;
  questionState?: any;
  isGraded?: boolean;
}

interface FormData {
  grade: number;
  feedback?: string;
}

const CodeExamQuestion = (props: Props) => {
  const { page, questionCode, questionState, isGraded, coreQuestionCode } = props;

  const { t } = useTranslation();
  const content = JSON.parse(questionState?.content || "{}");

  const navigate = useNavigate();
  const courseId = useParams<{ courseId: string }>().courseId;
  const examId = useParams<{ examId: string }>().examId;
  const [loading, setLoading] = useState(false);
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const [snackbarContent, setSnackbarContent] = useState<string>("");
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const submitHandler = async (data: any) => {
    setLoading(true);
    const formSubmitData: FormData = { ...data };
    const questionId = coreQuestionCode.question.id;
    const rightAnswer = "";
    const submission: GradeSubmission[] = [
      {
        examSubmissionId: submissionId || "",
        questionId,
        grade: formSubmitData.grade,
        rightAnswer,
        feedback: formSubmitData.feedback
      }
    ];

    QuestionSubmissionService.gradeQuestionSubmission(submission)
      .then((response) => {
        console.log("Grade updated successfully", response);
      })
      .catch((error) => {
        console.error("Failed to update grade", error);
        setSnackbarType(AlertType.Error);
        setSnackbarContent(t("update_grade_failed"));
      })
      .finally(() => {
        navigate(
          routes.lecturer.exam.grading
            .replace(":submissionId", submissionId || "")
            .replace(":examId", examId || "")
            .replace(":courseId", courseId || "")
        );
        setSnackbarType(AlertType.Success);
        setSnackbarContent(t("update_grade_success"));
        setOpenSnackbar(true);
        setLoading(false);
      });
  };

  const schema = useMemo(() => {
    return yup.object().shape({
      grade: yup.number().required().min(0).max(coreQuestionCode.question.defaultMark),
      feedback: yup.string()
    });
  }, [coreQuestionCode.question.defaultMark]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      grade: questionState?.grade || 0,
      feedback: questionState?.feedback || ""
    }
  });

  useEffect(() => {
    reset({
      grade: questionState?.grade || 0,
      feedback: questionState?.feedback || ""
    });
  }, [questionState, reset]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${page + 1}`}</Heading4>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={2}>
          <Box
            sx={{ backgroundColor: questionState?.answered ? "#e6eaf7" : "#FDF6EA" }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {questionState?.answered ? t("common_answer_saved") : t("common_not_answered")}
            </ParagraphBody>
          </Box>
          <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {isGraded
                ? `${t("achieved_mark")}: ${questionState?.grade.toFixed(2) || "0.00"} / ${coreQuestionCode.question.defaultMark.toFixed(2)}`
                : `${t("achieved_mark")}: ${t("common_not_graded")} / ${coreQuestionCode.question.defaultMark.toFixed(2)}`}
            </ParagraphBody>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Box id={classes.introduction}>
          <Box id={classes.courseDescription}>
            <Stack spacing={2}>
              <Box>
                <Heading3>{questionCode?.name}</Heading3>
                <ReactQuill
                  value={questionCode?.problemStatement || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>

              <Box>
                <Heading5>Input format</Heading5>
                <ReactQuill
                  value={questionCode?.inputFormat || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
                <Heading5>Output format</Heading5>
                <ReactQuill
                  value={questionCode?.outputFormat || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>

              <Box>
                <Heading5>Constraint</Heading5>
                <ReactQuill
                  value={questionCode?.constraints || ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
        <Stack display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("common_answer")}
          </ParagraphBody>
        </Stack>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            margin: "15px 0"
          }}
        >
          <Box
            display={"flex"}
            flexDirection='row'
            justifyContent={"space-between"}
            alignItems='center'
            sx={{
              backgroundColor: "var(--gray-1)",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              padding: "10px"
            }}
          >
            <CodeIcon />
          </Box>
          <Box
            sx={{
              height: "400px"
            }}
          >
            <CodeEditor
              highlightActiveLine
              autoFocus={false}
              maxHeight='400px'
              value={decodeBase64(content?.code || "")}
              readOnly
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={12} marginTop={2}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box>
            <Grid item xs={6}>
              <Controller
                name='grade'
                control={control}
                render={({ field }) => (
                  <InputTextFieldColumn
                    type='number'
                    title={t("common_grade")}
                    titleRequired={true}
                    useDefaultTitleStyle
                    error={Boolean(errors.grade)}
                    errorMessage={errors.grade?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} className={classes.textEditor}>
              <TitleWithInfoTip
                title={t("common_feedback")}
                titleRequired
                fontSize='12px'
                color='var(--gray-60)'
                gutterBottom
                fontWeight='600'
              />
              <Controller
                name='feedback'
                control={control}
                render={({ field }) => (
                  <TextEditor
                    openDialog
                    type='text'
                    title={t("common_feedback")}
                    roundedBorder={true}
                    required
                    placeholder={t("common_feedback")}
                    backgroundColor='white'
                    tooltipDescription={t("common_feedback")}
                    {...field}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </Grid>
            <LoadButton
              btnType={BtnType.Outlined}
              color='primary'
              style={{ marginTop: "30px" }}
              onClick={handleSubmit(submitHandler)}
              loading={loading}
            >
              {t("update_grade")}
            </LoadButton>
          </Box>
        </form>
      </Grid>
      <SnackbarAlert
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        type={snackbarType}
        content={snackbarContent}
      />
    </Grid>
  );
};

export default CodeExamQuestion;

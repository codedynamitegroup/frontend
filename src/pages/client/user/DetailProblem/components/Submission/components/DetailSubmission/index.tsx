import { Button, CircularProgress, Container, Grid } from "@mui/material";
import i18next from "i18next";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useRef } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import { ICodeQuestion, ISourceCodeSubmission, feedbackCodeByAI } from "services/FeedbackCodeByAI";
import { useState } from "react";

import MDEditor from "@uiw/react-md-editor";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { useAppSelector } from "hooks";
import { convert } from "html-to-text";
import { standardlizeUTCStringToLocaleString } from "utils/moment";

interface Props {
  handleSubmissionDetail: () => void;
  languageName: string;
  codeSubmissionDetail: CodeSubmissionDetailEntity | null;
  codeQuestion: CodeQuestionEntity;
}

export default function DetailSolution({
  handleSubmissionDetail,
  codeSubmissionDetail,
  languageName,
  codeQuestion
}: Props) {
  const { t } = useTranslation();

  const user = useAppSelector((state) => state.auth.currentUser);

  const sourceCodeSubmission: ISourceCodeSubmission = {
    source_code: codeSubmissionDetail?.bodyCode ?? "",
    language: languageName
  };
  const plainDescription = `
  ProblemStatement: ${convert(codeQuestion.problemStatement ?? "")}
  InputFormat: ${convert(codeQuestion.inputFormat ?? "")}
  OutputFormat: ${convert(codeQuestion.outputFormat ?? "")}
  Constraints: ${convert(codeQuestion.constraints ?? "")}
  `;
  console.log(codeSubmissionDetail?.bodyCode);
  const codeQuestionProblemStatement: ICodeQuestion = {
    title: codeQuestion.name,
    description: plainDescription
  };
  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  const [loading, setLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const [feedbackContent, setFeedbackContent] = useState<string>(``);
  const [chunckLoading, setChunkLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState<string>("");
  const [explainedCode, setExplainedCode] = useState<string>("");

  const handleFeedbackCodeByAI = async () => {
    setFeedbackContent(``); // Clear previous content
    setSuggestedCode(``);
    setExplainedCode(``);

    setChunkLoading(true);
    setLoading(true);

    try {
      let isFeedback = false;
      let isSugessted = false;
      let isExplainedCode = false;

      for await (const chunk of feedbackCodeByAI(
        sourceCodeSubmission,
        codeQuestionProblemStatement
      )) {
        if (chunk === "feedback_prompt") {
          isFeedback = true;
          isExplainedCode = false;
          isSugessted = false;

          continue;
        } else if (chunk === "suggested_code_prompt") {
          isFeedback = false;
          isSugessted = true;
          isExplainedCode = false;

          continue;
        } else if (chunk === "explained_code_prompt") {
          isSugessted = false;
          isFeedback = false;
          isExplainedCode = true;

          continue;
        }

        if (isFeedback) {
          setFeedbackContent((prev) => prev + chunk);
        } else if (isSugessted) {
          setSuggestedCode((prev) => prev + chunk);
        } else if (isExplainedCode) {
          setExplainedCode((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setLoading(false);
      setChunkLoading(false);
    }
  };

  const toDateFormate = (str: string | undefined, format: string) => {
    try {
      if (str === undefined) return str;

      return standardlizeUTCStringToLocaleString(str, format);
    } catch (err) {
      console.error(err);
      return str;
    }
  };

  return (
    <Grid className={classes.root}>
      <Box className={classes.stickyBack} ref={stickyBackRef}>
        <Box onClick={handleSubmissionDetail} className={classes.backButton}>
          <ArrowBackIcon className={classes.backIcon} />
          <span translation-key='common_back'>{t("common_back")}</span>
        </Box>
        <Divider />
      </Box>
      <Box
        className={classes.submissionContainer}
        style={{
          height: `calc(100% - ${stickyBackHeight}px)`
        }}
      >
        <Box className={classes.submissionInfo}>
          <Box className={classes.submissionTitle}>
            {codeSubmissionDetail && (
              <ParagraphBody
                fontWeight={"700"}
                colorname={
                  codeSubmissionDetail.gradingStatus === "GRADING"
                    ? "--orange-4"
                    : codeSubmissionDetail.description !== "Accepted"
                      ? "--red-error"
                      : "--green-600"
                }
              >
                {codeSubmissionDetail.gradingStatus === "GRADING"
                  ? codeSubmissionDetail.gradingStatus
                  : codeSubmissionDetail.description}
              </ParagraphBody>
            )}
            <Box className={classes.submissionAuthor}>
              <img src={user?.avatarUrl} alt='User' className={classes.avatar} />
              <ParagraphExtraSmall fontWeight={"700"}>
                {i18next.language === "vi"
                  ? `${user?.lastName ?? ""} ${user?.firstName ?? ""}`
                  : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              </ParagraphExtraSmall>
              <ParagraphExtraSmall translation-key='detail_problem_submission_detail_user_submission_time'>
                {t("detail_problem_submission_detail_user_submission_time", {
                  time: toDateFormate(codeSubmissionDetail?.createdAt, i18next.language) ?? "N/A",
                  interpolation: { escapeValue: false }
                })}
              </ParagraphExtraSmall>
            </Box>
          </Box>
          <Button
            variant='contained'
            color='primary'
            translation-key='detail_problem_submission_detail_share_solution'
          >
            {t("detail_problem_submission_detail_share_solution")}
          </Button>
        </Box>
        <Grid container className={classes.submissionStatistical}>
          <Grid item xs={5.75} className={classes.statisticalTime}>
            <Container className={classes.title}>
              <AccessTimeIcon />
              <ParagraphSmall
                colorname={"--white"}
                translation-key='detail_problem_submission_detail_runtime'
              >
                {t("detail_problem_submission_detail_runtime")}
              </ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                {codeSubmissionDetail?.avgRuntime ?? "N/A"}ms
              </ParagraphBody>
            </Container>
          </Grid>
          <Grid item xs={0.5} />
          <Grid item xs={5.75} className={classes.statisticalMemory}>
            <Container className={classes.title}>
              <MemoryIcon />
              <ParagraphSmall
                colorname={"--white"}
                translation-key='detail_problem_submission_detail_memory'
              >
                {t("detail_problem_submission_detail_memory")}
              </ParagraphSmall>
            </Container>
            <Container className={classes.data}>
              <ParagraphBody colorname={"--white"} fontSize={"20px"} fontWeight={"700"}>
                {codeSubmissionDetail?.avgMemory ?? "N/A"}MB
              </ParagraphBody>
            </Container>
          </Grid>
        </Grid>
        <Box className={classes.submissionText}>
          <Box className={classes.feedbackTitle}>
            <ParagraphBody
              fontWeight={700}
              translation-key='detail_problem_submission_detail_your_solution'
            >
              {t("detail_problem_submission_detail_your_solution")}
            </ParagraphBody>
            <LoadingButton
              loading={loading}
              variant='contained'
              color='primary'
              onClick={handleFeedbackCodeByAI}
            >
              {t("detail_submission_AI_evaluation")}
            </LoadingButton>
          </Box>
          <Box data-color-mode='light'>
            <MDEditor.Markdown source={"```java\n" + sourceCodeSubmission.source_code} />
          </Box>
        </Box>

        {feedbackContent && (
          <Box className={classes.submissionText}>
            {feedbackContent && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={feedbackContent} className={classes.markdown} />
              </Box>
            )}
            {suggestedCode && (
              <Box data-color-mode='light'>
                <MDEditor.Markdown source={"\n" + suggestedCode} />
              </Box>
            )}
            {explainedCode && (
              <>
                <Box data-color-mode='light'>
                  <MDEditor.Markdown source={explainedCode} className={classes.markdown} />
                </Box>
              </>
            )}
          </Box>
        )}
        {chunckLoading && <CircularProgress />}
      </Box>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={alertType}
        content={alertContent}
      />
    </Grid>
  );
}

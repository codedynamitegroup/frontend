import { Avatar, Button, CircularProgress, Container, Grid, TextField } from "@mui/material";
import i18next from "i18next";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useRef } from "react";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphExtraSmall from "components/text/ParagraphExtraSmall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import { ISourceCodeSubmission, feedbackCodeByAI } from "services/FeedbackCodeByAI";
import { useState } from "react";

import MDEditor from "@uiw/react-md-editor";
import LoadingButton from "@mui/lab/LoadingButton";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { useAppSelector } from "hooks";
import { convert } from "html-to-text";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { kiloByteToMegaByte, roundedNumber } from "utils/number";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import Heading5 from "components/text/Heading5";

interface Props {
  handleSubmissionDetail: () => void;
  languageName: string;
  codeSubmissionDetail: CodeSubmissionDetailEntity | null;
  codeQuestion: CodeQuestionEntity;
  isShareSolutionDisabled?: boolean;
}

export interface ICodeQuestion {
  title: string;
  description: string;
}

export default function DetailSolution({
  handleSubmissionDetail,
  codeSubmissionDetail,
  languageName,
  codeQuestion,
  isShareSolutionDisabled
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();
  const shareYourSolution = () => {
    if (problemId)
      navigate(routes.user.problem.solution.share.replace(":problemId", problemId), {
        state: {
          sourceCode: codeSubmissionDetail?.sourceCode ?? ""
        }
      });
  };

  const user = useAppSelector((state) => state.auth.currentUser);

  const sourceCodeSubmission: ISourceCodeSubmission = {
    source_code: codeSubmissionDetail?.sourceCode ?? "",
    language: languageName
  };
  const plainDescription = `
  ProblemStatement: ${convert(codeQuestion.problemStatement ?? "")}
  InputFormat: ${convert(codeQuestion.inputFormat ?? "")}
  OutputFormat: ${convert(codeQuestion.outputFormat ?? "")}
  Constraints: ${convert(codeQuestion.constraints ?? "")}
  `;

  const codeQuestionProblemStatement: ICodeQuestion = {
    title: codeQuestion.name,
    description: plainDescription
  };
  const stickyBackRef = useRef<HTMLDivElement>(null);
  const { height: stickyBackHeight } = useBoxDimensions({
    ref: stickyBackRef
  });
  const [loading, setLoading] = useState(false);
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
      let isSuggestedCode = false;
      let isExplainedCode = false;

      for await (const chunk of feedbackCodeByAI(
        sourceCodeSubmission,
        codeQuestionProblemStatement
      )) {
        if (chunk === "feedback_prompt") {
          isFeedback = true;
          isExplainedCode = false;
          isSuggestedCode = false;

          continue;
        } else if (chunk === "suggested_code_prompt") {
          isFeedback = false;
          isSuggestedCode = true;
          isExplainedCode = false;

          continue;
        } else if (chunk === "explained_code_prompt") {
          isSuggestedCode = false;
          isFeedback = false;
          isExplainedCode = true;

          continue;
        }

        if (isFeedback) {
          setFeedbackContent((prev) => prev + chunk);
        } else if (isSuggestedCode) {
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
              <Heading5
                fontWeight={600}
                colorname={
                  codeSubmissionDetail.gradingStatus === "GRADING"
                    ? "--orange-4"
                    : codeSubmissionDetail.description !== "Accepted"
                      ? "--red-error"
                      : "--green-600"
                }
              >
                {codeSubmissionDetail.gradingStatus === "GRADING" ||
                codeSubmissionDetail.description === undefined
                  ? codeSubmissionDetail.gradingStatus.replace("_", " ")
                  : codeSubmissionDetail.description}
              </Heading5>
            )}
            <Box className={classes.submissionAuthor}>
              <Avatar
                sx={{
                  bgcolor: `${generateHSLColorByRandomText(`${user?.firstName} ${user?.lastName}`)}`
                }}
                alt={user?.email}
                src={user?.avatarUrl}
              >
                {user?.firstName.charAt(0)}
              </Avatar>

              <ParagraphBody fontWeight={600}>
                {i18next.language === "vi"
                  ? `${user?.lastName ?? ""} ${user?.firstName ?? ""}`
                  : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              </ParagraphBody>
              <ParagraphBody translation-key='detail_problem_submission_detail_user_submission_time'>
                {t("detail_problem_submission_detail_user_submission_time", {
                  time: toDateFormate(codeSubmissionDetail?.createdAt, i18next.language) ?? "N/A",
                  interpolation: { escapeValue: false }
                })}
              </ParagraphBody>
            </Box>
          </Box>
          {isShareSolutionDisabled === true ? null : (
            <Button
              variant='contained'
              color='primary'
              translation-key='detail_problem_submission_detail_share_solution'
              onClick={shareYourSolution}
            >
              {t("detail_problem_submission_detail_share_solution")}
            </Button>
          )}
        </Box>
        {codeSubmissionDetail?.firstFailTestCase?.message &&
          codeSubmissionDetail.firstFailTestCase.message.length > 0 && (
            <Box className={classes.result} sx={styles.errorBox}>
              <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                Message
              </ParagraphBody>
              <TextField
                multiline
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                fullWidth
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.message ?? ""}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
        {codeSubmissionDetail?.firstFailTestCase?.stderr &&
          codeSubmissionDetail.firstFailTestCase.stderr.length > 0 && (
            <Box className={classes.result} sx={styles.errorBox}>
              <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                Stderr
              </ParagraphBody>
              <TextField
                multiline
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                fullWidth
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.stderr.length}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
        {codeSubmissionDetail?.firstFailTestCase?.compileOutput &&
          codeSubmissionDetail.firstFailTestCase.compileOutput.length > 0 && (
            <Box className={classes.result} sx={styles.errorBox}>
              <ParagraphBody fontWeight={1000} colorname={"--red-text"}>
                Complie output
              </ParagraphBody>
              <TextField
                multiline
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                fullWidth
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.compileOutput}
                variant='standard'
                inputProps={{ style: { color: "var(--red-text)" } }}
              />
            </Box>
          )}
        {codeSubmissionDetail?.firstFailTestCase &&
          codeSubmissionDetail.description !== "Compilation Error" && (
            <Box sx={{ marginY: 1 }}>
              <ParagraphBody
                fontWeight={700}
                translation-key='detail_problem_submission_failed_test_case'
              >
                {t("detail_problem_submission_failed_test_case")}
              </ParagraphBody>
            </Box>
          )}

        {codeSubmissionDetail?.firstFailTestCase?.input &&
          codeSubmissionDetail.description !== "Compilation Error" && (
            <Box className={classes.result}>
              <ParagraphExtraSmall translation-key='detail_problem_input'>
                {t("detail_problem_input")}
                {": "}
              </ParagraphExtraSmall>
              <TextField
                multiline
                InputProps={{ readOnly: true }}
                fullWidth
                id='outlined-basic'
                variant='outlined'
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.input}
              />
            </Box>
          )}
        {codeSubmissionDetail?.firstFailTestCase?.output &&
          codeSubmissionDetail.description !== "Compilation Error" && (
            <Box className={classes.result}>
              <ParagraphExtraSmall translation-key='detail_problem_output'>
                {t("detail_problem_output")}
                {": "}
              </ParagraphExtraSmall>
              <TextField
                multiline
                fullWidth
                InputProps={{ readOnly: true }}
                id='outlined-basic'
                variant='outlined'
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.output}
              />
            </Box>
          )}
        {codeSubmissionDetail?.firstFailTestCase?.actualOutput &&
          codeSubmissionDetail.description !== "Compilation Error" && (
            <Box className={classes.result}>
              <ParagraphExtraSmall translation-key='detail_problem_actual_result'>
                {t("detail_problem_actual_result")}
                {": "}
              </ParagraphExtraSmall>
              <TextField
                multiline
                InputProps={{ readOnly: true }}
                fullWidth
                id='outlined-basic'
                variant='outlined'
                size='small'
                className={classes.input}
                value={codeSubmissionDetail.firstFailTestCase.actualOutput}
              />
            </Box>
          )}
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
                {roundedNumber(codeSubmissionDetail?.avgRuntime, 3) ?? "N/A"}
                {codeSubmissionDetail?.avgRuntime !== undefined ? "ms" : ""}
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
                {roundedNumber(kiloByteToMegaByte(codeSubmissionDetail?.avgMemory), 3) ?? "N/A"}{" "}
                {codeSubmissionDetail?.avgMemory !== undefined ? "MB" : ""}
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
            <MDEditor.Markdown source={"```\n" + sourceCodeSubmission.source_code} />
          </Box>
        </Box>

        <Box className={classes.submissionText}>
          {feedbackContent && (
            <Box data-color-mode='light'>
              <MDEditor.Markdown
                source={feedbackContent.replaceAll("```", "")}
                className={classes.markdown}
              />
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
                <MDEditor.Markdown
                  source={explainedCode.replaceAll("```", "")}
                  className={classes.markdown}
                />
              </Box>
            </>
          )}
        </Box>
        {chunckLoading && <CircularProgress />}
      </Box>
    </Grid>
  );
}
const styles = {
  errorBox: {
    backgroundColor: "var(--red-background)",
    borderRadius: 1,
    paddingX: 1
  }
};

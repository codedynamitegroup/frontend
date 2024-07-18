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
import { useState } from "react";
import { feedbackCodeByAI, ISourceCodeSubmission } from "services/AIService/FeedbackCodeByAI";
import { ICodeQuestion } from "pages/client/user/DetailProblem/components/Submission/components/DetailSubmission";
import JoyButton from "@mui/joy/Button";

interface Props {
  page: number;
  questionCode?: CodeQuestionEntity;
  coreQuestionCode: CodeQuestion;
  questionState?: any;
  isGraded?: boolean;
}

const CodeExamQuestion = (props: Props) => {
  const { page, questionCode, questionState, isGraded, coreQuestionCode } = props;
  const plainDescription = `
  ProblemStatement:
	""
	${convert(questionCode?.problemStatement ?? "")}
	""

  InputFormat:
	""
	${convert(questionCode?.inputFormat ?? "")}
	""

  OutputFormat: 
	""
	${convert(questionCode?.outputFormat ?? "")}
	""

  Constraints:
	""
	${convert(questionCode?.constraints ?? "")}
	""
  `;

  const { t } = useTranslation();
  const content = JSON.parse(questionState?.content || "{}");

  const [feedbackContent, setFeedbackContent] = useState<string>(``);
  const [chunckLoading, setChunkLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState<string>("");
  const [explainedCode, setExplainedCode] = useState<string>("");

  const sourceCodeSubmission: ISourceCodeSubmission = {
    source_code: decodeBase64(content?.code || ""),
    language: "Java"
  };

  const codeQuestionProblemStatement: ICodeQuestion = {
    title: questionCode?.name || "",
    description: plainDescription
  };

  const handleFeedbackCodeByAI = async () => {
    setFeedbackContent(``); // Clear previous content
    setSuggestedCode(``);
    setExplainedCode(``);

    setChunkLoading(true);

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
      setChunkLoading(false);
    }
  };

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
          <JoyButton loading={chunckLoading} color='primary' onClick={handleFeedbackCodeByAI}>
            {t("detail_submission_AI_evaluation")}
          </JoyButton>
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
        {/* Feedback */}
        {(feedbackContent || suggestedCode || explainedCode) && (
          <>
            <Heading5 translation-key='common_feedback_by_ai'>
              {t("common_feedback_by_ai")}
            </Heading5>
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
              {chunckLoading && <CircularProgress />}
            </Box>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default CodeExamQuestion;

import { Grid, Stack, Divider, Box } from "@mui/material";
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

interface Props {
  page: number;
  questionCode?: CodeQuestionEntity;
  questionState?: any;
}

const CodeExamQuestion = (props: Props) => {
  const { page, questionCode, questionState } = props;
  const { t } = useTranslation();
  const content = JSON.parse(questionState?.content || "{}");

  console.log(content);

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
              {t("common_score_can_achieve")}
              {": "}
              {/* {questionShortAnswer.question.defaultMark} */}
              MARK STRING
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
        <ParagraphBody fontSize={".875rem"} textAlign={"left"} fontWeight={"600"} color={"#212121"}>
          {t("common_answer")}
        </ParagraphBody>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px"
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
              height: "400px",
              padding: "10px"
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
    </Grid>
  );
};

export default CodeExamQuestion;

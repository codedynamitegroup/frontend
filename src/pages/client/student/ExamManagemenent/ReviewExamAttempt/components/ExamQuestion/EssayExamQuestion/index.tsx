import { Box, Grid, Stack, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { Textarea } from "@mui/joy";
import { EssayQuestion } from "models/coreService/entity/QuestionEntity";

import { GetQuestionSubmissionEntity } from "models/courseService/entity/QuestionSubmissionEntity";
import { FileCard } from "@files-ui/react";

interface EssayExamQuestionProps {
  questionEssayQuestion: EssayQuestion;
  questionIndex: number;
  questionSubmitContent?: GetQuestionSubmissionEntity;
}

const EssayExamQuestion = (props: EssayExamQuestionProps) => {
  const { questionEssayQuestion, questionIndex, questionSubmitContent } = props;
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${questionIndex + 1}`}</Heading4>
          {/* <Button
            variant={isFlagged ? "soft" : "outlined"}
            color='primary'
            startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
            onClick={flagQuestionHandle}
          >
            {isFlagged ? t("common_remove_flag") : t("common_flag")}
          </Button> */}
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={2}>
          <Box
            sx={{
              backgroundColor: questionSubmitContent?.answerStatus ? "#e6eaf7" : "#FDF6EA"
            }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {questionSubmitContent?.answerStatus
                ? t("common_answered")
                : t("common_not_answered")}
            </ParagraphBody>
          </Box>
          <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {t("common_score_can_achieve")}
              {": "}
              {questionEssayQuestion.question.defaultMark}
            </ParagraphBody>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Box>
          <ParagraphBody
            sx={{
              padding: 0,
              height: "fit-content"
            }}
            className='ql-editor'
            fontSize={"1rem"}
            textAlign={"left"}
            fontWeight={"400"}
            color={"#212121"}
            lineHeight={"1.5"}
            dangerouslySetInnerHTML={{
              __html: questionEssayQuestion.question.questionText
            }}
          />
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("common_answer")}
          </ParagraphBody>
          {questionEssayQuestion.responseFormat === "editor" && (
            <ParagraphBody
              sx={{
                minHeight: "200px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "10px"
              }}
              className='ql-editor'
              fontSize={"1rem"}
              textAlign={"left"}
              fontWeight={"400"}
              color={"#212121"}
              lineHeight={"1.5"}
              dangerouslySetInnerHTML={{
                __html: questionSubmitContent?.content || ""
              }}
            />
          )}
          {questionEssayQuestion.responseFormat === "plain" && (
            <Textarea
              defaultValue={questionSubmitContent?.content}
              minRows={"10"}
              maxRows={questionEssayQuestion.responseFieldLines}
            />
          )}
        </Box>
      </Grid>

      {(questionEssayQuestion.responseFormat === "no_online" ||
        questionEssayQuestion.attachments !== 0) && (
        <Grid item xs={12}>
          <Grid container gap={1}>
            {questionSubmitContent?.files?.map((file, index) => (
              <Grid>
                <FileCard
                  id={file.fileUrl}
                  key={index}
                  name={file.fileName}
                  downloadUrl={file.fileUrl}
                  type={file.fileType}
                  size={file.fileSize}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default EssayExamQuestion;

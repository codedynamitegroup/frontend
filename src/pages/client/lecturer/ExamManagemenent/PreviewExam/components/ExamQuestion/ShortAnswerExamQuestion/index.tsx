import { Textarea } from "@mui/joy";
import { Grid, Stack, Divider, Box } from "@mui/material";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { ShortAnswerQuestion } from "models/coreService/entity/ShortAnswerQuestionEntity";

interface ShortAnswerExamQuestionProps {
  readOnly?: boolean;
  questionShortAnswer: ShortAnswerQuestion;
  questionSubmitContent?: any;
  questionIndex: number;
}

const ShortAnswerExamQuestion = (props: ShortAnswerExamQuestionProps) => {
  const { t } = useTranslation();
  const { questionShortAnswer, questionSubmitContent, questionIndex } = props;

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
              backgroundColor:
                questionSubmitContent && questionSubmitContent.content !== ""
                  ? "#e6eaf7"
                  : "#FDF6EA"
            }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {questionSubmitContent && questionSubmitContent.content !== ""
                ? t("common_answered")
                : t("common_not_answered")}
            </ParagraphBody>
          </Box>
          <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {t("common_score_can_achieve")}
              {": "}
              {questionShortAnswer.question.defaultMark}
            </ParagraphBody>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
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
            __html: questionShortAnswer.question.questionText
          }}
        />
        <ParagraphBody fontSize={".875rem"} textAlign={"left"} fontWeight={"600"} color={"#212121"}>
          {t("common_answer")}
        </ParagraphBody>
        <Textarea
          sx={{
            "& .MuiTextarea-textarea.Mui-disabled": {
              color: "#212121"
            },
            marginBottom: 1,
            backgroundColor: questionSubmitContent?.content !== "" ? "" : "#feeded"
          }}
          defaultValue={questionSubmitContent?.content}
          minRows={1}
          maxRows={1}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default ShortAnswerExamQuestion;

import { Box, Grid, Stack, Divider } from "@mui/material";
import { Card } from "@mui/joy";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import { MultiChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
import { GetQuestionSubmissionEntity } from "models/courseService/entity/QuestionSubmissionEntity";
import { useEffect, useState } from "react";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";

interface PreviewMultipleChoiceProps {
  questionIndex: number;
  questionSubmitContent?: GetQuestionSubmissionEntity;
  questionTrueFalse: MultiChoiceQuestion;
  isGraded?: boolean;
}

const TrueFalseExamQuestion = (props: PreviewMultipleChoiceProps) => {
  const { questionIndex, questionSubmitContent, questionTrueFalse, isGraded } = props;
  const { t } = useTranslation();
  const answerList = [
    {
      value: "true",
      label: t("common_true")
    },
    {
      value: "false",
      label: t("common_false")
    }
  ];
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  useEffect(() => {
    if (!questionSubmitContent) return;

    if (questionSubmitContent.content === questionTrueFalse?.question?.answers?.[0].answer)
      setIsCorrectAnswer(true);
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${questionIndex + 1}`}</Heading4>
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
              {isGraded
                ? `${t("achieved_mark")}: ${questionSubmitContent?.grade.toFixed(2) || "0.00"} / ${questionTrueFalse.question.defaultMark.toFixed(2)}`
                : `${t("achieved_mark")}: ${t("common_not_graded")} / ${questionTrueFalse.question.defaultMark.toFixed(2)}`}
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
            __html: questionTrueFalse.question.questionText
          }}
        />
        {Boolean(questionTrueFalse.showStandardInstructions) && (
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("course_management_exam_preview_multichoice")}
          </ParagraphBody>
        )}
        <JoyRadioGroup
          color='primary'
          onChange={() => {}}
          value={questionSubmitContent?.content || ""}
          values={answerList}
          orientation='vertical'
          size='md'
          fontSize='.8rem'
          fontWeight='400'
          overlay
          disabled
        />
      </Grid>
      {isGraded && (
        <Grid item xs={12}>
          <Card variant='soft' color={isCorrectAnswer ? "success" : "danger"}>
            {isCorrectAnswer && (
              <Box display={"flex"} flexDirection='row' alignItems={"center"}>
                <SentimentSatisfiedAltRoundedIcon
                  sx={{
                    fontSize: "1.5rem",
                    marginRight: ".5rem"
                  }}
                />
                <Heading6>"Thats correct!"</Heading6>
              </Box>
            )}
            {questionTrueFalse?.question?.generalFeedback && (
              <ParagraphSmall>{questionTrueFalse?.question?.generalFeedback}</ParagraphSmall>
            )}
            {!isCorrectAnswer && (
              <Box display={"flex"} flexDirection='row' alignItems={"center"}>
                <SentimentDissatisfiedRoundedIcon
                  sx={{
                    fontSize: "1.5rem",
                    marginRight: ".5rem"
                  }}
                />
                <Heading6>"Wrong!!"</Heading6>
              </Box>
            )}

            <ParagraphSmall>
              {`The correct answer is: ${
                questionTrueFalse?.question?.answers?.[0].answer === "true"
                  ? t("common_true")
                  : t("common_false")
              }`}
            </ParagraphSmall>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default TrueFalseExamQuestion;

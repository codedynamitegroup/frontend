import { Textarea, Card } from "@mui/joy";
import { Grid, Stack, Divider, Box } from "@mui/material";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { ShortAnswerQuestion } from "models/coreService/entity/ShortAnswerQuestionEntity";
import { GetQuestionSubmissionEntity } from "models/courseService/entity/QuestionSubmissionEntity";
import { useEffect, useState } from "react";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";

interface ShortAnswerExamQuestionProps {
  readOnly?: boolean;
  questionShortAnswer: ShortAnswerQuestion;
  questionSubmitContent?: GetQuestionSubmissionEntity;
  questionIndex: number;
  isGraded?: boolean;
}

const ShortAnswerExamQuestion = (props: ShortAnswerExamQuestionProps) => {
  const { t } = useTranslation();
  const { questionShortAnswer, questionSubmitContent, questionIndex, isGraded } = props;
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [correctAnswerList, setCorrectAnswerList] = useState<string[]>([]);

  useEffect(() => {
    if (!questionSubmitContent || questionShortAnswer.question.answers === undefined) return;

    const isCorrect = checkAnswer(
      questionSubmitContent.content,
      questionShortAnswer.question.answers,
      questionShortAnswer.caseSensitive || false
    );
    setIsCorrectAnswer(isCorrect);
    setCorrectAnswerList(
      questionShortAnswer.question.answers
        .filter((answer: AnswerOfQuestion) => answer.fraction === 1)
        .map((answer: AnswerOfQuestion) => answer.id)
    );
  }, [
    questionShortAnswer.caseSensitive,
    questionShortAnswer.question.answers,
    questionSubmitContent
  ]);

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
                ? `${t("achieved_mark")}: ${questionSubmitContent?.grade.toFixed(2) || "0.00"} / ${questionShortAnswer.question.defaultMark.toFixed(2)}`
                : `${t("achieved_mark")}: ${t("common_not_graded")} / ${questionShortAnswer.question.defaultMark.toFixed(2)}`}
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
            backgroundColor: questionSubmitContent?.answerStatus ? "" : "#feeded"
          }}
          defaultValue={questionSubmitContent?.content}
          minRows={1}
          maxRows={1}
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
            {questionShortAnswer?.question?.generalFeedback && (
              <ParagraphSmall>{questionShortAnswer?.question?.generalFeedback}</ParagraphSmall>
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
            <ParagraphSmall>{`${correctAnswerList?.length > 1 ? t("correct_answer_plural") : t("correct_answer_non_plural")}: `}</ParagraphSmall>
            {correctAnswerList?.map((answer) => (
              <ParagraphSmall key={answer}>
                {questionShortAnswer?.question?.answers?.find((item) => item.id === answer)?.answer}
              </ParagraphSmall>
            ))}
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

const checkAnswer = (value: string, contentList: AnswerOfQuestion[], caseSensitive: boolean) => {
  const correctAnswerList = contentList
    .filter((item) => item.fraction === 1)
    .map((item) => item.id);
  let inputValueId = "";
  if (caseSensitive) inputValueId = contentList.find((item) => item.answer === value)?.id || "";
  else
    inputValueId =
      contentList.find((item) => item.answer.toLowerCase() === value.toLowerCase())?.id || "";

  return correctAnswerList.includes(inputValueId);
};

export default ShortAnswerExamQuestion;

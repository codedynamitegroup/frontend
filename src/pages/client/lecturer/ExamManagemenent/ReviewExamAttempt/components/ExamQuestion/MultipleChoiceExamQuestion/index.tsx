import { Box, Grid, Stack, Divider } from "@mui/material";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
import { useTranslation } from "react-i18next";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import Sheet from "@mui/joy/Sheet";
import { Checkbox, Card } from "@mui/joy";
import { GetQuestionSubmissionEntity } from "models/courseService/entity/QuestionSubmissionEntity";
import { useEffect, useState } from "react";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";

interface MultipleChoiceExamQuestionProps {
  questionIndex: number;
  questionMultiChoice: MultiChoiceQuestion;
  questionSubmitContent?: GetQuestionSubmissionEntity;
  isGraded?: boolean;
}

const MultipleChoiceExamQuestion = (props: MultipleChoiceExamQuestionProps) => {
  const { t } = useTranslation();
  const { questionIndex, questionMultiChoice, questionSubmitContent, isGraded } = props;

  const answerList = questionMultiChoice.question.answers?.map((answer: any) => ({
    value: answer.id,
    label: answer.answer
  }));
  const [correctAnswerList, setCorrectAnswerList] = useState<string[]>([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<number>(0);

  useEffect(() => {
    if (
      !questionMultiChoice ||
      !questionSubmitContent ||
      questionMultiChoice.question.answers === undefined
    )
      return;
    setCorrectAnswerList(
      questionMultiChoice?.question?.answers
        .filter((answer: AnswerOfQuestion) => answer.fraction > 0)
        .map((answer: AnswerOfQuestion) => answer.id)
    );
  }, [questionMultiChoice, questionSubmitContent]);

  useEffect(() => {
    if (!correctAnswerList || !questionSubmitContent) return;

    const submittedAnswerList = questionSubmitContent.content.split(",");
    setIsCorrectAnswer(
      checkCorrectAnswer(questionMultiChoice.single, correctAnswerList, submittedAnswerList)
    );
  }, [correctAnswerList]);

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
                ? `${t("achieved_mark")}: ${questionSubmitContent?.grade.toFixed(2) || "0.00"} / ${questionMultiChoice.question.defaultMark.toFixed(2)}`
                : `${t("achieved_mark")}: ${t("common_not_graded")} / ${questionMultiChoice.question.defaultMark.toFixed(2)}`}
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
            __html: questionMultiChoice.question.questionText
          }}
        />

        {Boolean(questionMultiChoice.showStandardInstructions) && (
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {`
            ${
              questionMultiChoice.single
                ? t("course_management_exam_preview_multichoice")
                : t("course_management_exam_preview_multichoice_multiple")
            }:`}
          </ParagraphBody>
        )}
        {Boolean(questionMultiChoice.single) ? (
          <JoyRadioGroup
            color='primary'
            value={questionSubmitContent?.content || ""}
            onChange={() => {}}
            disabled
            values={answerList}
            orientation='vertical'
            size='md'
            numbering={questionMultiChoice.answerNumbering}
            fontSize='.8rem'
            fontWeight='400'
            overlay
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "& > div": { p: 1, borderRadius: "12px", display: "flex" }
            }}
          >
            {/* Value is ID */}
            {answerList?.map((answer: any) => (
              <Sheet variant='outlined' key={answer.value}>
                <Checkbox
                  disabled
                  onChange={() => {}}
                  value={answer.value}
                  checked={questionSubmitContent?.content.includes(answer.value)}
                  size='sm'
                  overlay
                  label={
                    <ParagraphBody textAlign={"center"} fontSize='.8rem' fontWeight='400'>
                      {answer.label}
                    </ParagraphBody>
                  }
                />
              </Sheet>
            ))}
          </Box>
        )}
      </Grid>
      {isGraded && (
        <>
          <Grid item xs={12}>
            <Card
              variant='soft'
              color={
                isCorrectAnswer === 1 ? "success" : isCorrectAnswer === 2 ? "warning" : "danger"
              }
            >
              {isCorrectAnswer === 1 && (
                <Box display={"flex"} flexDirection='row' alignItems={"center"}>
                  <SentimentSatisfiedAltRoundedIcon
                    sx={{
                      fontSize: "1.5rem",
                      marginRight: ".5rem"
                    }}
                  />
                  <Heading6>{questionMultiChoice?.correctFeedback || "Thats correct!"}</Heading6>
                </Box>
              )}
              {isCorrectAnswer === 0 && (
                <Box display={"flex"} flexDirection='row' alignItems={"center"}>
                  <SentimentDissatisfiedRoundedIcon
                    sx={{
                      fontSize: "1.5rem",
                      marginRight: ".5rem"
                    }}
                  />
                  <Heading6>{questionMultiChoice?.incorrectFeedback || "Wrong!!"}</Heading6>
                </Box>
              )}
              {isCorrectAnswer === 2 && (
                <Box display={"flex"} flexDirection='row' alignItems={"center"}>
                  <SentimentDissatisfiedRoundedIcon
                    sx={{
                      fontSize: "1.5rem",
                      marginRight: ".5rem"
                    }}
                  />
                  <Heading6>
                    {questionMultiChoice?.partiallyCorrectFeedback || "Partially correct!"}
                  </Heading6>
                </Box>
              )}
              {questionMultiChoice?.question?.generalFeedback && (
                <ParagraphSmall>{questionMultiChoice?.question?.generalFeedback}</ParagraphSmall>
              )}
              <ParagraphSmall fontWeight={"500"}>
                {`${questionMultiChoice?.single ? t("correct_answer_non_plural") : t("correct_answer_plural")}:`}
              </ParagraphSmall>
              {correctAnswerList?.map((answer) => (
                <ParagraphSmall key={answer}>
                  {answerList?.find((item) => item.value === answer)?.label}
                </ParagraphSmall>
              ))}
            </Card>
          </Grid>
          {questionSubmitContent?.feedback && (
            <Grid item xs={12}>
              <Heading6>{t("common_teacher_feedback")}</Heading6>
              <Card variant='soft'>
                <ParagraphSmall>{questionSubmitContent?.feedback}</ParagraphSmall>
              </Card>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

const checkCorrectAnswer = (
  single: boolean,
  correctAnswerList: string[],
  selectedAnswerList: string[]
): number => {
  if (single) {
    return correctAnswerList.includes(selectedAnswerList[0]) ? 1 : 0;
  } else {
    // Only check box can select multi answer --> can partially correct
    let isPartialCorrect = false;
    for (const answer of selectedAnswerList) {
      if (correctAnswerList.includes(answer)) {
        isPartialCorrect = true;
        break; // Breaks out of the loop when a correct answer is found
      }
    }

    return correctAnswerList.sort().join(",") === selectedAnswerList.sort().join(",")
      ? 1 // Fully correct
      : isPartialCorrect
        ? 2 // Partial correct
        : 0; // Incorrect
  }
};

export default MultipleChoiceExamQuestion;

import { Box, Grid, Stack, Divider, TextField } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Button from "@mui/joy/Button";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { useTranslation } from "react-i18next";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import Sheet from "@mui/joy/Sheet";
import { Checkbox } from "@mui/joy";
import { setAnswered, setFlag } from "reduxes/TakeExam";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { QuestionService } from "services/coreService/QuestionService";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";

interface MultipleChoiceExamQuestionProps {
  questionIndex: number;
  questionMultiChoice: MultiChoiceQuestion;
  questionSubmitContent: any;
  questionId: string;
}

const MultipleChoiceExamQuestion = (props: MultipleChoiceExamQuestionProps) => {
  const { t } = useTranslation();
  const { questionIndex, questionMultiChoice, questionSubmitContent } = props;

  const answerList = questionMultiChoice.question.answers?.map((answer: any) => ({
    value: answer.id,
    label: answer.answer
  }));

  const [answerOfQuestions, setAnswerOfQuestion] = useState<AnswerOfQuestion[]>([]);
  const [mark, setMark] = useState<number>(0);


  const handleGetAnsweryQuestionId = (questionId: string) => {
    QuestionService.getAnswerByQuestionId(questionId)
      .then((res) => {
        const data = res.filter((item: AnswerOfQuestion) => item.fraction !== 0);
        setAnswerOfQuestion(data);
        const matchedAnswer = data.find(
          (item: AnswerOfQuestion) => item.answer === questionSubmitContent.content
        );
        if (matchedAnswer) {
          const defaultMark = questionMultiChoice.question.defaultMark;
          setMark(matchedAnswer.fraction * defaultMark);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("done");
      });
  };

  useEffect(() => {
    handleGetAnsweryQuestionId(props.questionId);
  }, []);

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
              {questionMultiChoice.question.defaultMark}
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
            value={questionSubmitContent?.content}
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
            {answerList?.map((answer: any) => {
              const isCorrectAnswer = answerOfQuestions.some(
                (a) => a.questionId === answer.question.id
              );
              const sheetClassName = isCorrectAnswer ? "correct-answer" : "default-background";
              return (
                <div key={answer.value} className={sheetClassName}>
                  <Checkbox
                    disabled
                    onChange={() => {}}
                    value={answer.value}
                    checked={questionSubmitContent?.content.includes(answer.value)}
                    overlay
                    label={
                      <ParagraphBody textAlign='center' fontSize='.8rem' fontWeight='400'>
                        {answer.label}
                      </ParagraphBody>
                    }
                  />
                </div>
              );
            })}
          </Box>
        )}
      </Grid>
      <Grid item xs={12} md={12} marginTop={2}>
        <Stack direction={"row"} spacing={2}>
          <Box
            sx={{
              backgroundColor: "#f5f5f5"
            }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
             {t("correct_answer")}
            </ParagraphBody>
          </Box>
        </Stack>

        {answerOfQuestions.map((answer: any) => (
          <Sheet
            variant='outlined'
            key={answer.id}
            sx={{ backgroundColor: "#e6f4ea", marginTop: 1 }}
          >
            <Checkbox
              disabled
              onChange={() => {}}
              value={answer.id}
              checked={true}
              size='sm'
              overlay
              label={
                <ParagraphBody textAlign={"center"} fontSize='.8rem' fontWeight='400'>
                  {answer.answer}
                </ParagraphBody>
              }
            />
          </Sheet>
        ))}

        <Stack direction={"row"} spacing={2} marginTop={2}>
          <TextField
            id='outlined-basic'
            label={t("common_grade")}
            variant='outlined'
            size='small'
            value={mark}
            onChange={(e) => {
              setMark(Number(e.target.value));
            }}
          />
          <Button color='primary'>{t("update_grade")}</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MultipleChoiceExamQuestion;

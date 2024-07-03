import CloseIcon from "@mui/icons-material/Close";
import { Button, Card, Checkbox, Sheet } from "@mui/joy";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Skeleton,
  Divider
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import React, { useEffect, useState } from "react";
import PreviewQuestionSkeleton from "../PreviewSkeleton";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { QuestionService } from "services/coreService/QuestionService";
import qtype from "utils/constant/Qtype";
import "./index.scss";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import Heading6 from "components/text/Heading6";
import ParagraphSmall from "components/text/ParagraphSmall";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import { MultiChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";

interface PreviewMultipleChoiceProps extends DialogProps {
  questionId: string;
  readOnly?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewMultipleChoice = ({
  questionId,
  setOpen,
  readOnly,
  ...props
}: PreviewMultipleChoiceProps) => {
  const { t } = useTranslation();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [answered, setIsAnswered] = useState(false);
  const [multipleChoiceQuestionDetail, setMultipleChoiceQuestionDetail] =
    useState<MultiChoiceQuestion>();
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswerList, setCorrectAnswerList] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState<{ label: string; value: string }[]>([]);
  const [checkBoxValue, setCheckBoxValue] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState<string>("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<number>(0);

  const handleGetMultiChoiceQuestionDetail = async () => {
    try {
      const questionCommands: PostQuestionDetailList = {
        questionCommands: [
          {
            questionId: questionId,
            qtype: qtype.multiple_choice.code
          }
        ]
      };

      const response = await QuestionService.getQuestionDetail(questionCommands);
      setShowSkeleton(false);

      return response;
    } catch (error) {
      setOpen(false);
      setShowSkeleton(false);

      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await handleGetMultiChoiceQuestionDetail();
      setMultipleChoiceQuestionDetail(res.questionResponses[0].qtypeMultichoiceQuestion);

      setCorrectAnswerList(
        res.questionResponses[0].qtypeMultichoiceQuestion.question.answers
          .filter((answer: AnswerOfQuestion) => answer.fraction > 0)
          .map((answer: AnswerOfQuestion) => answer.id)
      );

      setAnswerList(
        res.questionResponses[0].qtypeMultichoiceQuestion.question.answers.map(
          (answer: AnswerOfQuestion) => ({
            label: answer.answer,
            value: answer.id
          })
        )
      );
    };
    fetchData();
  }, []);

  const handleStartAgain = () => {
    setCheckBoxValue([]);
    setRadioValue("");

    setShowCorrectAnswer(false);
  };

  const handleRadioChange = (value: string) => {
    setIsAnswered(true);
    setRadioValue(value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsAnswered(true);
      setCheckBoxValue([...checkBoxValue, event.target.value]);
    } else {
      setCheckBoxValue(checkBoxValue.filter((uuid) => uuid !== event.target.value));
    }
  };

  const handleCheckResult = () => {
    console.log("Check result");

    if (multipleChoiceQuestionDetail?.single !== undefined) {
      if (multipleChoiceQuestionDetail?.single) {
        setIsCorrectAnswer(
          checkCorrectAnswer(multipleChoiceQuestionDetail.single, correctAnswerList, [radioValue])
        );
      } else {
        setIsCorrectAnswer(
          checkCorrectAnswer(multipleChoiceQuestionDetail.single, correctAnswerList, checkBoxValue)
        );
      }
    }

    setShowCorrectAnswer(true);
  };

  useEffect(() => {
    if (!multipleChoiceQuestionDetail?.single) {
      if (checkBoxValue.length > 0) setIsAnswered(true);
      else setIsAnswered(false);
    }
  }, [checkBoxValue]);

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        {showSkeleton ? (
          <>
            <Skeleton variant='text' width={400} height={50} />
          </>
        ) : (
          `Preview question: ${multipleChoiceQuestionDetail?.question.name}`
        )}
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {showSkeleton ? (
          <PreviewQuestionSkeleton showSkeleton={showSkeleton} />
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Heading4>{`${t("common_question")} ${1}`}</Heading4>
                <Button
                  variant={isFlagged ? "soft" : "outlined"}
                  color='primary'
                  startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
                  onClick={() => setIsFlagged(!isFlagged)}
                >
                  {isFlagged ? t("common_remove_flag") : t("common_flag")}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <Stack direction={"row"} spacing={2}>
                <Box
                  sx={{ backgroundColor: answered ? "#e6eaf7" : "#FDF6EA" }}
                  borderRadius={1}
                  padding={".35rem 1rem"}
                >
                  <ParagraphBody fontSize={"12px"} color={"#212121"}>
                    {answered ? t("common_answer_saved") : t("common_not_answered")}
                  </ParagraphBody>
                </Box>
                <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
                  <ParagraphBody fontSize={"12px"} color={"#212121"}>
                    {t("common_score_can_achieve")}
                    {`: ${multipleChoiceQuestionDetail?.question.defaultMark}`}
                  </ParagraphBody>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={12}>
              <ReactQuill
                defaultValue={multipleChoiceQuestionDetail?.question.questionText}
                readOnly={true}
                theme={"bubble"}
                className={`text-editor-question-text`}
              />

              {Boolean(multipleChoiceQuestionDetail?.showStandardInstructions) && (
                <ParagraphBody
                  fontSize={".875rem"}
                  textAlign={"left"}
                  fontWeight={"600"}
                  color={"#212121"}
                >
                  {`
            ${
              multipleChoiceQuestionDetail?.single
                ? t("course_management_exam_preview_multichoice")
                : t("course_management_exam_preview_multichoice_multiple")
            }:`}
                </ParagraphBody>
              )}
              {Boolean(multipleChoiceQuestionDetail?.single) ? (
                <JoyRadioGroup
                  color='primary'
                  value={radioValue}
                  onChange={handleRadioChange}
                  values={answerList}
                  orientation='vertical'
                  size='md'
                  numbering={multipleChoiceQuestionDetail?.answerNumbering}
                  fontSize='.8rem'
                  fontWeight='400'
                  overlay
                  disabled={showCorrectAnswer}
                  correctAnswer={correctAnswerList}
                  showCorrectAnswer={showCorrectAnswer}
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
                  {answerList?.map((answer) => (
                    <Sheet
                      variant={
                        showCorrectAnswer && checkBoxValue.includes(answer.value)
                          ? "soft"
                          : "outlined"
                      }
                      key={answer.value}
                      color={
                        !showCorrectAnswer || !checkBoxValue.includes(answer.value)
                          ? "primary"
                          : correctAnswerList.includes(answer.value)
                            ? "success"
                            : "danger"
                      }
                    >
                      <Checkbox
                        disabled={showCorrectAnswer}
                        onChange={handleCheckboxChange}
                        value={answer.value}
                        checked={checkBoxValue.includes(answer.value)}
                        size='sm'
                        overlay
                        sx={{
                          "& .MuiCheckbox-label p": {
                            color: showCorrectAnswer ? "var(--gray-50)" : ""
                          }
                        }}
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

            <Grid item xs={12}>
              {showCorrectAnswer && (
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
                      <Heading6>
                        {multipleChoiceQuestionDetail?.correctFeedback || "Thats correct!"}
                      </Heading6>
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
                      <Heading6>
                        {multipleChoiceQuestionDetail?.incorrectFeedback || "Wrong!!"}
                      </Heading6>
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
                        {multipleChoiceQuestionDetail?.partiallyCorrectFeedback ||
                          "Partially correct!"}
                      </Heading6>
                    </Box>
                  )}
                  {multipleChoiceQuestionDetail?.question?.generalFeedback && (
                    <ParagraphSmall>
                      {multipleChoiceQuestionDetail?.question?.generalFeedback}
                    </ParagraphSmall>
                  )}
                  <ParagraphSmall fontWeight={"500"}>
                    {`${multipleChoiceQuestionDetail?.single ? t("correct_answer_non_plural") : t("correct_answer_plural")}:`}
                  </ParagraphSmall>
                  {correctAnswerList?.map((answer) => (
                    <ParagraphSmall key={answer}>
                      {answerList.find((item) => item.value === answer)?.label}
                    </ParagraphSmall>
                  ))}
                </Card>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      {!readOnly && !showSkeleton && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Button onClick={handleStartAgain}>{t("preview_start_again")}</Button>
            <Button onClick={handleCheckResult}>{t("preview_check_result")}</Button>
            <Button onClick={() => setOpen(false)}>{t("common_close")}</Button>
          </Stack>
        </Grid>
      )}
      {showSkeleton && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Skeleton variant='rounded' width={120} height={36} />
            <Skeleton variant='rounded' width={120} height={36} />
            <Skeleton variant='rounded' width={120} height={36} />
          </Stack>
        </Grid>
      )}
    </Dialog>
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

export default PreviewMultipleChoice;

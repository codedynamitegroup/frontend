import CloseIcon from "@mui/icons-material/Close";
import { Button, Card } from "@mui/joy";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack
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

const PreviewTrueFalse = ({
  setOpen,
  questionId,
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
  const [correctAnswer, setCorrectAnswer] = useState<AnswerOfQuestion>();
  const [radioValue, setRadioValue] = useState<string>("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

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

      setCorrectAnswer(res.questionResponses[0].qtypeMultichoiceQuestion.question.answers?.[0]);
    };
    fetchData();
  }, []);

  const handleRadioChange = (value: string) => {
    setIsAnswered(true);
    setRadioValue(value);
  };

  const handleCheckResult = () => {
    console.log("Check result");

    const convertedCorrectAnswer = correctAnswer?.answer === "true" ? "1" : "0";

    if (convertedCorrectAnswer === radioValue) setIsCorrectAnswer(true);
    else setIsCorrectAnswer(false);

    setShowCorrectAnswer(true);
  };

  const handleStartAgain = () => {
    setRadioValue("");
    setIsAnswered(false);
    setShowCorrectAnswer(false);
  };

  const answerList = [
    { value: "1", label: t("common_true") },
    { value: "0", label: t("common_false") }
  ];

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        {showSkeleton ? (
          <>
            <Skeleton variant='text' width={400} height={50} />
          </>
        ) : (
          `Preview question: ${multipleChoiceQuestionDetail?.question.name}`
        )}{" "}
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
                  {t("course_management_exam_preview_multichoice")}
                </ParagraphBody>
              )}
              <JoyRadioGroup
                disabled={showCorrectAnswer}
                color='primary'
                value={radioValue}
                onChange={handleRadioChange}
                values={answerList}
                orientation='vertical'
                size='md'
                fontSize='.8rem'
                fontWeight='400'
                overlay
              />
            </Grid>

            <Grid item xs={12}>
              {showCorrectAnswer && (
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
                  {multipleChoiceQuestionDetail?.question?.generalFeedback && (
                    <ParagraphSmall>
                      {multipleChoiceQuestionDetail?.question?.generalFeedback}
                    </ParagraphSmall>
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
                      correctAnswer?.answer === "true" ? t("common_true") : t("common_false")
                    }`}
                  </ParagraphSmall>
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

export default PreviewTrueFalse;

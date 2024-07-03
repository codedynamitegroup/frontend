import CloseIcon from "@mui/icons-material/Close";
import { Button, Card, Textarea } from "@mui/joy";
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
import { ShortAnswerQuestion } from "models/coreService/entity/ShortAnswerQuestionEntity";
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

interface PreviewShortAnswerProps extends DialogProps {
  questionId: string;
  readOnly?: boolean;
  value?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewShortAnswer = ({
  questionId,
  setOpen,

  readOnly,
  ...props
}: PreviewShortAnswerProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [answered, setIsAnswered] = useState(false);
  const [shortAnswerQuestionDetail, setShortAnswerQuestionDetail] = useState<ShortAnswerQuestion>();
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [correctAnswerList, setCorrectAnswerList] = useState<string[]>([]);

  const handleGetShortAnswerQuestionDetail = async () => {
    try {
      const questionCommands: PostQuestionDetailList = {
        questionCommands: [
          {
            questionId: questionId,
            qtype: qtype.short_answer.code
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
      const res = await handleGetShortAnswerQuestionDetail();
      setShortAnswerQuestionDetail(res.questionResponses[0].qtypeShortAnswerQuestion);

      setCorrectAnswerList(
        res.questionResponses[0].qtypeShortAnswerQuestion.question.answers
          .filter((answer: AnswerOfQuestion) => answer.fraction === 1)
          .map((answer: AnswerOfQuestion) => answer.id)
      );
    };
    fetchData();
  }, []);

  const handleOnInputChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleStartAgain = () => {
    setValue("");
    setIsCorrectAnswer(false);
    setShowCorrectAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (!shortAnswerQuestionDetail?.question.answers) return;
    setIsCorrectAnswer(false);
    setShowCorrectAnswer(false);

    if (
      checkAnswer(
        value,
        correctAnswerList,
        shortAnswerQuestionDetail?.question.answers,
        shortAnswerQuestionDetail?.caseSensitive
      )
    )
      setIsCorrectAnswer(true);
    setShowCorrectAnswer(true);
  };

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        {showSkeleton ? (
          <>
            <Skeleton variant='text' width={400} height={50} />
          </>
        ) : (
          `Preview question: ${shortAnswerQuestionDetail?.question.name}`
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
                    {`: ${shortAnswerQuestionDetail?.question.defaultMark}`}
                  </ParagraphBody>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={12}>
              <ReactQuill
                defaultValue={shortAnswerQuestionDetail?.question.questionText}
                readOnly={true}
                theme={"bubble"}
                className={`text-editor-question-text`}
              />
              <ParagraphBody
                fontSize={".875rem"}
                textAlign={"left"}
                fontWeight={"600"}
                color={"#212121"}
              >
                {t("common_answer")}
              </ParagraphBody>
              <Textarea
                disabled={showCorrectAnswer}
                defaultValue={value}
                value={value}
                sx={{ marginBottom: 1, backgroundColor: "white" }}
                minRows={1}
                maxRows={1}
                placeholder={t("common_enter_answer")}
                onChange={handleOnInputChange}
              />

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
                  {shortAnswerQuestionDetail?.question?.generalFeedback && (
                    <ParagraphSmall>
                      {shortAnswerQuestionDetail?.question?.generalFeedback}
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
                  <ParagraphSmall>{`${correctAnswerList?.length > 1 ? t("correct_answer_plural") : t("correct_answer_non_plural")}: `}</ParagraphSmall>
                  {correctAnswerList?.map((answer) => (
                    <ParagraphSmall key={answer}>
                      {
                        shortAnswerQuestionDetail?.question?.answers?.find(
                          (item) => item.id === answer
                        )?.answer
                      }
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
            <Button onClick={handleCheckAnswer}>{t("preview_check_result")}</Button>
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

const checkAnswer = (
  value: string,
  correctAnswerList: string[],
  contentList: AnswerOfQuestion[],
  caseSensitive: boolean
) => {
  let inputValueId = "";
  if (caseSensitive) inputValueId = contentList.find((item) => item.answer === value)?.id || "";
  else
    inputValueId =
      contentList.find((item) => item.answer.toLowerCase() === value.toLowerCase())?.id || "";

  return correctAnswerList.includes(inputValueId);
};

export default PreviewShortAnswer;

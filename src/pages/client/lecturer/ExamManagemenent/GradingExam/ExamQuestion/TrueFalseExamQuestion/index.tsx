import { Box, Grid, Stack, Divider, TextField, Snackbar, SnackbarContent } from "@mui/material";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { Button, Checkbox, Sheet } from "@mui/joy";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import { useState, useEffect } from "react";
import { QuestionService } from "services/coreService/QuestionService";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { GradeSubmission } from "models/courseService/entity/SubmissionGradeEntity";
import SnackbarAlert from "components/common/SnackbarAlert";
import { AlertType } from "pages/client/lecturer/QuestionManagement/components/AICreateQuestion";

interface PreviewMultipleChoiceProps {
  questionIndex: number;
  questionSubmitContent?: any;
  questionTrueFalse: MultiChoiceQuestion;
}

const TrueFalseExamQuestion = (props: PreviewMultipleChoiceProps) => {
  const { questionIndex, questionSubmitContent, questionTrueFalse } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const examId = useParams<{ examId: string }>().examId;
  const handleUpdateGrade = () => {
    const questionId = questionTrueFalse.question.id;
    const rightAnswer = "";
    const submission: GradeSubmission[] = [
      { examSubmissionId: submissionId || "", questionId, grade: mark, rightAnswer }
    ];

    QuestionSubmissionService.gradeQuestionSubmission(submission)
      .then((response) => {
        console.log("Grade updated successfully", response);
      })
      .catch((error) => {
        console.error("Failed to update grade", error);
        setSnackbarType(AlertType.Error);
        setSnackbarContent(t("update_grade_failed"));
      })
      .finally(() => {
        navigate(
          routes.lecturer.exam.grading
            .replace(":submissionId", submissionId || "")
            .replace(":examId", examId || "")
            .replace(":courseId", courseId || "")
        );
        setSnackbarType(AlertType.Success);
        setSnackbarContent(t("update_grade_success"));
        setOpenSnackbar(true);
      });
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [snackbarContent, setSnackbarContent] = useState<string>("");

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

  const [answerOfQuestions, setAnswerOfQuestion] = useState<AnswerOfQuestion[]>([]);
  const [mark, setMark] = useState<number>(0);

  const handleGetAnsweryQuestionId = (questionId: string) => {
    QuestionService.getAnswerByQuestionId(questionId)
      .then((res) => {
        const data = res.filter((item: AnswerOfQuestion) => item.fraction !== 0);
        setAnswerOfQuestion(data);
        setMark(questionSubmitContent?.grade || 0);
        // const matchedAnswer = data.find(
        //   (item: AnswerOfQuestion) => item.answer === questionSubmitContent.content
        // );
        // if (matchedAnswer) {
        //   const defaultMark = questionTrueFalse.question.defaultMark;
        //   setMark(matchedAnswer.fraction * defaultMark);
        // }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("done");
      });
  };

  useEffect(() => {
    handleGetAnsweryQuestionId(questionTrueFalse.question.id);
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
              {questionTrueFalse.question.defaultMark}
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
          value={questionSubmitContent?.content}
          values={answerList}
          orientation='vertical'
          size='md'
          fontSize='.8rem'
          fontWeight='400'
          overlay
          disabled
        />
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
        <Sheet variant='outlined' sx={{ backgroundColor: "#e6f4ea", marginTop: 1 }}>
          <Checkbox
            disabled
            onChange={() => {}}
            value={"questionMultiChoice.question.name"}
            checked
            size='sm'
            overlay
            label={
              <ParagraphBody textAlign={"center"} fontSize='.8rem' fontWeight='400'>
                {answerOfQuestions[0]?.answer === "true" ? t("common_true") : t("common_false")}
              </ParagraphBody>
            }
          />
        </Sheet>

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
          <Button color='primary' onClick={handleUpdateGrade}>
            {t("update_grade")}
          </Button>
        </Stack>
      </Grid>
      <SnackbarAlert
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        type={snackbarType}
        content={snackbarContent}
      />
    </Grid>
  );
};

export default TrueFalseExamQuestion;

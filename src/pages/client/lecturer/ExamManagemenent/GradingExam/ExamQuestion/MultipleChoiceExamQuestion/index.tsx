import { Box, Grid, Stack, Divider } from "@mui/material";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
import { useTranslation } from "react-i18next";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import Sheet from "@mui/joy/Sheet";
import { Checkbox } from "@mui/joy";
import { useEffect, useMemo, useState } from "react";
import { QuestionService } from "services/coreService/QuestionService";
import { AnswerOfQuestion } from "models/coreService/entity/AnswerOfQuestionEntity";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { GradeSubmission } from "models/courseService/entity/SubmissionGradeEntity";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import TextEditor from "components/editor/TextEditor";
import classes from "./styles.module.scss";
interface FormData {
  grade: number;
  feedback?: string;
}

interface MultipleChoiceExamQuestionProps {
  questionIndex: number;
  questionMultiChoice: MultiChoiceQuestion;
  questionSubmitContent: any;
  questionId: string;
}

const MultipleChoiceExamQuestion = (props: MultipleChoiceExamQuestionProps) => {
  const { t } = useTranslation();
  const { questionIndex, questionMultiChoice, questionSubmitContent } = props;
  const [loading, setLoading] = useState(false);
  const answerList = questionMultiChoice.question.answers?.map((answer: any) => ({
    value: answer.id,
    label: answer.answer
  }));

  const [answerOfQuestions, setAnswerOfQuestion] = useState<AnswerOfQuestion[]>([]);
  const [mark, setMark] = useState<number>(0);

  const navigate = useNavigate();
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const examId = useParams<{ examId: string }>().examId;
  const submitHandler = async (data: any) => {
    setLoading(true);
    const formSubmitData: FormData = { ...data };
    const questionId = questionMultiChoice.question.id;
    const rightAnswer = "";
    const submission: GradeSubmission[] = [
      {
        examSubmissionId: submissionId || "",
        questionId,
        grade: formSubmitData.grade,
        rightAnswer,
        feedback: formSubmitData.feedback
      }
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
        setLoading(false);
      });
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [snackbarContent, setSnackbarContent] = useState<string>("");

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
        //   const defaultMark = questionMultiChoice.question.defaultMark;
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
    handleGetAnsweryQuestionId(props.questionId);
  }, []);

  const schema = useMemo(() => {
    return yup.object().shape({
      grade: yup.number().required().min(0).max(questionMultiChoice.question.defaultMark),
      feedback: yup.string()
    });
  }, [questionMultiChoice.question.defaultMark]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      grade: questionSubmitContent?.grade || 0,
      feedback: questionSubmitContent?.feedback || ""
    }
  });

  useEffect(() => {
    reset({
      grade: questionSubmitContent?.grade || 0,
      feedback: questionSubmitContent?.feedback || ""
    });
  }, [questionSubmitContent, reset]);

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
              const isCorrectAnswer = answerOfQuestions?.some(
                (a) => a?.questionId === answer?.question?.id
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
                  <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
                </ParagraphBody>
              }
            />
          </Sheet>
        ))}

        <Box>
          <Grid item xs={6}>
            <Controller
              name='grade'
              control={control}
              render={({ field }) => (
                <InputTextFieldColumn
                  type='number'
                  title={t("common_grade")}
                  titleRequired={true}
                  useDefaultTitleStyle
                  error={Boolean(errors.grade)}
                  errorMessage={errors.grade?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} className={classes.textEditor}>
            <TitleWithInfoTip
              title={t("common_feedback")}
              titleRequired
              fontSize='12px'
              color='var(--gray-60)'
              gutterBottom
              fontWeight='600'
            />
            <Controller
              name='feedback'
              control={control}
              render={({ field }) => (
                <TextEditor
                  openDialog
                  type='text'
                  title={t("common_feedback")}
                  roundedBorder={true}
                  required
                  placeholder={t("common_feedback")}
                  backgroundColor='white'
                  tooltipDescription={t("common_feedback")}
                  {...field}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </Grid>
          <LoadButton
            btnType={BtnType.Outlined}
            color='primary'
            style={{ marginTop: "30px" }}
            onClick={handleSubmit(submitHandler)}
            loading={loading}
          >
            {t("update_grade")}
          </LoadButton>
        </Box>
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

export default MultipleChoiceExamQuestion;

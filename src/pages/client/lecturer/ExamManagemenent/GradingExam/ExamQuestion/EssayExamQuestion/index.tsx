import { Box, Grid, Stack, Divider, TextField } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { Checkbox, Sheet, Textarea } from "@mui/joy";
import { EssayQuestion } from "models/coreService/entity/EssayQuestionEntity";
import {
  addFileToExamQuesiton,
  removeAllFilesFromExamQuestion,
  removeFileFromExamQuestion,
  setAnswered,
  setFlag
} from "reduxes/TakeExam";
import { useDispatch } from "react-redux";
import AdvancedDropzoneForEssayExam from "components/editor/FileUploaderForExamEssay";
import { useState } from "react";
import SnackbarAlert from "components/common/SnackbarAlert";
import { AlertType } from "pages/client/lecturer/QuestionManagement/components/AICreateQuestion";
import { GradeSubmission } from "models/courseService/entity/SubmissionGradeEntity";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";

interface EssayExamQuestionProps {
  questionEssayQuestion: EssayQuestion;
  questionIndex: number;
  questionSubmitContent?: any;
}

const EssayExamQuestion = (props: EssayExamQuestionProps) => {
  const { questionEssayQuestion, questionIndex, questionSubmitContent } = props;
  const { t } = useTranslation();

  const [mark, setMark] = useState<number>(questionSubmitContent?.grade || 0);

  const navigate = useNavigate();
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const examId = useParams<{ examId: string }>().examId;
  const handleUpdateGrade = () => {
    const questionId = questionEssayQuestion.question.id;
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
              {questionEssayQuestion.question.defaultMark}
            </ParagraphBody>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={12}>
        <Box>
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
              __html: questionEssayQuestion.question.questionText
            }}
          />
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("common_answer")}
          </ParagraphBody>
          {questionEssayQuestion.responseFormat === "editor" && (
            <ParagraphBody
              sx={{
                minHeight: "200px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "10px"
              }}
              className='ql-editor'
              fontSize={"1rem"}
              textAlign={"left"}
              fontWeight={"400"}
              color={"#212121"}
              lineHeight={"1.5"}
              dangerouslySetInnerHTML={{
                __html: questionSubmitContent?.content
              }}
            />
          )}
          {questionEssayQuestion.responseFormat === "plain" && (
            <Textarea
              defaultValue={questionSubmitContent?.content}
              minRows={"10"}
              maxRows={questionEssayQuestion.responseFieldLines}
            />
          )}
        </Box>
      </Grid>

      {/* {(questionEssayQuestion.responseFormat === "no_online" ||
        questionEssayQuestion.attachments !== 0) && (
        <Grid item xs={12}>
          <AdvancedDropzoneForEssayExam
            maxFileSize={convertedFileSize}
            accept={fileTypeList}
            maxFiles={questionEssayQuestion.attachments}
            stopAutoUpload
            disableDownload
            relatedId={questionEssayQuestion.question.id}
            relatedDispatch={addFileToExamQuesiton}
            relatedRemoveDispatch={removeFileFromExamQuestion}
            filesFromUrl={questionState?.files}
            relatedRemoveAllDispatch={removeAllFilesFromExamQuestion}
          />
        </Grid>
      )} */}

      <Grid item xs={12} md={12} marginTop={2}>
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

export default EssayExamQuestion;

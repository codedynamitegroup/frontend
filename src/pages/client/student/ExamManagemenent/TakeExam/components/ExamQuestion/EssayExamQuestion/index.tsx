import { Box, Grid, Stack, Divider } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { Textarea } from "@mui/joy";
import { EssayQuestion } from "models/coreService/entity/QuestionEntity";
import {
  addFileToExamQuesiton,
  removeAllFilesFromExamQuestion,
  removeFileFromExamQuestion,
  setFlag
} from "reduxes/TakeExam";
import { useDispatch } from "react-redux";
import AdvancedDropzoneForEssayExam from "components/editor/FileUploaderForExamEssay";

interface Props {
  page: number;

  questionEssayQuestion: EssayQuestion;
  questionState: any;
}

const EssayExamQuestion = (props: Props) => {
  const { page, questionEssayQuestion, questionState } = props;
  const isFlagged = questionState?.flag;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileTypeList =
    questionEssayQuestion.fileTypesList === "archive"
      ? ".7z, .bdoc, .cdoc, .ddoc, .gtar, .tgz, .gz, .gzip, .hqx, .rar, .sit, .tar, .zip"
      : questionEssayQuestion.fileTypesList === "document"
        ? ".doc, .docx, .epub, .gdoc, .odt, .ott, .oth, .pdf, .rtf"
        : questionEssayQuestion.fileTypesList === "image"
          ? ".bmp, .gif, .jpeg, .jpg, .png, .svg, .tif, .tiff"
          : questionEssayQuestion.fileTypesList === "video"
            ? ".3g2, .3gp, .avi, .flv, .h264, .m4v, .mkv, .mov, .mp4, .mpg, .mpeg .rm .swf .vob .wmv"
            : questionEssayQuestion.fileTypesList === "audio"
              ? ".aif, .cda, .mid, .midi, .mp3, .mpa, .ogg, .wav, .wma"
              : "";
  const convertedFileSize = questionEssayQuestion.maxBytes
    ? (questionEssayQuestion.maxBytes / 1000) * 1024 * 1024
    : undefined;

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined)
      dispatch(setFlag({ id: questionEssayQuestion.question.id, flag: !isFlagged }));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${page + 1}`}</Heading4>
          <Button
            variant={isFlagged ? "soft" : "outlined"}
            color='primary'
            startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
            onClick={flagQuestionHandle}
          >
            {isFlagged ? t("common_remove_flag") : t("common_flag")}
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={2}>
          <Box
            sx={{ backgroundColor: questionState?.answered ? "#e6eaf7" : "#FDF6EA" }}
            borderRadius={1}
            padding={".35rem 1rem"}
          >
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              {questionState?.answered ? t("common_answer_saved") : t("common_not_answered")}
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
            gutterBottom
            fontSize={"1rem"}
            textAlign={"left"}
            fontWeight={"400"}
            color={"#212121"}
            lineHeight={"1.5"}
          >
            {questionEssayQuestion.question.questionText}
          </ParagraphBody>
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("common_answer")}
          </ParagraphBody>
          {questionEssayQuestion.responseFormat === "editor" && (
            <TextEditor
              value=''
              roundedBorder
              maxLines={questionEssayQuestion.responseFieldLines}
            />
          )}
          {questionEssayQuestion.responseFormat === "plain" && (
            <Textarea minRows={"10"} maxRows={questionEssayQuestion.responseFieldLines} />
          )}
        </Box>
      </Grid>

      {(questionEssayQuestion.responseFormat === "no_online" ||
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
      )}
    </Grid>
  );
};

export default EssayExamQuestion;

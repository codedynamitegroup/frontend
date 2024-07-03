import CloseIcon from "@mui/icons-material/Close";
import { Button, Textarea } from "@mui/joy";
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
import TextEditor from "components/editor/TextEditor";
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
import { EssayQuestion } from "models/coreService/entity/EssayQuestionEntity";
import AdvancedDropzoneForEssayExam from "components/editor/FileUploaderForExamEssay";

interface PreviewEssayProps extends DialogProps {
  questionId: string;
  readOnly?: boolean;
  grading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewEssay = ({ questionId, setOpen, readOnly, grading, ...props }: PreviewEssayProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [answered, setIsAnswered] = useState(false);
  const [essayQuestionDetail, setEssayQuestionDetail] = useState<EssayQuestion>();
  const [fileTypeList, setFileTypeList] = useState<string>("");
  const [convertedFileSize, setConvertedFileSize] = useState<number>();
  const [clearAllFiles, setClearAllFiles] = useState<boolean>(false);

  const handleStartAgain = () => {
    setValue("");
    setClearAllFiles(true);
  };

  const handleInputChange = (value: string) => {
    setValue(value);
  };

  const hanleGetEssayQuestionDetail = async () => {
    try {
      const questionCommands: PostQuestionDetailList = {
        questionCommands: [
          {
            questionId: questionId,
            qtype: qtype.essay.code
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
      const res = await hanleGetEssayQuestionDetail();
      setEssayQuestionDetail(res.questionResponses[0].qtypeEssayQuestion);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!essayQuestionDetail || !essayQuestionDetail.fileTypesList) return;

    essayQuestionDetail.fileTypesList.split(",").forEach((item: string) => {
      console.log(item);
      let fileType = "";
      if (item === "archive")
        fileType =
          ".7z, .bdoc, .cdoc, .ddoc, .gtar, .tgz, .gz, .gzip, .hqx, .rar, .sit, .tar, .zip";
      else if (item === "document")
        fileType = ".doc, .docx, .epub, .gdoc, .odt, .ott, .oth, .pdf, .rtf";
      else if (item === "image") fileType = ".bmp, .gif, .jpeg, .jpg, .png, .svg, .tif, .tiff";
      else if (item === "video")
        fileType =
          ".3g2, .3gp, .avi, .flv, .h264, .m4v, .mkv, .mov, .mp4, .mpg, .mpeg .rm .swf .vob .wmv";
      else if (item === "audio") fileType = ".aif, .cda, .mid, .midi, .mp3, .mpa, .ogg, .wav, .wma";

      if (fileType !== "") setFileTypeList((prev) => prev + ", " + fileType);
    });
    setConvertedFileSize(
      essayQuestionDetail.maxBytes ? (essayQuestionDetail.maxBytes / 1000) * 1024 * 1024 : undefined
    );
  }, [essayQuestionDetail]);

  useEffect(() => {
    if (clearAllFiles) setClearAllFiles(false);
  }, [clearAllFiles]);

  return (
    <Dialog {...props}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={props["aria-labelledby"]}>
        {showSkeleton ? (
          <>
            <Skeleton variant='text' width={400} height={50} />
          </>
        ) : (
          `Preview question: ${essayQuestionDetail?.question.name}`
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
                    {`: ${essayQuestionDetail?.question.defaultMark}`}
                  </ParagraphBody>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box>
                <ReactQuill
                  defaultValue={essayQuestionDetail?.question.questionText}
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
                {essayQuestionDetail?.responseFormat === "editor" && (
                  <TextEditor
                    value={value}
                    defaultvalue={value}
                    onChange={handleInputChange}
                    roundedBorder
                    maxLines={essayQuestionDetail?.responseFieldLines}
                  />
                )}
                {essayQuestionDetail?.responseFormat === "plain" && (
                  <Textarea minRows={"10"} maxRows={essayQuestionDetail?.responseFieldLines} />
                )}
              </Box>
            </Grid>

            {(essayQuestionDetail?.responseFormat === "no_online" ||
              essayQuestionDetail?.attachments !== 0) && (
              <Grid item xs={12}>
                <AdvancedDropzoneForEssayExam
                  maxFileSize={convertedFileSize}
                  accept={fileTypeList}
                  maxFiles={essayQuestionDetail?.attachments}
                  stopAutoUpload
                  disableDownload
                  clearAllFiles={clearAllFiles}
                />
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      {!readOnly && !showSkeleton && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Button onClick={handleStartAgain}>{t("preview_start_again")}</Button>
            <Button onClick={() => setOpen(false)}>{t("common_close")}</Button>
          </Stack>
        </Grid>
      )}
      {showSkeleton && (
        <Grid container justifyContent={"center"} marginY={1}>
          <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
            <Skeleton variant='rounded' width={120} height={36} />
            <Skeleton variant='rounded' width={120} height={36} />
          </Stack>
        </Grid>
      )}
    </Dialog>
  );
};

export default PreviewEssay;

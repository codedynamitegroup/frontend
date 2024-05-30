import { Box, Grid, Stack, Divider } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import FlagIcon from "@mui/icons-material/Flag";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { Textarea } from "@mui/joy";
import AdvancedDropzoneDemo from "components/editor/FileUploader";

interface Props {
  page: number;
  isFlagged?: boolean;

  responseFormat?: "editor" | "plain" | "no_online";
  responseFieldLines?: number;
  minWord?: number;
  maxWord?: number;
  attachments?: number;
  fileSize?: number;
  fileTypes?: string;
}

const EssayExamQuestion = (props: Props) => {
  const { page, isFlagged, responseFormat, responseFieldLines, attachments, fileSize, fileTypes } =
    props;
  const { t } = useTranslation();
  const fileTypeList =
    fileTypes === "archive"
      ? ".7z .bdoc .cdoc .ddoc .gtar .tgz .gz .gzip .hqx .rar .sit .tar .zip"
      : fileTypes === "document"
        ? ".doc .docx .epub .gdoc .odt .ott .oth .pdf .rtf"
        : fileTypes === "image"
          ? ".bmp .gif .jpeg .jpg .png .svg .tif .tiff"
          : fileTypes === "video"
            ? ".3g2 .3gp .avi .flv .h264 .m4v .mkv .mov .mp4 .mpg .mpeg .rm .swf .vob .wmv"
            : fileTypes === "audio"
              ? ".aif .cda .mid .midi .mp3 .mpa .ogg .wav .wma"
              : "";
  const convertedFileSize = fileSize ? (fileSize / 1000) * 1024 * 1024 : undefined;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Heading4>{`${t("common_question")} ${page + 1}`}</Heading4>
          <Button
            variant={isFlagged ? "soft" : "outlined"}
            color='primary'
            startDecorator={isFlagged ? <FlagIcon /> : <FlagOutlinedIcon />}
          >
            {isFlagged ? t("common_remove_flag") : t("common_flag")}
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ backgroundColor: "#FDF6EA" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              Chưa trả lời
            </ParagraphBody>
          </Box>
          <Box sx={{ backgroundColor: "#f5f5f5" }} borderRadius={1} padding={".35rem 1rem"}>
            <ParagraphBody fontSize={"12px"} color={"#212121"}>
              Điểm có thể đạt được: 2
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
            Ai là cha của SE? Nêu những thành tựu nổi bật
          </ParagraphBody>
          <ParagraphBody
            fontSize={".875rem"}
            textAlign={"left"}
            fontWeight={"600"}
            color={"#212121"}
          >
            {t("common_answer")}
          </ParagraphBody>
          {responseFormat === "editor" && (
            <TextEditor value='' roundedBorder maxLines={responseFieldLines} />
          )}
          {responseFormat === "plain" && <Textarea minRows={"10"} maxRows={responseFieldLines} />}
        </Box>
      </Grid>

      {(responseFormat === "no_online" || attachments !== 0) && (
        <Grid item xs={12}>
          <AdvancedDropzoneDemo
            maxFileSize={convertedFileSize}
            accept={fileTypeList}
            maxFiles={attachments}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default EssayExamQuestion;

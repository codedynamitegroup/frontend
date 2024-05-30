import { Textarea } from "@mui/joy";
import { Grid, Stack, Divider, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Heading4 from "components/text/Heading4";
import Button from "@mui/joy/Button";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";

interface Props {
  page: number;
  isFlagged?: boolean;
}

const ShortAnswerExamQuestion = (props: Props) => {
  const { page, isFlagged } = props;
  const { t } = useTranslation();

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
        <ParagraphBody
          gutterBottom
          fontSize={"1rem"}
          textAlign={"left"}
          fontWeight={"400"}
          color={"#212121"}
          lineHeight={"1.5"}
        >
          What is the full form of HTML?{" "}
        </ParagraphBody>
        <ParagraphBody fontSize={".875rem"} textAlign={"left"} fontWeight={"600"} color={"#212121"}>
          {t("common_answer")}
        </ParagraphBody>
        <Textarea
          sx={{ marginBottom: 1, backgroundColor: "white" }}
          minRows={1}
          maxRows={1}
          placeholder={t("common_enter_answer")}
        />
      </Grid>
    </Grid>
  );
};

export default ShortAnswerExamQuestion;

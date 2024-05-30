import { Box, Grid, Stack, Divider } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Button from "@mui/joy/Button";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { useTranslation } from "react-i18next";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";

interface Props {
  page: number;

  isFlagged?: boolean;

  questionTrueFalseQuestion: MultiChoiceQuestion;
}

const TrueFalseExamQuestion = (props: Props) => {
  const { t } = useTranslation();
  const { page, isFlagged, questionTrueFalseQuestion } = props;
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
            __html: questionTrueFalseQuestion.question.questionText
          }}
        />
        {Boolean(questionTrueFalseQuestion.showStandardInstructions) && (
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
          value={""}
          onChange={() => {}}
          values={answerList}
          orientation='vertical'
          size='md'
          fontSize='.8rem'
          fontWeight='400'
          overlay
        />
      </Grid>
    </Grid>
  );
};

export default TrueFalseExamQuestion;

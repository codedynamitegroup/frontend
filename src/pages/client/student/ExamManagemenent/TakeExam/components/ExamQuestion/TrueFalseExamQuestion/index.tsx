import { Box, Grid, Stack, Divider } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Button from "@mui/joy/Button";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
import { useTranslation } from "react-i18next";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import { useDispatch } from "react-redux";
import { setAnswered, setFlag } from "reduxes/TakeExam";

interface Props {
  page: number;
  questionTrueFalseQuestion: MultiChoiceQuestion;
  questionState: any;
}

const TrueFalseExamQuestion = (props: Props) => {
  const { t } = useTranslation();
  const { page, questionState, questionTrueFalseQuestion } = props;
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
  const dispatch = useDispatch();
  const isFlagged = questionState?.flag;

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined)
      dispatch(setFlag({ id: questionTrueFalseQuestion.question.id, flag: !isFlagged }));
  };

  const handleRadioChange = (value: string) => {
    dispatch(
      setAnswered({ id: questionTrueFalseQuestion.question.id, content: value, answered: true })
    );
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
              {questionTrueFalseQuestion.question.defaultMark}
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
          value={questionState?.content}
          onChange={handleRadioChange}
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

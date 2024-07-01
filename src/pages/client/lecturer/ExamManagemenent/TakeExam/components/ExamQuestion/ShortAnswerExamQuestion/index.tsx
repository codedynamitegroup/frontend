import { Textarea } from "@mui/joy";
import { Grid, Stack, Divider, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Heading4 from "components/text/Heading4";
import Button from "@mui/joy/Button";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { useDispatch } from "react-redux";
import { setAnswered, setFlag } from "reduxes/TakeExam";
import { ShortAnswerQuestion } from "models/coreService/entity/ShortAnswerQuestionEntity";
import { debounce } from "lodash";

interface Props {
  page: number;
  questionShortAnswer: ShortAnswerQuestion;
  questionState: any;
}

const ShortAnswerExamQuestion = (props: Props) => {
  const { page, questionShortAnswer, questionState } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFlagged = questionState?.flag;

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined)
      dispatch(setFlag({ id: questionShortAnswer.question.id, flag: !isFlagged }));
  };

  const debouncedHandleOnInputChange = debounce((e: any) => {
    let isAnswered = true;
    if (e.target.value === "") isAnswered = false;

    dispatch(
      setAnswered({
        id: questionShortAnswer.question.id,
        answered: isAnswered,
        content: e.target.value
      })
    );
  }, 250);

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
              {questionShortAnswer.question.defaultMark}
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
            __html: questionShortAnswer.question.questionText
          }}
        />
        <ParagraphBody fontSize={".875rem"} textAlign={"left"} fontWeight={"600"} color={"#212121"}>
          {t("common_answer")}
        </ParagraphBody>
        <Textarea
          defaultValue={questionState?.content}
          onChange={debouncedHandleOnInputChange}
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

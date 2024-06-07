import { Box, Grid, Stack, Divider } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import Button from "@mui/joy/Button";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { useTranslation } from "react-i18next";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import Sheet from "@mui/joy/Sheet";
import { Checkbox } from "@mui/joy";
import { setAnswered, setFlag } from "reduxes/TakeExam";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

interface Props {
  page: number;

  questionMultiChoice: MultiChoiceQuestion;
  questionState: any;
}

const MultipleChoiceExamQuestion = (props: Props) => {
  const { t } = useTranslation();
  const { page, questionState, questionMultiChoice } = props;
  const dispatch = useDispatch();
  const isFlagged = questionState?.flag;

  // convert answer got from API to JoyRadioGroup format
  // value is answer ID, label is answer content aka answer
  const [answerList, setAnswerList] = useState<{ value: string; label: string }[] | undefined>(
    questionMultiChoice.question.answers?.map((answer: any) => ({
      value: answer.id,
      label: answer.answer
    }))
  );

  const flagQuestionHandle = () => {
    if (isFlagged !== undefined)
      dispatch(setFlag({ id: questionMultiChoice.question.id, flag: !isFlagged }));
  };

  const handleRadioChange = (value: string) => {
    dispatch(setAnswered({ id: questionMultiChoice.question.id, content: value, answered: true }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedList: string[] = questionState?.content.split(", ");
    selectedList = selectedList.filter((uuid) => uuid !== "" && uuid !== "null");

    if (event.target.checked) {
      selectedList.push(event.target.value);
    } else {
      selectedList = selectedList.filter((uuid) => uuid !== event.target.value);
    }

    const updatedContent = selectedList.join(", ");

    dispatch(
      setAnswered({
        id: questionMultiChoice.question.id,
        content: updatedContent,
        answered: selectedList.length > 0 ? true : false
      })
    );

    console.log(selectedList);
  };

  useEffect(() => {
    if (questionMultiChoice.shuffleAnswers) setAnswerList(shuffleArray(answerList));
  }, []);

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
            sx={{ backgroundColor: questionState.answered ? "#e6eaf7" : "#FDF6EA" }}
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
            value={questionState?.content}
            onChange={handleRadioChange}
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
            {answerList?.map((answer) => (
              <Sheet variant='outlined' key={answer.value}>
                <Checkbox
                  onChange={handleCheckboxChange}
                  value={answer.value}
                  checked={questionState?.content.includes(answer.value)}
                  size='sm'
                  overlay
                  label={
                    <ParagraphBody textAlign={"center"} fontSize='.8rem' fontWeight='400'>
                      {answer.label}
                    </ParagraphBody>
                  }
                />
              </Sheet>
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

function shuffleArray(array: any[] | undefined) {
  if (!array) return [];

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export default MultipleChoiceExamQuestion;

import {
  Box,
  FormControl,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  FormGroup
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";

import ParagraphBody from "components/text/ParagraphBody";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { useTranslation } from "react-i18next";
import { QuestionService } from "services/coreService/QuestionService";

interface Props {
  page: number;
}

const MultipleChoiceExamQuestion = (props: Props) => {
  const questionId = "b6484e21-6937-489c-b031-b71767994735";
  const { t } = useTranslation();
  const { page } = props;
  const [value1, setValue1] = useState<String>();
  const [questionData, setQuestionData] = useState<MultiChoiceQuestion>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue1((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    QuestionService.getMultiChoiceQuestionByQuestionId(questionId)
      .then((res) => {
        setQuestionData(res.qtypeMultichoiceQuestion);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={2}>
        <Box sx={{ backgroundColor: grey[300] }} borderRadius={1} paddingX={3} paddingY={1}>
          <Typography gutterBottom translation-key='common_question'>
            {t("common_question")} {page + 1}
          </Typography>
          <Typography gutterBottom translation-key='course_management_exam_preview_available'>
            {t("course_management_exam_preview_available")}: 2
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={10}>
        <Box sx={{ backgroundColor: blue[100] }} borderRadius={1} paddingX={3} paddingY={3}>
          <Typography gutterBottom>{questionData?.question.name}</Typography>
          {Boolean(questionData?.showStandardInstructions) && (
            <Typography>
              {`
            ${
              questionData?.single
                ? t("course_management_exam_preview_multichoice")
                : t("course_management_exam_preview_multichoice_multiple")
            }:`}
            </Typography>
          )}

          {Boolean(questionData?.single) ? (
            <FormControl>
              <RadioGroup name='radio-buttons-group' value={value1} onChange={handleChange}>
                {questionData?.question.answers.map((answer) => (
                  <FormControlLabel
                    key={answer.id}
                    value='1'
                    control={<Radio />}
                    label={answer.answer}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <FormGroup>
              {questionData?.question.answers.map((answer) => (
                <FormControlLabel key={answer.id} control={<Checkbox />} label={answer.answer} />
              ))}
            </FormGroup>
          )}
        </Box>
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Stack direction={"row"} alignItems={"center"}>
              <ParagraphBody translation-key='common_flag'>{t("common_flag")}</ParagraphBody>{" "}
              <FlagIcon sx={{ color: "red" }} />
            </Stack>
          }
        />
      </Grid>
    </Grid>
  );
};

export default MultipleChoiceExamQuestion;

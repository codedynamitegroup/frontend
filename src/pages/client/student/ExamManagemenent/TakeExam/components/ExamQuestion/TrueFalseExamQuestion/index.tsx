import { Textarea } from "@mui/joy";
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  FormControl,
  RadioGroup,
  Radio
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import FlagIcon from "@mui/icons-material/Flag";
import ParagraphBody from "components/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { QuestionService } from "services/coreService/QuestionService";
import { MultiChoiceQuestion } from "models/coreService/entity/QuestionEntity";

interface Props {
  page: number;
}

const TrueFalseExamQuestion = (props: Props) => {
  const questionId = "338af6e9-45b3-47b0-8d3a-841ec50ac6e5";
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

  useEffect(() => {
    console.log(questionData);
  }, [questionData]);

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
          <FormControl>
            <RadioGroup name='radio-buttons-group' value={value1} onChange={handleChange}>
              <FormControlLabel value='1' control={<Radio />} label={t("common_true")} />
              <FormControlLabel value='2' control={<Radio />} label={t("common_false")} />
            </RadioGroup>
          </FormControl>
        </Box>
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Stack direction={"row"} alignItems={"center"}>
              <ParagraphBody>{t("common_flag")}</ParagraphBody> <FlagIcon sx={{ color: "red" }} />
            </Stack>
          }
        />
      </Grid>
    </Grid>
  );
};

export default TrueFalseExamQuestion;

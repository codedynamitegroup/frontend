import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import { memo, useState } from "react";
import classes from "./styles.module.scss";
import Heading5 from "components/text/Heading5";
import { useTranslation } from "react-i18next";
import { QuestionEntity } from "models/courseService/entity/QuestionEntity";

type Props = { question: QuestionEntity };

enum EDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}
const CodeQuestionInformation = memo(({ question }: Props) => {
  const { t } = useTranslation();
  const [problemDescription, setProblemDescription] = useState<string>("Mô tả bài toán");
  const [problemStatement, setProblemStatement] = useState<string>("Tính tổng 2 số");
  const [inputFormat, setInputFormat] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );
  const [outputFormat, setOutputFormat] = useState<string>(
    "Là một số nguyên cho biết tổng của a và b"
  );
  const [contraints, setContraints] = useState<string>("a và b là số nguyên");
  const [questionName] = useState<string>("Tổng 2 số");
  const [difficulty, setDifficulty] = useState<string>(EDifficulty.EASY);
  const handleChange = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value);
  };

  return (
    <Box component='form' autoComplete='off' className={classes.formBody}>
      <Heading5
        fontStyle={"italic"}
        fontWeight={"400"}
        colorname='--gray-50'
        translation-key='code_management_detail_info_description'
      >
        {t("code_management_detail_info_description")}{" "}
      </Heading5>
      <InputTextField
        title={t("exam_management_create_question_name")}
        type='text'
        value={question.name}
        translation-key='exam_management_create_question_name'
      />
      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_difficult_level'>
              {t("common_difficult_level")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Select value={question.difficulty} onChange={handleChange} sx={{ width: "200px" }}>
              <MenuItem value={EDifficulty.EASY} translation-key='common_easy'>
                {t("common_easy")}
              </MenuItem>
              <MenuItem value={EDifficulty.MEDIUM} translation-key='common_medium'>
                {t("common_medium")}
              </MenuItem>
              <MenuItem value={EDifficulty.HARD} translation-key='common_hard'>
                {t("common_hard")}
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>
      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='code_management_create_description'>
              {t("code_management_create_description")}
            </TextTitle>
          </Grid>
          <Grid item xs={9} className={classes.textEditor}>
            <TextEditor value={question.questionText} onChange={setProblemDescription} />
          </Grid>
        </Grid>
      </FormControl>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='code_management_create_statement'>
            {t("code_management_create_statement")}
          </TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditor}>
          <TextEditor value={problemStatement} onChange={setProblemStatement} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3} translation-key='code_management_create_input_format'>
          <TextTitle>{t("code_management_create_input_format")}</TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditor}>
          <TextEditor value={inputFormat} onChange={setInputFormat} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='code_management_create_constraint'>
            {t("code_management_create_constraint")}
          </TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditor}>
          <TextEditor value={contraints} onChange={setContraints} />
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='code_management_create_output_format'>
            {t("code_management_create_output_format")}
          </TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditor}>
          <TextEditor value={outputFormat} onChange={setOutputFormat} />
        </Grid>
      </Grid>
    </Box>
  );
});

export default CodeQuestionInformation;

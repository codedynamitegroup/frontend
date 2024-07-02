import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Tooltip
} from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import TextTitle from "components/text/TextTitle";
import { memo, useState } from "react";
import classes from "./styles.module.scss";
import Heading5 from "components/text/Heading5";
import { useTranslation } from "react-i18next";
import { CodeQuestionAdminEntity } from "models/codeAssessmentService/entity/CodeQuestionAdminEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { CodeQuestionFormData } from "../../type/CodeQuestionFormData";
import { Controller, useForm, useFormContext } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";

type Props = { codeQuestion: CodeQuestionAdminEntity | undefined };
type CodeQuestionInformationFormValue = {
  name: string;
  problemStatement: string;
  difficulty: QuestionDifficultyEnum;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  isPublic: boolean;
  allowImport: boolean;
};

const CodeQuestionInformation = ({ codeQuestion }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    control: codeQuestionControl,
    formState: { errors: codeQuestionFormErrors }
  } = useFormContext<CodeQuestionInformationFormValue>();
  const [inputFormat, setInputFormat] = useState<string>(
    "Gồm 2 số nguyên a và b cách nhau bởi dấu cách, được nhập từ bàn phím"
  );
  const [outputFormat, setOutputFormat] = useState<string>(
    "Là một số nguyên cho biết tổng của a và b"
  );
  const [contraints, setContraints] = useState<string>("a và b là số nguyên");
  const [questionName] = useState<string>("Tổng 2 số");
  const [difficulty, setDifficulty] = useState<string>(QuestionDifficultyEnum.EASY);
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
      <Controller
        name='name'
        control={codeQuestionControl}
        render={({ field: { onChange, value } }) => (
          <InputTextField
            onChange={onChange}
            value={value}
            errorMessage={codeQuestionFormErrors.name?.message}
            title={t("exam_management_create_question_name")}
            type='text'
            width='100%'
            translation-key='exam_management_create_question_name'
          />
        )}
      />

      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle translation-key='common_difficult_level'>
              {t("common_difficult_level")}
            </TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Controller
              name='difficulty'
              control={codeQuestionControl}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onChange={onChange} sx={{ width: "200px" }}>
                  <MenuItem value={QuestionDifficultyEnum.EASY} translation-key='common_easy'>
                    {t("common_easy")}
                  </MenuItem>
                  <MenuItem value={QuestionDifficultyEnum.MEDIUM} translation-key='common_medium'>
                    {t("common_medium")}
                  </MenuItem>
                  <MenuItem value={QuestionDifficultyEnum.HARD} translation-key='common_hard'>
                    {t("common_hard")}
                  </MenuItem>
                </Select>
              )}
            />
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
          <Controller
            name='problemStatement'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <TextEditor value={value} onChange={onChange} maxLines={12} sx={{}} />
            )}
          />
          {codeQuestionFormErrors.problemStatement?.message && (
            <ErrorMessage>{codeQuestionFormErrors.problemStatement.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={12}>
        <Grid item xs={3} translation-key='code_management_create_input_format'>
          <TextTitle>{t("code_management_create_input_format")}</TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditorSmall}>
          <Controller
            name='inputFormat'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <TextEditor value={value} onChange={onChange} maxLines={5} />
            )}
          />
          {codeQuestionFormErrors.inputFormat?.message && (
            <ErrorMessage>{codeQuestionFormErrors.inputFormat.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='code_management_create_constraint'>
            {t("code_management_create_constraint")}
          </TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditorSmall}>
          <Controller
            name='constraints'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <TextEditor value={value} onChange={onChange} maxLines={5} />
            )}
          />
          {codeQuestionFormErrors.constraints?.message && (
            <ErrorMessage>{codeQuestionFormErrors.constraints.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='code_management_create_output_format'>
            {t("code_management_create_output_format")}
          </TextTitle>
        </Grid>
        <Grid item xs={9} className={classes.textEditorSmall}>
          <Controller
            name='outputFormat'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <TextEditor value={value} onChange={onChange} maxLines={5} />
            )}
          />
          {codeQuestionFormErrors.outputFormat?.message && (
            <ErrorMessage>{codeQuestionFormErrors.outputFormat.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='common_public'>{t("common_public")}</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <Controller
            name='isPublic'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <Tooltip title={t("code_management_public_tool_tip")}>
                <Switch onChange={onChange} checked={value} />
              </Tooltip>
            )}
          />
          {codeQuestionFormErrors.isPublic?.message && (
            <ErrorMessage>{codeQuestionFormErrors.isPublic.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle translation-key='common_allow_import_contest'>
            {t("common_allow_import_contest")}
          </TextTitle>
        </Grid>
        <Grid item xs={9}>
          <Controller
            name='allowImport'
            control={codeQuestionControl}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          {codeQuestionFormErrors.allowImport?.message && (
            <ErrorMessage>{codeQuestionFormErrors.allowImport.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CodeQuestionInformation;

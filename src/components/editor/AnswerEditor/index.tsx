import {
  Grid,
  Select,
  MenuItem,
  createTheme,
  TextField,
  Badge,
  BadgeProps,
  styled
} from "@mui/material";
import Button from "@mui/joy/Button";
import TextEditor from "../TextEditor";
import AnswerPoint from "utils/AnswerPoint";
import qtype from "utils/constant/Qtype";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";

interface AnswerEditorProps {
  answerNumber: number;
  qtype: String;
  control: any;
  index: any;
  field: any;
  remove: any;
  errors: any;
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {}
}));

const AnswerEditor = (props: AnswerEditorProps) => {
  const { control, index, field, remove, errors } = props;
  const theme = createTheme();
  const { t } = useTranslation();
  const removeAnswerHandler = () => {
    remove(index);
  };

  return (
    <Grid
      border={1}
      width={"auto"}
      marginX={theme.spacing(1)}
      columnSpacing={1}
      rowSpacing={1}
      paddingBottom={1}
      paddingX={1}
      container
    >
      <Grid
        item
        xs={12}
        md={3}
        textAlign={{ xs: "left", md: "right" }}
        translation-key={["question_management_option", "common_answer"]}
      >
        {props.qtype === qtype.multiple_choice.code &&
          `${t("question_management_option")} ${props.answerNumber}`}
        {props.qtype === qtype.short_answer.code && `${t("common_answer")} ${props.answerNumber}`}
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        sx={{ height: props.qtype === qtype.multiple_choice.code ? "200px" : "auto" }}
      >
        {props.qtype === qtype.multiple_choice.code && (
          <TextEditor
            translation-key='question_management_enter_content'
            placeholder={`${t("question_management_enter_content")}...`}
            value={""}
          />
        )}
        {props.qtype === qtype.short_answer.code && (
          <Controller
            control={control}
            name={`answers.${index}.answer`}
            render={({ field }) => (
              <TextField size='small' {...field} error={errors?.answers?.[index]?.answer} />
            )}
          />
        )}
      </Grid>
      <Grid item xs={12} md={3}>
        <></>
      </Grid>
      <Grid item xs={12} md={9}>
        {errors?.answers?.[index]?.answer && (
          <ErrorMessage marginBottom={"10px"}>
            {errors?.answers?.[index]?.answer.message}
          </ErrorMessage>
        )}
      </Grid>

      <Grid
        item
        xs={12}
        md={3}
        textAlign={{ xs: "left", md: "right" }}
        translation-key='question_management_percentage'
      >
        {t("question_management_percentage")}
      </Grid>
      <Grid item xs={12} md={9}>
        <Controller
          control={control}
          name={`answers.${index}.fraction`}
          render={({ field }) => (
            <Select defaultValue={-1} size='small' {...field}>
              <MenuItem value={-1}>None</MenuItem>
              {AnswerPoint.map((item, i) => (
                <MenuItem key={i} value={i}>{`${item.percentNumber * 100}%`}</MenuItem>
              ))}
            </Select>
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        textAlign={{ xs: "left", md: "right" }}
        translation-key='question_management_general_comment'
      >
        {t("question_management_general_comment")}
      </Grid>
      <Grid item xs={12} md={9} className={classes.textEditor}>
        <Controller
          control={control}
          name={`answers.${index}.feedback`}
          render={({ field }) => (
            <TextEditor
              error={errors?.answers?.[index]?.feedback}
              translation-key='question_management_comment_answer'
              placeholder={`${t("question_management_comment_answer")}...`}
              {...field}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <></>
      </Grid>
      <Grid item xs={12} md={9}>
        {errors?.answers?.[index]?.feedback && (
          <ErrorMessage marginBottom={"10px"}>
            {errors?.answers?.[index]?.feedback.message}
          </ErrorMessage>
        )}
      </Grid>
      <Grid item xs={12} container justifyContent={"center"}>
        <Button
          color='primary'
          variant='outlined'
          translation-key='common_delete'
          onClick={removeAnswerHandler}
        >
          {t("common_delete")}
        </Button>
      </Grid>
      <Grid item xs={12} md={3}>
        <></>
      </Grid>
    </Grid>
  );
};

export default AnswerEditor;

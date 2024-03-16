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

interface AnswerEditorProps {
  answerNumber: number;
  qtype: String;
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {}
}));
const AnswerEditor = (props: AnswerEditorProps) => {
  const theme = createTheme();
  const { t } = useTranslation();
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
        {props.qtype === qtype.short_answer.code && <TextField size='small' />}
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
        <Select defaultValue={-1} size='small'>
          <MenuItem value={-1}>None</MenuItem>
          {AnswerPoint.map((item, i) => (
            <MenuItem key={i} value={i}>{`${item.percentNumber * 100}%`}</MenuItem>
          ))}
        </Select>
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
        <TextEditor
          translation-key='question_management_comment_answer'
          placeholder={`${t("question_management_comment_answer")}...`}
          value={""}
        />
      </Grid>
      <Grid item xs={12} container justifyContent={"center"}>
        <Button color='primary' variant='outlined' translation-key='common_delete'>
          {t("common_delete")}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AnswerEditor;

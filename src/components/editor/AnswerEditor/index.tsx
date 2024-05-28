import { Grid, Stack, Typography } from "@mui/material";
import Button from "@mui/joy/Button";
import TextEditor from "../TextEditor";
import AnswerPoint from "utils/AnswerPoint";
import qtype from "utils/constant/Qtype";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import DeleteIcon from "@mui/icons-material/Delete";

interface AnswerEditorProps {
  answerNumber: number;
  qtype: String;
  control: any;
  index: any;
  field: any;
  remove: any;
  errors: any;
}

const AnswerEditor = (props: AnswerEditorProps) => {
  const { control, index, field, remove, errors } = props;
  const { t } = useTranslation();
  const removeAnswerHandler = () => {
    remove(index);
  };

  return (
    <Grid
      border={1}
      columnSpacing={1}
      rowSpacing={1}
      paddingBottom={4}
      paddingX={2}
      spacing={props.qtype === qtype.multiple_choice.code ? 3 : 1}
      sx={{ borderRadius: "12px", borderColor: "#E0E0E0", borderStyle: "solid" }}
      container
    >
      <Grid item xs={12} md={12}>
        <Stack
          direction='row'
          spacing={3}
          justifyContent={"space-between"}
          alignContent={"center"}
          display={"flex"}
        >
          <Typography
            translation-key='question_management_option'
            className={classes.criteriaOrderText}
          >
            {t("common_answer")} {props.answerNumber + 1}
          </Typography>
          <Button
            color='danger'
            variant='soft'
            translation-key='common_delete'
            startDecorator={<DeleteIcon fontSize='small' />}
            onClick={removeAnswerHandler}
          >
            {t("common_delete")}
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        {props.qtype === qtype.multiple_choice.code && (
          <>
            <Typography
              translation-key='question_management_option'
              className={classes.generalDescription}
            >
              {t("question_management_option")}
            </Typography>
            <Controller
              control={control}
              name={`answers.${index}.answer`}
              render={({ field }) => (
                <TextEditor
                  roundedBorder
                  error={errors?.answers?.[index]?.answer}
                  translation-key='question_management_enter_content'
                  placeholder={`${t("question_management_enter_content")}...`}
                  {...field}
                />
              )}
            />
            {errors?.answers?.[index]?.answer && (
              <ErrorMessage marginBottom={"10px"}>
                {errors?.answers?.[index]?.answer?.message}
              </ErrorMessage>
            )}
          </>
        )}
        {props.qtype === qtype.short_answer.code && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={6} md={6}>
                <Controller
                  control={control}
                  name={`answers.${index}.answer`}
                  render={({ field }) => (
                    <InputTextFieldColumn
                      title={`${t("common_content")}`}
                      titleRequired
                      size='small'
                      {...field}
                      error={errors?.answers?.[index]?.answer}
                      errorMessage={errors?.answers?.[index]?.answer?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  translation-key='question_management_percentage'
                  className={classes.generalDescription}
                >
                  {t("question_management_percentage")}
                </Typography>
                <Controller
                  control={control}
                  name={`answers.${index}.fraction`}
                  defaultValue={-1}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onChange={(event, newValue) => onChange(newValue)}
                      sx={{ borderRadius: "12px", height: "40px" }}
                    >
                      <Option value={-1}>None</Option>
                      {AnswerPoint.map((item, i) => (
                        <Option
                          key={i}
                          value={item.percentNumber}
                        >{`${item.percentNumber * 100}%`}</Option>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      {props.qtype === qtype.multiple_choice.code && (
        <>
          <Grid item xs={12}>
            <></>
          </Grid>
          <Grid item xs={12}>
            <></>
          </Grid>
          <Grid item xs={12}>
            <></>
          </Grid>
          <Grid item xs={12}>
            <></>
          </Grid>
        </>
      )}

      <Grid item xs={12} md={12}>
        {props.qtype === qtype.multiple_choice.code && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  translation-key='question_management_percentage'
                  className={classes.generalDescription}
                >
                  {t("question_management_percentage")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name={`answers.${index}.fraction`}
                  defaultValue={-1}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onChange={(event, newValue) => onChange(newValue)}
                      sx={{ borderRadius: "12px", height: "40px" }}
                    >
                      <Option value={-1}>None</Option>
                      {AnswerPoint.map((item, i) => (
                        <Option
                          key={i}
                          value={item.percentNumber}
                        >{`${item.percentNumber * 100}%`}</Option>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      {props.qtype === qtype.multiple_choice.code && (
        <>
          <Grid item xs={12}>
            <></>
          </Grid>
          <Grid item xs={12}>
            <></>
          </Grid>
        </>
      )}
      <Grid item xs={12} md={12} translation-key='question_management_general_comment'>
        <Typography className={classes.generalDescription}>
          {t("question_management_general_comment")}{" "}
          <span className={classes.errorTextStar}>*</span>
        </Typography>
        <Controller
          control={control}
          name={`answers.${index}.feedback`}
          render={({ field }) => (
            <TextEditor
              roundedBorder
              error={errors?.answers?.[index]?.feedback}
              translation-key='question_management_comment_answer'
              placeholder={`${t("question_management_comment_answer")}...`}
              {...field}
            />
          )}
        />
        {errors?.answers?.[index]?.feedback && (
          <ErrorMessage marginBottom={"10px"}>
            {errors?.answers?.[index]?.feedback.message}
          </ErrorMessage>
        )}
      </Grid>
      <Grid item xs={12}>
        <></>
      </Grid>
      <Grid item xs={12}>
        <></>
      </Grid>
    </Grid>
  );
};

export default AnswerEditor;

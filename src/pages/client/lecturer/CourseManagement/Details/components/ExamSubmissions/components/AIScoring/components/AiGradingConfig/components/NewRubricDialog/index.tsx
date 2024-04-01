import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField,
  Slide,
  AppBar,
  Toolbar,
  Container,
  Input,
  IconButton,
  Box,
  Stack,
  Divider
} from "@mui/material";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { closeNewRubric } from "reduxes/NewEditRubricDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { open as openSelectRubricDialog } from "reduxes/SelectRubricDialog";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { useTranslation } from "react-i18next";
import { forwardRef, useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";
import { useForm, useFieldArray, Controller, set } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

interface PropsData {
  name?: string;
  description?: string;
  headerHeight: number;
}
interface NestedPropsData {
  parentIndex: number;
  control: any;
  register: any;
}
const maxScale = 6;
const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    max-height: 280px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? "#C7D0DD" : "#1C2025"};
    background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"};

    &:hover {
      border-color: 'red !important';
    }

    &:focus {
      outline: 0;
      border-color: '#3788d8';
      box-shadow: 0 0 0 2px ${theme.palette.mode === "dark" ? "#0072E5" : "#3788d8"};
    }
  `
);
const ScaleTextArea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 40px;
    max-height: 280px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? "#C7D0DD" : "#1C2025"};
    background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"};

    &:hover {
      border-color: 'red !important';
    }

    &:focus {
      outline: 0;
      border-color: '#3788d8';
      box-shadow: 0 0 0 2px ${theme.palette.mode === "dark" ? "#0072E5" : "#3788d8"};
    }
  `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const NewRubricDialog = ({ headerHeight }: PropsData) => {
  const { register, control, handleSubmit, reset, resetField, trigger, setError } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "criteria"
  });

  fields.forEach((field, index) => {
    // Code block containing useFieldArray hook moved here
  });

  const status = useSelector((state: RootState) => state.rubricDialog.newRubricStatus);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleResetForm = () => {
    reset({ criteria: [] });
  };
  const handleBack = () => {
    handleResetForm();
    dispatch(closeNewRubric());
    dispatch(openSelectRubricDialog());
  };
  const onSave = (data: any) => {
    // dispatch(closeNewRubric());
    alert(JSON.stringify(data));
  };
  const handleAddNewCriteriaField = () => {
    append({ criteriaName: "" });
  };
  const handleRemoveCriteriaField = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={status}
        aria-labelledby='new-rubric-dialog-app-bar'
        aria-describedby='alert-dialog-description'
        className={classes.container}
        fullWidth={true}
        maxWidth={"sm"}
        sx={{ height: "100%" }}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{ position: "relative", backgroundColor: "white" }}
          id='new-rubric-dialog-app-bar'
        >
          <Container maxWidth='lg'>
            <Toolbar>
              <Typography
                sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d2130", flex: 1 }}
                translation-key='grading_config_add_new_rubric'
              >
                {t("grading_config_add_new_rubric")}
              </Typography>

              <DialogActions>
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ textAlign: "center" }}
                  variant='outlined'
                  translation-key='grading_config_back_to_select_rubric'
                >
                  {t("grading_config_back_to_select_rubric")}
                </Button>
                <Button
                  autoFocus
                  variant='contained'
                  translation-key='common_save'
                  type='submit'
                  onClick={handleSubmit(onSave)}
                >
                  {t("common_save")}
                </Button>
              </DialogActions>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth='lg'>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <form onSubmit={handleSubmit(onSave)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      className={classes.configlabel}
                      translation-key='grading_config_select_rubric_dialog_name'
                    >
                      {t("grading_config_select_rubric_dialog_name")}
                    </Typography>

                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant='outlined'
                          fullWidth
                          color='primary'
                          InputProps={{ className: classes.inputTextField }}
                          placeholder='Nhập tên rubric'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      className={classes.configlabel}
                      translation-key='common_description'
                    >
                      {t("common_description")}
                    </Typography>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          aria-label='empty textarea'
                          placeholder='Positive with focus on where the user can improve'
                          minLength={3}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ color: "black", marginBottom: "5px" }}
                      translation-key='grading_config_criteria'
                    >
                      {t("grading_config_criteria")}
                    </Typography>
                    <Grid container gap={2}>
                      {fields.map((field, index) => (
                        <Grid item xs={12} key={field.id}>
                          <Stack direction='row' spacing={1} alignItems={"center"}>
                            <Typography
                              className={classes.criteriaOrderText}
                            >{`${index + 1} / ${fields.length}`}</Typography>{" "}
                            <IconButton
                              sx={{
                                backgroundColor: "#ffd7db"
                              }}
                              type='button'
                              onClick={() => remove(index)}
                              color='primary'
                              className={classes.removeCriteriaIconButton}
                            >
                              <DeleteIcon color='error' sx={{ fontSize: "16px" }} />
                            </IconButton>
                          </Stack>

                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography
                                className={classes.configlabel}
                                translation-key='grading_config_criteria_name'
                              >
                                {t("grading_config_criteria_name")}
                              </Typography>
                              <TextField
                                id='outlined-basic'
                                variant='outlined'
                                fullWidth
                                InputProps={{ className: classes.inputTextField }}
                                {...register(`criteria.${index}.criteriaName`)}
                                placeholder={t("grading_config_enter_criteria_name")}
                                translation-key='grading_config_enter_criteria_name'
                              />
                              <Typography
                                className={classes.configlabel}
                                sx={{ marginTop: "10px" }}
                                translation-key='grading_config_criteria_description'
                              >
                                {t("grading_config_criteria_description")}
                              </Typography>
                              <Textarea
                                aria-label='empty textarea'
                                placeholder='Positive with focus on where the user can improve'
                                minLength={3}
                                {...register(`criteria.${index}.criteriaDescription`)}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={1}>
                                <NestedGradeScale parentIndex={index} {...{ control, register }} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Divider sx={{ marginTop: "10px" }} />
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      variant='outlined'
                      translation-key='grading_config_select_criteria'
                      sx={{ marginTop: "20px" }}
                      startIcon={
                        <AddIcon
                          sx={{
                            color: "#0072E5"
                          }}
                        />
                      }
                      onClick={handleAddNewCriteriaField}
                    >
                      {t("grading_config_select_criteria")}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </DialogContentText>
          </DialogContent>
        </Container>
      </Dialog>
    </>
  );
};

const NestedGradeScale = ({ parentIndex, control, register }: NestedPropsData) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `criteria[${parentIndex}].scaleDescription`
  });
  const handleAppend = () => {
    fields.length < maxScale && append({ scaleDescription: "" });
  };
  const handleRemove = () => {
    fields.length > 1 && remove(fields.length - 1);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography className={classes.configlabel} translation-key='grading_config_criteria_scale'>
          {t("grading_config_criteria_scale")}
        </Typography>
        <Stack direction='row' spacing={1} alignItems={"center"}>
          <IconButton
            onClick={handleAppend}
            size='small'
            disabled={fields.length >= maxScale ? true : false}
          >
            <ArrowDropUpRoundedIcon fontSize='inherit' />
          </IconButton>
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: "var(--green-200)",
              padding: "5px",
              width: "2rem",
              height: "2rem"
            }}
          >
            <Typography textAlign={"center"}>{`${fields.length}`}</Typography>{" "}
          </Box>
          <IconButton
            onClick={handleRemove}
            size='small'
            disabled={fields.length < 1 ? true : false}
          >
            <ArrowDropDownRoundedIcon fontSize='inherit' />
          </IconButton>
        </Stack>
      </Grid>
      {fields.map((field, index) => (
        <Grid item xs={4} key={field.id}>
          <Typography
            className={classes.configlabel}
            translation-key='grading_config_criteria_scale_description'
          >
            {t("grading_config_criteria_scale_description", { index: index + 1 })}
          </Typography>
          <ScaleTextArea
            aria-label='empty textarea'
            minLength={3}
            {...register(`criteria[${parentIndex}].scaleDescription[${index}].scale${index}`)}
            placeholder={t("grading_config_enter_scale", { index: index + 1 })}
          />
        </Grid>
      ))}
    </>
  );
};
export default NewRubricDialog;

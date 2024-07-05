import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
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
import { forwardRef, useEffect, useRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";
import { useForm, useFieldArray, Controller, set } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import Heading6 from "components/text/Heading6";
import Heading5 from "components/text/Heading5";
import Heading3 from "components/text/Heading3";
import Heading2 from "components/text/Heading2";
import useBoxDimensions from "hooks/useBoxDimensions";
import { CreateRubricUserCommand } from "models/courseService/entity/RubricUserEntity";
import useAuth from "hooks/useAuth";
import { RubricUserService } from "services/courseService/RubricUser";
import { setSuccessMess } from "reduxes/AppStatus";

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
  const { loggedUser } = useAuth();
  const handleBack = () => {
    handleResetForm();
    dispatch(closeNewRubric());
    dispatch(openSelectRubricDialog());
  };
  const onSave = async (data: any) => {
    const createRubricUserCommandData: CreateRubricUserCommand = {
      rubricName: data.name,
      rubricDescription: data.description,
      rubricContent: JSON.stringify(data.criteria),
      userId: loggedUser?.userId || ""
    };

    await RubricUserService.createRubricUser(createRubricUserCommandData)
      .then((res) => {
        dispatch(setSuccessMess("Rubric created successfully"));
        dispatch(closeNewRubric());
      })
      .catch((err) => {
        console.error("Failed to create rubric", err);
      });
  };
  const handleAddNewCriteriaField = () => {
    append({
      criteriaName: "",
      criteriaGrade: "",

      scale: [{ score: 1, description: "" }]
    });
  };
  const handleRemoveCriteriaField = (index: number) => {
    remove(index);
  };

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const { height: stickyHeaderHeight } = useBoxDimensions({ ref: stickyHeaderRef });

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
        sx={{
          height: "100%",

          "& .MuiDialog-paper": {
            overflow: "hidden"
          }
        }}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "fixed", backgroundColor: "white" }}>
          <Box>
            <Toolbar ref={stickyHeaderRef}>
              <Heading2 sx={{ flex: 1 }} translation-key='grading_config_add_new_rubric'>
                {t("grading_config_add_new_rubric")}
              </Heading2>

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
          </Box>
        </AppBar>

        <Box
          sx={{
            marginTop: `${stickyHeaderHeight === 0 ? 64 : stickyHeaderHeight}px`,
            overflowY: "auto"
          }}
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <form onSubmit={handleSubmit(onSave)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Heading6 translation-key='grading_config_select_rubric_dialog_name'>
                      {t("grading_config_select_rubric_dialog_name")}
                    </Heading6>

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
                          placeholder='Rubric name...'
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Heading6 className={classes.configlabel} translation-key='common_description'>
                      {t("common_description")}
                    </Heading6>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          aria-label='empty textarea'
                          placeholder='Rubric description...'
                          minLength={3}
                          {...field}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Heading5
                      sx={{ color: "black", marginBottom: "5px" }}
                      translation-key='grading_config_criteria'
                    >
                      {t("grading_config_criteria")}
                    </Heading5>
                    <Grid container gap={2}>
                      {fields.map((field, index) => (
                        <Grid item xs={12} key={field.id}>
                          <Stack direction='row' spacing={1} alignItems={"center"}>
                            <Heading6
                              className={classes.criteriaOrderText}
                            >{`${index + 1} / ${fields.length}`}</Heading6>{" "}
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

                          <Grid container>
                            <Grid item xs={12} display={"flex"} direction={"column"} gap={"5px"}>
                              <Heading6 translation-key='grading_config_criteria_name'>
                                {t("grading_config_criteria_name")}
                              </Heading6>
                              <TextField
                                id='outlined-basic'
                                variant='outlined'
                                fullWidth
                                InputProps={{ className: classes.inputTextField }}
                                {...register(`criteria.${index}.criteriaName`)}
                                placeholder={t("grading_config_enter_criteria_name")}
                                translation-key='grading_config_enter_criteria_name'
                              />
                              <Heading6 translation-key='grading_config_criteria_grade'>
                                {t("grading_config_criteria_grade")} (Optional)
                              </Heading6>
                              <TextField
                                id='outlined-basic'
                                variant='outlined'
                                type='number'
                                fullWidth
                                InputProps={{ className: classes.inputTextField }}
                                {...register(`criteria.${index}.criteriaGrade`)}
                                placeholder={t("grading_config_criteria_grade_enter")}
                                translation-key='grading_config_criteria_grade_enter'
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
        </Box>
      </Dialog>
    </>
  );
};

const NestedGradeScale = ({ parentIndex, control, register }: NestedPropsData) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `criteria[${parentIndex}].scale`
  });
  const handleAppend = () => {
    fields.length < maxScale && append({ score: fields.length + 1, description: "" });
  };
  const handleRemove = () => {
    fields.length > 1 && remove(fields.length - 1);
  };

  return (
    <>
      <Grid item xs={12}>
        <Heading6 className={classes.configlabel} translation-key='grading_config_criteria_scale'>
          {t("grading_config_criteria_scale")}
        </Heading6>
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
            <Heading6 textAlign={"center"}>{`${fields.length}`}</Heading6>{" "}
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
      {fields.map((field: any, index) => (
        <Grid item xs={4} key={field.id}>
          <Heading6
            className={classes.configlabel}
            translation-key='grading_config_criteria_scale_description'
          >
            {`${t("grading_config_criteria_scale_description", { index: field.score })}/${fields.length}`}
          </Heading6>
          <ScaleTextArea
            aria-label='empty textarea'
            minLength={3}
            {...register(`criteria[${parentIndex}].scale[${index}].description`)}
            placeholder={`${t("grading_config_enter_scale", { index: index + 1 })}/${fields.length}`}
          />
        </Grid>
      ))}
    </>
  );
};
export default NewRubricDialog;

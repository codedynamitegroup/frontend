import React, { useRef, useState } from "react";
import classes from "./styles.module.scss";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import Header from "components/Header";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { useTranslation } from "react-i18next";
import StepButton from "@mui/material/StepButton";
import GradingConfigSelect from "./components/GradingConfigSelect";
import useBoxDimensions from "hooks/useBoxDimensions";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import clsx from "clsx";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import MenuIcon from "@mui/icons-material/Menu";

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    max-height: 340px;
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
      border-color: '#3399FF';
    }

    &:focus {
      outline: 0;
      border-color: '#3399FF';
      box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? "#0072E5" : "#b6daff"};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const GradingConfig = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const { width: rootWidth } = useBoxDimensions({ ref: rootRef });

  const steps = [t("grading_config_setting"), t("grading_config_choose_criteria")];
  const language = [
    { label: t("common_automatic"), value: "automatic" },
    { label: t("language_vn"), value: "vn" },
    { label: t("language_us"), value: "en" }
  ];
  const textType = [
    { label: t("common_question_type_essay"), value: "essay" },
    { label: t("common_question_type_multi_choice"), value: "multiChoice" },
    { label: t("common_question_type_short"), value: "short" },
    { label: t("common_question_type_yes_no"), value: "trueFalse" },
    { label: t("common_question_type_code"), value: "code" }
  ];
  const difficulty = [
    { label: t("common_easy"), value: "easy" },
    { label: t("common_medium"), value: "medium" },
    { label: t("common_hard"), value: "hard" }
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const onSelectLanguage = (value: string) => {
    console.log(value);
  };
  const [gradeScale, setGradeScale] = React.useState("letter");

  const handleGradeScaleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGradeScale((event.target as HTMLInputElement).value);
  };
  const handleNextButton = () => {
    activeStep === 0 && setActiveStep(1);
    activeStep === 1 && navigate(routes.lecturer.course.assignment);
  };
  const handleBackButton = () => {
    activeStep === 1 && setActiveStep(0);
    activeStep === 0 && navigate(routes.lecturer.course.assignment);
  };

  return (
    <Box className={classes.root} ref={rootRef}>
      <Header />
      <Grid container justifyContent='center' gap={5} sx={{ display: "flex", overflow: "hidden" }}>
        <Grid item xs={12}>
          <Toolbar>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.management)}
                translation-key='common_course_management'
              >
                {t("common_course_management")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.information)}
              >
                CS202 - Nhập môn lập trình
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.assignment)}
                translation-key='course_detail_assignment_list'
              >
                {t("course_detail_assignment_list")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                translation-key='assignment_management_create_assignment'
              >
                {t("assignment_management_create_assignment")}
              </ParagraphSmall>
            </Box>
          </Toolbar>
        </Grid>
        <Grid item xs={5}>
          <Stepper activeStep={activeStep} nonLinear alternativeLabel={rootWidth < 670}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12}>
          {activeStep === 0 && (
            <Container maxWidth='lg' className={classes.container}>
              <Grid container justifyContent='center' paddingTop={"10px"} spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    className={classes.generalDescription}
                    translation-key='grading_config_description'
                  >
                    {t("grading_config_description")}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={5}>
                    <Grid item xs={6}>
                      <GradingConfigSelect
                        translation-key={["common_language", "common_automatic"]}
                        items={language}
                        label={t("common_language")}
                        changeItemHandler={onSelectLanguage}
                        defaultValue={"automatic"}
                        showIcon={true}
                        iconDescription='Chọn ngôn ngữ dùng để đánh giá bài làm của sinh viên'
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <GradingConfigSelect
                        items={textType}
                        label={t("grading_config_exam_type")}
                        translation-key='grading_config_exam_type'
                        changeItemHandler={onSelectLanguage}
                        defaultValue='essay'
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <GradingConfigSelect
                        items={difficulty}
                        label={t("common_difficult_level")}
                        changeItemHandler={onSelectLanguage}
                        defaultValue='easy'
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl size='small'>
                        <FormLabel
                          id='demo-controlled-radio-buttons-group'
                          className={clsx(classes.selectLabel, classes.configlabel)}
                          translation-key='grading_config_scale'
                        >
                          {t("grading_config_scale")}
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby='demo-controlled-radio-buttons-group'
                          name='controlled-radio-buttons-group'
                          value={gradeScale}
                          onChange={handleGradeScaleGroupChange}
                        >
                          <Stack
                            direction={rootWidth >= 400 ? "row" : "column"}
                            gap={rootWidth < 510 ? 1 : 5}
                          >
                            <Stack direction='row' alignItems={"center"}>
                              <FormControlLabel
                                value='letter'
                                control={<Radio size='small' />}
                                label={t("grading_config_letter_scale")}
                                translation-key='grading_config_letter_scale'
                                sx={{ marginRight: "5px" }}
                              />
                              <Tooltip title={"iconDescription"} placement='top' arrow>
                                <InfoIcon className={classes.infoIcon} color='primary' />
                              </Tooltip>
                            </Stack>
                            <Stack direction='row' gap={-1} alignItems={"center"}>
                              <FormControlLabel
                                value='point'
                                control={<Radio size='small' />}
                                label={t("grading_config_point_scale")}
                                translation-key='grading_config_point_scale'
                                sx={{ marginRight: "5px" }}
                              />
                              <Tooltip title={"iconDescription"} placement='top' arrow>
                                <InfoIcon className={classes.infoIcon} color='primary' />
                              </Tooltip>
                            </Stack>
                          </Stack>
                          <Typography
                            translation-key='grading_config_scale_note'
                            sx={{ fontSize: "12px", color: "#6c757d" }}
                          >
                            {t("grading_config_scale_note")}
                          </Typography>
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <Stack direction='row' spacing={0.8} alignItems={"center"}>
                        <Typography
                          className={classes.configlabel}
                          translation-key='grading_config_feedback_style'
                        >
                          {t("grading_config_feedback_style")}
                        </Typography>
                        <Tooltip
                          title={t("grading_config_feedback_style_note")}
                          translation-key='grading_config_feedback_style_note'
                          placement='top'
                          arrow
                        >
                          <InfoIcon className={classes.infoIcon} color='primary' />
                        </Tooltip>
                      </Stack>
                      <Textarea
                        aria-label='empty textarea'
                        placeholder='Positive with focus on where the user can improve'
                        minLength={3}
                      />{" "}
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' spacing={0.8} alignItems={"center"}>
                        <Typography
                          className={classes.configlabel}
                          translation-key='grading_config_feedback_style'
                        >
                          {t("grading_config_answer_objective")}
                        </Typography>
                        <Tooltip
                          translation-key='grading_config_answer_objective_note'
                          title={t("grading_config_answer_objective_note")}
                          placement='top'
                          arrow
                        >
                          <InfoIcon className={classes.infoIcon} color='primary' />
                        </Tooltip>
                      </Stack>
                      <Textarea
                        aria-label='empty textarea'
                        placeholder='Explore the relationship of different algorithms and how they relate to different systems'
                      />{" "}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          )}
        </Grid>
      </Grid>
      <Stack
        className={classes.stickyFooter}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          variant='outlined'
          className={classes.stepButton}
          translation-key='common_back'
          onClick={handleBackButton}
        >
          {t("common_back")}
        </Button>
        <Button
          variant='contained'
          className={classes.stepButton}
          translation-key='common_continue'
          onClick={handleNextButton}
        >
          {activeStep === 1 ? t("common_finish") : t("common_continue")}
        </Button>
      </Stack>
    </Box>
  );
};

export default GradingConfig;

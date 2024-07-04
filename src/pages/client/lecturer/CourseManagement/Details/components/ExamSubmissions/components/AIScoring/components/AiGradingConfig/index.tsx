import React, { useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Button, Container, CssBaseline, Grid, Stack, Toolbar } from "@mui/material";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import useBoxDimensions from "hooks/useBoxDimensions";
import { styled } from "@mui/material/styles";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import AddIcon from "@mui/icons-material/Add";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import GradingConfigSelect from "./components/GradingConfigSelect";
import RubricCard from "./components/RubricCard";
import SelectRubricDialog from "./components/SelectRubricDialog";
import { useDispatch } from "react-redux";
import { open as openSelectRubricDialog } from "reduxes/SelectRubricDialog";
import NewRubricDialog from "./components/NewRubricDialog";
import SelectCriteriaConfig from "./components/SelectCriteriaDialog";
import { useSelector } from "react-redux";
import { RootState } from "store";
import ParagraphBody from "components/text/ParagraphBody";
import Heading5 from "components/text/Heading5";
import { RubricUserEntity } from "models/courseService/entity/RubricUserEntity";
import { AssignmentService } from "services/courseService/AssignmentService";
import { CreateReportEssayAICommand } from "models/courseService/entity/create/CreateReportEssayAICommand";
import { setSuccessMess } from "reduxes/AppStatus";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

enum EFeedbackLanguage {
  Vietnamese = "Vietnamese",
  English = "English"
}
// const Textarea = styled(BaseTextareaAutosize)(
//   ({ theme }) => `
//     box-sizing: border-box;
//     width: 100%;
//     height: 100%;
//     max-width: 100%;
//     min-width: 100%;
//     min-height: 150px;
//     max-height: 340px;
//     font-family: 'IBM Plex Sans', sans-serif;
//     font-size: 0.875rem;
//     font-weight: 400;
//     line-height: 1.5;
//     padding: 12px;
//     border-radius: 12px 12px 0 12px;
//     color: ${theme.palette.mode === "dark" ? "#C7D0DD" : "#1C2025"};
//     background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
//     border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
//     box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"};

//     &:hover {
//       border-color: '#3399FF';
//     }

//     &:focus {
//       outline: 0;
//       border-color: '#3399FF';
//       box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? "#0072E5" : "#b6daff"};
//     }

//     // firefox
//     &:focus-visible {
//       outline: 0;
//     }
//   `
// );

const GradingConfig = () => {
  const drawerWidth = 450;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);
  const { width: rootWidth } = useBoxDimensions({ ref: rootRef });
  const [rubricSelected, setRubricSelected] = useState<RubricUserEntity | undefined>(undefined);

  const onSelectRubric = (rubric: RubricUserEntity) => {
    setRubricSelected(rubric);
  };
  const onDeleteSelectedRubric = () => {
    setRubricSelected(undefined);
  };

  const { courseId } = useParams<{ courseId: string }>();
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const language = [
    { label: t("language_vn"), value: EFeedbackLanguage.Vietnamese },
    { label: t("language_us"), value: EFeedbackLanguage.English }
  ];
  const [selectedFeedbackLanguage, setSelectedFeedbackLanguage] = useState<EFeedbackLanguage>(
    EFeedbackLanguage.English
  );

  const onSelectLanguage = (value: string) => {
    setSelectedFeedbackLanguage(value as EFeedbackLanguage);
  };
  // const [gradeScale, setGradeScale] = React.useState("letter");

  // const handleGradeScaleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setGradeScale((event.target as HTMLInputElement).value);
  // };
  const onSubmit = async () => {
    if (!assignmentId) return;
    const createReportEssayAICommand: CreateReportEssayAICommand = {
      assignmentId: assignmentId,
      rubricId: rubricSelected?.id,
      feedbackLanguage: selectedFeedbackLanguage
    };
    await AssignmentService.createReportGradeEssayAI(createReportEssayAICommand)
      .then((res) => {
        dispatch(setSuccessMess("Create report successfully"));
        navigate(
          routes.lecturer.assignment.detail
            .replace(":assignmentId", assignmentId)
            .replace(":courseId", courseId || "")
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChooseRubric = () => {
    dispatch(openSelectRubricDialog());
  };

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginRight: drawerWidth
    })
  }));

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const header2Ref = useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({ ref: header2Ref });

  const stickyFooterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFooterHeight } = useBoxDimensions({ ref: stickyFooterRef });
  const stateRubricDialog = useSelector((state: RootState) => state.selectRubricDialog);
  const stateNewRubricDialog = useSelector((state: RootState) => state.rubricDialog);

  return (
    <>
      <Box className={classes.root} ref={rootRef}>
        <Header />
        <Box>
          <CssBaseline />
          <AppBar
            position='fixed'
            className={classes.tabs}
            sx={{
              marginTop: `${sidebarStatus.headerHeight}px`,
              backgroundColor: "white"
            }}
            ref={header2Ref}
            open={false}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.management)}
                >
                  Quản lý khoá học
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
                >
                  Danh sách bài tập
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.exam.detail)}
                >
                  Bài kiểm tra cuối kỳ
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.exam.submissions)}
                >
                  Danh sách bài nộp
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall colorname='--blue-500'>Chấm điểm AI</ParagraphSmall>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <CssBaseline />

        <Box
          sx={{
            marginTop: `${sidebarStatus.headerHeight + header2Height}px`,
            paddingTop: "20px",
            paddingBottom: `${stickyFooterHeight}px`
          }}
        >
          <Grid container justifyContent='center' sx={{}} gap={5}>
            <Grid item xs={12}>
              {/* {activeStep === 2 && (
                <Container maxWidth='lg' className={classes.container}>
                  <Grid container justifyContent='center' paddingTop={"10px"} spacing={2}>
                    <Grid item xs={12}>
                      <ParagraphBody
                        className={classes.generalDescription}
                        translation-key='grading_config_description'
                      >
                        {t("grading_config_description")}
                      </ParagraphBody>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={5}>
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
                                  <Tooltip
                                    title={t("grading_config_letter_description")}
                                    translation-key='grading_config_letter_description'
                                    placement='top'
                                    arrow
                                  >
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
                                  <Tooltip
                                    title={t("grading_config_point_description")}
                                    placement='top'
                                    arrow
                                    translation-key='grading_config_point_description'
                                  >
                                    <InfoIcon className={classes.infoIcon} color='primary' />
                                  </Tooltip>
                                </Stack>
                              </Stack>
                              <ParagraphBody
                                translation-key='grading_config_scale_note'
                                sx={{ fontSize: "12px", color: "#6c757d" }}
                              >
                                {t("grading_config_scale_note")}
                              </ParagraphBody>
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                          <Stack direction='row' spacing={0.8} alignItems={"center"}>
                            <ParagraphBody
                              className={classes.configlabel}
                              translation-key='grading_config_feedback_style'
                            >
                              {t("grading_config_feedback_style")}
                            </ParagraphBody>
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
                            <ParagraphBody
                              className={classes.configlabel}
                              translation-key='grading_config_feedback_style'
                            >
                              {t("grading_config_answer_objective")}
                            </ParagraphBody>
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
              )} */}

              <Container maxWidth='lg' className={classes.container}>
                <Grid container paddingTop={"10px"} spacing={2}>
                  <Grid item xs={12}>
                    <ParagraphBody
                      className={classes.generalDescription}
                      translation-key='grading_config_select_criteria_description'
                    >
                      {t("grading_config_select_criteria_description")}
                    </ParagraphBody>
                  </Grid>
                  <Grid item xs={12}>
                    <Heading5 translation-key='grading_config_rubric'>
                      {`${t("grading_config_rubric")} `}
                      {
                        <Heading5
                          display={"inline"}
                          fontWeight={400}
                          translation-key='grading_config_optional'
                        >
                          ({t("grading_config_optional")})
                        </Heading5>
                      }
                    </Heading5>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                      <Button
                        variant='outlined'
                        className={classes.addBtn}
                        startIcon={<AddIcon color='primary' />}
                        fullWidth
                        onClick={handleChooseRubric}
                        translation-key='grading_config_select_rubric'
                      >
                        {t("grading_config_select_rubric")}{" "}
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <RubricCard
                      selectedRubric={rubricSelected}
                      onDeleteSelectedRubric={onDeleteSelectedRubric}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <GradingConfigSelect
                      translation-key={["common_language", "common_automatic"]}
                      items={language}
                      label={t("common_language")}
                      changeItemHandler={onSelectLanguage}
                      defaultValue={selectedFeedbackLanguage}
                      showIcon={true}
                      iconDescription='Chọn ngôn ngữ dùng để đánh giá bài làm của sinh viên'
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                      <ParagraphBody className={classes.critTitle}>{`Criteria `}</ParagraphBody>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                        <Button
                          variant='outlined'
                          className={classes.addBtn}
                          startIcon={<AddIcon color='primary' />}
                          fullWidth
                          onClick={handleAddCriteria}
                          translation-key='grading_config_select_criteria'
                        >
                          {t("grading_config_select_criteria")}
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction='column' spacing={2}>
                        <CriteriaCard name='Criteria 1' />
                        <CriteriaCard name='Criteria 2' />
                        <CriteriaCard name='Criteria 9' />
                      </Stack>
                    </Grid> */}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </Box>
        <Stack
          className={classes.stickyFooter}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          ref={stickyFooterRef}
        >
          <Button
            variant='outlined'
            className={classes.stepButton}
            translation-key='common_back'
            onClick={() => {
              navigate(
                routes.lecturer.assignment.detail
                  .replace(":assignmentId", assignmentId || "")
                  .replace(":courseId", courseId || "")
              );
            }}
          >
            {t("common_back")}
          </Button>
          <Button
            variant='contained'
            className={classes.stepButton}
            translation-key='common_continue'
            onClick={onSubmit}
          >
            {t("common_finish")}
          </Button>
        </Stack>
      </Box>
      {stateRubricDialog.status && (
        <>
          <SelectRubricDialog onSelectRubric={onSelectRubric} />
        </>
      )}

      {stateNewRubricDialog.newRubricStatus && (
        <NewRubricDialog headerHeight={sidebarStatus.headerHeight} />
      )}

      <SelectCriteriaConfig />
    </>
  );
};

export default GradingConfig;

import React, { useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Button, Container, Grid, Stack } from "@mui/material";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import AddIcon from "@mui/icons-material/Add";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Buttons from "components/Buttons";
import Heading2 from "components/text/Heading2";

enum EFeedbackLanguage {
  Vietnamese = "Vietnamese",
  English = "English"
}

const GradingConfig = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);
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

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const stickyFooterRef = useRef<HTMLDivElement>(null);
  const { height: stickyFooterHeight } = useBoxDimensions({ ref: stickyFooterRef });
  const stateRubricDialog = useSelector((state: RootState) => state.selectRubricDialog);
  const stateNewRubricDialog = useSelector((state: RootState) => state.rubricDialog);

  return (
    <>
      <Box className={classes.root} ref={rootRef}>
        <Header />

        <Box
          sx={{
            marginTop: `${sidebarStatus.headerHeight}px`,
            paddingTop: "20px",
            paddingBottom: `${stickyFooterHeight}px`
          }}
        >
          <Grid container justifyContent='center' sx={{}} gap={5}>
            <Grid item xs={12}>
              <Container maxWidth='lg' className={classes.container}>
                <Grid container paddingTop={"10px"} spacing={2}>
                  <Grid item xs={12}>
                    <Buttons
                      children={t("common_back")}
                      btnType={"Blue"}
                      onClick={() => {
                        navigate(
                          routes.lecturer.assignment.detail
                            .replace(":courseId", courseId || "")
                            .replace(":assignmentId", assignmentId || "")
                        );
                      }}
                      startIcon={
                        <ChevronLeftIcon
                          sx={{
                            color: "white"
                          }}
                        />
                      }
                      width='fit-content'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Heading2 translation-key='grading_config_select_criteria'>
                      {t("grading_config_select_criteria")}
                    </Heading2>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody translation-key='grading_config_select_criteria_description'>
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

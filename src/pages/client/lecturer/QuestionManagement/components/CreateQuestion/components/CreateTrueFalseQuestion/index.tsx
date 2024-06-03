import { Box, Container, Grid, Typography, Stack, Divider } from "@mui/material";
import Header from "components/Header";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { PostMultipleChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "components/text/ErrorMessage";
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { isValidDecimal } from "utils/coreService/convertDecimalPoint";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Footer from "components/Footer";

import TitleWithInfoTip from "../../../../../../../../components/text/TitleWithInfo";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import JoyButton from "@mui/joy/Button";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { setQuestionCreate } from "reduxes/coreService/questionCreate";

interface Props {
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: string;
  generalDescription?: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
  showInstructions: string;
  showNumCorrect: string;
}

const CreateTrueFalseQuestion = (props: Props) => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [snackbarContent, setSnackbarContent] = useState<string>("");
  const [submitCount, setSubmitCount] = useState(0);

  const navigate = useNavigate();

  const headerRef = useRef<HTMLDivElement>(null);
  let { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });
  if (props.insideCrumb) headerHeight = 0;
  // const [initialized, setInitialized] = useState(true);
  // let outletContext: any = useOutletContext();
  // let outletTab = outletContext?.value;
  // useEffect(() => {
  //   if (initialized) {
  //     setInitialized(false);
  //   } else {
  //     navigate("/lecturer/question-bank-management");
  //   }
  // }, [outletTab]);

  const urlParams = useParams();

  //  Form handler
  const schema = useMemo(() => {
    return yup.object().shape({
      questionName: yup.string().required(t("question_name_required")).trim(),
      questionDescription: yup
        .string()
        .required(t("question_description_required"))
        .trim("")
        .test("isQuillEmpty", t("question_description_required"), (value) => !isQuillEmpty(value)),
      defaultScore: yup
        .string()
        .required(t("question_default_score_required"))
        .test(
          "is-decimal",
          "Invalid number, default score must be a number greater than or equal 0",
          (value) => isValidDecimal(value)
        )
        .transform((value) => value.replace(",", ".")),
      generalDescription: yup.string().trim(""),

      correctFeedback: yup.string(),
      incorrectFeedback: yup.string(),
      showInstructions: yup.string().required(t("question_show_instructions_required")),
      showNumCorrect: yup.string().required(t("question_show_num_correct_required"))
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      defaultScore: "0",
      generalDescription: "",
      questionDescription: "",
      questionName: "",

      correctFeedback: "",
      incorrectFeedback: "",
      showInstructions: "1",
      showNumCorrect: "1"
    }
  });

  const location = useLocation();
  const courseId = location.state?.courseId;
  const isQuestionBank = location.state?.isQuestionBank;
  const categoryName = location.state?.categoryName;
  const categoryId = useParams()["categoryId"];

  const submitHandler = async (data: any) => {
    console.log(data);
    setSubmitLoading(true);

    const formSubmittedData: FormData = { ...data };
    const newQuestion: PostMultipleChoiceQuestion = {
      organizationId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      createdBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      updatedBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: Number(formSubmittedData?.defaultScore),
      qType: "TRUE_FALSE",

      answers: undefined,
      questionBankCategoryId: isQuestionBank ? categoryId : undefined,
      single: true,
      shuffleAnswers: false,
      showStandardInstructions: formSubmittedData.showInstructions.toString(),
      correctFeedback: formSubmittedData.correctFeedback,
      incorrectFeedback: formSubmittedData.incorrectFeedback,
      answerNumbering: undefined,
      showNumCorrect: Number(formSubmittedData.showNumCorrect)
    };
    console.log(newQuestion);

    QuestionService.createMultichoiceQuestion(newQuestion)
      .then((res) => {
        console.log(res);
        if (!isQuestionBank) getQuestionByQuestionId(res.questionId);
        setSnackbarType(AlertType.Success);
        setSnackbarContent(
          t("question_management_create_question_success", {
            questionType: t("common_question_type_multi_choice")
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setSnackbarType(AlertType.Error);
        setSnackbarContent(
          t("question_management_create_question_failed", {
            questionType: t("common_question_type_multi_choice")
          })
        );
      })
      .finally(() => {
        setSubmitLoading(false);
        setOpenSnackbar(true);
        if (isQuestionBank)
          navigate(routes.lecturer.question_bank.detail.replace(":categoryId", categoryId ?? ""));
        else navigate(routes.lecturer.exam.create.replace(":courseId", courseId));
      });
  };

  const dispatch = useDispatch();
  const getQuestionByQuestionId = async (questionId: string) => {
    try {
      const response = await QuestionService.getQuestionsByQuestionId(questionId);
      dispatch(setQuestionCreate(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (i18n.language !== currentLang && errors?.questionName) {
      console.log("triggered");
      trigger();
      setCurrentLang(i18n.language);
    }
  }, [i18n.language]);

  const showNumCorrectOptions = [
    { value: "1", label: t("common_true") },
    { value: "0", label: t("common_false") }
  ];
  const showInstructionsOptions = [
    { value: "1", label: t("question_management_show_instructions") },
    { value: "0", label: t("question_management_no_show_instructions") }
  ];
  return (
    <>
      <SnackbarAlert
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        type={snackbarType}
        content={snackbarContent}
      />
      <Helmet>
        <title>Create true false question</title>
      </Helmet>

      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <form onSubmit={handleSubmit(submitHandler, () => setSubmitCount((count) => count + 1))}>
          <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
            <Box className={classes.tabWrapper}>
              {isQuestionBank ? (
                <ParagraphBody
                  className={classes.breadCump}
                  colorname='--gray-50'
                  fontWeight={"600"}
                >
                  <span
                    onClick={() => navigate(routes.lecturer.question_bank.path)}
                    translation-key='common_question_bank'
                  >
                    {i18next.format(t("common_question_bank"), "firstUppercase")}
                  </span>{" "}
                  {"> "}
                  <span
                    onClick={() =>
                      navigate(`/lecturer/question-bank-management/${urlParams["categoryId"]}`)
                    }
                  >
                    {categoryName}
                  </span>{" "}
                  {"> "}
                  <span>Tạo câu hỏi</span>
                </ParagraphBody>
              ) : (
                <ParagraphBody
                  className={classes.breadCump}
                  colorname='--gray-50'
                  fontWeight={"600"}
                >
                  <span
                    translation-key='common_course_management'
                    onClick={() => navigate(routes.lecturer.course.management)}
                  >
                    {t("common_course_management")}
                  </span>{" "}
                  {"> "}
                  <span
                    onClick={() =>
                      navigate(routes.lecturer.course.information.replace(":courseId", "1"))
                    }
                  >
                    CS202 - Nhập môn lập trình
                  </span>{" "}
                  {"> "}
                  <span onClick={() => navigate(routes.lecturer.course.assignment)}>
                    Xem bài tập
                  </span>{" "}
                  {"> "}
                  <span
                    onClick={() => navigate(routes.lecturer.exam.create)}
                    translation-key='course_lecturer_assignment_create_exam'
                  >
                    {t("course_lecturer_assignment_create_exam")}
                  </span>{" "}
                  {"> "}
                  <span translation-key='question_management_create_question'>
                    {t("question_management_create_question")}
                  </span>
                </ParagraphBody>
              )}
            </Box>
            <Box className={classes.formBody}>
              <Typography
                className={classes.pageTitle}
                translation-key={["common_add", "common_question_type_with_question_truefalse"]}
              >
                {t("common_add")}{" "}
                {t("common_question_type_with_question_truefalse").toLocaleLowerCase()}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    {/* Question name */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        defaultValue=''
                        control={control}
                        name='questionName'
                        render={({ field: { ref, ...field } }) => (
                          <InputTextFieldColumn
                            inputRef={ref}
                            error={Boolean(errors?.questionName)}
                            errorMessage={errors.questionName?.message}
                            title={`${t("exam_management_create_question_name")}`}
                            type='text'
                            placeholder={t("exam_management_create_question_name")}
                            titleRequired={true}
                            translation-key='exam_management_create_question_name'
                            {...field}
                          />
                        )}
                      />
                    </Grid>

                    {/* Default Score */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        defaultValue={"0"}
                        control={control}
                        name='defaultScore'
                        render={({ field: { ref, ...field } }) => (
                          <InputTextFieldColumn
                            inputRef={ref}
                            titleRequired={true}
                            error={Boolean(errors?.defaultScore)}
                            errorMessage={errors.defaultScore?.message}
                            title={`${t("question_management_default_score")}`}
                            type='text'
                            placeholder={t("question_management_default_score")}
                            required
                            translation-key={[
                              "question_management_default_score",
                              "question_default_score_description"
                            ]}
                            tooltipDescription={t("question_default_score_description")}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    {/* Question description */}
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        translation-key='exam_management_create_question_description'
                        title={`${t("exam_management_create_question_description")} `}
                        titleRequired
                      />
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12} className={classes.textEditor}>
                          <Controller
                            defaultValue=''
                            control={control}
                            name='questionDescription'
                            render={({ field }) => (
                              <TextEditor
                                submitCount={submitCount}
                                title={t("exam_management_create_question_description")}
                                openDialog
                                roundedBorder={true}
                                error={Boolean(errors?.questionDescription)}
                                placeholder={`${t("question_management_enter_question_description")}...`}
                                required
                                translation-key='question_management_enter_question_description'
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {Boolean(errors?.questionDescription) && (
                            <ErrorMessage>{errors.questionDescription?.message}</ErrorMessage>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* General feedback */}
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        translation-key='question_management_general_comment'
                        title={`${t("question_management_general_comment")} `}
                        optional
                      />
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12} className={classes.textEditor}>
                          <Controller
                            defaultValue=''
                            control={control}
                            name='generalDescription'
                            render={({ field }) => (
                              <TextEditor
                                title={t("question_management_general_comment")}
                                openDialog
                                error={Boolean(errors?.generalDescription)}
                                roundedBorder={true}
                                placeholder={`${t("question_management_enter_general_comment")}...`}
                                translation-key='question_management_enter_general_comment'
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}></Grid>
                        <Grid item xs={12} md={12}>
                          {Boolean(errors?.generalDescription) && (
                            <ErrorMessage marginBottom={"10px"}>
                              {errors.generalDescription?.message}
                            </ErrorMessage>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        translation-key='question_management_correct_answer'
                        title={`${t("question_management_correct_answer")} `}
                        tooltipDescription={t("question_management_correct_answer_description")}
                      />
                      <Controller
                        name='showNumCorrect'
                        control={control}
                        defaultValue={"1"}
                        render={({ field: { onChange, value } }) => (
                          <JoyRadioGroup
                            value={value}
                            onChange={onChange}
                            values={showNumCorrectOptions}
                            orientation='horizontal'
                            size='md'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip title={t("question_multiple_choice_show_instructions")} />
                      <Controller
                        name='showInstructions'
                        control={control}
                        defaultValue={"1"}
                        render={({ field: { onChange, value } }) => (
                          <JoyRadioGroup
                            value={value}
                            onChange={onChange}
                            values={showInstructionsOptions}
                            orientation='horizontal'
                            size='md'
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    {/* Correct feedback */}
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        optional
                        translation-key='question_multiple_choice_correct_feedback'
                        title={t("question_multiple_choice_correct_feedback")}
                      />
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12} className={classes.textEditor}>
                          <Controller
                            defaultValue=''
                            control={control}
                            name='correctFeedback'
                            render={({ field }) => (
                              <TextEditor
                                openDialog
                                title={t("question_multiple_choice_correct_feedback")}
                                roundedBorder={true}
                                error={Boolean(errors?.correctFeedback)}
                                placeholder={`${t("question_multiple_choice_enter_correct_feedback")}...`}
                                translation-key='question_multiple_choice_enter_correct_feedback'
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {Boolean(errors?.correctFeedback) && (
                            <ErrorMessage>{errors.correctFeedback?.message}</ErrorMessage>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Incorrect feedback */}
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        optional
                        translation-key='question_multiple_choice_incorrect_feedback'
                        title={t("question_multiple_choice_incorrect_feedback")}
                      />
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12} className={classes.textEditor}>
                          <Controller
                            defaultValue=''
                            control={control}
                            name='incorrectFeedback'
                            render={({ field }) => (
                              <TextEditor
                                openDialog
                                title={t("question_multiple_choice_incorrect_feedback")}
                                roundedBorder={true}
                                error={Boolean(errors?.correctFeedback)}
                                placeholder={`${t("question_multiple_choice_enter_incorrect_feedback")}...`}
                                translation-key='question_multiple_choice_enter_incorrect_feedback'
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {Boolean(errors?.incorrectFeedback) && (
                            <ErrorMessage>{errors.incorrectFeedback?.message}</ErrorMessage>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Divider />
              <Stack spacing={{ xs: 2 }} direction={"row"} justifyContent={"center"}>
                <JoyButton
                  loading={submitLoading}
                  variant='solid'
                  type='submit'
                  translation-key='question_management_create_question'
                >
                  {t("question_management_create_question")}
                </JoyButton>
                <JoyButton variant='outlined' translation-key='common_cancel'>
                  {t("common_cancel")}
                </JoyButton>
              </Stack>
            </Box>
          </Container>
        </form>
        <Footer />
      </Grid>
      <Box className={classes.stickyFooterContainer}>
        <Box className={classes.stickyFooterItem}></Box>
      </Box>
    </>
  );
};

export default CreateTrueFalseQuestion;

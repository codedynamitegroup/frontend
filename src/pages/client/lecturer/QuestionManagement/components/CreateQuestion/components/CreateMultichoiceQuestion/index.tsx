import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  Stack,
  Typography
} from "@mui/material";
import Header from "components/Header";
import TextEditor from "components/editor/TextEditor";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AnswerEditor from "components/editor/AnswerEditor";
import { routes } from "routes/routes";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import { PostMultipleChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import { Helmet } from "react-helmet";
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { isValidDecimal } from "utils/coreService/convertDecimalPoint";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Footer from "components/Footer";

import TitleWithInfoTip from "../../../../../../../../components/text/TitleWithInfo";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import JoySelect from "components/common/JoySelect";
import JoyRadioGroup from "components/common/radio/JoyRadioGroup";
import JoyButton from "@mui/joy/Button";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionCreate } from "reduxes/coreService/questionCreate";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";

interface Props {
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: string;
  generalDescription?: string;
  answers: { answer: string; feedback: string; fraction: number }[];

  correctFeedback?: string;
  incorrectFeedback?: string;
  numbering: string;
  single: string;
  shuffleAnswer: string;
  showInstructions: string;
  showNumCorrect: string;
}

const CreateMultichoiceQuestion = (props: Props) => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [answerOpen, setAnswerOpen] = useState(true);
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

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

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
      answers: yup
        .array()
        .min(2, t("min_answer_required", { answerNum: 2 }))
        .required(t("min_answer_required", { answerNum: 2 }))
        .of(
          yup.object().shape({
            answer: yup
              .string()
              .required(t("question_answer_content_required"))
              .test(
                "isQuillEmpty",
                t("question_description_required"),
                (value) => !isQuillEmpty(value)
              ),
            feedback: yup
              .string()
              .required(t("common_required"))
              .test(
                "isQuillEmpty",
                t("question_description_required"),
                (value) => !isQuillEmpty(value)
              ),
            fraction: yup.number().required(t("question_feedback_answer_required"))
          })
        ),
      correctFeedback: yup.string(),
      incorrectFeedback: yup.string(),
      numbering: yup.string().required(t("question_numbering_required")),
      single: yup.string().required(t("question_one_or_many_required")),
      shuffleAnswer: yup.string().required(t("question_shuffle_answer_required")),
      showInstructions: yup.string().required(t("question_show_instructions_required")),
      showNumCorrect: yup.string().required(t("question_show_instructions_required"))
    });
  }, [t]);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      answers: [],
      defaultScore: "1",
      generalDescription: "",
      questionDescription: "",
      questionName: "",

      correctFeedback: "",
      incorrectFeedback: "",
      numbering: "abc",
      single: "1",
      shuffleAnswer: "1",
      showInstructions: "1",
      showNumCorrect: "1"
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers"
  });

  const location = useLocation();
  const courseId = location.state?.courseId;
  const isQuestionBank = location.state?.isQuestionBank;
  const isOrgQuestionBank = location.state?.isOrgQuestionBank;
  const categoryName = location.state?.categoryName;
  const categoryId = useParams()["categoryId"];
  const user: User = useSelector(selectCurrentUser);

  const submitHandler = async (data: any) => {
    console.log(data);
    setSubmitLoading(true);
    const formSubmittedData: FormData = { ...data };
    const newQuestion: PostMultipleChoiceQuestion = {
      organizationId: user.organization.organizationId,
      createdBy: user.userId,
      updatedBy: user.userId,
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: Number(formSubmittedData?.defaultScore),
      qType: "MULTIPLE_CHOICE",
      answers: formSubmittedData.answers,
      questionBankCategoryId: isQuestionBank ? categoryId : undefined,
      isOrgQuestionBank: isOrgQuestionBank,
      single: Number(formSubmittedData.single) === 1,
      shuffleAnswers: Boolean(Number(formSubmittedData.shuffleAnswer)),
      showStandardInstructions: formSubmittedData.showInstructions.toString(),
      correctFeedback: formSubmittedData.correctFeedback,
      incorrectFeedback: formSubmittedData.incorrectFeedback,
      answerNumbering: formSubmittedData.numbering,
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

  const addAnswer = () => {
    append({ answer: "", feedback: "", fraction: 0 });
  };

  useEffect(() => {
    if (i18n.language !== currentLang && errors?.questionName) {
      console.log("triggered");
      trigger();
      setCurrentLang(i18n.language);
    }
  }, [i18n.language]);

  const questionAnswerRef = useRef<HTMLElement>(null);
  console.log(errors);
  useEffect(() => {
    if (
      !errors.questionName &&
      !errors.defaultScore &&
      !errors.questionDescription &&
      errors.answers &&
      questionAnswerRef.current
    ) {
      questionAnswerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [errors.answers]);

  const numberingOptions = [
    { value: "abc", label: "a., b., c." },
    { value: "ABC", label: "A., B., C." },
    { value: "n123", label: "1., 2., 3." }
  ];

  const singleOptions = [
    { value: "1", label: t("question_management_one") },
    { value: "2", label: t("question_management_many") }
  ];

  const shuffleAnswerOptions = [
    { value: "1", label: t("question_management_scramble_action") },
    { value: "0", label: t("question_management_no_scramble") }
  ];

  const showInstructionsOptions = [
    { value: "1", label: t("question_management_show_instructions") },
    { value: "0", label: t("question_management_no_show_instructions") }
  ];

  const showNumCorrectOptions = [
    { value: "1", label: t("question_management_show_num_correct") },
    { value: "0", label: t("question_management_no_show_num_correct") }
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
        <title>Create multiple choice question</title>
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
                translation-key={["common_add", "common_question_type_with_question_multichoice"]}
              >
                {t("common_add")}{" "}
                {t("common_question_type_with_question_multichoice").toLocaleLowerCase()}
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
                            error={Boolean(errors?.questionName)}
                            errorMessage={errors.questionName?.message}
                            title={`${t("exam_management_create_question_name")}`}
                            type='text'
                            placeholder={t("exam_management_create_question_name")}
                            titleRequired={true}
                            translation-key='exam_management_create_question_name'
                            inputRef={ref}
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

                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip title={t("question_multiple_choice_numbering")} />
                      <Controller
                        name='numbering'
                        control={control}
                        defaultValue='abc'
                        render={({ field: { onChange, value } }) => (
                          <JoySelect value={value} onChange={onChange} options={numberingOptions} />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip title={t("question_management_scramble")} />
                      <Controller
                        name='shuffleAnswer'
                        control={control}
                        defaultValue={"1"}
                        render={({ field: { onChange, value } }) => (
                          <JoyRadioGroup
                            value={value}
                            onChange={onChange}
                            values={shuffleAnswerOptions}
                            orientation='horizontal'
                            size='md'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip title={t("question_management_one_or_many")} />
                      <Controller
                        name='single'
                        control={control}
                        defaultValue={"1"}
                        render={({ field: { onChange, value } }) => (
                          <JoySelect value={value} onChange={onChange} options={singleOptions} />
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
                    <Grid item xs={12} md={6} />

                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip title={t("question_multiple_show_num_correct")} />
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
                  </Grid>
                </Grid>
              </Grid>

              <div>
                <ListItemButton onClick={() => setAnswerOpen(!answerOpen)} sx={{ paddingX: 0 }}>
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12} md={3}>
                      <Heading2
                        sx={{ display: "inline" }}
                        translation-key='question_management_answer'
                        ref={questionAnswerRef}
                      >
                        {t("question_management_answer")}
                      </Heading2>
                      {Boolean(errors?.answers) && (
                        <ErrorMessage>
                          {errors.answers?.message || errors.answers?.root?.message}
                        </ErrorMessage>
                      )}
                    </Grid>
                    <Grid item xs={12} md={9} display={"flex"} alignItems={"center"}>
                      {answerOpen ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                  </Grid>
                </ListItemButton>

                <Collapse in={answerOpen} timeout='auto' unmountOnExit>
                  <Stack spacing={{ xs: 4 }} useFlexGap>
                    <Divider />
                    {fields.map((field, index) => (
                      <AnswerEditor
                        key={field.id}
                        answerNumber={index}
                        qtype={props.qtype}
                        {...{ control, index, field, remove, errors }}
                      />
                    ))}

                    <Grid container justifyContent={"center"}>
                      <JoyButton
                        translation-key='question_answer_add_answer'
                        onClick={addAnswer}
                        variant='soft'
                        startDecorator={<AddIcon />}
                        sx={{ width: "300px" }}
                      >
                        {t("question_answer_add_answer")}
                      </JoyButton>
                    </Grid>

                    <Divider />
                  </Stack>
                </Collapse>
              </div>
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

export default CreateMultichoiceQuestion;

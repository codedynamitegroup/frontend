import { Box, Collapse, Container, Divider, Grid, ListItemButton, Stack } from "@mui/material";
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
import { PostMultipleChoiceQuestion } from "models/coreService/entity/MultipleChoiceQuestionEntity";
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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import CustomBreadCrumb from "components/common/Breadcrumb";
import { CourseService } from "services/courseService/CourseService";
import { CourseDetailEntity } from "models/courseService/entity/detail/CourseDetailEntity";
import { Card } from "@mui/joy";
import { RootState } from "store";
import { MultichoiceQuestionService } from "services/coreService/QtypeMultichoiceQuestionService";

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

const EditMultichoiceQuestion = (props: Props) => {
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
  const [courseData, setCourseData] = useState<CourseDetailEntity>();
  const navigate = useNavigate();

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const [headerHeight, setHeaderHeight] = useState(sidebarStatus.headerHeight);
  if (props.insideCrumb) setHeaderHeight(0);

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
  const isAdminQuestionBank = location.state?.isAdminQuestionBank;
  const isOrgAdminQuestionBank = location.state?.isOrgQuestionBank;
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

    MultichoiceQuestionService.createMultichoiceQuestion(newQuestion)
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
        if (isAdminQuestionBank)
          navigate(routes.admin.question_bank.detail.replace(":categoryId", categoryId ?? ""));
        else if (isOrgAdminQuestionBank)
          navigate(routes.org_admin.question_bank.detail.replace(":categoryId", categoryId ?? ""));
        else if (isQuestionBank)
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
  const getCouseData = async (courseId: string) => {
    try {
      const response = await CourseService.getCourseDetail(courseId);
      setCourseData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getCouseData(courseId);
    };

    fetchData();
  }, [courseId]);
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
  const breadCrumbData = isQuestionBank
    ? [
        {
          navLink: routes.lecturer.question_bank.path,
          label: i18next.format(t("common_question_bank"), "firstUppercase")
        },
        {
          navLink: `/lecturer/question-bank-management/${urlParams["categoryId"]}`,
          label: categoryName
        }
      ]
    : [
        {
          navLink: routes.lecturer.course.management,
          label: t("common_course_management")
        },
        {
          navLink: routes.lecturer.course.information.replace(":courseId", courseId),
          label: courseData?.name
        },
        {
          navLink: routes.lecturer.course.assignment.replace(":courseId", courseId),
          label: t("common_type_assignment")
        },
        {
          navLink: routes.lecturer.exam.create.replace(":courseId", courseId),
          label: t("course_lecturer_assignment_create_exam")
        }
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
        <Header />
        <form onSubmit={handleSubmit(submitHandler, () => setSubmitCount((count) => count + 1))}>
          <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
            <CustomBreadCrumb
              breadCrumbData={breadCrumbData}
              lastBreadCrumbLabel={t("create_question_multiple_choice")}
            />

            <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
              <Box
                sx={{
                  borderRadius: "1000px",
                  backgroundColor: "#FFE0B2",
                  width: "40px",
                  height: "40px"
                }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <FormatListBulletedIcon
                  sx={{
                    color: "#FB8C00"
                  }}
                />
              </Box>
              <Heading2
                translation-key={["common_add", "common_question_type_with_question_multichoice"]}
              >
                {t("common_add").toUpperCase()}{" "}
                {t("common_question_type_with_question_multichoice").toUpperCase()}
              </Heading2>
            </Stack>

            <Box className={classes.formBody}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    variant='soft'
                    color='primary'
                    sx={{
                      padding: "10px"
                    }}
                  >
                    <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                      {i18next.t("common_general").toUpperCase()}
                    </ParagraphBody>
                  </Card>
                </Grid>
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
                            useDefaultTitleStyle
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
                            useDefaultTitleStyle
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
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
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
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
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
                <Grid item xs={12}>
                  <Card
                    variant='soft'
                    color='primary'
                    sx={{
                      padding: "10px"
                    }}
                  >
                    <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                      {i18next.t("common_detail").toUpperCase()}
                    </ParagraphBody>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        optional
                        translation-key='question_multiple_choice_correct_feedback'
                        title={t("question_multiple_choice_correct_feedback")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
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
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
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
                      <TitleWithInfoTip
                        title={t("question_multiple_choice_numbering")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
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
                      <TitleWithInfoTip
                        title={t("question_management_scramble")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
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
                      <TitleWithInfoTip
                        title={t("question_management_one_or_many")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
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
                      <TitleWithInfoTip
                        title={t("question_multiple_choice_show_instructions")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
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
                      <TitleWithInfoTip
                        title={t("question_multiple_show_num_correct")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
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
                  </Grid>
                </Grid>
              </Grid>

              <div>
                <ListItemButton
                  onClick={() => setAnswerOpen(!answerOpen)}
                  sx={{ paddingX: 0, marginBottom: "30px" }}
                >
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12}>
                      <Card
                        variant='soft'
                        color='primary'
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "row"
                        }}
                        translation-key='question_management_answer'
                      >
                        <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                          {t("question_management_answer").toUpperCase()}
                          {Boolean(errors?.answers) && (
                            <ErrorMessage>
                              {errors.answers?.message || errors.answers?.root?.message}
                            </ErrorMessage>
                          )}
                        </ParagraphBody>

                        {answerOpen ? <ExpandLess /> : <ExpandMore />}
                      </Card>
                    </Grid>
                  </Grid>
                </ListItemButton>

                <Collapse in={answerOpen} timeout='auto' unmountOnExit>
                  <Stack spacing={{ xs: 4 }} useFlexGap>
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
                  </Stack>
                </Collapse>
              </div>
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
                <JoyButton
                  variant='outlined'
                  translation-key='common_cancel'
                  onClick={() => {
                    if (isQuestionBank)
                      navigate(
                        routes.lecturer.question_bank.detail.replace(
                          ":categoryId",
                          categoryId ?? ""
                        )
                      );
                    else navigate(routes.lecturer.exam.create.replace(":courseId", courseId));
                  }}
                >
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

export default EditMultichoiceQuestion;

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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import { PostShortAnswerQuestion } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import AlertDialog from "../BlockingDialog";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionCreate } from "reduxes/coreService/questionCreate";
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { isValidDecimal } from "utils/coreService/convertDecimalPoint";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import JoyButton from "@mui/joy/Button";
import Footer from "components/Footer";
import TitleWithInfoTip from "../../../../../../../../components/text/TitleWithInfo";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";

import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import CustomBreadCrumb from "components/common/Breadcrumb";
import { CourseService } from "services/courseService/CourseService";
import { CourseDetailEntity } from "models/courseService/entity/detail/CourseDetailEntity";
import { Card } from "@mui/joy";

interface Props {
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: string;
  generalDescription?: string;
  caseSensitive?: number;
  answers: { answer: string; feedback: string; fraction: number }[];
}

const CreateShortAnswerQuestion = (props: Props) => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const isQuestionBank = location.state?.isQuestionBank;
  const isAdminQuestionBank = location.state?.isAdminQuestionBank;
  const isOrgQuestionBank = location.state?.isOrgQuestionBank;
  const categoryName = location.state?.categoryName;
  const categoryId = useParams()["categoryId"];
  const [courseData, setCourseData] = useState<CourseDetailEntity>();

  const { t, i18n } = useTranslation();

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [answerOpen, setAnswerOpen] = useState(true);
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = useState(0);

  // submit animation
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [snackbarContent, setSnackbarContent] = useState<string>("");

  const headerRef = useRef<HTMLDivElement>(null);
  let { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });
  if (props.insideCrumb) headerHeight = 0;

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

      caseSensitive: yup.number(),

      answers: yup
        .array()
        .min(1, t("min_answer_required", { answerNum: 1 }))
        .required(t("min_answer_required", { answerNum: 1 }))
        .of(
          yup.object().shape({
            answer: yup.string().required(t("question_answer_content_required")),
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
        )
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
      caseSensitive: 1,
      defaultScore: "1",
      generalDescription: "",
      questionDescription: "",
      questionName: ""
    }
  });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "answers" // unique name for your Field Array,
  });

  const dispatch = useDispatch();

  const [openAlertDiaglog, setOpenAlertDiaglog] = useState(true);

  const user: User = useSelector(selectCurrentUser);

  const submitHandler = async (data: any) => {
    console.log(user);
    console.log("user", user);
    setOpenAlertDiaglog(false);
    setSubmitLoading(true);
    const formSubmittedData: FormData = { ...data };

    const newQuestion: PostShortAnswerQuestion = {
      organizationId: isAdminQuestionBank ? "" : user.organization.organizationId,
      createdBy: user.userId,
      updatedBy: user.userId,
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: Number(formSubmittedData?.defaultScore),
      qType: "SHORT_ANSWER",
      answers: formSubmittedData.answers,
      questionBankCategoryId: isQuestionBank ? categoryId : undefined,
      isOrgQuestionBank: isOrgQuestionBank,
      caseSensitive: Boolean(formSubmittedData?.caseSensitive)
    };
    console.log(newQuestion);
    QuestionService.createShortAnswerQuestion(newQuestion)
      .then((res) => {
        if (!isQuestionBank) getQuestionByQuestionId(res.questionId);
      })
      .finally(() => {
        console.log("finally");
        setSnackbarType(AlertType.Success);
        setSnackbarContent(
          t("question_management_create_question_success", {
            questionType: t("common_question_type_short")
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setSnackbarType(AlertType.Error);
        setSnackbarContent(
          t("question_management_create_question_failed", {
            questionType: t("common_question_type_short")
          })
        );
      })
      .finally(() => {
        setSubmitLoading(false);
        setOpenSnackbar(true);
        if (isAdminQuestionBank)
          navigate(routes.admin.question_bank.detail.replace(":categoryId", categoryId ?? ""));
        else if (isQuestionBank)
          navigate(routes.lecturer.question_bank.detail.replace(":categoryId", categoryId ?? ""));
        else navigate(routes.lecturer.exam.create.replace(":courseId", courseId));
      });
  };

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

  useEffect(() => {
    if (i18n.language !== currentLang && errors?.questionName) {
      trigger();
      setCurrentLang(i18n.language);
    }
  }, [i18n.language]);

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
      <Grid className={classes.root}>
        <SnackbarAlert
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={openSnackbar}
          setOpen={setOpenSnackbar}
          type={snackbarType}
          content={snackbarContent}
        />
        <Helmet>
          <title>Course | Create short answer question</title>
        </Helmet>
        <Header ref={headerRef} />

        <form onSubmit={handleSubmit(submitHandler, () => setSubmitCount((count) => count + 1))}>
          <AlertDialog isBlocking={openAlertDiaglog} />
          <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
            <CustomBreadCrumb
              breadCrumbData={breadCrumbData}
              lastBreadCrumbLabel={t("create_question_short_answer")}
            />

            <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
              <Box
                sx={{
                  borderRadius: "1000px",
                  backgroundColor: "#E0F7FA",
                  width: "40px",
                  height: "40px"
                }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ShortTextRoundedIcon
                  sx={{
                    color: "#039BE5"
                  }}
                />
              </Box>
              <Heading2
                translation-key={["common_add", "common_question_type_with_question_shortanswer"]}
              >
                {t("common_add").toUpperCase()}{" "}
                {t("common_question_type_with_question_shortanswer").toUpperCase()}
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
                    <Grid item xs={6} md={6}>
                      <Controller
                        defaultValue=''
                        control={control}
                        name='questionName'
                        rules={{ required: true }}
                        render={({ field: { ref, ...field } }) => (
                          <InputTextFieldColumn
                            inputRef={ref}
                            useDefaultTitleStyle
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
                    <Grid item xs={6} md={6}>
                      <Controller
                        defaultValue={"0"}
                        control={control}
                        name='defaultScore'
                        rules={{ required: true }}
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
                    <Grid item xs={6} md={6}>
                      <TitleWithInfoTip
                        title={t("exam_management_create_question_description")}
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
                                openDialog
                                title={t("exam_management_create_question_description")}
                                roundedBorder={true}
                                error={Boolean(errors?.questionDescription)}
                                placeholder={`${t("question_management_enter_question_description")}...`}
                                required
                                translation-key='question_management_enter_question_description'
                                {...field}
                                submitCount={submitCount}
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
                    <Grid item xs={6} md={6}>
                      <TitleWithInfoTip
                        title={t("question_management_general_comment")}
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
                                openDialog
                                title={t("question_management_general_comment")}
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
                  {/* Case sensitive */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Card
                        variant='soft'
                        color='primary'
                        sx={{
                          padding: "10px",
                          marginBottom: "25px"
                        }}
                      >
                        <ParagraphBody
                          fontWeight={"600"}
                          colorname='--blue-2'
                          translation-key='common_detail'
                        >
                          {i18next.t("common_detail").toUpperCase()}
                        </ParagraphBody>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <TitleWithInfoTip
                        title={t("question_management_distinguish_lettercase")}
                        tooltipDescription={t("case_sensitive_tooltip_description")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Controller
                        name='caseSensitive'
                        control={control}
                        defaultValue={1}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            value={value}
                            onChange={(event, newValue) => onChange(newValue)}
                            sx={{ borderRadius: "12px", height: "40px" }}
                          >
                            <Option value={1}>Phân biệt</Option>
                            <Option value={0}>Không phân biệt</Option>
                          </Select>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Answer list */}
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
                  <Stack spacing={{ xs: 3 }} useFlexGap sx={{ marginBottom: "20px" }}>
                    {fields.map((field, index) => (
                      <>
                        <AnswerEditor
                          key={field.id}
                          answerNumber={index}
                          qtype={props.qtype}
                          {...{ control, index, field, remove, errors }}
                        />
                      </>
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

export default CreateShortAnswerQuestion;

import {
  Button,
  Box,
  Checkbox,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  Stack
} from "@mui/material";
import Header from "components/Header";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AnswerEditor from "components/editor/AnswerEditor";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
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

interface Props {
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: number;
  generalDescription?: string;
  caseSensitive?: boolean;
  answers: { answer: string; feedback: string; fraction: number }[];
}

const CreateShortAnswerQuestion = (props: Props) => {
  const { t } = useTranslation();

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [answerOpen, setAnswerOpen] = useState(true);
  const vi_name = useMemo(
    () => Object.values(qtype).find((value) => value.code === props.qtype)?.vi_name,
    [props.qtype]
  );
  const en_name = useMemo(
    () => Object.values(qtype).find((value) => value.code === props.qtype)?.en_name,
    [props.qtype]
  );
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
      questionName: yup.string().required(t("question_name_required")),
      questionDescription: yup.string().required(t("question_description_required")),
      defaultScore: yup
        .number()
        .required(t("question_default_score_required"))
        .min(0, t("question_default_score_invalid")),
      generalDescription: yup.string(),
      caseSensitive: yup.boolean(),
      answers: yup
        .array()
        .min(1, t("min_answer_required", { answerNum: 1 }))
        .required(t("min_answer_required", { answerNum: 1 }))
        .of(
          yup.object().shape({
            answer: yup.string().required(t("question_answer_content_required")),
            feedback: yup.string().required(t("common_required")),
            fraction: yup.number().required(t("question_feedback_answer_required"))
          })
        )
    });
  }, [t]);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      answers: [],
      caseSensitive: true,
      defaultScore: 0,
      generalDescription: "",
      questionDescription: "",
      questionName: ""
    }
  });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "answers" // unique name for your Field Array,
  });
  const submitHandler = async (data: any) => {
    console.log(data);
    const formSubmittedData: FormData = { ...data };
    const newQuestion: PostShortAnswerQuestion = {
      organizationId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      createdBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      updatedBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: formSubmittedData?.defaultScore,
      qType: "SHORT_ANSWER",
      answers: formSubmittedData.answers,

      caseSensitive: Boolean(formSubmittedData?.caseSensitive)
    };
    QuestionService.createShortAnswerQuestion(newQuestion)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addAnswer = () => {
    append({ answer: "", feedback: "", fraction: 0 });
  };

  return (
    <>
      <Helmet>
        <title>Create short answer question</title>
      </Helmet>

      <Grid className={classes.root}>
        <Header ref={headerRef} />

        <form onSubmit={handleSubmit(submitHandler)}>
          <AlertDialog isBlocking={isDirty} />
          <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
            <Box className={classes.tabWrapper}>
              {props.insideCrumb ? (
                <ParagraphBody
                  className={classes.breadCump}
                  colorname='--gray-50'
                  fontWeight={"600"}
                >
                  <span
                    onClick={() => navigate("/lecturer/question-bank-management")}
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
                    Học OOP
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
              <Heading1 fontWeight={"500"} translation-key='common_add'>
                {t("common_add")}{" "}
                {currentLang === "en"
                  ? i18next.format(en_name, "lowercase")
                  : i18next.format(vi_name, "lowercase")}
              </Heading1>
              <Controller
                defaultValue=''
                control={control}
                name='questionName'
                render={({ field }) => (
                  <InputTextField
                    error={Boolean(errors?.questionName)}
                    errorMessage={errors.questionName?.message}
                    title={`${t("exam_management_create_question_name")} *`}
                    type='text'
                    placeholder={t("exam_management_create_question_name")}
                    required
                    translation-key='exam_management_create_question_name'
                    {...field}
                  />
                )}
              />

              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='exam_management_create_question_description'>
                    {t("exam_management_create_question_description")} *
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='questionDescription'
                    render={({ field }) => (
                      <TextEditor
                        error={Boolean(errors?.questionDescription)}
                        placeholder={`${t("question_management_enter_question_description")}...`}
                        required
                        translation-key='question_management_enter_question_description'
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <></>
                </Grid>
                <Grid item xs={12} md={9}>
                  {Boolean(errors?.questionDescription) && (
                    <ErrorMessage marginBottom={"10px"}>
                      {errors.questionDescription?.message}
                    </ErrorMessage>
                  )}
                </Grid>
              </Grid>

              <Controller
                defaultValue={0}
                control={control}
                name='defaultScore'
                render={({ field }) => (
                  <InputTextField
                    error={Boolean(errors?.defaultScore)}
                    errorMessage={errors.defaultScore?.message}
                    title={`${t("question_management_default_score")} *`}
                    type='text'
                    placeholder={t("question_management_default_score")}
                    required
                    translation-key='question_management_default_score'
                    {...field}
                  />
                )}
              />

              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_management_general_comment'>
                    {t("question_management_general_comment")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='generalDescription'
                    render={({ field }) => (
                      <TextEditor
                        placeholder={`${t("question_management_enter_general_comment")}...`}
                        translation-key='question_management_enter_general_comment'
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <></>
                </Grid>
                <Grid item xs={12} md={9}>
                  {Boolean(errors?.generalDescription) && (
                    <ErrorMessage marginBottom={"10px"}>
                      {errors.generalDescription?.message}
                    </ErrorMessage>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle translation-key='question_management_distinguish_lettercase'>
                    {t("question_management_distinguish_lettercase")}
                  </TextTitle>
                </Grid>
                <Checkbox defaultChecked {...register("caseSensitive")} />
              </Grid>

              {/* Answer list */}
              <div>
                <ListItemButton onClick={() => setAnswerOpen(!answerOpen)} sx={{ paddingX: 0 }}>
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12} md={3}>
                      <Heading2
                        sx={{ display: "inline" }}
                        translation-key='question_management_answer'
                      >
                        {t("question_management_answer")}
                      </Heading2>
                      {Boolean(errors?.answers) && (
                        <ErrorMessage>{errors.answers?.message}</ErrorMessage>
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
                      <Button onClick={addAnswer}>
                        <AddIcon />
                      </Button>
                    </Grid>

                    <Divider />
                  </Stack>
                </Collapse>
              </div>

              <Box className={classes.stickyFooterContainer}>
                <Box className={classes.phantom} />
                <Box className={classes.stickyFooterItem}>
                  <Button
                    variant='contained'
                    type='submit'
                    translation-key='question_management_create_question'
                  >
                    {t("question_management_create_question")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </form>
      </Grid>
    </>
  );
};

export default CreateShortAnswerQuestion;

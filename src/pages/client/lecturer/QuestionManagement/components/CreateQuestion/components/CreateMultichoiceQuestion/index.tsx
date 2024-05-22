import {
  Button,
  Box,
  Checkbox,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  MenuItem,
  Select,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import { PostMultipleChoiceQuestion } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
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
  answers: { answer: string; feedback: string; fraction: number }[];
  correctFeedback?: string;
  incorrectFeedback?: string;
  numbering: string;
  single: number;
  shuffleAnswer: boolean;
  showInstructions: boolean;
  showNumCorrect?: boolean;
}

const CreateMultichoiceQuestion = (props: Props) => {
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
        .typeError(
          t("invalid_type", {
            name: t("question_management_default_score"),
            type: t("type_number")
          })
        )
        .min(0, t("question_default_score_invalid"))
        .required(t("question_default_score_required")),
      generalDescription: yup.string(),
      answers: yup
        .array()
        .min(2, t("min_answer_required", { answerNum: 2 }))
        .required(t("min_answer_required", { answerNum: 2 }))
        .of(
          yup.object().shape({
            answer: yup.string().required(t("question_answer_content_required")),
            feedback: yup.string().required(t("common_required")),
            fraction: yup.number().required(t("question_feedback_answer_required"))
          })
        ),
      correctFeedback: yup.string(),
      incorrectFeedback: yup.string(),
      numbering: yup.string().required(t("question_numbering_required")),
      single: yup.number().required(t("question_one_or_many_required")),
      shuffleAnswer: yup.boolean().required(t("question_shuffle_answer_required")),
      showInstructions: yup.boolean().required(t("question_show_instructions_required")),
      showNumCorrect: yup.boolean()
    });
  }, [t]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers"
  });
  const submitHandler = async (data: any) => {
    const formSubmittedData: FormData = { ...data };
    const newQuestion: PostMultipleChoiceQuestion = {
      organizationId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      createdBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      updatedBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: formSubmittedData?.defaultScore,
      qType: "MULTIPLE_CHOICE",

      answers: formSubmittedData.answers,

      single: formSubmittedData.single === 1,
      shuffleAnswers: formSubmittedData.shuffleAnswer,
      showStandardInstructions: formSubmittedData.showInstructions.toString(),
      correctFeedback: formSubmittedData.correctFeedback,
      incorrectFeedback: formSubmittedData.incorrectFeedback,
      answerNumbering: formSubmittedData.numbering,
      showNumCorrect: Number(formSubmittedData.showNumCorrect)
    };
    QuestionService.createMultichoiceQuestion(newQuestion)
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
        <title>Create multiple choice question</title>
      </Helmet>

      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <form onSubmit={handleSubmit(submitHandler)}>
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
                control={control}
                name='questionName'
                defaultValue=''
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
                    <ErrorMessage>{errors.questionDescription?.message}</ErrorMessage>
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
                    <ErrorMessage>{errors.generalDescription?.message}</ErrorMessage>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_multiple_choice_correct_feedback'>
                    {t("question_multiple_choice_correct_feedback")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='correctFeedback'
                    render={({ field }) => (
                      <TextEditor
                        placeholder={`${t("question_multiple_choice_enter_correct_feedback")}...`}
                        translation-key='question_multiple_choice_enter_correct_feedback'
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <></>
                </Grid>
                <Grid item xs={12} md={9}>
                  {Boolean(errors?.correctFeedback) && (
                    <ErrorMessage>{errors.correctFeedback?.message}</ErrorMessage>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_multiple_choice_enter_incorrect_feedback'>
                    {t("question_multiple_choice_enter_incorrect_feedback")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='incorrectFeedback'
                    render={({ field }) => (
                      <TextEditor
                        placeholder={`${t("question_multiple_choice_enter_incorrect_feedback")}...`}
                        translation-key='question_multiple_choice_enter_incorrect_feedback'
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <></>
                </Grid>
                <Grid item xs={12} md={9}>
                  {Boolean(errors?.incorrectFeedback) && (
                    <ErrorMessage>{errors.incorrectFeedback?.message}</ErrorMessage>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_multiple_choice_numbering'>
                    {t("question_multiple_choice_numbering")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select
                    defaultValue={"abc"}
                    fullWidth={true}
                    size='small'
                    required
                    {...register("numbering")}
                  >
                    <MenuItem value={"abc"}>a., b., c.</MenuItem>
                    <MenuItem value={"ABC"}>A., B., C.</MenuItem>
                    <MenuItem value={"n123"}>1., 2., 3.</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_management_one_or_many'>
                    {t("question_management_one_or_many")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select defaultValue={1} fullWidth={true} size='small' {...register("single")}>
                    <MenuItem value={1} translation-key='question_management_one'>
                      {t("question_management_one")}
                    </MenuItem>
                    <MenuItem value={2} translation-key='question_management_many'>
                      {t("question_management_many")}
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <TextTitle translation-key='question_management_scramble'>
                    {t("question_management_scramble")}
                  </TextTitle>
                </Grid>
                <Checkbox defaultChecked {...register("shuffleAnswer")} />
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle translation-key='question_multiple_choice_show_instructions'>
                    {t("question_multiple_choice_show_instructions")}
                  </TextTitle>
                </Grid>
                <Checkbox {...register("showInstructions")} />
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={3}>
                  <TextTitle translation-key='question_multiple_show_num_correct'>
                    {t("question_multiple_show_num_correct")}
                  </TextTitle>
                </Grid>
                <Checkbox {...register("showNumCorrect")} />
              </Grid>

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
                    translation-key='question_management_create_question'
                    type='submit'
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

export default CreateMultichoiceQuestion;

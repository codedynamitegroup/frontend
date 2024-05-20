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
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
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
import {
  MultichocieNumbering,
  PostMultipleChoiceQuestion
} from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "components/text/ErrorMessage";

interface Props {
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: number;
  generalDescription?: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
  showInstructions: boolean;
  showNumCorrect?: boolean;
}

const CreateTrueFalseQuestion = (props: Props) => {
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
  const [initialized, setInitialized] = useState(true);
  let outletContext: any = useOutletContext();
  let outletTab = outletContext?.value;
  useEffect(() => {
    if (initialized) {
      setInitialized(false);
    } else {
      navigate("/lecturer/question-bank-management");
    }
  }, [outletTab]);

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

      correctFeedback: yup.string(),
      incorrectFeedback: yup.string(),
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
  console.log(errors);

  const submitHandler = async (data: any) => {
    console.log(data);

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
      qType: "TRUE_FALSE",

      answers: undefined,

      single: true,
      shuffleAnswers: undefined,
      showStandardInstructions: formSubmittedData.showInstructions.toString(),
      correctFeedback: formSubmittedData.correctFeedback,
      incorrectFeedback: formSubmittedData.incorrectFeedback,
      answerNumbering: undefined,
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

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Container style={{ marginTop: `${headerHeight}px` }} className={classes.container}>
          <Box className={classes.tabWrapper}>
            {props.insideCrumb ? (
              <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
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
              <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
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

            <div>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_management_correct_answer'>
                    {t("question_management_correct_answer")} *
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Select defaultValue={0} size='small' required {...register("showNumCorrect")}>
                    <MenuItem value={0} translation-key='common_false'>
                      {t("common_false")}
                    </MenuItem>
                    <MenuItem value={1} translation-key='common_true'>
                      {t("common_true")}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_multiple_choice_show_instructions'>
                    {t("question_multiple_choice_show_instructions")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Checkbox {...register("showInstructions")} />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_management_comment_correct_answer'>
                    {t("question_management_comment_correct_answer")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='correctFeedback'
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
                  {Boolean(errors?.correctFeedback) && (
                    <ErrorMessage>{errors.correctFeedback?.message}</ErrorMessage>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextTitle translation-key='question_management_comment_wrong_answer'>
                    {t("question_management_comment_wrong_answer")}
                  </TextTitle>
                </Grid>
                <Grid item xs={12} md={9} className={classes.textEditor}>
                  <Controller
                    defaultValue=''
                    control={control}
                    name='incorrectFeedback'
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
                  {Boolean(errors?.incorrectFeedback) && (
                    <ErrorMessage>{errors.incorrectFeedback?.message}</ErrorMessage>
                  )}
                </Grid>
              </Grid>
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
  );
};

export default CreateTrueFalseQuestion;

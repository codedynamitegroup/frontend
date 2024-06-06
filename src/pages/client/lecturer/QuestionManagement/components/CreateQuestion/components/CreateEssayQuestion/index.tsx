import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  Stack,
  Typography,
  Checkbox,
  ListItemText
} from "@mui/material";
import Header from "components/Header";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { routes } from "routes/routes";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "components/text/ErrorMessage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Heading2 from "components/text/Heading2";
import { PostEssayQuestion } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { isValidDecimal } from "utils/coreService/convertDecimalPoint";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import Footer from "components/Footer";
import TitleWithInfoTip from "../../../../../../../../components/text/TitleWithInfo";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import JoyButton from "@mui/joy/Button";
import { Helmet } from "react-helmet";
import JoySelect from "components/common/JoySelect";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Chip } from "@mui/joy";
import { get } from "http";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionCreate } from "reduxes/coreService/questionCreate";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";

interface Props {
  courseId?: string;
  courseName?: string;
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: string;
  generalDescription?: string;

  responseFormat: string;
  responseRequired: string;
  responseFieldLines: string;
  attachments: string;
  attachmentsRequired: string;
  graderInfo?: string;
  graderInfoFormat?: number;
  responseTemplate?: string;
  responseTemplateFormat?: number;
  fileTypesList?: string[];
  minWord: number;
  maxWord: number;
  maxBytes: string;
}

const fileTypes = [
  { type: "all", description: "" },
  {
    type: "archive",
    description: ".7z .bdoc .cdoc .ddoc .gtar .tgz .gz .gzip .hqx .rar .sit .tar .zip"
  },
  { type: "document", description: ".doc .docx .epub .gdoc .odt .ott .oth .pdf .rtf" },
  {
    type: "image",
    description:
      ".ai .bmp .gdraw .gif .ico .jpe .jpeg .jpg .pct .pic .pict .png .svg .svgz .tif .tiff"
  },
  {
    type: "video",
    description:
      ".3gp .avi .dv .dif .flv .f4v .fmp4 .mov .movie .mp4 .m4v .mpeg .mpe .mpg .ogv .qt .rmvb .rv .ts .webm .wmv .asf"
  },
  {
    type: "audio",
    description: ".aac .aif .aiff .aifc .au .flac .m3u .mp3 .m4a .oga .ogg .ra .ram .rm .wav .wma"
  }
];

const CreateEssayQuestion = (props: Props) => {
  const { t, i18n } = useTranslation();
  const [responseFormat, setResponseFormat] = useState("editor");
  const [responseOpen, setResponseOpen] = useState(true);
  const [responseTemplateOpen, setResponseTemplateOpen] = useState(true);
  const [graderInfoOpen, setGraderInfoOpen] = useState(true);
  const [responseTextRequired, setResponseTextRequired] = useState("0");
  const [attachments, setAttachments] = useState(0);
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertType>(AlertType.Error);
  const [snackbarContent, setSnackbarContent] = useState<string>("");

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

  // useEffect(() => {
  //   setCurrentLang(i18next.language);
  // }, [i18next.language]);

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

      responseFormat: yup.string().required(t("response_format_required")),
      responseRequired: yup.string().required(t("response_required")),
      responseFieldLines: yup.string().required(t("response_field_lines_required")),
      attachments: yup.string().required(t("attachments_required")),
      attachmentsRequired: yup.string().required(t("attachments_required")),
      graderInfo: yup.string(),
      graderInfoFormat: yup.number(),
      responseTemplate: yup.string(),
      responseTemplateFormat: yup.number(),
      fileTypesList: yup.array().when("attachments", ([attachments], schema) => {
        return Number(attachments) !== 0
          ? schema.required(t("file_types_required"))
          : schema.notRequired();
      }),
      minWord: yup
        .number()
        .required(t("min_word_required"))
        .typeError(t("invalid_type", { name: t("essay_min_word"), type: t("type_number") }))
        .min(-1, t("min_word_invalid"))
        .integer(t("min_word_invalid")),
      maxWord: yup
        .number()
        .required(t("max_word_required"))
        .typeError(t("invalid_type", { name: t("essay_max_word"), type: t("type_number") }))
        .min(-1, t("max_word_invalid"))
        .integer(t("max_word_invalid")),
      maxBytes: yup
        .string()
        .required(t("max_bytes_required"))
        .typeError(
          t("invalid_type", {
            name: t("question_management_default_score"),
            type: t("type_number")
          })
        )
    });
  }, [t]);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      questionName: "",
      questionDescription: "",
      defaultScore: "0",
      generalDescription: "",
      responseFormat: "editor",
      responseRequired: "0",
      responseFieldLines: "10",
      attachments: "0",
      attachmentsRequired: "0",
      graderInfo: "",
      responseTemplate: "",
      fileTypesList: [],
      minWord: -1,
      maxWord: -1,
      maxBytes: "1000"
    }
  });
  console.log(errors);

  const watchResponseFormat = watch("responseFormat");
  const watchResponseRequired = watch("responseRequired");
  const watchAttachments = watch("attachments");
  const watchFileTypesList = watch("fileTypesList");

  const location = useLocation();
  const courseId = location.state?.courseId;
  const isQuestionBank = location.state?.isQuestionBank;
  const categoryName = location.state?.categoryName;
  const categoryId = useParams()["categoryId"];
  const user: User = useSelector(selectCurrentUser);

  const submitHandler = async (data: any) => {
    setSubmitLoading(true);

    const formSubmittedData: FormData = { ...data };
    const newEssayQuestion: PostEssayQuestion = {
      organizationId: user.organization.organizationId,
      createdBy: user.userId,
      updatedBy: user.userId,
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: Number(formSubmittedData?.defaultScore),
      qType: "ESSAY",
      questionBankCategoryId: isQuestionBank ? categoryId : undefined,
      responseFormat: formSubmittedData.responseFormat,
      responseRequired: Number(formSubmittedData.responseRequired),
      responseFieldLines: Number(formSubmittedData.responseFieldLines),
      attachments: Number(formSubmittedData.attachments),
      attachmentsRequired: Number(formSubmittedData.attachmentsRequired),
      graderInfo: formSubmittedData.graderInfo,
      responseTemplate: formSubmittedData.responseTemplate,
      minWordLimit: formSubmittedData?.minWord,
      maxWordLimit: formSubmittedData?.maxWord,
      maxBytes: Number(formSubmittedData.maxBytes),
      fileTypesList: formSubmittedData.fileTypesList
        ? formSubmittedData.fileTypesList.join(",").toString()
        : "all"
    };
    console.log(newEssayQuestion);

    QuestionService.createEssayQuestion(newEssayQuestion)
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

  // useEffect(() => {
  //   console.log("focus");
  //   setFocus("questionDescription");
  // }, [errors.questionDescription]);

  useEffect(() => {
    setResponseFormat(watchResponseFormat);

    if (watchResponseFormat === "no_online" && attachments === 0) {
      setValue("attachments", "1");
    }
  }, [watchResponseFormat]);

  useEffect(() => {
    setResponseTextRequired(watchResponseRequired);
  }, [watchResponseRequired]);

  useEffect(() => {
    setAttachments(Number(watchAttachments));
  }, [watchAttachments]);

  useEffect(() => {
    setSelectedFileTypes(watchFileTypesList ? watchFileTypesList : []);
  }, [watchFileTypesList]);

  const responseFormatOptions = [
    {
      value: "editor",
      label: t("HTML_editor")
    },
    {
      value: "plain",
      label: t("plain_text")
    },
    {
      value: "no_online",
      label: t("no_online_text")
    }
  ];
  const responseRequiredOptions = [
    {
      value: "1",
      label: t("require_enter_text")
    },
    {
      value: "0",
      label: t("optional_enter_text")
    }
  ];
  const responseFieldLinesOptions = [
    {
      value: "2",
      label: t("response_field_lines", { lines: 2 })
    },
    {
      value: "3",
      label: t("response_field_lines", { lines: 3 })
    },
    {
      value: "5",
      label: t("response_field_lines", { lines: 5 })
    },
    {
      value: "10",
      label: t("response_field_lines", { lines: 10 })
    },
    {
      value: "15",
      label: t("response_field_lines", { lines: 15 })
    },
    {
      value: "20",
      label: t("response_field_lines", { lines: 20 })
    },
    {
      value: "25",
      label: t("response_field_lines", { lines: 25 })
    },
    {
      value: "30",
      label: t("response_field_lines", { lines: 30 })
    },
    {
      value: "35",
      label: t("response_field_lines", { lines: 35 })
    },
    {
      value: "40",
      label: t("response_field_lines", { lines: 40 })
    }
  ];
  const attachmentsOptions = [
    {
      value: "0",
      label: t("no_attachments")
    },
    {
      value: "1",
      label: t("num_attachment", { num: 1 })
    },
    {
      value: "2",
      label: t("num_attachment", { num: 2 })
    },
    {
      value: "3",
      label: t("num_attachment", { num: 3 })
    },
    {
      value: "-1",
      label: t("unlimited_attachment")
    }
  ];
  const requireAttachmentsOptions = [
    {
      value: "0",
      label: t("attachments_are_optional")
    },
    {
      value: "1",
      label: t("num_attachment", { num: 1 })
    },
    {
      value: "2",
      label: t("num_attachment", { num: 2 })
    },
    {
      value: "3",
      label: t("num_attachment", { num: 3 })
    }
  ];
  const maxBytesList = [
    {
      value: "10",
      label: "10 KB"
    },

    {
      value: "50",
      label: "50 KB"
    },
    {
      value: "100",
      label: "100 KB"
    },

    {
      value: "500",
      label: "500 KB"
    },
    {
      value: "1000",
      label: "1 MB"
    },
    {
      value: "2000",
      label: "2 MB"
    },

    {
      value: "5000",
      label: "5 MB"
    },
    {
      value: "10000",
      label: "10 MB"
    },
    {
      value: "20000",
      label: "20 MB"
    },

    {
      value: "40000",
      label: "40 MB"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Create essay question</title>
      </Helmet>
      <Grid className={classes.root}>
        <Header ref={headerRef} />
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
                  {props.courseName}
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
          <form onSubmit={handleSubmit(submitHandler, () => setSubmitCount((count) => count + 1))}>
            <Box className={classes.formBody}>
              <Typography
                className={classes.pageTitle}
                translation-key={["common_add", "common_question_type_with_question_truefalse"]}
              >
                {t("common_add")}{" "}
                {t("common_question_type_with_question_essay").toLocaleLowerCase()}
              </Typography>

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
                  <Grid item xs={6} md={6}>
                    <Controller
                      defaultValue={"0"}
                      control={control}
                      name='defaultScore'
                      render={({ field: { ref, ...field } }) => (
                        <InputTextFieldColumn
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
                          inputRef={ref}
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
                          render={({ field: { ref, ...field } }) => (
                            <TextEditor
                              title={t("exam_management_create_question_description")}
                              openDialog
                              roundedBorder
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

              <div>
                <ListItemButton onClick={() => setResponseOpen(!responseOpen)} sx={{ paddingX: 0 }}>
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12} md={3}>
                      <Heading2
                        sx={{ display: "inline" }}
                        translation-key='question_essay_response'
                      >
                        {t("question_essay_response")}
                      </Heading2>
                      {/* {Boolean(errors?.answers) && (
                    <ErrorMessage>{errors.answers?.message}</ErrorMessage>
                  )} */}
                    </Grid>
                    <Grid item xs={12} md={9} display={"flex"} alignItems={"center"}>
                      {responseOpen ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                  </Grid>
                </ListItemButton>

                <Collapse in={responseOpen} timeout='auto' unmountOnExit>
                  <Stack spacing={{ xs: 4 }} useFlexGap>
                    <Divider />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TitleWithInfoTip
                          translation-key='question_essay_response_format'
                          title={`${t("question_essay_response_format")} `}
                        />
                        <Controller
                          name='responseFormat'
                          control={control}
                          defaultValue='editor'
                          render={({ field: { onChange, value } }) => (
                            <JoySelect
                              value={value}
                              onChange={onChange}
                              options={responseFormatOptions}
                            />
                          )}
                        />
                      </Grid>

                      {responseFormat !== "no_online" && (
                        <>
                          {/* Response require */}
                          <Grid item xs={12} md={6}>
                            <TitleWithInfoTip
                              translation-key='question_essay_response_require'
                              title={`${t("question_essay_response_require")} `}
                            />
                            <Controller
                              name='responseRequired'
                              control={control}
                              defaultValue={"1"}
                              render={({ field: { onChange, value } }) => (
                                <JoySelect
                                  value={value}
                                  onChange={onChange}
                                  options={responseRequiredOptions}
                                />
                              )}
                            />
                          </Grid>

                          {/* Response field lines */}

                          <Grid item xs={12} md={6}>
                            <TitleWithInfoTip
                              translation-key='question_essay_response_field_lines'
                              title={`${t("question_essay_response_field_lines")} `}
                            />

                            <Controller
                              defaultValue={"10"}
                              control={control}
                              name='responseFieldLines'
                              render={({ field: { onChange, value } }) => (
                                <JoySelect
                                  value={value}
                                  onChange={onChange}
                                  options={responseFieldLinesOptions}
                                />
                              )}
                            />
                          </Grid>

                          {Number(responseTextRequired) === 1 && (
                            <>
                              <Grid item xs={12} md={6}>
                                <Controller
                                  defaultValue={-1}
                                  control={control}
                                  name='minWord'
                                  render={({ field: { ref, ...field } }) => (
                                    <InputTextFieldColumn
                                      error={Boolean(errors?.minWord)}
                                      errorMessage={errors.minWord?.message}
                                      title={`${t("essay_min_word")} *`}
                                      type='text'
                                      placeholder={t("essay_enter_min_word")}
                                      required
                                      translation-key='essay_min_word'
                                      {...field}
                                      inputRef={ref}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6} />
                              <Grid item xs={12} md={6}>
                                <Controller
                                  defaultValue={-1}
                                  control={control}
                                  name='maxWord'
                                  render={({ field: { ref, ...field } }) => (
                                    <InputTextFieldColumn
                                      error={Boolean(errors?.maxWord)}
                                      errorMessage={errors.maxWord?.message}
                                      title={`${t("essay_max_word")} *`}
                                      type='text'
                                      placeholder={t("essay_enter_max_word")}
                                      required
                                      translation-key={["essay_max_word", "essay_max_word"]}
                                      {...field}
                                      inputRef={ref}
                                    />
                                  )}
                                />
                              </Grid>
                            </>
                          )}
                        </>
                      )}

                      <Grid item xs={12} md={12}>
                        <TextTitle translation-key='question_attachments_setting'>
                          {t("question_attachments_setting")}
                        </TextTitle>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TitleWithInfoTip
                          translation-key='question_essay_attachment'
                          title={t("question_essay_attachment")}
                        />
                        <Controller
                          defaultValue={responseFormat === "no_online" ? "1" : "0"}
                          control={control}
                          name='attachments'
                          render={({ field: { onChange, value } }) => (
                            <JoySelect
                              value={value}
                              onChange={(newValue) => {
                                // Change the value based on responseFormat
                                if (responseFormat === "no_online" && value === "0") {
                                  value = "1";
                                }

                                // Call the original onChange function
                                onChange(newValue);
                              }}
                              options={attachmentsOptions}
                            />
                          )}
                        />
                      </Grid>
                      {(responseFormat === "no_online" || attachments !== 0) && (
                        <>
                          <Grid item xs={12} md={6}>
                            <TitleWithInfoTip
                              translation-key='question_require_attachments'
                              title={t("question_require_attachments")}
                            />
                            <Controller
                              defaultValue={"0"}
                              control={control}
                              name='attachmentsRequired'
                              render={({ field: { onChange, value } }) => (
                                <JoySelect
                                  value={value}
                                  onChange={onChange}
                                  options={requireAttachmentsOptions}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TitleWithInfoTip
                              translation-key='question_attachment_file_type'
                              title={t("question_attachment_file_type")}
                            />
                            <Controller
                              defaultValue={[]}
                              name='fileTypesList'
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ height: "38px", borderRadius: "12px" }}
                                  value={value}
                                  multiple
                                  onChange={(event: any, value: string[]) => onChange(value)}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                                      {selected.map((selectedOption) => (
                                        <Chip variant='soft' color='primary'>
                                          {selectedOption.value}
                                        </Chip>
                                      ))}
                                    </Box>
                                  )}
                                  slotProps={{
                                    listbox: {
                                      style: {
                                        minWidth: "0px"
                                      }
                                    }
                                  }}
                                  placeholder={t("question_attachment_file_type")}

                                  // error={Boolean(errors?.fileTypesList)}
                                  // renderValue={(selected) => selected.join(", ")}
                                >
                                  {!selectedFileTypes.includes("all") ? (
                                    fileTypes.map((fileType) => (
                                      <Option key={fileType.type} value={fileType.type}>
                                        <Checkbox
                                          checked={selectedFileTypes.indexOf(fileType.type) > -1}
                                        />
                                        <ListItemText
                                          primary={t(`file_type_${fileType.type}`)}
                                          secondary={fileType.description}
                                          sx={{
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            maxWidth: "400px"
                                          }}
                                        />
                                      </Option>
                                    ))
                                  ) : (
                                    <Option value={fileTypes[0].type}>
                                      <Checkbox
                                        checked={selectedFileTypes.indexOf(fileTypes[0].type) > -1}
                                      />
                                      <ListItemText
                                        primary={t(`file_type_${fileTypes[0].type}`)}
                                        secondary={fileTypes[0].description}
                                      />
                                    </Option>
                                  )}
                                </Select>
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TitleWithInfoTip
                              translation-key='max_byte_title'
                              title={t("max_byte_title")}
                            />

                            <Controller
                              defaultValue={"1000"}
                              control={control}
                              name='maxBytes'
                              render={({ field: { onChange, value } }) => (
                                <JoySelect
                                  value={value}
                                  onChange={onChange}
                                  options={maxBytesList}
                                />
                              )}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>

                    <Divider />
                  </Stack>
                </Collapse>
              </div>

              <div>
                <ListItemButton
                  onClick={() => setResponseTemplateOpen(!responseTemplateOpen)}
                  sx={{ paddingX: 0 }}
                >
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12} md={3}>
                      <Heading2
                        sx={{ display: "inline" }}
                        translation-key='question_essay_response_template'
                      >
                        {t("question_essay_response_template")}
                      </Heading2>
                    </Grid>
                    <Grid item xs={12} md={9} display={"flex"} alignItems={"center"}>
                      {responseTemplateOpen ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                  </Grid>
                </ListItemButton>

                <Collapse in={responseTemplateOpen} timeout='auto' unmountOnExit>
                  <Stack spacing={{ xs: 4 }} useFlexGap>
                    <Divider />
                    <Grid container spacing={1} columns={12}>
                      <Grid item xs={12} md={12} className={classes.textEditor}>
                        <TitleWithInfoTip
                          optional
                          translation-key='question_response_template'
                          title={t("question_response_template")}
                        />
                        <Controller
                          defaultValue=''
                          control={control}
                          name='responseTemplate'
                          render={({ field }) => (
                            <TextEditor
                              title={t("question_response_template")}
                              roundedBorder
                              openDialog
                              error={Boolean(errors?.responseTemplate)}
                              placeholder={`${t("question_enter_response_template")}...`}
                              required
                              translation-key='question_enter_response_template'
                              {...field}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <></>
                      </Grid>
                      <Grid item xs={12} md={9}>
                        {/* {Boolean(errors?.questionDescription) && (
                        <ErrorMessage marginBottom={"10px"}>
                          {errors.questionDescription?.message}
                        </ErrorMessage>
                      )} */}
                      </Grid>
                    </Grid>

                    <Divider />
                  </Stack>
                </Collapse>
              </div>

              <div>
                <ListItemButton
                  onClick={() => setGraderInfoOpen(!graderInfoOpen)}
                  sx={{ paddingX: 0 }}
                >
                  <Grid container alignItems={"center"} columns={12}>
                    <Grid item xs={12} md={3}>
                      <Heading2
                        sx={{ display: "inline" }}
                        translation-key='question_essay_grader_info'
                      >
                        {t("question_essay_grader_info")}
                      </Heading2>
                    </Grid>
                    <Grid item xs={12} md={9} display={"flex"} alignItems={"center"}>
                      {graderInfoOpen ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                  </Grid>
                </ListItemButton>

                <Collapse in={graderInfoOpen} timeout='auto' unmountOnExit>
                  <Stack spacing={{ xs: 4 }} useFlexGap>
                    <Divider />
                    <Grid container spacing={1} columns={12}>
                      <Grid item xs={12} md={12} className={classes.textEditor}>
                        <TitleWithInfoTip
                          optional
                          translation-key='question_essay_grader_info'
                          title={t("question_essay_grader_info")}
                        />{" "}
                        <Controller
                          defaultValue=''
                          control={control}
                          name='graderInfo'
                          render={({ field }) => (
                            <TextEditor
                              roundedBorder
                              openDialog
                              error={Boolean(errors?.graderInfo)}
                              placeholder={`${t("question_essay_enter_grader_info")}...`}
                              required
                              translation-key='question_essay_enter_grader_info'
                              {...field}
                              title={t("question_essay_grader_info")}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <></>
                      </Grid>
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
          </form>

          <SnackbarAlert
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={openSnackbar}
            setOpen={setOpenSnackbar}
            type={snackbarType}
            content={snackbarContent}
          />
        </Container>

        <Footer />
      </Grid>
      {/* <Box className={classes.stickyFooterContainer}>
        <Box className={classes.stickyFooterItem} />
      </Box> */}
    </>
  );
};

export default CreateEssayQuestion;

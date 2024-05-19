import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  ListItemButton,
  MenuItem,
  Button,
  Select,
  Stack,
  SelectChangeEvent,
  Checkbox,
  ListItemText
} from "@mui/material";
import Header from "components/Header";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useMemo, useRef, useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
// import Button from "@mui/joy/Button";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
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

interface Props {
  courseId?: string;
  courseName?: string;
  qtype: String;
  insideCrumb?: boolean;
}

interface FormData {
  questionName: string;
  questionDescription: string;
  defaultScore: number;
  generalDescription?: string;

  responseFormat: string;
  responseRequired?: number;
  responseFieldLines: number;
  attachments: number;
  attachmentsRequired?: number;
  graderInfo?: string;
  graderInfoFormat?: number;
  responseTemplate?: string;
  responseTemplateFormat?: number;
  fileTypesList?: string[];
  minWord: number;
  maxWord: number;
  maxBytes?: number;
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
const maxBytesList = [10, 50, 100, 500, 1000, 2000, 5000, 10000, 20000, 40000];

const CreateEssayQuestion = (props: Props) => {
  const { t } = useTranslation();
  const [responseFormat, setResponseFormat] = useState("editor");
  const [responseOpen, setResponseOpen] = useState(true);
  const [responseTemplateOpen, setResponseTemplateOpen] = useState(true);
  const [graderInfoOpen, setGraderInfoOpen] = useState(true);
  const [responseTextRequired, setResponseTextRequired] = useState(0);
  const [attachments, setAttachments] = useState(0);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
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

  useEffect(() => {
    console.log(selectedFileTypes);
  }, [selectedFileTypes]);

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
        .required(t("question_default_score_required"))
        .min(0, t("question_default_score_invalid")),
      generalDescription: yup.string(),

      responseFormat: yup.string().required(t("response_format_required")),
      responseRequired: yup.number(),
      responseFieldLines: yup.number().required(t("response_field_lines_required")),
      attachments: yup.number().required(t("attachments_required")),
      attachmentsRequired: yup.number(),
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
        .min(-1, t("min_word_invalid")),
      maxWord: yup
        .number()
        .required(t("max_word_required"))
        .typeError(t("invalid_type", { name: t("essay_max_word"), type: t("type_number") }))
        .min(-1, t("max_word_invalid")),
      maxBytes: yup
        .number()
        .typeError(
          t("invalid_type", {
            name: t("question_management_default_score"),
            type: t("type_number")
          })
        )
        .when("attachments", ([attachments], schema) => {
          return Number(attachments) !== 0
            ? schema.required(t("max_bytes_required"))
            : schema.notRequired();
        })
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
  console.log(selectedFileTypes);

  const submitHandler = async (data: any) => {
    const formSubmittedData: FormData = { ...data };
    const newEssayQuestion: PostEssayQuestion = {
      organizationId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      createdBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      updatedBy: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      difficulty: "EASY",
      name: formSubmittedData.questionName,
      questionText: formSubmittedData.questionDescription,
      generalFeedback: formSubmittedData?.generalDescription,
      defaultMark: formSubmittedData?.defaultScore,
      qType: "ESSAY",

      responseFormat: formSubmittedData.responseFormat,
      responseRequired: formSubmittedData.responseRequired,
      responseFieldLines: formSubmittedData.responseFieldLines,
      attachments: formSubmittedData.attachments,
      attachmentsRequired: formSubmittedData.attachmentsRequired,
      graderInfo: formSubmittedData.graderInfo,
      responseTemplate: formSubmittedData.responseTemplate,
      minWordLimit: formSubmittedData?.minWord,
      maxWordLimit: formSubmittedData?.maxWord,
      maxBytes: formSubmittedData.maxBytes,
      fileTypesList: formSubmittedData.fileTypesList
        ? formSubmittedData.fileTypesList.join(",").toString()
        : "all"
    };
    console.log(newEssayQuestion);

    QuestionService.createEssayQuestion(newEssayQuestion)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFileTypeChange = (event: SelectChangeEvent<typeof selectedFileTypes>) => {
    const {
      target: { value }
    } = event;
    // Ensure value is always an array
    value.includes("all")
      ? setSelectedFileTypes(["all"])
      : setSelectedFileTypes(typeof value === "string" ? value.split(",") : value);
    console.log("slec: " + selectedFileTypes);
  };
  return (
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
        <form onSubmit={handleSubmit(submitHandler)}>
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
              <Grid item xs={12} md={3}>
                <TextTitle translation-key='question_management_rating_criteria'>
                  {t("question_management_rating_criteria")}
                </TextTitle>
              </Grid>
              <Grid item xs={12} md={9} className={classes.textEditor}>
                <TextEditor
                  min
                  placeholder={`${t("question_management_enter_rating_criteria")}...`}
                  value={""}
                  translation-key='question_management_enter_rating_criteria'
                />
              </Grid>
            </Grid>

            <div>
              <ListItemButton onClick={() => setResponseOpen(!responseOpen)} sx={{ paddingX: 0 }}>
                <Grid container alignItems={"center"} columns={12}>
                  <Grid item xs={12} md={3}>
                    <Heading2 sx={{ display: "inline" }} translation-key='question_essay_response'>
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
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} md={3}>
                      <TextTitle translation-key='question_essay_response_format'>
                        {t("question_essay_response_format")}
                      </TextTitle>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Select
                        defaultValue={"editor"}
                        fullWidth={true}
                        size='small'
                        required
                        {...register("responseFormat")}
                        onChange={(e) => {
                          setResponseFormat(e.target.value);
                        }}
                      >
                        <MenuItem value={"editor"} translation-key='HTML_editor'>
                          {t("HTML_editor")}
                        </MenuItem>
                        <MenuItem value={"plain"} translation-key='plain_text'>
                          {t("plain_text")}
                        </MenuItem>
                        <MenuItem value={"no_online"} translation-key='no_online_text'>
                          {t("no_online_text")}
                        </MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  {responseFormat !== "no_online" && (
                    <>
                      {/* Response require */}
                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='question_essay_response_require'>
                            {t("question_essay_response_require")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Select
                            defaultValue={0}
                            fullWidth={true}
                            size='small'
                            required
                            {...register("responseRequired")}
                            onChange={(e) => {
                              setResponseTextRequired(Number(e.target.value));
                            }}
                          >
                            <MenuItem value={0} translation-key='require_enter_text'>
                              {t("require_enter_text")}
                            </MenuItem>
                            <MenuItem value={1} translation-key='optional_enter_text'>
                              {t("optional_enter_text")}
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>

                      {/* Response field lines */}
                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='question_essay_response_field_lines'>
                            {t("question_essay_response_field_lines")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Select
                            defaultValue={10}
                            fullWidth={true}
                            size='small'
                            required
                            {...register("responseFieldLines")}
                          >
                            <MenuItem value={2} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 2 })}
                            </MenuItem>
                            <MenuItem value={3} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 3 })}
                            </MenuItem>
                            <MenuItem value={5} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 5 })}
                            </MenuItem>
                            <MenuItem value={10} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 10 })}
                            </MenuItem>
                            <MenuItem value={15} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 15 })}
                            </MenuItem>
                            <MenuItem value={20} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 20 })}
                            </MenuItem>
                            <MenuItem value={25} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 25 })}
                            </MenuItem>
                            <MenuItem value={30} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 30 })}
                            </MenuItem>
                            <MenuItem value={35} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 35 })}
                            </MenuItem>
                            <MenuItem value={40} translation-key='require_enter_text'>
                              {t("response_field_lines", { lines: 40 })}
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>

                      {responseTextRequired === 0 && (
                        <>
                          <Controller
                            defaultValue={-1}
                            control={control}
                            name='minWord'
                            render={({ field }) => (
                              <InputTextField
                                error={Boolean(errors?.minWord)}
                                errorMessage={errors.minWord?.message}
                                title={`${t("essay_min_word")} *`}
                                type='text'
                                placeholder={t("essay_enter_min_word")}
                                required
                                translation-key='essay_min_word'
                                {...field}
                              />
                            )}
                          />
                          <Controller
                            defaultValue={-1}
                            control={control}
                            name='maxWord'
                            render={({ field }) => (
                              <InputTextField
                                error={Boolean(errors?.maxWord)}
                                errorMessage={errors.maxWord?.message}
                                title={`${t("essay_max_word")} *`}
                                type='text'
                                placeholder={t("essay_enter_max_word")}
                                required
                                translation-key={["essay_max_word", "essay_max_word"]}
                                {...field}
                              />
                            )}
                          />
                        </>
                      )}

                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='question_allow_attachments'>
                            {t("question_allow_attachments")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Select
                            defaultValue={0}
                            fullWidth={true}
                            size='small'
                            required
                            {...register("attachments")}
                            onChange={(e) => {
                              setAttachments(Number(e.target.value));
                            }}
                          >
                            <MenuItem value={0} translation-key='no_attachments'>
                              {t("no_attachments")}
                            </MenuItem>
                            <MenuItem value={1} translation-key='num_attachment'>
                              {t("num_attachment", { num: 1 })}
                            </MenuItem>
                            <MenuItem value={2} translation-key='num_attachment'>
                              {t("num_attachment", { num: 2 })}
                            </MenuItem>
                            <MenuItem value={3} translation-key='num_attachment'>
                              {t("num_attachment", { num: 3 })}
                            </MenuItem>
                            <MenuItem value={-1} translation-key='num_attachment'>
                              {t("unlimited_attachment")}
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {(responseFormat === "no_online" || attachments !== 0) && (
                    <>
                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='question_require_attachments'>
                            {t("question_require_attachments")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Select
                            defaultValue={0}
                            fullWidth={true}
                            size='small'
                            required
                            {...register("attachmentsRequired")}
                            onChange={(e) => {
                              setAttachments(Number(e.target.value));
                            }}
                          >
                            <MenuItem value={0} translation-key='attachments_are_optional'>
                              {t("attachments_are_optional")}
                            </MenuItem>
                            <MenuItem value={1} translation-key='num_attachment'>
                              {t("num_attachment", { num: 1 })}
                            </MenuItem>
                            <MenuItem value={2} translation-key='num_attachment'>
                              {t("num_attachment", { num: 2 })}
                            </MenuItem>
                            <MenuItem value={3} translation-key='num_attachment'>
                              {t("num_attachment", { num: 3 })}
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>

                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='question_attachment_file_type'>
                            {t("question_attachment_file_type")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Controller
                            defaultValue={selectedFileTypes}
                            name='fileTypesList'
                            control={control}
                            render={({ field }) => (
                              <Select
                                multiple
                                fullWidth={true}
                                size='small'
                                {...field}
                                onChange={(e) => {
                                  handleFileTypeChange(e);
                                  field.onChange(e);
                                }}
                                error={Boolean(errors?.fileTypesList)}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                {!selectedFileTypes.includes("all") ? (
                                  fileTypes.map((fileType) => (
                                    <MenuItem key={fileType.type} value={fileType.type}>
                                      <Checkbox
                                        checked={selectedFileTypes.indexOf(fileType.type) > -1}
                                      />
                                      <ListItemText
                                        primary={t(`file_type_${fileType.type}`)}
                                        secondary={fileType.description}
                                      />
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value={fileTypes[0].type}>
                                    <Checkbox
                                      checked={selectedFileTypes.indexOf(fileTypes[0].type) > -1}
                                    />
                                    <ListItemText
                                      primary={t(`file_type_${fileTypes[0].type}`)}
                                      secondary={fileTypes[0].description}
                                    />
                                  </MenuItem>
                                )}
                              </Select>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <></>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          {Boolean(errors?.fileTypesList) && (
                            <ErrorMessage>{errors.fileTypesList?.message}</ErrorMessage>
                          )}
                        </Grid>
                      </Grid>

                      <Grid container spacing={1} columns={12}>
                        <Grid item xs={12} md={3}>
                          <TextTitle translation-key='max_byte_title'>
                            {t("max_byte_title")}
                          </TextTitle>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Select
                            defaultValue={1000}
                            fullWidth={true}
                            size='small'
                            required
                            {...register("maxBytes")}
                            onChange={(e) => {
                              setAttachments(Number(e.target.value));
                            }}
                          >
                            {maxBytesList.map((maxByte: number) => (
                              <MenuItem key={maxByte} value={maxByte}>
                                {maxByte / 1000 < 1 ? `${maxByte} KB` : `${maxByte / 1000} MB`}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    </>
                  )}
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
                    <Grid item xs={12} md={3}>
                      <TextTitle translation-key='question_response_template'>
                        {t("question_response_template")}
                      </TextTitle>
                    </Grid>
                    <Grid item xs={12} md={9} className={classes.textEditor}>
                      <Controller
                        defaultValue=''
                        control={control}
                        name='responseTemplate'
                        render={({ field }) => (
                          <TextEditor
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
                    <Grid item xs={12} md={3}>
                      <TextTitle translation-key='question_essay_grader_info'>
                        {t("question_essay_grader_info")}
                      </TextTitle>
                    </Grid>
                    <Grid item xs={12} md={9} className={classes.textEditor}>
                      <Controller
                        defaultValue=''
                        control={control}
                        name='graderInfo'
                        render={({ field }) => (
                          <TextEditor
                            error={Boolean(errors?.graderInfo)}
                            placeholder={`${t("question_essay_enter_grader_info")}...`}
                            required
                            translation-key='question_essay_enter_grader_info'
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
        </form>
      </Container>
    </Grid>
  );
};

export default CreateEssayQuestion;

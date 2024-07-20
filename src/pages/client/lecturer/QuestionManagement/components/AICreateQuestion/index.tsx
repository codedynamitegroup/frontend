import { Box, Container, Grid, MenuItem, Select, Skeleton } from "@mui/material";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import { memo, useState } from "react";
import { useLocation, useMatches, useNavigate, useParams } from "react-router-dom";
import classes from "./styles.module.scss";
import Button from "@mui/joy/Button";
import { routes } from "routes/routes";
import { Card, Textarea, RadioGroup, Badge } from "@mui/joy";
import Heading6 from "components/text/Heading6";
import FormControlLabel from "@mui/material/FormControlLabel";
import Heading4 from "components/text/Heading4";
import SnackbarAlert from "components/common/SnackbarAlert";
import CreateQuestionByAI, { IQuestion } from "services/AIService/CreateQuestionByAI";
import MDEditor from "@uiw/react-md-editor";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store";
import CustomBreadCrumb from "components/common/Breadcrumb";
import { addQuestion } from "reduxes/CreateQuestion";
import { useDispatch } from "react-redux";
import { setErrorMess } from "reduxes/AppStatus";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import ParagraphSmall from "components/text/ParagraphSmall";
import images from "config/images";
import Heading5 from "components/text/Heading5";
import ReactQuill from "react-quill";

interface Props {
  insideCrumb?: boolean;
  isOrg?: boolean;
}
export enum AlertType {
  Success = "success",
  INFO = "info",
  Warning = "warning",
  Error = "error"
}
export enum EQType {
  Essay = 1,
  MultipleChoice = 2,
  ShortAnswer = 3,
  TrueFalse = 4
}
export enum EQuestionLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3
}
export enum ELanguage {
  Vietnamese = 1,
  English = 2
}
export enum EAmountAnswer {
  Three = 3,
  Four = 4,
  Five = 5
}

const AICreateQuestion = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const location = useLocation();
  const categoryName = location.state?.categoryName;
  const isOrgAdmin = location.state?.isOrgAdmin;
  const { categoryId } = useParams<{ categoryId: string }>();

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [lengthQuestion, setLengthQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [desciption, setDesciption] = useState("");
  const [number_question, setNumberQuestion] = useState(5);
  const [level, setLevel] = useState<EQuestionLevel>(EQuestionLevel.Easy);
  const [qtype, setQtype] = useState<EQType>(EQType.MultipleChoice);
  const [answeredQtype, setAnsweredQtype] = useState<EQType>(EQType.MultipleChoice);
  const [qamountAnswer, setQamountAnswer] = useState<EAmountAnswer>(EAmountAnswer.Three);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);
  const [allowMultipleCorrectAnswer, setAllowMultipleCorrectAnswer] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);
    setQuestions([]);
    setAnsweredQtype(qtype);

    try {
      const genJob = await CreateQuestionByAI(
        topic,
        desciption,
        qtype,
        qamountAnswer,
        allowMultipleCorrectAnswer,
        number_question,
        level
      );
      if (genJob !== undefined) {
        const data = await genJob;
        const questionsTemp = data[0];

        setQuestions(questionsTemp);
        setLengthQuestion(questionsTemp.length);
      }
    } catch (error) {
      console.error("Error generating text:", error);
      dispatch(setErrorMess("Error in generating question"));
    } finally {
      setLoading(false);
    }
  };

  const urlParams = useParams();
  const handleQuestionClick = (questionData: IQuestion) => {
    if (!categoryId) return;

    const newId = crypto.randomUUID();
    const tempQuestion = {
      ...questionData,
      tempId: newId,
      qType: answeredQtype
    };
    dispatch(addQuestion(tempQuestion));

    let navigateLink = "";
    if (answeredQtype === EQType.Essay) {
      navigateLink = isOrgAdmin
        ? routes.org_admin.question_bank.create_question.essay.createAI
        : routes.lecturer.question_bank.create_question.essay.createAI;
    } else if (answeredQtype === EQType.MultipleChoice) {
      navigateLink = isOrgAdmin
        ? routes.org_admin.question_bank.create_question.multiple_choice.createAI
        : routes.lecturer.question_bank.create_question.multiple_choice.createAI;
    } else if (answeredQtype === EQType.ShortAnswer) {
      navigateLink = isOrgAdmin
        ? routes.org_admin.question_bank.create_question.short_answer.createAI
        : routes.lecturer.question_bank.create_question.short_answer.createAI;
    } else {
      navigateLink = isOrgAdmin
        ? routes.org_admin.question_bank.create_question.true_false.createAI
        : routes.lecturer.question_bank.create_question.true_false.createAI;
    }

    navigateLink = navigateLink.replace(":categoryId", categoryId).replace(":aiQuestionId", newId);

    window.open(`#${navigateLink}`);
  };

  const breadCrumbData = isOrgAdmin
    ? [
        { navLink: routes.org_admin.question_bank.root, label: t("common_question_bank") },
        {
          navLink: routes.org_admin.question_bank.detail.replace(":categoryId", categoryId || ""),
          label: categoryName || ""
        }
      ]
    : [
        { navLink: routes.lecturer.question_bank.path, label: t("common_question_bank") },
        {
          navLink: `${routes.lecturer.question_bank.detail.replace(":categoryId", categoryId || "")}`,
          label: categoryName || ""
        }
      ];

  return (
    <Grid className={classes.root}>
      <Header />
      <Container
        sx={{
          margin: `${sidebarStatus?.headerHeight}px 10px 20px 10px`
        }}
        className={classes.container}
      >
        <CustomBreadCrumb
          breadCrumbData={breadCrumbData}
          lastBreadCrumbLabel={t("create_question_ai")}
        />
        <Heading1 fontWeight={"500"} translation-key='common_add_question'>
          {t("common_add_question")}
        </Heading1>
        <Grid
          container
          spacing={1}
          sx={{
            paddingRight: "20px"
          }}
        >
          <Grid item xs={4}>
            <Card
              component='form'
              className={classes.formBody}
              autoComplete='off'
              variant='outlined'
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InputTextFieldColumn
                    useDefaultTitleStyle
                    title={t("common_topic")}
                    onChange={(e: any) => setTopic(e.target.value)}
                    value={topic}
                    placeholder={t("common_enter_topic")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TitleWithInfoTip
                    title={t("common_description")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Textarea
                    sx={{
                      borderRadius: "12px"
                    }}
                    onChange={(e: any) => {
                      if (desciption.length <= 200) {
                        if (e.target.value.length + desciption.length <= 200)
                          setDesciption(e.target.value);
                        else {
                          setDesciption(e.target.value.slice(0, 200));
                        }
                      }
                    }}
                    value={desciption}
                    placeholder={t("common_enter_description")}
                    minRows={6}
                    maxRows={10}
                    endDecorator={
                      <ParagraphSmall
                        fontWeight={500}
                      >{`${desciption.length} / 200`}</ParagraphSmall>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TitleWithInfoTip
                    title={t("common_question_type")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Select
                    value={qtype}
                    onChange={(e: any) => setQtype(e.target.value)}
                    fullWidth={true}
                    size='small'
                    required
                    sx={{
                      borderRadius: "12px"
                    }}
                  >
                    <MenuItem value={EQType.Essay}>{t("common_question_type_essay")}</MenuItem>
                    <MenuItem value={EQType.MultipleChoice}>
                      {t("common_question_type_multi_choice")}
                    </MenuItem>
                    <MenuItem value={EQType.ShortAnswer}>
                      {t("common_question_type_short")}
                    </MenuItem>
                    <MenuItem value={EQType.TrueFalse}>{t("common_question_type_yes_no")}</MenuItem>
                  </Select>
                </Grid>
                {qtype === EQType.MultipleChoice && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TitleWithInfoTip
                        title={t("num_of_answer")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
                      <Select
                        sx={{
                          borderRadius: "12px"
                        }}
                        value={qamountAnswer}
                        onChange={(e: any) => setQamountAnswer(e.target.value)}
                        fullWidth={true}
                        size='small'
                        required
                      >
                        <MenuItem value={EAmountAnswer.Three}>3</MenuItem>
                        <MenuItem value={EAmountAnswer.Four}>4</MenuItem>
                        <MenuItem value={EAmountAnswer.Five}>5</MenuItem>
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                    >
                      <TitleWithInfoTip
                        title={t("allow_multiple_correct_answer")}
                        fontSize='12px'
                        color='var(--gray-60)'
                        gutterBottom
                        fontWeight='600'
                      />
                      <Select
                        sx={{
                          borderRadius: "12px"
                        }}
                        value={allowMultipleCorrectAnswer ? "1" : "0"}
                        onChange={(e: any) => {
                          if (e.target.value === "1") setAllowMultipleCorrectAnswer(true);
                          else setAllowMultipleCorrectAnswer(false);
                        }}
                        fullWidth={true}
                        size='small'
                        required
                      >
                        <MenuItem value={"1"}>{t("common_allow_multiple_correct_answer")}</MenuItem>
                        <MenuItem value={"0"}>{t("common_only_one_correct_answer")}</MenuItem>
                      </Select>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <InputTextFieldColumn
                    useDefaultTitleStyle
                    title={t("num_of_question")}
                    type='number'
                    value={number_question}
                    onChange={(e: any) => {
                      if (e.target.value < 1) {
                        setNumberQuestion(1);
                      }
                      setNumberQuestion(e.target.value);
                    }}
                    placeholder='Nhập số lượng câu hỏi'
                  />
                </Grid>

                <Grid item xs={12}>
                  <TitleWithInfoTip
                    title={t("common_difficult_level")}
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Select
                    sx={{
                      borderRadius: "12px"
                    }}
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    fullWidth={true}
                    size='small'
                    required
                  >
                    <MenuItem value={EQuestionLevel.Easy}>{t("common_easy")}</MenuItem>
                    <MenuItem value={EQuestionLevel.Medium}>{t("common_medium")}</MenuItem>
                    <MenuItem value={EQuestionLevel.Hard}>{t("common_hard")}</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Button onClick={handleGenerate} loading={loading}>
                  {t("question_management_create_question")}
                </Button>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={8}>
            <Card className={classes.listQuestion}>
              <Grid container spacing={2}>
                {questions &&
                  questions.map((value: IQuestion, index) => {
                    return (
                      <Grid item xs={12}>
                        <Badge
                          sx={{ width: "100%" }}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left"
                          }}
                          badgeContent={`${index + 1}`}
                          color={"neutral"}
                          variant='solid'
                        >
                          <Button
                            className={classes.questionCard}
                            key={index}
                            onClick={() => handleQuestionClick(value)}
                            variant='outlined'
                            color='neutral'
                            fullWidth
                          >
                            <Heading6 className={classes.question} fontWeight={"600"}>
                              {value.question}
                            </Heading6>
                            <Box className={classes.answer}>
                              <RadioGroup
                                aria-labelledby='demo-radio-buttons-group-label'
                                defaultValue='female'
                                name='radio-buttons-group'
                                value={value.correctAnswer}
                              >
                                {value.answers &&
                                  value.answers.map((answer, index) => {
                                    return (
                                      <Box className={classes.answerItem} key={index}>
                                        {value.correctAnswer ? (
                                          <>
                                            <FormControlLabel
                                              value={index + 1}
                                              control={<></>}
                                              label={`(${String.fromCharCode(65 + index)})`}
                                              labelPlacement='start'
                                              className={classes.radio}
                                            />
                                            {value?.correctAnswer?.some(
                                              (answer) => answer === index + 1
                                            ) ? (
                                              <ParagraphBody
                                                className={classes.answerContent}
                                                colorname='--green-500'
                                              >
                                                {answer.content}
                                              </ParagraphBody>
                                            ) : (
                                              <ParagraphBody className={classes.answerContent}>
                                                {answer.content}
                                              </ParagraphBody>
                                            )}
                                          </>
                                        ) : (
                                          <Box
                                            data-color-mode='light'
                                            className={classes.answerContent}
                                          >
                                            <MDEditor.Markdown
                                              source={answer.content}
                                              className={classes.markdown}
                                            />
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })}
                              </RadioGroup>
                            </Box>
                          </Button>
                        </Badge>
                      </Grid>
                    );
                  })}
              </Grid>
              {!loading && questions.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "700px",
                    gap: "10px",
                    width: "100%"
                  }}
                >
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box
                      component='img'
                      src={images.course.emptyBox}
                      sx={{
                        width: "100px",
                        height: "100px"
                      }}
                    />
                    <Heading1>{t("common_no_question_data")}</Heading1>
                  </Box>

                  <ParagraphBody fontSize={"16px"}>{t("common_no_data_description")}</ParagraphBody>
                </Box>
              )}
              {loading === true && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: "10px"
                  }}
                >
                  <Grid container spacing={2}>
                    {Array.from({ length: number_question }).map((_, index) => (
                      <Grid item xs={12} key={index}>
                        <Skeleton variant='rounded' height={150} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Card>
          </Grid>
          <SnackbarAlert
            open={openSnackbarAlert}
            setOpen={setOpenSnackbarAlert}
            type={alertType}
            content={alertContent}
          />
        </Grid>
      </Container>
    </Grid>
  );
};

export default memo(AICreateQuestion);

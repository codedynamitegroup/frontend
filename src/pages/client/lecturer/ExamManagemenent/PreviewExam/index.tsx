import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, CssBaseline, Divider, Drawer, Grid, Skeleton, Stack, TextField } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import TextTitle from "components/text/TextTitle";
import useWindowDimensions from "hooks/useWindowDimensions";
import * as React from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import EssayExamQuestion from "./components/ExamQuestion/EssayExamQuestion";
import MultipleChoiceExamQuestion from "./components/ExamQuestion/MultipleChoiceExamQuestion";
import ShortAnswerExamQuestion from "./components/ExamQuestion/ShortAnswerExamQuestion";
import TrueFalseExamQuestion from "./components/ExamQuestion/TrueFalseExamQuestion";
import classes from "./styles.module.scss";
import useBoxDimensions from "hooks/useBoxDimensions";
import { ExamService } from "services/courseService/ExamService";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";
import Button from "@mui/joy/Button";
import { ExamEntity } from "models/courseService/entity/ExamEntity";
import { useTranslation } from "react-i18next";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import IconButton from "@mui/joy/IconButton";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import ExamReviewBoxContent from "./components/BoxContent";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { QuestionService } from "services/coreService/QuestionService";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import convertUuidToHashSlug from "utils/convertUuidToHashSlug";
import { Helmet } from "react-helmet";

interface SubmissionData {
  examSubmissionId: string;
  examId: string;
  userId: string;
  startTime: Date;
  submitTime: Date;
  status: string;
  questionSubmissionResponses: {
    questionId: string;
    examSubmissionId: string;
    userId: string;
    passStatus: string;
    grade: number;
    content: string;
    rightAnswer: string;
    numFile: number;
  }[];
}

const drawerWidth = 370;


export default function PreviewExam() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const examId = useParams<{ examId: string }>().examId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const questionPageIndex = parseInt(searchParams.get("page") || "0");
  const isShowAllQuesionsInOnePage = searchParams.get("showall");
  const [open, setOpen] = React.useState(true);
  const [inputIndexValue, setInputIndexValue] = React.useState(1);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [examData, setExamData] = React.useState<ExamEntity | undefined>(undefined);
  const [submissionData, setSubmissionData] = React.useState<SubmissionData | undefined>(undefined);
  const [timeOpen, setTimeOpen] = React.useState<Date>(new Date());
  const [timeClose, setTimeClose] = React.useState<Date>(new Date());
  const [mainSkeleton, setMainSkeleton] = React.useState<boolean>(true);
  const [timeTaken, setTimeTaken] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  React.useEffect(() => {
    if (examId) {
      // Get exam data
      ExamService.getExamById(examId)
        .then((res) => {
          console.log("Get exam data");
          setExamData(res);
        })
        .catch((error) => {
          console.error(error);
        });

      // Get exam questions
      ExamService.getExamQuestionById(examId, null)
        .then((res) => {
          console.log("Get exam questions");
          const questionIds = res.questions.map((question: GetQuestionExam) => ({
            questionId: question.id,
            qtype: question.qtype
          }));
          const postQuestionDetailList: PostQuestionDetailList = {
            questionCommands: questionIds
          };

          // Get question detail
          QuestionService.getQuestionDetail(postQuestionDetailList)
            .then((res) => {
              console.log("Get question detail");
              const transformList = res.questionResponses.map((question: any) => {
                const data = question.qtypeEssayQuestion
                  ? question.qtypeEssayQuestion
                  : question.qtypeShortAnswerQuestion
                    ? question.qtypeShortAnswerQuestion
                    : question.qtypeMultichoiceQuestion
                      ? question.qtypeMultichoiceQuestion
                      : question.qtypeTrueFalseQuestion
                        ? question.qtypeTrueFalseQuestion
                        : question.qtypeCodeQuestion;
                return {
                  data
                };
              });
              setQuestions(transformList);
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {});
        })
        .catch((error) => {
          setMainSkeleton(false);
          console.error(error);
        })
        .finally(() => {
          setMainSkeleton(false);
        });

      // Get exam submission data
      if (submissionId !== undefined)
        ExamService.getExamSubmissionById(submissionId)
          .then((res) => {
            console.log("Get exam submission data");
            setSubmissionData(res);

            // Calculate time taken
            const openTime = new Date(res.startTime);
            const closeTime = new Date(res.submitTime);

            const diffMs = closeTime.getTime() - openTime.getTime(); // milliseconds between openTime & closeTime
            const diffDays = Math.floor(diffMs / 86400000); // days
            const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds
            setTimeOpen(openTime);
            setTimeClose(closeTime);

            setTimeTaken({
              days: diffDays,
              hours: diffHrs,
              minutes: diffMins,
              seconds: diffSecs
            });
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {});
    }
  }, []);

  const [drawerVariant, setDrawerVariant] = React.useState<
    "temporary" | "permanent" | "persistent"
  >(width < 1080 ? "temporary" : "permanent");
  React.useEffect(() => {
    if (width < 1080) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("persistent");
    }
  }, [width]);

  const monthNames = [
    t("common_january"),
    t("common_february"),
    t("common_march"),
    t("common_april"),
    t("common_may"),
    t("common_june"),
    t("common_july"),
    t("common_august"),
    t("common_september"),
    t("common_october"),
    t("common_november"),
    t("common_december")
  ];

  const weekdayNames = [
    t("common_sunday"),
    t("common_monday"),
    t("common_tuesday"),
    t("common_wednesday"),
    t("common_thursday"),
    t("common_friday"),
    t("common_saturday")
  ];

  return (
    <>
      <Helmet>
        <title>{`${t("exam_review_attempt_title")} | ${examData?.name}`}</title>
      </Helmet>
      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <Box className={classes.container} style={{ marginTop: `${headerHeight}px` }}>
          <CssBaseline />

          <CssBaseline />
          {/* <DrawerHeader /> */}
          <Button
            // aria-label='open drawer'
            onClick={handleDrawerOpen}
            sx={{
              ...(open && { display: "none" }),
              position: "fixed",
              top: `${headerHeight + 10}px`,
              right: 0,
              height: "44px",
              width: "49px"
            }}
            size='sm'
            endDecorator={<MenuIcon color='action' />}
            variant='soft'
          />
          <Box className={classes.formBody} width={"100%"}>
            <Heading1 fontWeight={"500"}>{examData?.name}</Heading1>
            <Button
              onClick={() => {
                if (courseId && examId)
                  navigate(
                    routes.lecturer.exam.detail
                      .replace(":courseId", courseId)
                      .replace(":examId", examId)
                  );
              }}
              startDecorator={<ChevronLeftIcon fontSize='small' />}
              color='neutral'
              variant='soft'
              size='md'
              sx={{ width: "fit-content" }}
            >
              {t("common_back")}
            </Button>
            <Stack direction={"row"} spacing={1}>
              {mainSkeleton ? (
                <>
                  <Skeleton variant='rectangular' width={200} height={50} />
                  <Skeleton variant='rectangular' width={200} height={50} />
                  <Skeleton variant='rectangular' width={200} height={50} />
                </>
              ) : (
                <>
                  <ExamReviewBoxContent
                    textTitle={t("exam_review_started_on")}
                    textContent={t("common_show_time", {
                      weekDay: weekdayNames[timeOpen.getDay()],
                      day: timeOpen.getDate(),
                      month: monthNames[timeOpen.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                      year: timeOpen.getFullYear(),
                      time: `${timeOpen.getHours() < 10 ? `0${timeOpen.getHours()}` : timeOpen.getHours()}:${timeOpen.getMinutes() < 10 ? `0${timeOpen.getMinutes()}` : timeOpen.getMinutes()}`
                    })}
                    icon={
                      <DateRangeRoundedIcon
                        sx={{
                          fontSize: "15px",
                          marginBottom: "3px"
                        }}
                      />
                    }
                  />
                  <ExamReviewBoxContent
                    textTitle={t("exam_review_completed_on")}
                    textContent={t("common_show_time", {
                      weekDay: weekdayNames[timeClose.getDay()],
                      day: timeClose.getDate(),
                      month: monthNames[timeClose.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                      year: timeClose.getFullYear(),
                      time: `${timeClose.getHours() < 10 ? `0${timeClose.getHours()}` : timeClose.getHours()}:${timeClose.getMinutes() < 10 ? `0${timeClose.getMinutes()}` : timeClose.getMinutes()}`
                    })}
                    icon={
                      <CheckCircleOutlineRoundedIcon
                        sx={{
                          fontSize: "15px",
                          marginBottom: "3px"
                        }}
                      />
                    }
                  />
                  <ExamReviewBoxContent
                    textTitle={t("exam_review_time_taken")}
                    textContent={
                      timeTaken.days > 0
                        ? t("common_show_time_no_date_no_day", {
                            hour: t("hour", { count: timeTaken.hours }),
                            min: t("min", { count: timeTaken.minutes }),
                            sec: t("sec", { count: timeTaken.seconds })
                          })
                        : timeTaken.minutes > 0
                          ? t("common_show_time_no_date_no_hour", {
                              min: t("min", { count: timeTaken.minutes }),
                              sec: t("sec", { count: timeTaken.seconds })
                            })
                          : t("common_show_time_no_date_no_min", {
                              sec: t("sec", { count: timeTaken.seconds })
                            })
                    }
                    icon={
                      <AccessTimeRoundedIcon
                        sx={{
                          fontSize: "15px",
                          marginBottom: "3px"
                        }}
                      />
                    }
                  />
                </>
              )}
            </Stack>
            <Box
              sx={{
                borderRadius: "5px",
                border: "1px solid #E1E1E1",
                padding: "20px"
              }}
            >
              {isShowAllQuesionsInOnePage !== "0" ? (
                // show all questions in one page
                <Grid container spacing={7}>
                  {questions.map((question, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} id={convertUuidToHashSlug(question.data.question.id)}>
                        {question.data.question.qtype === qtype.essay.code ? (
                          <EssayExamQuestion
                            questionIndex={index}
                            questionEssayQuestion={question.data}
                            questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                              (submittedQuestion) =>
                                submittedQuestion.questionId === question.data.question.id
                            )}
                          />
                        ) : question.data.question.qtype === qtype.short_answer.code ? (
                          <ShortAnswerExamQuestion
                            questionIndex={index}
                            questionShortAnswer={question.data}
                            questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                              (submittedQuestion) =>
                                submittedQuestion.questionId === question.data.question.id
                            )}
                          />
                        ) : question.data.question.qtype === qtype.multiple_choice.code ? (
                          <MultipleChoiceExamQuestion
                            questionIndex={index}
                            questionMultiChoice={question.data}
                            questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                              (submittedQuestion) =>
                                submittedQuestion.questionId === question.data.question.id
                            )}
                          />
                        ) : question.data.question.qtype === qtype.true_false.code ? (
                          <TrueFalseExamQuestion
                            questionIndex={index}
                            questionTrueFalse={question.data}
                            questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                              (submittedQuestion) =>
                                submittedQuestion.questionId === question.data.question.id
                            )}
                          />
                        ) : null}
                      </Grid>
                      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                        <Divider
                          sx={{
                            width: "100px"
                          }}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              ) : questions[questionPageIndex].data.question.qtype === qtype.essay.code ? (
                <EssayExamQuestion
                  questionIndex={questionPageIndex}
                  questionEssayQuestion={questions[questionPageIndex].data}
                  questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                    (submittedQuestion) =>
                      submittedQuestion.questionId === questions[questionPageIndex].data.question.id
                  )}
                />
              ) : questions[questionPageIndex].data.question.qtype === qtype.short_answer.code ? (
                <ShortAnswerExamQuestion
                  questionIndex={questionPageIndex}
                  questionShortAnswer={questions[questionPageIndex].data}
                  questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                    (submittedQuestion) =>
                      submittedQuestion.questionId === questions[questionPageIndex].data.question.id
                  )}
                />
              ) : questions[questionPageIndex].data.question.qtype ===
                qtype.multiple_choice.code ? (
                <MultipleChoiceExamQuestion
                  questionIndex={questionPageIndex}
                  questionMultiChoice={questions[questionPageIndex].data}
                  questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                    (submittedQuestion) =>
                      submittedQuestion.questionId === questions[questionPageIndex].data.question.id
                  )}
                />
              ) : questions[questionPageIndex].data.question.qtype === qtype.true_false.code ? (
                <TrueFalseExamQuestion
                  questionIndex={questionPageIndex}
                  questionTrueFalse={questions[questionPageIndex].data}
                  questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                    (submittedQuestion) =>
                      submittedQuestion.questionId === questions[questionPageIndex].data.question.id
                  )}
                />
              ) : null}
              {isShowAllQuesionsInOnePage !== "0" ? (
                <Grid container spacing={1}>
                  <Grid item xs={6}></Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    <Button
                      onClick={() => {
                        if (courseId && examId)
                          navigate(
                            routes.lecturer.exam.detail
                              .replace(":courseId", courseId)
                              .replace(":examId", examId)
                          );
                        else {
                          // navigate to unknown page
                          // navigate();
                        }
                      }}
                    >
                      {t("exam_finish_review")}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={1}
                  sx={{
                    marginTop: "10px"
                  }}
                >
                  <Grid item xs={6}>
                    {questionPageIndex !== 0 && (
                      <Link
                        to={{
                          pathname: routes.student.exam.review,
                          search: `?showall=0&page=${questionPageIndex - 1}`
                        }}
                      >
                        <Button variant='soft'>
                          {t("course_management_exam_preview_prev_page")}
                        </Button>
                      </Link>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    {questionPageIndex !== questions.length - 1 ? (
                      <Link
                        to={{
                          pathname: routes.student.exam.review,
                          search: `?showall=0&page=${questionPageIndex + 1}`
                        }}
                      >
                        <Button>{t("course_management_exam_preview_next_page")}</Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => {
                          navigate(routes.lecturer.exam.detail);
                        }}
                        translation-key='exam_finish_review'
                      >
                        {t("exam_finish_review")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
          <Drawer
            sx={{
              display: open ? "block" : "none",
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                borderTop: "1px solid #E1E1E1",
                borderRadius: "12px 0px",
                width: drawerWidth,
                top: `${headerHeight + 10}px `
              }
            }}
            variant={drawerVariant}
            anchor='right'
            open={open}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 1 }}>
              <IconButton onClick={handleDrawerClose} variant='soft'>
                {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
            <Box className={classes.drawerBody}>
              <Box className={classes.drawerFieldContainer}>
                <Grid container maxHeight={"80dvh"} overflow={"auto"} rowSpacing={3}>
                  <Grid item xs={12}>
                    <TextTitle className={classes.drawerTextTitle}>
                      {t("take_exam_question_navigation_title")}
                    </TextTitle>

                    <TitleWithInfoTip
                      title={t("take_exam_question_name")}
                      fontSize='13px'
                      fontWeight='500'
                    />
                    <TextField
                      placeholder={t("exam_enter_question_index")}
                      size='small'
                      type='number'
                      fullWidth
                      sx={{ marginBottom: "10px" }}
                      value={inputIndexValue}
                      InputProps={{
                        inputProps: { min: 1, max: questions.length }
                      }}
                      onChange={(e) => {
                        var value = parseInt(e.target.value, 10);
                        const max = questions.length;

                        if (value > max) value = max;
                        if (value < 1) value = 1;

                        setInputIndexValue(value);

                        if (value !== undefined || value !== null || isNaN(value)) {
                          if (isShowAllQuesionsInOnePage === "0") {
                            if (courseId && examId && submissionId && value - 1 >= 0)
                              navigate(
                                `${routes.lecturer.exam.review
                                  .replace(":courseId", courseId)
                                  .replace(":examId", examId)
                                  .replace(
                                    ":submissionId",
                                    submissionId
                                  )}?showall=0&page=${value - 1}`
                              );
                            else {
                              // navigate to unknown page
                              // navigate();
                            }
                          } else {
                            if (questions[value - 1]) {
                              const slug = convertUuidToHashSlug(
                                questions[value - 1].data.question.id
                              );
                              const element = document.getElementById(slug);
                              element?.scrollIntoView({ behavior: "smooth" });
                            }
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1} className={classes.pageNavigationDrawer}>
                  {questions.map((question, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={"outlined"}
                        sx={{
                          borderRadius: "1000px",
                          width: "40px",
                          height: "40px"
                          // backgroundColor: question.answered ? "#e1e1e1" : ""
                        }}
                        onClick={() => {
                          if (isShowAllQuesionsInOnePage === "0") {
                            if (courseId && examId && submissionId)
                              navigate(
                                `${routes.student.exam.review
                                  .replace(":courseId", courseId)
                                  .replace(":examId", examId)
                                  .replace(":submissionId", submissionId)}?showall=0&page=${index}`
                              );
                            else {
                              // navigate to unknown page
                              // navigate();
                            }
                          } else {
                            const slug = convertUuidToHashSlug(question.data.question.id);
                            const element = document.getElementById(slug);
                            element?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                  <Grid item xs={12} justifyContent={"center"} display={"flex"}>
                    <Button
                      fullWidth
                      variant='soft'
                      onClick={() => {
                        if (courseId && examId && submissionId) {
                          if (isShowAllQuesionsInOnePage !== "0")
                            navigate(
                              `${`${routes.student.exam.review
                                .replace(":courseId", courseId)
                                .replace(":examId", examId)
                                .replace(":submissionId", submissionId)}?showall=0`}`
                            );
                          else {
                            navigate(
                              `${routes.student.exam.review
                                .replace(":courseId", courseId)
                                .replace(":examId", examId)
                                .replace(":submissionId", submissionId)}`
                            );
                          }
                        } else {
                          // navigate to unknown page
                          // navigate();
                        }
                      }}
                    >
                      {isShowAllQuesionsInOnePage
                        ? t("exam_view_multiple_page")
                        : t("exam_view_one_page")}
                    </Button>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"} display={"flex"}>
                    <Button
                      fullWidth
                      onClick={() => {
                        if (courseId && examId)
                          navigate(
                            routes.student.exam.detail
                              .replace(":courseId", courseId)
                              .replace(":examId", examId)
                          );
                        else {
                          // navigate to unknown page
                          // navigate();
                        }
                      }}
                      translation-key='exam_finish_review'
                    >
                      {t("exam_finish_review")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Grid>
    </>
  );
}

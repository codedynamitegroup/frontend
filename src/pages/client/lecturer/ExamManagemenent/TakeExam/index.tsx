import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FlagIcon from "@mui/icons-material/Flag";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ModeIcon from "@mui/icons-material/Mode";
import {
  Autocomplete,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  Stack,
  TextField
} from "@mui/material";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import TextTitle from "components/text/TextTitle";
import useBoxDimensions from "hooks/useBoxDimensions";
import useWindowDimensions from "hooks/useWindowDimensions";
import * as React from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import EssayExamQuestion from "./components/ExamQuestion/EssayExamQuestion";
import MultipleChoiceExamQuestion from "./components/ExamQuestion/MultipleChoiceExamQuestion";
import ShortAnswerExamQuestion from "./components/ExamQuestion/ShortAnswerExamQuestion";
import TrueFalseExamQuestion from "./components/ExamQuestion/TrueFalseExamQuestion";
import classes from "./styles.module.scss";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/MenuOpen";
import IconButton from "@mui/joy/IconButton";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import Badge from "@mui/joy/Badge";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import { ExamService } from "services/courseService/ExamService";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";
import { parse as uuidParse } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "hooks";
import { cleanTakeExamState, setExam } from "reduxes/TakeExam";
import { QuestionService } from "services/coreService/QuestionService";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import Checkbox from "@mui/joy/Checkbox";
import Heading2 from "components/text/Heading2";
import moment from "moment";
import { SubmitExamRequest } from "models/courseService/entity/ExamEntity";
import { Helmet } from "react-helmet";
import { User } from "models/authService/entity/user";
import { selectCurrentUser } from "reduxes/Auth";

const drawerWidth = 370;

export default function TakeExam() {
  const examId = useParams<{ examId: string }>().examId;
  const storageExamID = useAppSelector((state) => state.takeExam.examId);
  const user: User = useSelector(selectCurrentUser);
  const courseId = useParams<{ courseId: string }>().courseId;

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const [currentQuestionList, setCurrentQuestionList] = React.useState<any>([]);

  let questionPageIndex = Number(searchParams.get("page"));
  if (isNaN(questionPageIndex) || questionPageIndex < 0) {
    questionPageIndex = 0;
  }

  const dispatch = useDispatch();
  const questionList = useAppSelector((state) => state.takeExam.questionList);
  const questionListRef = React.useRef(questionList);
  // Update the ref whenever questionList changes
  React.useEffect(() => {
    questionListRef.current = questionList;
  }, [questionList]);

  const examData = useAppSelector((state) => state.takeExam.examData);
  const startTime = useAppSelector((state) => state.takeExam.startAt);
  const [open, setOpen] = React.useState(true);
  const [isShowTimeLeft, setIsShowTimeLeft] = React.useState(true);
  const [drawerVariant, setDrawerVariant] = React.useState<
    "temporary" | "permanent" | "persistent"
  >(width < 1080 ? "temporary" : "permanent");
  const [selectedQtype, setSelectedQtype] = React.useState<string[]>([]);
  const [showFlaggedQuestion, setShowFlaggedQuestion] = React.useState(false);

  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [timeLimit, setTimeLimit] = React.useState(() => {
    if (!startTime) return 0;

    const startTimeMil = new Date(startTime).getTime();

    return startTimeMil + (examData?.timeLimit || 0) * 1000;
  });
  const getTimeUntil = (inputTime: any) => {
    if (!inputTime) {
      return;
    }
    const time = moment(inputTime).diff(moment().utc(), "milliseconds");

    if (time < 0) {
      const endTime = new Date(
        new Date().toLocaleString("en", { timeZone: "Asia/Bangkok" })
      ).toISOString();

      // if enable auto submit ==> submit exam
      if (examData.overdueHanding === "AUTOSUBMIT" && !submitted) {
        setSubmitted(true);
        const questions = questionListRef.current.map((question) => {
          return {
            questionId: question.questionData.id,
            content: question.content,
            numFile: question.files?.length || 0
          };
        });

        console.log("questions", questions);

        const startAtTime = new Date(
          new Date(startTime || "").toLocaleString("en", { timeZone: "Asia/Bangkok" })
        ).toISOString();
        const submitData: SubmitExamRequest = {
          examId: examId || storageExamID,
          userId: user.userId,
          questions: questions,
          startTime: startAtTime,
          submitTime: endTime
        };

        ExamService.submitExam(submitData)
          .then((response) => {
            dispatch(cleanTakeExamState());
            navigate(
              routes.lecturer.exam.review
                .replace(":courseId", courseId || examData.courseId)
                .replace(":examId", examId || examData.id)
                .replace(":submissionId", response.examSubmissionId)
            );
          })
          .catch((error) => {})
          .finally(() => {});
      } else {
        console.log("abandon exam");
        // else ==> abandon exam
        dispatch(cleanTakeExamState());
        navigate(
          routes.lecturer.exam.detail
            .replace(":courseId", courseId || examData.courseId)
            .replace(":examId", examId || examData.id)
        );
      }

      return;
    } else {
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => getTimeUntil(timeLimit), 500);

    return () => clearInterval(interval);
  }, [timeLimit]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Auto change drawer to temporary when screen width < 1080
  // and change to persistent when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("persistent");
    }
  }, [width]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  // get whole question list if storage is empty (first time load page)
  // start the timer
  React.useEffect(() => {
    // exam litmit
    // if(examData)
    if (questionList === undefined || questionList?.length <= 0 || examId !== storageExamID)
      ExamService.getExamQuestionById(examId ?? examData.id, null)
        .then((res) => {
          const questionFromAPI = res.questions.map((question: GetQuestionExam, index: number) => {
            return {
              flag: false,
              answered: false,
              content: "",
              questionData: question,
              files: []
            };
          });

          // const startTime = new Date(new Date().toLocaleString("en", { timeZone: "Asia/Bangkok" }));
          const startTime = new Date();
          console.log("startTIme", startTime);

          setTimeLimit(startTime.getTime() + (examData?.timeLimit || 0) * 1000);
          dispatch(
            setExam({
              examId: examId ?? examData.id,
              startAt: startTime.toISOString(),
              questionList: questionFromAPI
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  const handleSubmitExam = () => {
    navigate(
      `${routes.lecturer.exam.submitSummary
        .replace(":courseId", courseId ?? examData.courseId)
        .replace(":examId", examId ?? examData.id)}`,
      {
        replace: true
      }
    );
  };

  // get current page question list
  React.useEffect(() => {
    // get all question with the current page index
    const currentQuestionList = questionList
      .filter((question) => question.questionData.page === questionPageIndex)
      .map((question) => ({
        questionId: question.questionData.id,
        qtype: question.questionData.qtype
      }));

    const postQuestionDetailList: PostQuestionDetailList = {
      questionCommands: currentQuestionList
    };

    if (currentQuestionList.length === 0) return;

    QuestionService.getQuestionDetail(postQuestionDetailList)
      .then((res) => {
        console.log("get current list", res);
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
        setCurrentQuestionList(transformList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [questionPageIndex, storageExamID]);

  // back - forward button
  const handleQuestionNavigateButton = (questionId: string) => {
    const index = questionList.find((question) => question.questionData.id === questionId)
      ?.questionData.page;
    const slug = convertIdToSlug(questionId);

    if (index === questionPageIndex) {
      const element = document.getElementById(slug);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // navigate(
      //   `${routes.lecturer.exam.take
      //     .replace(":courseId", courseId ?? examData.courseId)
      //     .replace(":examId", examId ?? examData.id)}?page=${index}#${slug}`,
      //   {
      //     replace: true
      //   }
      // );
    }
  };

  const [isSelectedQtypeChanged, setIsSelectedQtypeChanged] = React.useState(false);
  // Handler for selecting question type autocomplte
  const selectQtypeHandler = (event: any, value: any) => {
    if (value.length === 0) {
      setSelectedQtype([]);
    } else {
      const selectedQtype = value.map((autocompleteQuestionType: any) => {
        if (autocompleteQuestionType.label === t("common_question_type_essay")) {
          return qtype.essay.code;
        } else if (autocompleteQuestionType.label === t("common_question_type_multi_choice")) {
          return qtype.multiple_choice.code;
        } else if (autocompleteQuestionType.label === t("common_question_type_yes_no")) {
          return qtype.true_false.code;
        } else if (autocompleteQuestionType.label === t("common_question_type_short")) {
          return qtype.short_answer.code;
        }
        return "";
      });
      setSelectedQtype(selectedQtype);
    }
    setIsSelectedQtypeChanged(true);
  };

  React.useEffect(() => {
    if (!isSelectedQtypeChanged) return;
    setIsSelectedQtypeChanged(false);

    console.log("selectedQtype", selectedQtype);
    const firstFilteredQuestion = questionList
      .filter((question) => selectedQtype.includes(question.questionData.qtype))
      .at(0);

    // navigate(
    //   `${routes.lecturer.exam.take
    //     .replace(":courseId", courseId ?? examData.courseId)
    //     .replace(
    //       ":examId",
    //       examId ?? examData.id
    //     )}?page=${firstFilteredQuestion?.questionData.page || 0}`,
    //   {
    //     replace: true
    //   }
    // );
  }, [selectedQtype]);

  // Scroll to question
  React.useEffect(() => {
    const checkExist = setInterval(function () {
      const id = location.hash.substring(1); // get the id from the hash
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        clearInterval(checkExist);
      }
    }, 100); // check every 100ms
  }, [location]);

  return (
    <>
      <Helmet>
        <title>
          {t("exam_take_exam_title")}
          {" | "}
          {examData.name}
        </title>
      </Helmet>
      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <Box className={classes.container} style={{ marginTop: `${headerHeight}px` }}>
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
            <Heading1 fontWeight={"500"}>{examData.name}</Heading1>
            <Heading2>
              <div dangerouslySetInnerHTML={{ __html: examData.intro }}></div>
            </Heading2>
            <Button
              onClick={() => {
                navigate(
                  routes.lecturer.exam.detail
                    .replace(":courseId", courseId || examData.courseId)
                    .replace(":examId", examId || examData.id)
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
            <Box
              sx={{
                position: "sticky",
                top: "74px",
                zIndex: "1020"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <Box
                  sx={{
                    padding: "8px 9px 8px 10px",
                    borderRadius: "40px",
                    display: "flex",
                    alignItems: "center",
                    color: "#005742",
                    backgroundColor: "#EAF4DD",
                    fontWeight: "500",
                    position: "sticky",
                    top: "0"
                  }}
                >
                  <AccessTimeOutlinedIcon
                    fontSize='medium'
                    sx={{ marginRight: "0.5rem !important" }}
                  />
                  {isShowTimeLeft
                    ? `Còn lại: ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
                        seconds < 10 ? `0${seconds}` : seconds
                      }`
                    : `Thời gian còn lại`}

                  <Button
                    onClick={() => {
                      setIsShowTimeLeft(!isShowTimeLeft);
                    }}
                    variant='soft'
                    color='neutral'
                    sx={{
                      borderRadius: "40px",
                      marginLeft: "16px",
                      border: "1px solid #bce3da"
                    }}
                  >
                    {isShowTimeLeft ? "Ẩn" : "Hiện"}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderRadius: "5px",
                border: "1px solid #E1E1E1",
                padding: "20px"
              }}
            >
              <Grid container spacing={7}>
                {currentQuestionList
                  .filter(
                    (question: any) =>
                      selectedQtype.length === 0 ||
                      selectedQtype.includes(question.data.question.qtype)
                  )
                  .map((question: any, index: number) => (
                    <React.Fragment key={question.data.question.id}>
                      <Grid item xs={12} id={convertIdToSlug(question.data.question.id)}>
                        {question.data.question.qtype === qtype.essay.code ? (
                          <EssayExamQuestion
                            page={questionList.findIndex(
                              (tempQuestion: any) =>
                                tempQuestion.questionData.id === question.data.question.id
                            )}
                            questionState={questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
                            )}
                            questionEssayQuestion={question.data}
                          />
                        ) : question.data.question.qtype === qtype.short_answer.code ? (
                          <ShortAnswerExamQuestion
                            page={questionList.findIndex(
                              (tempQuestion: any) =>
                                tempQuestion.questionData.id === question.data.question.id
                            )}
                            questionShortAnswer={question.data}
                            questionState={questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
                            )}
                          />
                        ) : question.data.question.qtype === qtype.multiple_choice.code ? (
                          <MultipleChoiceExamQuestion
                            page={questionList.findIndex(
                              (tempQuestion: any) =>
                                tempQuestion.questionData.id === question.data.question.id
                            )}
                            questionMultiChoice={question.data}
                            questionState={questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
                            )}
                          />
                        ) : question.data.question.qtype === qtype.true_false.code ? (
                          <TrueFalseExamQuestion
                            page={questionList.findIndex(
                              (tempQuestion: any) =>
                                tempQuestion.questionData.id === question.data.question.id
                            )}
                            questionTrueFalseQuestion={question.data}
                            questionState={questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
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

                <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
                  {questionPageIndex !== 0 ? (
                    <Link
                      to={{
                        pathname: routes.student.exam.take
                          .replace(":courseId", courseId ?? examData.courseId)
                          .replace(":examId", examId ?? examData.id),
                        search: `?page=${questionPageIndex - 1}`
                      }}
                    >
                      <Button variant='soft' color='neutral'>
                        Trang trước
                      </Button>
                    </Link>
                  ) : (
                    <Box></Box>
                  )}
                  {questionPageIndex ===
                  (questionList.length > 0
                    ? questionList[questionList.length - 1].questionData.page
                    : -1) ? (
                    <Button onClick={handleSubmitExam} variant='solid' color='primary'>
                      Kết thúc bài làm...
                    </Button>
                  ) : (
                    <Link
                      to={{
                        pathname: routes.student.exam.take
                          .replace(":courseId", courseId ?? examData.courseId)
                          .replace(":examId", examId ?? examData.id),
                        search: `?page=${questionPageIndex + 1}`
                      }}
                    >
                      <Button onClick={() => {}} variant='solid' color='primary'>
                        Trang sau
                      </Button>
                    </Link>
                  )}
                </Grid>
              </Grid>
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
            // ModalProps={{
            //   BackdropComponent: () => null // Disable the backdrop
            // }}
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
                    <Autocomplete
                      fullWidth
                      size='small'
                      options={questionList.filter(
                        (value) =>
                          selectedQtype.length === 0 ||
                          selectedQtype.includes(value.questionData.qtype)
                      )}
                      getOptionLabel={(params) =>
                        params.questionData.name ? `${params.questionData.name}` : ""
                      }
                      sx={{
                        marginBottom: "16px",
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Nhập câu hỏi'
                          size='small'
                          sx={{ borderRadius: "12px" }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.questionData.name === value.questionData.name
                      }
                    />
                    <TitleWithInfoTip
                      title={t("take_exam_question_sort_question")}
                      fontSize='13px'
                      fontWeight='500'
                    />
                    <Autocomplete
                      disablePortal
                      fullWidth
                      multiple
                      size='small'
                      limitTags={2}
                      options={[
                        { label: t("common_question_type_essay") },
                        { label: t("common_question_type_multi_choice") },
                        { label: t("common_question_type_yes_no") },
                        { label: t("common_question_type_short") }
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // placeholder={"Lọc câu hỏi"}
                          sx={{ borderRadius: "12px" }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      sx={{
                        marginBottom: "16px",
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" }
                      }}
                      onChange={selectQtypeHandler}
                      isOptionEqualToValue={(option, value) => option.label === value.label}
                    />

                    <Stack direction='row' spacing={1} marginBottom={"16px"}>
                      <TitleWithInfoTip
                        title={t("common_flagged_question")}
                        fontSize='13px'
                        fontWeight='500'
                      />
                      <Checkbox
                        onChange={(event) => {
                          setShowFlaggedQuestion(event.target.checked);
                        }}
                      />
                    </Stack>

                    <Grid container spacing={1} marginBottom={"10px"} sx={{ maxHeight: "30dvh" }}>
                      {questionList
                        .filter(
                          (question) =>
                            (selectedQtype.length === 0 ||
                              selectedQtype.includes(question.questionData.qtype)) &&
                            (showFlaggedQuestion ? question.flag : true)
                        )
                        .map((question, index) => (
                          <Grid item key={index} marginTop={"16px"} marginRight={"8px"}>
                            <Badge
                              color='neutral'
                              variant='outlined'
                              badgeContent={
                                question.questionData.qtype === qtype.essay.code ? (
                                  <ModeIcon sx={{ width: "15px", height: "15px" }} />
                                ) : question.questionData.qtype === qtype.short_answer.code ? (
                                  <ShortTextRoundedIcon sx={{ width: "15px", height: "15px" }} />
                                ) : question.questionData.qtype === qtype.true_false.code ? (
                                  <RuleRoundedIcon sx={{ width: "15px", height: "15px" }} />
                                ) : (
                                  <FormatListBulletedIcon sx={{ width: "15px", height: "15px" }} />
                                )
                              }
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                              }}
                            >
                              <Badge
                                color='neutral'
                                variant='outlined'
                                badgeContent={
                                  <FlagIcon
                                    sx={{
                                      width: "10px",
                                      height: "15px",
                                      color: "red"
                                    }}
                                  />
                                }
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right"
                                }}
                                invisible={!question.flag}
                              >
                                <Button
                                  variant={"outlined"}
                                  sx={{
                                    border: currentQuestionList.some(
                                      (questionInList: any) =>
                                        questionInList.data.question.id === question.questionData.id
                                    )
                                      ? "2px solid #002db3"
                                      : "2px solid #e1e1e1",
                                    borderRadius: "1000px",
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: question.answered ? "#e1e1e1" : ""
                                  }}
                                  color={
                                    currentQuestionList.some(
                                      (questionInList: any) =>
                                        questionInList.data.question.id === question.questionData.id
                                    )
                                      ? "primary"
                                      : "neutral"
                                  }
                                  onClick={() =>
                                    handleQuestionNavigateButton(question.questionData.id)
                                  }
                                >
                                  {questionList.findIndex(
                                    (tempQuestion: any) =>
                                      tempQuestion.questionData.id === question.questionData.id
                                  ) + 1}
                                </Button>
                              </Badge>
                            </Badge>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      {/* <Grid item justifyContent={"center"}>
                        <Pagination count={99} />
                      </Grid> */}
                      <Grid item justifyContent={"center"} xs={12}>
                        <Button onClick={handleSubmitExam} variant='soft' color='primary' fullWidth>
                          Kết thúc bài làm...
                        </Button>
                      </Grid>
                    </Grid>
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

function convertIdToSlug(str: string) {
  const bytes = Array.from(uuidParse(str));
  const base64 = btoa(String.fromCharCode.apply(null, bytes));
  const slug = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return slug;
}

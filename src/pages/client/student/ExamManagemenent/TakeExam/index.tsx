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
import { useTheme } from "@mui/material/styles";
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
import { useDispatch } from "react-redux";
import { useAppSelector } from "hooks";
import { cleanTakeExamState, setExam } from "reduxes/TakeExam";
import { QuestionService } from "services/coreService/QuestionService";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import Checkbox from "@mui/joy/Checkbox";
import Heading2 from "components/text/Heading2";
import { Helmet } from "react-helmet";
import { ExamSubmissionService } from "services/courseService/ExamSubmissionService";
import useAuth from "hooks/useAuth";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";
import {
  GetQuestionSubmissionEntity,
  SubmitQuestionList
} from "models/courseService/entity/QuestionSubmissionEntity";
import moment from "moment";
import { EndExamCommand, GetExamDetails } from "models/courseService/entity/ExamEntity";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { RootState } from "store";
import { useSelector } from "react-redux";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CodeExamQuestion from "./components/ExamQuestion/CodeQuestion";
import { CodeQuestionService } from "services/codeAssessmentService/CodeQuestionService";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { code } from "@uiw/react-md-editor";

const drawerWidth = 370;

export interface QuestionSubmissionMap {
  [key: string]: GetQuestionSubmissionEntity;
}
export interface CodeQuestionMap {
  [key: string]: CodeQuestionEntity;
}

export default function TakeExam() {
  const examId = useParams<{ examId: string }>().examId;
  const storageExamID = useAppSelector((state) => state.takeExam.examId);
  const auth = useAuth();

  const courseId = useParams<{ courseId: string }>().courseId;

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const [currentQuestionList, setCurrentQuestionList] = React.useState<any>([]);
  const [examDetails, setExamDetails] = React.useState<GetExamDetails>({
    examId: "",
    courseId: "",
    name: "",
    timeOpen: "",
    timeClose: "",
    timeLimit: 0,
    intro: "",
    overdueHanding: "",
    canRedoQuestions: false,
    shuffleAnswers: false
  });
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
  const [endTime, setEndTime] = React.useState<any | undefined>(undefined);
  const [examSubmissionId, setExamSubmissionId] = React.useState<string>("");
  const [canStartExam, setCanStartExam] = React.useState(false);
  const [isFinishedFetching, setIsFinishedFetching] = React.useState(false);
  const [currentCodeQuestionMap, setCurrentCodeQuestionMap] = React.useState<any>({});

  const handleEndExam = React.useCallback(
    async (submitTime: string) => {
      const endExamCommand: EndExamCommand = {
        examId: examId ?? examDetails.examId,
        userId: auth.loggedUser.userId,
        examSubmissionTime: submitTime
      };

      try {
        await ExamSubmissionService.endExam(endExamCommand);
        dispatch(setSuccessMess(t("exam_submit_success")));

        dispatch(cleanTakeExamState());
        navigate(
          routes.student.exam.detail
            .replace(":courseId", courseId || examDetails.courseId)
            .replace(":examId", examId || examDetails.examId),
          { replace: true }
        );
      } catch (error) {
        dispatch(setErrorMess(t("exam_submit_failed")));
      }
    },
    [
      examId,
      examDetails.examId,
      auth.loggedUser.userId,
      t,
      dispatch,
      navigate,
      courseId,
      examDetails.courseId
    ]
  );

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

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const handleStartExam = async () => {
    try {
      const response = await ExamSubmissionService.startExam({
        examId: examId ?? examDetails.examId,
        userId: auth.loggedUser.userId,
        examStartTime: new Date().toISOString()
      });
      setEndTime(new Date(response.endTime).getTime());
      // setExamSubmissionId(response.examSubmissionId);
    } catch (error: any) {
      console.log("error", error);
      if (error.code === 409) {
        // limit exceed
        dispatch(setErrorMess(t("exam_limit_exceed")));

        navigate(
          routes.student.exam.detail
            .replace(":courseId", courseId || examDetails.courseId)
            .replace(":examId", examId || examDetails.examId),
          { replace: true }
        );
      }
    }
  };

  const handleGetExamSubmissionDetail = async () => {
    try {
      const response = await ExamSubmissionService.getLatestOnGoingExamSubmission(
        examId ?? examDetails.examId,
        auth.loggedUser.userId
      );

      setEndTime(new Date(response.endTime).getTime());
      setExamSubmissionId(response.examSubmissionId);
      setExamDetails(response.examSubmissionExamResponse);
    } catch (error: any) {
      console.log("start error", error);
      if (error.code === 404) setCanStartExam(true);
    }
  };

  const handleGetCodeQuestionDetail = async (currentQuestionList: any) => {
    try {
      const codeQuestionIdList = currentQuestionList
        .filter((question: any) => question.data.question.qtype === qtype.source_code.code)
        .map((question: any) => question.data.id);

      if (codeQuestionIdList.length === 0) return;

      const response = await CodeQuestionService.getDetailCodeQuestion(codeQuestionIdList);
      setCurrentCodeQuestionMap(
        response.reduce((acc: CodeQuestionMap, codeQuestion: CodeQuestionEntity) => {
          acc[codeQuestion.id] = codeQuestion;
          return acc;
        }, {})
      );
    } catch (error: any) {}
  };

  const handleSaveQuestionState = React.useCallback(() => {
    const submitQuestionListData: SubmitQuestionList = {
      examId: examId ?? examDetails.examId,
      userId: auth.loggedUser.userId,
      questionSubmissionCommands: questionList.map((question) => {
        return {
          questionId: question.questionData.id,
          content: question.content,
          files: question.files || [],
          answerStatus: question.answered,
          flag: question.flag
        };
      })
    };

    try {
      const response = QuestionSubmissionService.submitQuestionList(submitQuestionListData);
      return response;
    } catch (error: any) {}
  }, [examId, examDetails.examId, auth.loggedUser.userId, questionList]);

  const handleGetQuestionSubmissionData = async (questionSubmissionIds: string[]) => {
    try {
      const response = await QuestionSubmissionService.getQuestionSubmission({
        examId: examId ?? examDetails.examId,
        userId: auth.loggedUser.userId,
        questionSubmissionIds: questionSubmissionIds
      });
      return response.questionSubmissions;
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const finalSubmitHandler = React.useCallback(async () => {
    const submitTime = new Date(
      new Date().toLocaleString("en", { timeZone: "Asia/Bangkok" })
    ).toISOString();
    console.log("saving hihi: ", questionList);

    console.log("auto submitting");
    await handleSaveQuestionState();
    handleEndExam(submitTime);
  }, [handleEndExam, handleSaveQuestionState, questionList]);

  const getTimeUntil = React.useCallback(
    (inputTime: any) => {
      console.log("inputTime", inputTime);
      if (!inputTime) {
        return;
      }
      const time = moment(inputTime).diff(moment().utc(), "milliseconds");

      if (time < 0 && endTime !== undefined) {
        // if enable auto submit ==> submit exam
        if (examDetails.overdueHanding === "AUTOSUBMIT" && !submitted) {
          setSubmitted(true);
          finalSubmitHandler();
        } else {
          // else ==> abandon exam
          // console.log("abandon exam");
          dispatch(cleanTakeExamState());
          navigate(
            routes.student.exam.detail
              .replace(":courseId", courseId || examDetails.courseId)
              .replace(":examId", examId || examDetails.examId)
          );
        }

        return;
      } else {
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
      }
    },
    [
      courseId,
      dispatch,
      endTime,
      examDetails.courseId,
      examDetails.examId,
      examDetails.overdueHanding,
      examId,
      finalSubmitHandler,
      navigate,
      submitted
    ]
  );

  React.useEffect(() => {
    const interval = setInterval(() => getTimeUntil(endTime), 500);

    return () => clearInterval(interval);
  }, [endTime, getTimeUntil]);

  const handleGetExamQuestion = async () => {
    try {
      const res = await ExamService.getExamQuestionById(examId ?? examDetails.examId, null);

      // Handle question data
      const questionSubmissions = await handleGetQuestionSubmissionData(
        res.questions.map((question: GetQuestionExam) => question.id)
      );
      let questionFromAPI: any[] = [];

      if (questionSubmissions) {
        const questionSubmissionHashmap = questionSubmissions.reduce(
          (acc: QuestionSubmissionMap, question: GetQuestionSubmissionEntity) => {
            acc[question.questionId] = question;
            return acc;
          },
          {}
        );

        questionFromAPI = res.questions.map((question: GetQuestionExam) => {
          return {
            flag: questionSubmissionHashmap[question.id]?.flag || false,
            answered: questionSubmissionHashmap[question.id]?.answerStatus || false,
            content: questionSubmissionHashmap[question.id]?.content || "",
            questionData: question,
            files: questionSubmissionHashmap[question.id]?.files || []
          };
        });
      } else {
        questionFromAPI = res.questions.map((question: GetQuestionExam) => {
          return {
            flag: false,
            answered: false,
            content: "",
            questionData: question,
            files: []
          };
        });
      }

      dispatch(
        setExam({
          examId: examId ?? examDetails.examId,
          questionList: questionFromAPI
        })
      );
    } catch (error: any) {
      console.log("error", error);
    }
  };

  // get whole question list if storage is empty (first time load page)
  // start the timer
  React.useEffect(() => {
    const fetchData = async () => {
      if (endTime === undefined) {
        await handleGetExamSubmissionDetail();
      }
      if (questionList === undefined || questionList?.length <= 0 || examId !== storageExamID) {
        await handleGetExamQuestion();
      }

      setIsFinishedFetching(true);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (isFinishedFetching && canStartExam) {
      handleStartExam();
    }
  }, [canStartExam, isFinishedFetching]);

  const handleSubmitExam = () => {
    navigate(
      `${routes.student.exam.submitSummary
        .replace(":courseId", courseId ?? examDetails.courseId)
        .replace(":examId", examId ?? examDetails.examId)}`,
      {
        replace: true
      }
    );
  };

  const handleGetQuestionDetail = async () => {
    const currentQuestionList = questionList
      .filter((question: any) => question.questionData.page === questionPageIndex)
      .map((question: any) => ({
        questionId: question.questionData.id,
        qtype: question.questionData.qtype
      }));

    const postQuestionDetailList: PostQuestionDetailList = {
      questionCommands: currentQuestionList
    };

    if (currentQuestionList.length === 0) return;

    const res = await QuestionService.getQuestionDetail(postQuestionDetailList);
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
    handleGetCodeQuestionDetail(transformList);
  };

  // get current page question list
  React.useEffect(() => {
    if (questionList !== undefined) {
      // get all question with the current page index
      handleGetQuestionDetail();
    }
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
      navigate(
        `${routes.student.exam.take
          .replace(":courseId", courseId ?? examDetails.courseId)
          .replace(":examId", examId ?? examDetails.examId)}?page=${index}#${slug}`,
        {
          replace: true
        }
      );
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

  // Filter by Question type
  React.useEffect(() => {
    if (!isSelectedQtypeChanged) return;
    setIsSelectedQtypeChanged(false);

    const firstFilteredQuestion = questionList
      .filter((question) => selectedQtype.includes(question.questionData.qtype))
      .at(0);

    navigate(
      `${routes.student.exam.take
        .replace(":courseId", courseId ?? examDetails.courseId)
        .replace(
          ":examId",
          examId ?? examDetails.examId
        )}?page=${firstFilteredQuestion?.questionData.page || 0}`,
      {
        replace: true
      }
    );
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

    return () => clearInterval(checkExist);
  }, [location]);

  // Save current exam state every 60 seconds
  React.useEffect(() => {
    const saveQuestionInterval = setInterval(() => {
      handleSaveQuestionState();
    }, 60000); // 1000 milliseconds = 1 seconds

    return () => clearInterval(saveQuestionInterval);
  }, [handleSaveQuestionState, questionList]);

  // Save exam every unload
  React.useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      try {
        await handleSaveQuestionState();
      } catch (error) {
        console.error("Error during beforeunload API call", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleSaveQuestionState]);

  return (
    <>
      <Helmet>
        <title>
          {t("exam_take_exam_title")}
          {" | "}
          {examDetails.name}
        </title>
      </Helmet>

      <Grid className={classes.root}>
        <Header />
        <Box className={classes.container} style={{ marginTop: `${sidebarStatus.headerHeight}px` }}>
          <CssBaseline />

          {/* <DrawerHeader /> */}
          <Button
            // aria-label='open drawer'
            onClick={handleDrawerOpen}
            sx={{
              ...(open && { display: "none" }),
              position: "fixed",
              top: `${sidebarStatus.headerHeight + 10}px`,
              right: 0,
              height: "44px",
              width: "49px"
            }}
            size='sm'
            endDecorator={<MenuIcon color='action' />}
            variant='soft'
          />

          <Box className={classes.formBody} width={"100%"}>
            <Heading1 fontWeight={"500"}>{examDetails.name}</Heading1>
            <Heading2>
              <div dangerouslySetInnerHTML={{ __html: examDetails.intro }}></div>
            </Heading2>
            <Button
              onClick={() => {
                navigate(
                  routes.student.exam.detail
                    .replace(":courseId", courseId || examDetails.courseId)
                    .replace(":examId", examId || examDetails.examId)
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
                        ) : (
                          <CodeExamQuestion
                            page={questionList.findIndex(
                              (tempQuestion: any) =>
                                tempQuestion.questionData.id === question.data.question.id
                            )}
                            questionCode={currentCodeQuestionMap[question.data.id]}
                            questionState={questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
                            )}
                            questionId={question.data.question.id}
                          />
                        )}
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
                          .replace(":courseId", courseId ?? examDetails.courseId)
                          .replace(":examId", examId ?? examDetails.examId),
                        search: `?page=${questionPageIndex - 1}`
                      }}
                      onClick={() => {
                        handleSaveQuestionState();
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
                          .replace(":courseId", courseId ?? examDetails.courseId)
                          .replace(":examId", examId ?? examDetails.examId),
                        search: `?page=${questionPageIndex + 1}`
                      }}
                      onClick={() => {
                        handleSaveQuestionState();
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
                top: `${sidebarStatus.headerHeight + 10}px `
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
                                ) : question.questionData.qtype === "CODE" ? (
                                  <CodeRoundedIcon sx={{ width: "15px", height: "15px" }} />
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

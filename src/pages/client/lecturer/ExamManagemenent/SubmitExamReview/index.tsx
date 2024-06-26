import Header from "components/Header";
import classes from "./styles.module.scss";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/joy/Button";
import React, { useCallback, useState } from "react";
import useBoxDimensions from "hooks/useBoxDimensions";
import MenuIcon from "@mui/icons-material/MenuOpen";
import useWindowDimensions from "hooks/useWindowDimensions";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import IconButton from "@mui/joy/IconButton";
import TextTitle from "components/text/TextTitle";
import { useAppSelector } from "hooks";
import Badge from "@mui/joy/Badge";
import ModeIcon from "@mui/icons-material/Mode";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FlagIcon from "@mui/icons-material/Flag";
import Table from "@mui/joy/Table";
import ParagraphBody from "components/text/ParagraphBody";
import { Chip } from "@mui/joy";
import convertUuidToHashSlug from "utils/convertUuidToHashSlug";
import moment from "moment";
import { EndExamCommand, GetExamDetails } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { useDispatch } from "react-redux";
import { cleanTakeExamState, setExam } from "reduxes/TakeExam";
import { Helmet } from "react-helmet";
import { ExamSubmissionService } from "services/courseService/ExamSubmissionService";
import useAuth from "hooks/useAuth";
import {
  GetQuestionSubmissionEntity,
  SubmitQuestionList
} from "models/courseService/entity/QuestionSubmissionEntity";
import { QuestionSubmissionService } from "services/courseService/QuestionSubmissionService";
import CustomDialog from "components/common/dialogs/CustomDialog";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useSelector } from "react-redux";
import { RootState } from "store";

const drawerWidth = 370;

export interface QuestionSubmissionMap {
  [key: string]: GetQuestionSubmissionEntity;
}

const SubmitExamSummary = () => {
  const dispatch = useDispatch();
  const examId = useParams<{ examId: string }>().examId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const [timeClose, setTimeClose] = useState<Date>(new Date());
  const auth = useAuth();

  const [endTime, setEndTime] = React.useState<any | undefined>(undefined);
  const [examSubmissionId, setExamSubmissionId] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [submitTime, setSubmitTime] = React.useState<string>("");
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

  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { width } = useWindowDimensions();
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

  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const questionList = useAppSelector((state) => state.takeExam.questionList);
  const handleQuestionNavigateButton = (question: any) => {
    const slug = convertUuidToHashSlug(question.questionData.id);

    if (courseId && examId)
      navigate(
        `${routes.lecturer.exam.take
          .replace(":courseId", courseId)
          .replace(":examId", examId)}?page=${question.questionData.page}#${slug}`
      );
  };
  const [isShowTimeLeft, setIsShowTimeLeft] = React.useState(true);

  const tableHead = [
    { value: t("common_question"), width: "40%" },
    { value: t("common_status"), width: "" }
  ];
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
  const handleGetExamSubmissionDetail = async () => {
    try {
      const response = await ExamSubmissionService.getLatestOnGoingExamSubmission(
        examId ?? examDetails.examId,
        auth.loggedUser.userId
      );

      setEndTime(new Date(response.endTime).getTime());
      setExamSubmissionId(response.examSubmissionId);
      setExamDetails(response.examSubmissionExamResponse);
      setTimeClose(new Date(response.examSubmissionExamResponse.timeClose));
    } catch (error: any) {
      console.log("error", error);
    }
  };
  const handleEndExam = useCallback(
    async (submitTime: string) => {
      const endExamCommand: EndExamCommand = {
        examId: examId ?? examDetails.examId,
        userId: auth.loggedUser.userId,
        examSubmissionTime: submitTime
      };

      ExamSubmissionService.endExam(endExamCommand)
        .then((response) => {
          dispatch(setSuccessMess(t("exam_submit_success")));

          dispatch(cleanTakeExamState());
          navigate(
            routes.lecturer.exam.detail
              .replace(":courseId", courseId || examDetails.courseId)
              .replace(":examId", examId || examDetails.examId),
            { replace: true }
          );
        })
        .catch((error) => {
          dispatch(setErrorMess(t("exam_submit_failed")));
        });
    },
    [
      auth.loggedUser.userId,
      courseId,
      dispatch,
      examDetails.courseId,
      examDetails.examId,
      examId,
      navigate,
      t
    ]
  );
  const handleFinalSave = React.useCallback(
    async (submitTime: string) => {
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
        await QuestionSubmissionService.submitQuestionList(submitQuestionListData);
        handleEndExam(submitTime);
      } catch (error: any) {}
    },
    [examId, examDetails.examId, auth.loggedUser.userId, questionList, handleEndExam]
  );
  React.useEffect(() => {
    if (examSubmissionId === "" || examSubmissionId === undefined || endTime === undefined) {
      handleGetExamSubmissionDetail();
    }
    if (questionList === undefined || questionList?.length <= 0) {
      ExamService.getExamQuestionById(examId ?? examDetails.examId, null)
        .then(async (res) => {
          // Get question submission data detail (submitted answer detail flag, answer status,...)
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
                files: []
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const submitExamHandler = useCallback(async () => {
    handleFinalSave(submitTime);
  }, [handleFinalSave, submitTime]);

  const getTimeUntil = useCallback(
    (inputTime: any) => {
      if (!inputTime) {
        return;
      }
      const time = moment(inputTime).diff(moment().utc(), "milliseconds");

      if (time < 0 && endTime !== undefined) {
        if (examDetails.overdueHanding === "AUTOSUBMIT") {
          console.log("submit exam time", new Date(endTime).toISOString());
          setSubmitTime(new Date(endTime).toISOString());
          submitExamHandler();
        } else {
          navigate(
            routes.lecturer.exam.detail
              .replace(":courseId", courseId || examDetails.courseId)
              .replace(":examId", examId || examDetails.examId),
            { replace: true }
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
      endTime,
      examDetails.courseId,
      examDetails.examId,
      examDetails.overdueHanding,
      examId,
      navigate,
      submitExamHandler
    ]
  );

  React.useEffect(() => {
    const interval = setInterval(() => getTimeUntil(endTime), 1000);

    return () => clearInterval(interval);
  }, [endTime, getTimeUntil]);
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

  const submitButtonClickHandler = () => {
    const tempSubmitTime = new Date(
      new Date().toLocaleString("en", { timeZone: "Asia/Bangkok" })
    ).toISOString();

    setSubmitTime(tempSubmitTime);
    setOpenDialog(true);
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
          {t("exam_summary")}
          {" | "}
          {examDetails.name}
        </title>
      </Helmet>
      {openDialog && (
        <CustomDialog
          title={t("exam_submit_and_finish")}
          children={"Submit at " + submitTime}
          open={openDialog}
          onHandleCancel={() => setOpenDialog(false)}
          onHanldeConfirm={submitExamHandler}
          handleClose={() => setOpenDialog(false)}
        />
      )}
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
                if (courseId && examId)
                  navigate(
                    routes.lecturer.exam.take
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
              <TextTitle>{t("exam_summary")}</TextTitle>
              <Table
                size='lg'
                hoverRow
                sx={{
                  "& tbody tr:hover": {
                    backgroundColor: "#f3f3f3", // Change this to your desired color
                    cursor: "pointer"
                  }
                }}
              >
                <thead>
                  <tr>
                    {tableHead.map((head, index) => (
                      <th
                        key={index}
                        style={{
                          width: head.width,
                          backgroundColor: "white",
                          borderBottom: "2px solid rgb(128,128,128)"
                        }}
                      >
                        <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
                          {head.value}
                        </ParagraphBody>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questionList.map((question, index) => (
                    <tr key={index} onClick={() => handleQuestionNavigateButton(question)}>
                      <td>
                        <Box
                          sx={{
                            backgroundColor: "#EAF4DD",
                            borderRadius: "16px",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid #e8e0e0"
                          }}
                        >
                          <ParagraphBody fontSize={"12px"} color={"#212121"} fontWeight={"400"}>
                            {index + 1}
                          </ParagraphBody>
                        </Box>
                      </td>
                      <td>
                        <Chip
                          sx={{
                            backgroundColor: question.answered ? "#FDF6EA" : "#e6eaf7",
                            borderRadius: "4px",
                            border: "1px solid #e8e0e0"
                          }}
                        >
                          <ParagraphBody fontSize={"14px"} color={"#212121"} fontWeight={"400"}>
                            {question.answered ? t("common_answered") : t("common_not_answered")}
                          </ParagraphBody>
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>

            <ParagraphBody
              marginTop={"20px"}
              fontSize={"14px"}
              color={"#212121"}
              fontWeight={"400"}
            >
              {t("submit_before", {
                weekDay: weekdayNames[timeClose.getDay()],
                day: timeClose.getDate(),
                month: monthNames[timeClose.getMonth()], // getMonth returns 0-11, so add 1 to get 1-12
                year: timeClose.getFullYear(),
                time: `${timeClose.getHours() < 10 ? `0${timeClose.getHours()}` : timeClose.getHours()}:${timeClose.getMinutes() < 10 ? `0${timeClose.getMinutes()}` : timeClose.getMinutes()}`
              })}
            </ParagraphBody>
            <Button sx={{ width: "fit-content" }} onClick={submitButtonClickHandler}>
              {t("exam_submit_and_finish")}
            </Button>
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

                    <Grid container spacing={1} marginBottom={"10px"} sx={{ maxHeight: "30dvh" }}>
                      {questionList.map((question, index) => (
                        <Grid item key={index} marginTop={"16px"} marginRight={"8px"}>
                          <Badge
                            color='neutral'
                            variant='outlined'
                            badgeContent={
                              question.questionData.qtype === "ESSAY" ? (
                                <ModeIcon sx={{ width: "15px", height: "15px" }} />
                              ) : question.questionData.qtype === "SHORT_ANSWER" ? (
                                <ShortTextRoundedIcon sx={{ width: "15px", height: "15px" }} />
                              ) : question.questionData.qtype === "TRUE_FALSE" ? (
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
                                  borderRadius: "1000px",
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: question.answered ? "#e1e1e1" : ""
                                }}
                                onClick={() => handleQuestionNavigateButton(question)}
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
                </Grid>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Grid>
    </>
  );
};

export default SubmitExamSummary;

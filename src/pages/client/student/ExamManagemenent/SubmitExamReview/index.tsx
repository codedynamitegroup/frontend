import Header from "components/Header";
import classes from "./styles.module.scss";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/joy/Button";
import React from "react";
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
import { SubmitExamRequest } from "models/courseService/entity/ExamEntity";
import { ExamService } from "services/courseService/ExamService";
import { setLoading } from "reduxes/Loading";
import { useDispatch } from "react-redux";
import { cleanTakeExamState } from "reduxes/TakeExam";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { Helmet } from "react-helmet";

const drawerWidth = 370;

const SubmitExamSummary = () => {
  const dispatch = useDispatch();
  const examId = useParams<{ examId: string }>().examId;
  const storageExamID = useAppSelector((state) => state.takeExam.examId);
  // const startTime = useAppSelector((state) => state.takeExam.startAt);
  const examData = useAppSelector((state) => state.takeExam.examData);
  const timeClose = new Date(examData.timeClose);

  // snack bar config
  const [openSnackAlert, setOpenSnackAlert] = React.useState(false);
  const [snackBarAlertMessage, setSnackBarAlertMessage] = React.useState("");
  const [snackBarType, setSnackBarType] = React.useState(AlertType.Success);

  const courseId = useParams<{ courseId: string }>().courseId;
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const [timeLimit, setTimeLimit] = React.useState(() => {
  //   if (!startTime) return 0;

  //   const startTimeMil = new Date(startTime).getTime();

  //   return startTimeMil + (examData?.timeLimit || 0) * 1000;
  // });
  const [timeLeft, setTimeLeft] = React.useState(0);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

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

  // const getTimeUntil = (inputTime: any) => {
  //   if (!inputTime) {
  //     return;
  //   }
  //   const time = moment(inputTime).diff(moment().utc(), "milliseconds");
  //   setTimeLeft(time);

  //   if (time < 0) {
  //     if (examData.id !== "" && examData.overdueHanding === "AUTOSUBMIT") submitExamHandler();
  //     else {
  //       navigate(
  //         routes.student.exam.detail
  //           .replace(":courseId", courseId || examData.courseId)
  //           .replace(":examId", examId || examData.id),
  //         { replace: true }
  //       );
  //     }

  //     return;
  //   } else {
  //     setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
  //     setMinutes(Math.floor((time / 1000 / 60) % 60));
  //     setSeconds(Math.floor((time / 1000) % 60));
  //   }
  // };

  // React.useEffect(() => {
  //   const interval = setInterval(() => getTimeUntil(timeLimit), 1000);

  //   return () => clearInterval(interval);
  // }, [timeLimit]);

  React.useEffect(() => {
    if (examData.id === "") {
      navigate(
        routes.student.exam.detail
          .replace(":courseId", courseId || examData.courseId)
          .replace(":examId", examId || examData.id),
        {
          replace: true
        }
      );
    }
  }, []);

  const questionList = useAppSelector((state) => state.takeExam.questionList);
  const handleQuestionNavigateButton = (question: any) => {
    const slug = convertUuidToHashSlug(question.questionData.id);

    if (courseId && examId)
      navigate(
        `${routes.student.exam.take
          .replace(":courseId", courseId)
          .replace(":examId", examId)}?page=${question.questionData.page}#${slug}`
      );
  };
  const [isShowTimeLeft, setIsShowTimeLeft] = React.useState(true);

  const tableHead = [
    { value: t("common_question"), width: "40%" },
    { value: t("common_status"), width: "" }
  ];

  const submitExamHandler = async () => {
    const endTime = new Date(
      new Date().toLocaleString("en", { timeZone: "Asia/Bangkok" })
    ).toISOString();
    dispatch(setLoading(true));

    const questions = questionList.map((question) => {
      return {
        questionId: question.questionData.id,
        content: question.content,
        numFile: question.files?.length || 0
      };
    });

    // const startAtTime = new Date(
    //   new Date(startTime || "").toLocaleString("en", { timeZone: "Asia/Bangkok" })
    // ).toISOString();

    const startAtTime = new Date().toISOString();
    console.log("start at time", new Date(startAtTime));
    const submitData: SubmitExamRequest = {
      examId: examId || storageExamID,
      userId: "2d7ed5a0-fb21-4927-9a25-647c17d29668",
      questions: questions,
      startTime: startAtTime,
      submitTime: endTime
    };

    ExamService.submitExam(submitData)
      .then((response) => {
        console.log("response", response);
        dispatch(cleanTakeExamState());

        setSnackBarAlertMessage("Nộp bài thành công");
        setSnackBarType(AlertType.Success);
        setOpenSnackAlert(true);
        navigate(
          routes.student.exam.review
            .replace(":courseId", courseId || examData.courseId)
            .replace(":examId", examId || examData.id)
            .replace(":submissionId", response.examSubmissionId),
          {
            replace: true
          }
        );
      })
      .catch((error) => {
        setSnackBarAlertMessage("Nộp bài thất bại");
        setSnackBarType(AlertType.Error);
        setOpenSnackAlert(true);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

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
        <title>
          {t("exam_summary")}
          {" | "}
          {examData.name}
        </title>
      </Helmet>
      <Grid className={classes.root}>
        <SnackbarAlert
          open={openSnackAlert}
          setOpen={setOpenSnackAlert}
          content={snackBarAlertMessage}
          type={snackBarType}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        />
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
                if (courseId && examId)
                  navigate(
                    routes.student.exam.take
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
            <Button sx={{ width: "fit-content" }} onClick={submitExamHandler}>
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

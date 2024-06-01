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
  Pagination,
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
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import TitleWithInfoTip from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/TitleWithInfo";
import Badge from "@mui/joy/Badge";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import { ExamService } from "services/courseService/ExamService";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";
import { parse as uuidParse } from "uuid";
import { useDispatch } from "react-redux";
import { useAppSelector } from "hooks";
import { setExam } from "reduxes/TakeExam";
import { QuestionService } from "services/coreService/QuestionService";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";

const drawerWidth = 340;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: `calc(100% - ${drawerWidth}px)`,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }),
  position: "relative"
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface FormData {
  response: { content: string }[];
}

export default function TakeExam() {
  const examId = "b6484e21-6937-489c-b031-b71767994741";
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
  const [open, setOpen] = React.useState(true);
  const [isShowTimeLeft, setIsShowTimeLeft] = React.useState(true);
  const [drawerVariant, setDrawerVariant] = React.useState<
    "temporary" | "permanent" | "persistent"
  >(width < 1080 ? "temporary" : "permanent");

  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const [timeLimit, setTimeLimit] = React.useState(new Date().getTime() + 3600000 * 10);

  const getTime = React.useCallback(() => {
    const now = new Date().getTime();
    const distance = timeLimit - now;

    if (distance > 0) {
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }
  }, [timeLimit]);

  // Handle time countdown
  // React.useEffect(() => {
  //   const interval = setInterval(() => getTime(), 1000);

  //   return () => clearInterval(interval);
  // }, [getTime, hours, minutes, seconds, timeLimit]);

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
  React.useEffect(() => {
    if (questionList === undefined || questionList?.length <= 0)
      ExamService.getExamQuestionById(examId, null)
        .then((res) => {
          console.log(res);

          const questionFromAPI = res.questions.map((question: GetQuestionExam, index: number) => {
            return {
              flag: false,
              answered: false,
              content: "",
              questionData: question
            };
          });
          dispatch(
            setExam({
              examId: examId,
              questionList: questionFromAPI
            })
          );
          // dispatch(setExamId(examId));
          // dispatch(setQuestionList(questionFromAPI));
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  // get current page question list
  React.useEffect(() => {
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
        console.log(res);
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
  }, [questionPageIndex]);

  // back - forward button
  const handleQuestionNavigateButton = (questionId: string) => {
    const index = questionList.find((question) => question.questionData.id === questionId)
      ?.questionData.page;
    const slug = convertIdToSlug(questionId);

    if (index === questionPageIndex) {
      // const element = document.getElementById(slug);
      // element?.scrollIntoView({ behavior: "smooth" });
      navigate(`${routes.student.exam.take}?page=${index}#${slug}`, {
        replace: true
      });
    } else {
      console.log(`${routes.student.exam.take}?page=${index}#${slug}`);
      navigate(`${routes.student.exam.take}?page=${index}#${slug}`, {
        replace: true
      });
    }
  };

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

  React.useEffect(() => {
    console.log(currentQuestionList);
  }, [currentQuestionList]);

  return (
    <>
      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <Box className={classes.container} style={{ marginTop: `${headerHeight}px` }}>
          <CssBaseline />

          {/* <AppBar
            position='fixed'
            sx={{
              // margin top to avoid appbar overlap with content
              marginTop: `${headerHeight}px`,
              backgroundColor: "white"
            }}
            open={open}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.student.course.management)}
                >
                  Quản lý khoá học
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.student.course.information)}
                >
                  CS202 - Nhập môn lập trình
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.student.course.assignment)}
                >
                  Danh sách bài tập
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.student.exam.detail)}
                >
                  Bài kiểm tra 1
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall colorname='--blue-500'>Xem trước</ParagraphSmall>
              </Box>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='end'
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: "none" }) }}
              >
                <MenuIcon color='action' />
              </IconButton>
            </Toolbar>
          </AppBar> */}
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
            <Heading1 fontWeight={"500"}>Bài kiểm tra Cuối Kì</Heading1>
            <Button
              onClick={() => {
                navigate(routes.student.exam.detail);
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
                {currentQuestionList.map((question: any, index: number) => (
                  <>
                    <Grid
                      item
                      xs={12}
                      id={convertIdToSlug(question.data.question.id)}
                      key={question.data.question.id}
                    >
                      {question.data.question.qtype === qtype.essay.code ? (
                        <EssayExamQuestion
                          page={questionList.findIndex(
                            (tempQuestion: any) =>
                              tempQuestion.questionData.id === question.data.question.id
                          )}
                          isFlagged={
                            questionList.find(
                              (questionInList) =>
                                questionInList.questionData.id === question.data.question.id
                            )?.flag
                          }
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
                    {index !== currentQuestionList.length - 1 && (
                      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                        <Divider
                          sx={{
                            width: "100px"
                          }}
                        />
                      </Grid>
                    )}
                  </>
                ))}

                <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
                  {questionPageIndex !== 0 ? (
                    <Link
                      to={{
                        pathname: routes.student.exam.take,
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
                    <Button onClick={() => {}} variant='solid' color='primary'>
                      Kết thúc bài làm...
                    </Button>
                  ) : (
                    <Link
                      to={{
                        pathname: routes.student.exam.take,
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
            ModalProps={{
              BackdropComponent: () => null // Disable the backdrop
            }}
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

                    <TitleWithInfoTip title={t("take_exam_question_name")} />
                    <Autocomplete
                      fullWidth
                      size='small'
                      options={questionList.filter((value) => value.questionData.name)}
                      getOptionLabel={(params) =>
                        params.questionData.name ? params.questionData.name : ""
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
                    />
                    <TitleWithInfoTip title={t("take_exam_question_sort_question")} />
                    <Autocomplete
                      disablePortal
                      fullWidth
                      multiple
                      size='small'
                      options={[
                        { label: "Tự luận" },
                        { label: "Trắc nghiệm" },
                        { label: "Câu hỏi được đánh dấu" }
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Lọc câu hỏi'
                          sx={{ borderRadius: "12px" }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      sx={{
                        marginBottom: "16px",
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" }
                      }}
                    />
                    <Grid container spacing={1} marginBottom={"10px"} sx={{ maxHeight: "30dvh" }}>
                      {questionList.map((question, index) => (
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
                                  height: "40px"
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
                                {index + 1}
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
                        <Button onClick={() => {}} variant='soft' color='primary' fullWidth>
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

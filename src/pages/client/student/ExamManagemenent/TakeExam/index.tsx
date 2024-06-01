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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative"
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open"
// })<AppBarProps>(({ theme, open }) => ({
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen
//     }),
//     marginRight: drawerWidth
//   })
// }));

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-start"
// }));

interface FormData {
  response: { content: string }[];
}

const tempMultichoiceQuestion = {
  question: {
    id: "b6484e21-6937-489c-b031-b71767994735",
    organization: {
      id: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      name: "Code Dynamite"
    },
    difficulty: "HARD",
    name: "Question haha",
    questionText:
      "<ol><li>đasada</li><li>l1jh5</li><li>12n5lk12</li><li>jhq4lkj12</li><li>1k2jh5lkj21</li><li>12jkl521hj</li><li>125h1j2l5h21</li><li>12h5io12ho</li><li>125p;o12h5il12</li><li>]12h5io12h5oil21h</li><li>12h5ji12hgo5i12h5o</li><li>12h5iol12h5oui21h5</li><li>sfs</li></ol><p></p>",
    generalFeedback: "Question Good Job feedback",
    defaultMark: 1.0,
    createdBy: {
      userId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      firstName: "Tuan",
      lastName: "Nguyen"
    },
    updatedBy: {
      userId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      firstName: "Tuan",
      lastName: "Nguyen"
    },
    qtype: "MULTIPLE_CHOICE",
    answers: [
      {
        id: "d215b5f8-0249-4dc5-89a3-51fd148cfe63",
        questionId: "b6484e21-6937-489c-b031-b71767994735",
        feedback: "Hihi",
        answer: "multi 1",
        fraction: 1.0
      },
      {
        id: "d215b5f8-0249-4dc5-89a3-51fd148cff62",
        questionId: "b6484e21-6937-489c-b031-b71767994735",
        feedback: "huhu",
        answer: "multi 2",
        fraction: 1.0
      },
      {
        id: "d215b5f8-0249-4dc5-89a3-51fd148cff20",
        questionId: "b6484e21-6937-489c-b031-b71767994735",
        feedback: "haha",
        answer: "multi 3",
        fraction: 1.0
      }
    ],
    createdAt: "2024-05-30T09:48:04.079618Z",
    updatedAt: "2024-05-30T09:48:04.079618Z"
  },
  id: "27549d54-4a3a-4be4-9875-eab03f88ba8f",
  single: true,
  shuffleAnswers: true,
  correctFeedback: "Correct",
  partiallyCorrectFeedback: "Partially correct",
  incorrectFeedback: "Incorrect",
  answerNumbering: "none",
  showNumCorrect: 3,
  showStandardInstructions: "Show instruction 2"
};
const tempTrueFalseQuestion = {
  question: {
    id: "b6484e21-6937-489c-b031-b71767994735",
    organization: {
      id: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      name: "Code Dynamite"
    },
    difficulty: "HARD",
    name: "Question haha",
    questionText:
      "<ol><li>đasada</li><li>l1jh5</li><li>12n5lk12</li><li>jhq4lkj12</li><li>1k2jh5lkj21</li><li>12jkl521hj</li><li>125h1j2l5h21</li><li>12h5io12ho</li><li>125p;o12h5il12</li><li>]12h5io12h5oil21h</li><li>12h5ji12hgo5i12h5o</li><li>12h5iol12h5oui21h5</li><li>sfs</li></ol><p></p>",
    generalFeedback: "Question Good Job feedback",
    defaultMark: 1.0,
    createdBy: {
      userId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      firstName: "Tuan",
      lastName: "Nguyen"
    },
    updatedBy: {
      userId: "9ba179ed-d26d-4828-a0f6-8836c2063992",
      firstName: "Tuan",
      lastName: "Nguyen"
    },
    qtype: "SHORT_ANSWER",
    answers: [],
    createdAt: "2024-05-30T09:48:04.079618Z",
    updatedAt: "2024-05-30T09:48:04.079618Z"
  },
  id: "27549d54-4a3a-4be4-9875-eab03f88ba8f",
  single: true,
  shuffleAnswers: true,
  correctFeedback: "Correct",
  partiallyCorrectFeedback: "Partially correct",
  incorrectFeedback: "Incorrect",
  answerNumbering: "none",
  showNumCorrect: 3,
  showStandardInstructions: "Show instruction 2"
};

export default function TakeExam() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { t } = useTranslation();
  let questionPageIndex = Number(searchParams.get("page"));
  if (isNaN(questionPageIndex) || questionPageIndex < 0) {
    questionPageIndex = 0;
  }

  const [open, setOpen] = React.useState(true);
  const [isShowTimeLeft, setIsShowTimeLeft] = React.useState(true);
  const [questions, setQuestions] = React.useState([
    {
      id: "0",
      questionId: "",
      type: qtype.essay,
      title: "1. Ai là cha của SE? Nêu những thành tựu nổi bật",
      done: true
    },
    {
      id: "1",
      type: qtype.short_answer,
      title: "2. What is the full form of HTML?",
      done: true
    },
    {
      id: "2",
      type: qtype.multiple_choice,
      title: "3. Con trỏ là gì?",
      done: true
    },
    {
      id: "3",
      type: qtype.true_false,
      title: "4. Ai là cha của SE? Nêu những thành tựu nổi bật",
      done: false
    },
    {
      id: "4",
      type: qtype.true_false,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    },
    {
      id: "5",
      type: qtype.multiple_choice,
      done: false
    }
  ]);
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

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
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
                <Grid item xs={12}>
                  {questions[questionPageIndex].type === qtype.essay ? (
                    <EssayExamQuestion
                      page={questionPageIndex}
                      isFlagged
                      responseFormat='editor'
                      responseFieldLines={10}
                      fileSize={40000}
                      fileTypes='archive'
                    />
                  ) : questions[questionPageIndex].type === qtype.short_answer ? (
                    <ShortAnswerExamQuestion page={questionPageIndex} />
                  ) : questions[questionPageIndex].type === qtype.multiple_choice ? (
                    <MultipleChoiceExamQuestion
                      page={questionPageIndex}
                      questionMultiChoice={tempMultichoiceQuestion}
                    />
                  ) : questions[questionPageIndex].type === qtype.true_false ? (
                    <TrueFalseExamQuestion
                      page={questionPageIndex}
                      questionTrueFalseQuestion={tempTrueFalseQuestion}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Box>

            {/* <Grid container spacing={1}>
              <Grid item xs={6}>
                {questionPageIndex !== 0 && (
                  <Link
                    to={{
                      pathname: routes.student.exam.take,
                      search: `?page=${questionPageIndex - 1}`
                    }}
                  >
                    Trang trước
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
                      pathname: routes.student.exam.take,
                      search: `?page=${questionPageIndex + 1}`
                    }}
                  >
                    Trang sau
                  </Link>
                ) : (
                  <Button onClick={() => {}}>Kết thúc bài làm...</Button>
                )}
              </Grid>
            </Grid> */}
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
                      options={questions.filter((value) => value.title)}
                      getOptionLabel={(params) => (params.title ? params.title : "")}
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
                    <Grid
                      container
                      spacing={1}
                      marginBottom={"10px"}
                      sx={{ overflow: "auto", maxHeight: "30dvh" }}
                    >
                      {questions.map((question, index) => (
                        <Grid item key={index} marginTop={"16px"} marginRight={"8px"}>
                          <Badge
                            color='neutral'
                            variant='outlined'
                            badgeContent={
                              question.type.code === qtype.essay.code ? (
                                <ModeIcon sx={{ width: "15px", height: "15px" }} />
                              ) : question.type.code === qtype.short_answer.code ? (
                                <ShortTextRoundedIcon sx={{ width: "15px", height: "15px" }} />
                              ) : question.type.code === qtype.true_false.code ? (
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
                            >
                              <Button
                                variant={
                                  questionPageIndex === index
                                    ? "solid"
                                    : question.done
                                      ? "soft"
                                      : "outlined"
                                }
                                sx={{
                                  backgroundColor: questionPageIndex === index ? "#077aefb3" : null,
                                  borderRadius: "1000px",
                                  width: "40px",
                                  height: "40px"
                                }}
                                onClick={() => {
                                  navigate(`${routes.student.exam.take}?page=${index}`, {
                                    replace: true
                                  });
                                }}
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
                      <Grid item justifyContent={"center"}>
                        <Pagination count={99} />
                      </Grid>
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

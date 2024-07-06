import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Box,
  Card,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
  Stack,
  Skeleton
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import SearchBar from "components/common/search/SearchBar";

import EditImageIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/joy/Button";
import CustomNumberInput from "components/common/inputs/CustomNumberInput";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import useBoxDimensions from "hooks/useBoxDimensions";
import useWindowDimensions from "hooks/useWindowDimensions";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import classes from "./styles.module.scss";
import { grey } from "@mui/material/colors";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EssayExamQuestion from "./ExamQuestion/EssayExamQuestion";
import ShortAnswerExamQuestion from "./ExamQuestion/ShortAnswerExamQuestion";
import MultipleChoiceExamQuestion from "./ExamQuestion/MultipleChoiceExamQuestion";
import TrueFalseExamQuestion from "./ExamQuestion/TrueFalseExamQuestion";
import { ExamService } from "services/courseService/ExamService";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";
import { ExamEntity, StudentExamSubmission } from "models/courseService/entity/ExamEntity";
import { PostQuestionDetailList } from "models/coreService/entity/QuestionEntity";
import { QuestionService } from "services/coreService/QuestionService";
import { ExamSubmissionService } from "services/courseService/ExamSubmissionService";
import { useSelector } from "react-redux";
import { RootState } from "store";
import convertUuidToHashSlug from "utils/convertUuidToHashSlug";
import ExamReviewBoxContent from "../PreviewExam/components/BoxContent";
import {
  GetQuestionSubmissionEntity,
  SubmissionDetail
} from "models/courseService/entity/QuestionSubmissionEntity";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useState } from "react";
import BasicSelect from "components/common/select/BasicSelect";
const drawerWidth = 450;

export interface QuestionDetailMap {
  [key: string]: QuestionDetail;
}

interface QuestionDetail {
  flag: boolean;
  answered: boolean;
  id: string;
}

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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start"
}));

enum EGradingStatus {
  GRADED,
  QUEUED,
  GRADING
}
export default function GradingExam() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openPreviewMultipleChoiceDialog, setOpenPreviewMultipleChoiceDialog] =
    React.useState(false);
  const [openPreviewEssay, setOpenPreviewEssay] = React.useState(false);
  const [openPreviewShortAnswer, setOpenPreviewShortAnswer] = React.useState(false);
  const [openPreviewTrueFalse, setOpenPreviewTrueFalse] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const submissionId = useParams<{ submissionId: string }>().submissionId;
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const [userId, setUserId] = React.useState("9ba179ed-d26d-4828-a0f6-8836c2063992");
  const [examSubmissionId, setExamSubmissionId] = React.useState(submissionId);
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (selectedRowId: GridRowSelectionModel) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel) => {
    console.log(model);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalElements, setTotalElements] = React.useState(0);

  const [searchValue, setSearchValue] = React.useState("");

  const handleSetGradeStatus = (examSubmissionId: string) => {
    ExamSubmissionService.setGradeStatus(examSubmissionId)
      .then((res) => {
        console.log("Set grade status successfully", res);
      })
      .catch((error) => {
        console.error("Failed to set grade status", error);
      })
      .finally(() => {
        setDialogOpen(true);
      });
  };

  function handleClick() {
    setLoading(true);

    handleSetGradeStatus(submissionId || "");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

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
  const [openChooseStudent, setOpenChooseStudent] = React.useState(false);
  const chooseStudentHeading: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 2 },
    { field: "name", headerName: "Tên", flex: 1.5 },
    {
      field: "status",
      headerName: "Trạng thái nộp bài",
      flex: 1,
      renderCell: (params) =>
        params.value === "SUBMITTED" ? (
          <Chip label='Đã nộp' sx={{ backgroundColor: "#c7f7d4", color: "#00e676" }} />
        ) : (
          <Chip label='Chưa nộp' />
        )
    },
    {
      field: "statusGrade",
      headerName: "Trạng thái chấm",
      flex: 1,
      renderCell: (params) =>
        params.value === "GRADED" ? (
          <Chip label='Đã chấm' sx={{ backgroundColor: "#c7f7d4", color: "#00e676" }} />
        ) : (
          <Chip label='Chưa chấm' />
        )
    }
    // {
    //   field: "action",
    //   type: "actions",
    //   headerName: "Hành động",
    //   getActions: (params) => [
    //     <IconButton onClick={() => setOpenChooseStudent(false)}>
    //       <VisibilityIcon />
    //     </IconButton>
    //   ]
    // }
  ];

  const [gradingStatus, setGradingStatus] = React.useState(0);
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);

  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });

  const [searchParams] = useSearchParams();
  const examId = useParams<{ examId: string }>().examId;
  const courseId = useParams<{ courseId: string }>().courseId;

  const [examData, setExamData] = React.useState<ExamEntity | undefined>(undefined);
  const [studentExamSubmission, setStudentExamSubmission] = React.useState<StudentExamSubmission[]>(
    []
  );

  const [studentSubmissionCurrent, setStudentSubmissionCurrent] = React.useState<
    StudentExamSubmission | undefined
  >(undefined);

  const [listSubmission, setListSubmission] = React.useState<any[]>([]);
  const questionPageIndex = parseInt(searchParams.get("page") || "0");
  const isShowAllQuesionsInOnePage = searchParams.get("showall");
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [submissionData, setSubmissionData] = React.useState<SubmissionDetail>();
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

  const handleGetExamQuestion = React.useCallback(async () => {
    if (examId === undefined) return;
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
  }, [examId]);

  const handleGetExamSubmission = React.useCallback(async () => {
    if (submissionId !== undefined)
      ExamSubmissionService.getExamSubmissionById(submissionId)
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

          ExamSubmissionService.getAllAttemptByExamIdAndUserId(res.examId, res.userId)
            .then((res) => {
              setListSubmission(
                res.map((submission: any, index: number) => ({ ...submission, id: index }))
              );
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {});
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
  }, [submissionId]);

  const handleGetStudentExamSubmission = React.useCallback(async () => {
    if (examId === undefined) return;
    ExamSubmissionService.getStudentExamSubmission(examId)
      .then((res) => {
        console.log("Get student exam submission");
        setStudentExamSubmission(res.studentExamSubmissionResponses);
        const currentStudent = res.studentExamSubmissionResponses.find(
          (student: StudentExamSubmission) => student.examSubmissionId === submissionId
        );
        setStudentSubmissionCurrent(currentStudent);
        setUserId(currentStudent?.userId);
        setTotalElements(res.totalItems);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  }, [examId, submissionId, userId]);

  const [drawerVariant, setDrawerVariant] = React.useState<
    "temporary" | "permanent" | "persistent"
  >(width < 1080 ? "temporary" : "permanent");

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };

  const [dialogOpen2, setDialogOpen2] = useState(false);
  const handleClose2 = () => {
    // Get exam questions
    handleGetExamQuestion();

    // Get exam submission data
    handleGetExamSubmission();

    // Get student exam submission
    handleGetStudentExamSubmission();

    handleSetGradeStatus(submissionId || "");
    setDialogOpen(false);
  };

  React.useEffect(() => {
    if (width < 1080) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("persistent");
    }
  }, [width]);

  React.useEffect(() => {
    const fetchData = async () => {
      // Get exam questions
      handleGetExamQuestion();

      // Get exam submission data
      handleGetExamSubmission();

      // Get student exam submission
      handleGetStudentExamSubmission();
    };
    fetchData();
  }, [
    handleGetExamQuestion,
    handleGetExamSubmission,
    handleGetStudentExamSubmission,
    submissionId
  ]);

  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      // Get exam questions
      handleGetExamQuestion();

      // Get exam submission data
      handleGetExamSubmission();

      // Get student exam submission
      handleGetStudentExamSubmission();

      handleSetGradeStatus(submissionId || "");
    };
    fetchData();
  }, [location.pathname, location.search, submissionId]);

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{t("warning")}</DialogTitle>
        <DialogContent>
          <Typography>{t("student_not_take_exam")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            {t("common_confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen2} onClose={handleClose2}>
        <DialogTitle>{t("exam_notify")}</DialogTitle>
        <DialogContent>
          <Typography>{t("exam_grade_success")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color='primary'>
            {t("common_confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid className={classes.root}>
        <Header />
        <Box
          className={classes.container}
          sx={{
            marginTop: `${sidebarStatus.headerHeight}px`
          }}
        >
          <CssBaseline />
          <AppBar
            position='fixed'
            sx={{
              top: `${sidebarStatus.headerHeight + 1}px`,
              backgroundColor: "white",
              boxShadow: "0px 2px 4px #00000026"
            }}
            ref={header2Ref}
            open={open}
          >
            <Toolbar>
              <Box id={classes.breadcumpWrapper}>
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() => navigate(routes.lecturer.course.management)}
                  translation-key='common_course_management'
                >
                  {t("common_course_management")}
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() =>
                    navigate(
                      routes.lecturer.course.information.replace(":courseId", courseId ?? "")
                    )
                  }
                >
                  {submissionData?.courseName}
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() =>
                    navigate(routes.lecturer.course.assignment.replace(":courseId", courseId ?? ""))
                  }
                  translation-key='course_detail_assignment_list'
                >
                  {t("course_detail_assignment_list")}
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall
                  colorname='--blue-500'
                  className={classes.cursorPointer}
                  onClick={() =>
                    navigate(
                      routes.lecturer.exam.detail
                        .replace(":courseId", courseId ?? "")
                        .replace(":examId", examId ?? "")
                    )
                  }
                >
                  {submissionData?.name}
                </ParagraphSmall>
                <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                <ParagraphSmall colorname='--blue-500'>Đánh giá</ParagraphSmall>
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
          </AppBar>
          <Main
            open={open}
            className={classes.mainContent}
            sx={{
              height: `calc(100% - ${header2Height}px)`,
              marginTop: `${header2Height}px`
            }}
          >
            <Card>
              <Box className={classes.formBody} width={"100%"}>
                <Heading1 fontWeight={"500"}>{submissionData?.name}</Heading1>
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
                        textTitle={t("exam_review_status")}
                        textContent={
                          submissionData?.status === "SUBMITTED"
                            ? t("exam_review_status_submitted").toUpperCase()
                            : submissionData?.status === "GRADED"
                              ? t("exam_review_status_graded").toUpperCase()
                              : t("exam_review_status_not_submitted").toUpperCase() ||
                                t("common_unknown")
                        }
                        icon={
                          <DonutLargeRoundedIcon
                            sx={{
                              fontSize: "15px",
                              marginBottom: "3px"
                            }}
                          />
                        }
                      />
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
                                questionId={question.data.question.id}
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
                  ) : questions[questionPageIndex]?.data?.question?.qtype === qtype.essay.code ? (
                    <EssayExamQuestion
                      questionIndex={questionPageIndex}
                      questionEssayQuestion={questions[questionPageIndex].data}
                      questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                        (submittedQuestion) =>
                          submittedQuestion.questionId ===
                          questions[questionPageIndex].data.question.id
                      )}
                    />
                  ) : questions[questionPageIndex]?.data?.question?.qtype ===
                    qtype.short_answer.code ? (
                    <ShortAnswerExamQuestion
                      questionIndex={questionPageIndex}
                      questionShortAnswer={questions[questionPageIndex].data}
                      questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                        (submittedQuestion) =>
                          submittedQuestion.questionId ===
                          questions[questionPageIndex].data.question.id
                      )}
                    />
                  ) : questions[questionPageIndex]?.data?.question?.qtype ===
                    qtype.multiple_choice.code ? (
                    <MultipleChoiceExamQuestion
                      questionId={questions[questionPageIndex].data.question.id}
                      questionIndex={questionPageIndex}
                      questionMultiChoice={questions[questionPageIndex].data}
                      questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                        (submittedQuestion) =>
                          submittedQuestion.questionId ===
                          questions[questionPageIndex].data.question.id
                      )}
                    />
                  ) : questions[questionPageIndex]?.data?.question?.qtype ===
                    qtype.true_false.code ? (
                    <TrueFalseExamQuestion
                      questionIndex={questionPageIndex}
                      questionTrueFalse={questions[questionPageIndex].data}
                      questionSubmitContent={submissionData?.questionSubmissionResponses.find(
                        (submittedQuestion) =>
                          submittedQuestion.questionId ===
                          questions[questionPageIndex].data.question.id
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
                        {/* <Button
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
                        </Button> */}
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
                              pathname: `${routes.lecturer.exam.review
                                .replace(":courseId", courseId || "")
                                .replace(":examId", examId || "")
                                .replace(":submissionId", submissionId || "")}`,
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
                              pathname: `${routes.lecturer.exam.review
                                .replace(":courseId", courseId || "")
                                .replace(":examId", examId || "")
                                .replace(":submissionId", submissionId || "")}`,
                              search: `?showall=0&page=${questionPageIndex + 1}`
                            }}
                          >
                            <Button>{t("course_management_exam_preview_next_page")}</Button>
                          </Link>
                        ) : (
                          // <Button
                          //   onClick={() => {
                          //     if (courseId && examId)
                          //       navigate(
                          //         `${routes.lecturer.exam.detail
                          //           .replace(":courseId", courseId)
                          //           .replace(":examId", examId)}`
                          //       );
                          //     else {
                          //       navigate(routes.lecturer.root);
                          //     }
                          //   }}
                          //   translation-key='exam_finish_review'
                          // >
                          //   {t("exam_finish_review")}
                          // </Button>
                          <></>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
            </Card>
          </Main>

          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                position: "fixed",
                height: `calc(100% - ${sidebarStatus.headerHeight + 1}px)`,
                top: `${sidebarStatus.headerHeight + 1}px`
              }
            }}
            variant='persistent'
            anchor='right'
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <Box className={classes.drawerBody}>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle translation-key='common_student'>{t("common_student")}</TextTitle>

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  border={1}
                  borderRadius={1}
                  padding={1}
                  sx={{ backgroundColor: "rgb(217, 226, 237)", ":hover": { cursor: "pointer" } }}
                  onClick={() => setOpenChooseStudent(true)}
                >
                  <ParagraphBody>
                    {studentSubmissionCurrent?.lastName + " " + studentSubmissionCurrent?.firstName}
                  </ParagraphBody>{" "}
                  <ArrowDropDownIcon />
                </Stack>

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <BasicSelect
                    labelId={t("common_attempt")}
                    value={submissionId ?? ""}
                    onHandleChange={(value) => {
                      setStudentSubmissionCurrent(
                        studentExamSubmission.find(
                          (student: StudentExamSubmission) => student.examSubmissionId === value
                        )
                      );

                      navigate(
                        routes.lecturer.exam.grading
                          .replace(":submissionId", value)
                          .replace(":examId", examId || "")
                          .replace(":courseId", courseId || "")
                      );
                    }}
                    items={listSubmission.map((submission) => ({
                      label: `Lần ${submission.id + 1}`,
                      value: submission.examSubmissionId
                    }))}
                  />
                </Stack>

                <Dialog
                  open={openChooseStudent}
                  onClose={() => setOpenChooseStudent(false)}
                  fullWidth={true}
                  maxWidth='md'
                >
                  <DialogTitle>Chọn sinh viên</DialogTitle>
                  <DialogContent>
                    <Paper className={classes.containerPaper}>
                      <Box className={classes.searchWrapper}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <SearchBar onSearchClick={() => null} maxWidth='100%' />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControl className={classes.colSearchContainer} size='small'>
                              <InputLabel id='filter-status'>Lọc</InputLabel>
                              <Select
                                labelId='filter-status'
                                id='colSearchSelect'
                                value={gradingStatus}
                                label='Lọc'
                                onChange={(e) => setGradingStatus(e.target.value as number)}
                              >
                                <MenuItem value={0}>Tất cả</MenuItem>
                                <MenuItem value={1}>Đang chấm</MenuItem>
                                <MenuItem value={2}>Chưa chấm</MenuItem>
                                <MenuItem value={3}>Đã chấm</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                    <CustomDataGrid
                      dataList={studentExamSubmission.map((item, index) => ({
                        ...item,
                        id: index,
                        name: item.firstName + " " + item.lastName
                      }))}
                      personalSx={true}
                      sx={{
                        "& .MuiDataGrid-cell:nth-last-child(n+2)": {
                          padding: "16px"
                        },
                        "& .normal-row:hover": {
                          cursor: "pointer"
                        },
                        "& .disable-row": {
                          backgroundColor: grey[100]
                        }
                      }}
                      getRowClassName={(params) => {
                        if (params.row.status === EGradingStatus.GRADING) return "disable-row";
                        else return "normal-row";
                      }}
                      tableHeader={chooseStudentHeading}
                      onSelectData={rowSelectionHandler}
                      // visibleColumn={visibleColumnList}
                      dataGridToolBar={dataGridToolbar}
                      page={page}
                      pageSize={rowsPerPage}
                      totalElement={totalElements}
                      onPaginationModelChange={pageChangeHandler}
                      showVerticalCellBorder={true}
                      getRowHeight={() => "auto"}
                      onClickRow={(params, event) => {
                        console.log(params.row, event, "click row");

                        if (params.row.status === "NOT_SUBMITTED") {
                          setDialogOpen(true);
                          return;
                        }

                        setStudentSubmissionCurrent(params.row);
                        navigate(
                          routes.lecturer.exam.grading
                            .replace(":submissionId", params.row.examSubmissionId)
                            .replace(":examId", examId || "")
                            .replace(":courseId", courseId || "")
                        );
                        setOpenChooseStudent(false);
                      }}
                      // slots={{toolbar:}}
                      // columnGroupingModel={columnGroupingModelPlus}
                    />
                  </DialogContent>
                  <DialogActions>
                    {/* <Button btnType={BtnType.Primary} onClick={() => setOpenChooseStudent(false)}>
                      Đóng
                    </Button> */}
                  </DialogActions>
                </Dialog>
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>
                  {t("question_grade")}:{" "}
                  {studentSubmissionCurrent?.mark + " / " + studentSubmissionCurrent?.totalMark}
                </TextTitle>
              </Box>
              <Box className={classes.drawerFieldContainer}>
                <TextTitle>
                  {t("exam_grade")}:{" "}
                  {studentSubmissionCurrent?.grade + " / " + studentSubmissionCurrent?.totalGrade}
                </TextTitle>
              </Box>

              <LoadButton
                btnType={BtnType.Outlined}
                fullWidth
                style={{ marginTop: "20px" }}
                padding='10px'
                loading={loading}
                onClick={handleClick}
                translation-key='finish_grading'
              >
                {t("finish_grading")}
              </LoadButton>
            </Box>
          </Drawer>
        </Box>
      </Grid>
    </>
  );
}

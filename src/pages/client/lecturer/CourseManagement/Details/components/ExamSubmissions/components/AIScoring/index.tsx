import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import ExamSubmissionFeatureBar from "../FeatureBar";
import SubmissionBarChart from "../SubmissionChart";
import classes from "./styles.module.scss";
import qtype from "utils/constant/Qtype";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { CssBaseline, IconButton, Toolbar } from "@mui/material";
import Header from "components/Header";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import TextTitle from "components/text/TextTitle";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { AssignmentStudent, QuestionEssay, scoringByAI } from "service/ScoringByAI";
import CircularProgress from "@mui/material/CircularProgress";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import { useEffect, useMemo, useRef, useState } from "react";
export enum SubmissionStatusSubmitted {
  SUBMITTED = "Đã nộp",
  NOT_SUBMITTED = "Chưa nộp"
}

export enum SubmissionStatusGraded {
  GRADED = "Đã chấm",
  NOT_GRADED = "Chưa chấm"
}

interface IFeedbackGradedAI {
  id: number;
  feedback: string[];
  score: number;
}
const AIScoring = () => {
  const drawerWidth = 450;

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

  const navigate = useNavigate();
  const totalSubmissionCount = 20;
  const totalStudent = 30;
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {};

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const [feedback, setFeedback] = useState<IFeedbackGradedAI[]>([]);

  const examData = {
    id: 1,
    max_grade: 10,
    questions: [
      {
        id: 1,
        question: "Câu hỏi 1",
        answer: "Đáp án 1",
        max_grade: 10,
        type: qtype.source_code,
        plagiarism_detection: {
          is_checked: true,
          result: {
            is_plagiarism: true,
            plagiarism_rate: 0.5
          }
        }
      }
    ]
  };

  const submissionList = [
    {
      id: 1,
      student_name: "Nguyễn Đinh Quang Khánh",
      student_email: "khanhndq2002@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.SUBMITTED,
        late_submission: {
          is_late: false,
          late_duration: "1 ngày 2 giờ"
        }
      },
      current_final_grade: feedback?.length !== 0 ? feedback[0]?.score : 0,

      feedback: feedback?.length !== 0 ? feedback[0]?.feedback : ""
    },
    {
      id: 2,
      student_name: "Nguyễn Quốc Tuấn",
      student_email: "tuannguyen@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.NOT_SUBMITTED,
        late_submission: {
          is_late: false,
          late_duration: "1 ngày 2 giờ"
        }
      },
      current_final_grade: feedback?.length !== 0 ? feedback[1]?.score : 0,
      feedback: feedback?.length !== 0 ? feedback[1]?.feedback : ""
    }
  ];

  const tableHeading: GridColDef[] = [
    { field: "student_name", headerName: "Tên sinh viên", width: 200 },
    { field: "student_email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 250,
      renderCell: (params) => {
        return (
          <Box padding='5px' width='100%'>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px"
              }}
            >
              {params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                ? "Đã nộp"
                : "Chưa nộp"}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor: "#EFCFCF",
                fontSize: "17px",
                display: params.value.late_submission.is_late ? "block" : "none"
              }}
            >
              {"Quá hạn "}
              {params.value.late_submission.late_duration}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px",
                display:
                  params.value.grade_status === SubmissionStatusGraded.GRADED ? "block" : "none"
              }}
            >
              {params.value.grade_status === SubmissionStatusGraded.GRADED
                ? "Đã chấm"
                : "Chưa chấm"}
            </Box>
          </Box>
        );
      }
    },
    {
      field: "current_final_grade",
      headerName: "Điểm tổng kết",
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <TextTitle>
              {params.value} / {examData.max_grade}
            </TextTitle>
          </Box>
        );
      }
    },
    {
      field: "feedback",
      headerName: "Phản hồi",
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <Box className={classes.textLimit}>
              <ParagraphBody>{params.value}</ParagraphBody>
            </Box>
          </Box>
        );
      }
    }
  ];

  const submissionDataset = [
    {
      student: 59,
      range: "0.00 - 5.00"
    },
    {
      student: 50,
      range: "5.00 - 6.00"
    },
    {
      student: 47,
      range: "6.00 - 7.00"
    },
    {
      student: 54,
      range: "7.00 - 8.00"
    },
    {
      student: 57,
      range: "8.00 - 9.00"
    },
    {
      student: 60,
      range: "9.00 - 10.00"
    },
    {
      student: 59,
      range: "10.00 - 11.00"
    },
    {
      student: 65,
      range: "11.00 - 12.00"
    },
    {
      student: 51,
      range: "12.00 - 13.00"
    },
    {
      student: 60,
      range: "13.00 - 14.00"
    },
    {
      student: 67,
      range: "14.00 - 15.00"
    },
    {
      student: 61,
      range: "15.00 - 16.00"
    }
  ];

  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(routes.lecturer.exam.ai_scroring_detail, {
      state: {
        feedback: params.row,
        answer: data[params.row.id].studentAnswer
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);

  const question: QuestionEssay = useMemo(
    () => ({
      content:
        "Trình bày cách thực hiện một thuật toán để tìm phần tử lớn nhất trong danh sách liên kết đơn?",
      answer:
        "**Thuật toán:** 1. Khởi tạo một biến max để lưu giá trị lớn nhất ban đầu là giá trị của phần tử đầu tiên trong danh sách liên kết. 2. Duyệt qua danh sách liên kết, so sánh từng phần tử với max. Nếu phần tử hiện tại lớn hơn max thì gán max bằng giá trị của phần tử hiện tại. 3. Trả về giá trị của max.",
      criteria:
        "Trả lời đúng các tiêu chí được nêu sẽ được tối đa điểm, thiếu mất 1 tiêu chí bị trừ 3 điểm",
      maxScore: 10
    }),
    []
  );

  const data: AssignmentStudent[] = useMemo(
    () => [
      {
        id: 1,
        studentAnswer:
          "1. Khởi tạo một biến max để lưu giá trị lớn nhất ban đầu là giá trị của phần tử đầu tiên trong danh sách liên kết. 2. Duyệt qua danh sách liên kết, so sánh từng phần tử với max. Nếu phần tử hiện tại lớn hơn max thì gán max bằng giá trị của phần tử hiện tại. 3. Trả về giá trị của max."
      },
      {
        id: 2,
        studentAnswer:
          "1. Khởi tạo một biến max để lưu giá trị lớn nhất ban đầu là giá trị của phần tử đầu tiên trong danh sách liên kết. 2. Duyệt qua danh sách liên kết, so sánh từng phần tử với max. Nếu phần tử hiện tại lớn hơn max thì gán max bằng giá trị của phần tử hiện tại."
      }
    ],
    []
  );

  const effectRan = useRef(false);

  function isResponseFeedbackGradedAI(obj: any): obj is IFeedbackGradedAI {
    return (
      typeof obj.id === "number" &&
      typeof obj.feedback === "object" &&
      typeof obj.score === "number"
    );
  }

  useEffect(() => {
    if (effectRan.current === false) {
      const handleScoringByAI = async () => {
        setLoading(true);

        await scoringByAI(data, question)
          .then((results) => {
            if (results && isResponseFeedbackGradedAI(results[0])) {
              setFeedback(results);
              setOpenSnackbarAlert(true);
              setAlertContent("Chấm điểm thành công");
              setAlertType(AlertType.Success);
            } else {
              throw new Error("Internal server error");
            }
          })
          .catch((err) => {
            console.error("Error generating content:", err);
            setOpenSnackbarAlert(true);
            setAlertContent("Chấm điểm thất bại, hãy thử lại lần nữa");
            setAlertType(AlertType.Error);
          })
          .finally(() => {
            setLoading(false);
          });
      };

      handleScoringByAI();
      return () => {
        effectRan.current = true;
      };
    }
  }, [data, question]);

  return (
    <>
      {loading === true ? (
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid className={classes.root}>
          <Header ref={headerRef} />
          <Box
            className={classes.container}
            sx={{
              marginTop: `${headerHeight + 80}px`
            }}
          >
            <CssBaseline />
            <AppBar
              position='fixed'
              sx={{
                // margin top to avoid appbar overlap with content
                marginTop: "64px",
                backgroundColor: "white"
              }}
              open={false}
            >
              <Toolbar>
                <Box id={classes.breadcumpWrapper}>
                  <ParagraphSmall
                    colorname='--blue-500'
                    className={classes.cursorPointer}
                    onClick={() => navigate(routes.lecturer.course.management)}
                  >
                    Quản lý khoá học
                  </ParagraphSmall>
                  <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                  <ParagraphSmall
                    colorname='--blue-500'
                    className={classes.cursorPointer}
                    onClick={() => navigate(routes.lecturer.course.information)}
                  >
                    CS202 - Nhập môn lập trình
                  </ParagraphSmall>
                  <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                  <ParagraphSmall
                    colorname='--blue-500'
                    className={classes.cursorPointer}
                    onClick={() => navigate(routes.lecturer.course.assignment)}
                  >
                    Danh sách bài tập
                  </ParagraphSmall>
                  <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                  <ParagraphSmall
                    colorname='--blue-500'
                    className={classes.cursorPointer}
                    onClick={() => navigate(routes.lecturer.exam.detail)}
                  >
                    Bài kiểm tra cuối kỳ
                  </ParagraphSmall>
                  <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                  <ParagraphSmall
                    colorname='--blue-500'
                    className={classes.cursorPointer}
                    onClick={() => navigate(routes.lecturer.exam.submissions)}
                  >
                    Danh sách bài nộp
                  </ParagraphSmall>
                  <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
                  <ParagraphSmall colorname='--blue-500'>Chấm điểm AI</ParagraphSmall>
                </Box>
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  edge='end'
                  sx={{ display: "none" }}
                >
                  <MenuIcon color='action' />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>
          <Container className={classes.examBody}>
            <Button
              btnType={BtnType.Primary}
              onClick={() => {
                navigate(routes.lecturer.exam.detail);
              }}
              startIcon={
                <ChevronLeftIcon
                  sx={{
                    color: "white"
                  }}
                />
              }
              width='fit-content'
              className={classes.backButton}
            >
              <ParagraphBody>Quay lại</ParagraphBody>
            </Button>
            <Heading1>Bài kiểm tra cuối kỳ</Heading1>
            <ParagraphBody>
              Số sinh viên nộp: {totalSubmissionCount}/{totalStudent}
            </ParagraphBody>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <SubmissionBarChart
                dataset={submissionDataset}
                xAxis={[{ scaleType: "band", dataKey: "range" }]}
                width={1000}
                height={500}
              />
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Heading1>Danh sách bài làm</Heading1>
              </Grid>
              <Grid item xs={12}>
                <ExamSubmissionFeatureBar />
              </Grid>
              <Grid item xs={12}>
                <CustomDataGrid
                  dataList={submissionList}
                  tableHeader={tableHeading}
                  onSelectData={rowSelectionHandler}
                  visibleColumn={visibleColumnList}
                  dataGridToolBar={dataGridToolbar}
                  page={page}
                  pageSize={pageSize}
                  totalElement={totalElement}
                  onPaginationModelChange={pageChangeHandler}
                  showVerticalCellBorder={true}
                  getRowHeight={() => "auto"}
                  onClickRow={rowClickHandler}
                />
              </Grid>
            </Grid>
          </Container>
          <SnackbarAlert
            open={openSnackbarAlert}
            setOpen={setOpenSnackbarAlert}
            type={alertType}
            content={alertContent}
          />
        </Grid>
      )}
    </>
  );
};

export default AIScoring;

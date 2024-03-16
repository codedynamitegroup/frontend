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
import {
  AssignmentStudent,
  EFeedbackGradedCriteriaRate,
  IFeedback,
  IFeedbackGradedAI,
  QuestionEssay,
  scoringByAI
} from "service/ScoringByAI";
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
      current_final_grade: feedback?.length !== 0 ? feedback[0]?.feedback?.score : 0,

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
      current_final_grade: feedback?.length !== 0 ? feedback[1]?.feedback?.score : 0,
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
        const feedbackTemp: IFeedback = params.value;
        if (!feedbackTemp) {
          return "";
        }

        const feedback = `
				1. Nội dung:
					- Độ chính xác: ${feedbackTemp?.content?.accuracy}
					- Logic: ${feedbackTemp?.content?.logic}
					- Sáng tạo: ${feedbackTemp?.content?.creativity}
					- Sử dụng nguồn: ${feedbackTemp?.content?.sourceUsage}
				
				2. Hình thức:
					- Ngữ pháp: ${feedbackTemp?.form?.grammar}
					- Từ vựng:  ${feedbackTemp?.form?.vocabulary}
					- Chính tả:  ${feedbackTemp?.form?.spelling}
					- Bố cục:  ${feedbackTemp?.form?.layout}
				
				3. Phong cách:
					- Rõ ràng: ${feedbackTemp?.style?.clarity}
					- Hấp dẫn: ${feedbackTemp?.style?.engagement}
					- Phù hợp: ${feedbackTemp?.style?.appropriateness}

				4. Phản hồi chung:
					- ${feedbackTemp?.overall}
				`;
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <Box className={classes.textLimit}>
              <ParagraphBody>{feedback}</ParagraphBody>
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
    console.log(params.row.id);
    navigate(routes.lecturer.exam.ai_scroring_detail, {
      state: {
        feedback: params.row,
        answer: data[params.row.id - 1]?.studentAnswer,
        question: question
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.Success);

  const question: QuestionEssay = useMemo(
    () => ({
      content: "Cách Chuyển Tất Cả Các Số Không Của Mảng Về Cuối",
      answer: `
			Di chuyển tất cả các số không trong một mảng số nguyên đến cuối. Câu trả lời nên tránh sử dụng không gian không đổi và bảo toàn thứ tự tương đối của các thành phần của mảng.

			Đầu vào: {1,2,3,0,8,0,4,7}

			Đầu ra sẽ là {1,2,3,8,4,7,0,0}

			Đặt phần tử ở vị trí có sẵn sau đây trong mảng nếu phần tử hiện tại không phải là số không. Điền vào tất cả các chỉ số còn lại bằng 0 khi tất cả các mục của mảng đã được xử lý.

			Giải pháp trước có độ phức tạp thời gian O (n), trong đó n là kích thước của đầu vào.
			`,
      rubics: "Trả lời đúng các tiêu chí được nêu sẽ được tối đa điểm",
      maxScore: 10
    }),
    []
  );

  const data: AssignmentStudent[] = useMemo(
    () => [
      {
        id: 1,
        studentAnswer: "Mảng động là con trỏ, chứa chuỗi ký tự ASCII"
      },
      {
        id: 2,
        studentAnswer: `
				Đầu vào: {1,2,3,0,8,0,4,7}

				Đầu ra sẽ là {1,2,3,8,4,7,0,0}
				
				Đặt phần tử ở vị trí có sẵn sau đây trong mảng nếu phần tử hiện tại không phải là số không. Điền vào tất cả các chỉ số còn lại bằng 0 khi tất cả các mục của mảng đã được xử lý.				
				`
      }
    ],
    []
  );

  const effectRan = useRef(false);

  function isResponseFeedbackGradedAI(obj: any): obj is IFeedbackGradedAI {
    return (
      typeof obj.id === "number" &&
      typeof obj.feedback === "object" &&
      typeof obj.feedback.content === "object" &&
      typeof obj.feedback.content.accuracy === "string" &&
      obj.feedback.content.accuracy !== "" &&
      typeof obj.feedback.content.logic === "string" &&
      obj.feedback.content.logic !== "" &&
      typeof obj.feedback.content.creativity === "string" &&
      obj.feedback.content.creativity !== "" &&
      typeof obj.feedback.content.sourceUsage === "string" &&
      obj.feedback.content.sourceUsage !== "" &&
      typeof obj.feedback.form === "object" &&
      typeof obj.feedback.form.grammar === "string" &&
      obj.feedback.form.grammar !== "" &&
      typeof obj.feedback.form.vocabulary === "string" &&
      obj.feedback.form.vocabulary !== "" &&
      typeof obj.feedback.form.spelling === "string" &&
      obj.feedback.form.spelling !== "" &&
      typeof obj.feedback.form.layout === "string" &&
      obj.feedback.form.layout !== "" &&
      typeof obj.feedback.style === "object" &&
      typeof obj.feedback.style.clarity === "string" &&
      obj.feedback.style.clarity !== "" &&
      typeof obj.feedback.style.engagement === "string" &&
      obj.feedback.style.engagement !== "" &&
      typeof obj.feedback.style.appropriateness === "string" &&
      obj.feedback.style.appropriateness !== "" &&
      typeof obj.feedback.overall === "string" &&
      typeof obj.feedback.score === "number"
    );
  }

  useEffect(() => {
    if (effectRan.current === false) {
      const handleScoringByAI = async () => {
        setLoading(true);
        await scoringByAI(data, question)
          .then((results) => {
            if (
              results &&
              results.length === 2 &&
              isResponseFeedbackGradedAI(results[0]) &&
              isResponseFeedbackGradedAI(results[1])
            ) {
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

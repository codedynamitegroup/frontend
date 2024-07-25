import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Chip, Grid, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { blue, green } from "@mui/material/colors";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import axios from "axios";
import CustomDataGrid from "components/common/CustomDataGrid";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import CreateReportConfirmDialog from "./components/CreateReportConfirmDialog";
import ExamSubmissionFeatureBar from "./components/FeatureBar";
import MultiSelectCodeQuestionsDialog from "./components/MultiSelectCodeQuestionsDialog";
import SubmissionBarChart from "./components/SubmissionChart";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { setErrorMess } from "reduxes/AppStatus";
import { PaginationList } from "models/general";
import { GradeExamSubmission } from "models/courseService/entity/ExamEntity";
import dayjs from "dayjs";

export enum SubmissionStatusSubmitted {
  SUBMITTED = "Đã nộp",
  NOT_SUBMITTED = "Chưa nộp"
}

export enum SubmissionStatusGraded {
  GRADED = "Đã chấm",
  NOT_GRADED = "Chưa chấm"
}

interface GradeExamSubmissionProps {
  id: string;
  submission_id: string;
  student_name: string;
  student_email: string;
  current_final_grade: number;
  submission_status_submitted?: string;
  grade_status?: string;
  last_submission_time: string;
  last_grade_time?: string;
}

interface GradeExamChartProps {
  student: number;
  range: string;
}

const LecturerCourseExamSubmissions = () => {
  const examState = useSelector((state: RootState) => state.exam);

  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [isMultiSelectCodeQuestionsDialogOpen, setIsMultiSelectCodeQuestionsDialogOpen] = useState({
    value: false,
    defaultTabIndex: 0
  });
  const [isCreateReportConfirmDialogOpen, setIsCreateReportConfirmDialogOpen] = useState({
    value: false,
    isExisted: false
  });
  const navigate = useNavigate();
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const [isPlagiarismDetectionLoading, setIsPlagiarismDetectionLoading] = useState(false);
  const [isCheckReportExistLoading, setIsCheckReportExistLoading] = useState(false);

  const examData = {
    id: 1,
    org_id: "f47ac10b-58cc-4372-a567-0e02b2c3d477",
    max_grade: 30,
    questions: [
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
        title: "Cài đặt thuật toán sắp xếp chọn",
        checkCheating: false,
        max_grade: 10,
        type: qtype.source_code,
        number: 1
      },
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d496",
        title: "Thuật toán là gì",
        max_grade: 10,
        type: qtype.essay,
        number: 2
      },
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d497",
        title: "HTML stands for Hyper Text Markup Language",
        max_grade: 10,
        type: qtype.multiple_choice,
        number: 3
      },
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d49",
        title: "Tính tổng các số lẻ từ 1 đến n",
        checkCheating: false,
        max_grade: 10,
        type: qtype.source_code,
        number: 4
      },
      {
        id: "f47ac10b-58cc-4372-a567-002b2c3d495",
        title: "Tính tổng bình phương các số từ 1 đến n",
        checkCheating: true,
        max_grade: 10,
        type: qtype.source_code,
        number: 5
      }
    ]
  };

  const filterExamQuestionData = examData.questions.map((value) => ({
    question: value.title,
    questionId: value.id
  }));
  filterExamQuestionData.unshift({ question: "Câu hỏi 11 đến 20", questionId: "-1" });

  const tableHeading: GridColDef[] = [
    {
      field: "student_name",
      headerName: `${t("common_fullname")} ${i18next.format(t("common_student"), "lowercase")}`,
      width: 200
    },
    { field: "student_email", headerName: "Email", width: 250 },
    {
      field: "submission_status_submitted",
      headerName: t("common_status"),
      width: 150,
      renderCell: (params) => {
        return (
          <Box padding='5px' width='100%'>
            <Box
              sx={{
                padding: "5px",
                backgroundColor: params.value === "SUBMITTED" ? "var(--green-300)" : "#f5f5f5",
                fontSize: "17px"
              }}
            >
              {params.value === "SUBMITTED" ? "Đã nộp" : "Chưa nộp"}
            </Box>
          </Box>
        );
      }
    },
    {
      field: "last_submission_time",
      headerName: t("course_lecturer_sub_last_submission_time"),
      width: 150
    },
    // {
    //   field: "last_grade_time",
    //   headerName: t("course_lecturer_sub_last_grading_time"),
    //   width: 150
    // },
    {
      field: "current_final_grade",
      headerName: t("common_final_grade"),
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <TextTitle>
              {params.value === undefined ? "-" : params.value} / {maxGrade}
            </TextTitle>
          </Box>
        );
      }
    },
    {
      field: "action",
      headerName: t("common_action"),
      width: 200,
      renderCell: (params) => {
        if (params.row.submission_status_submitted === "SUBMITTED") {
          return (
            <Box>
              <Button
                btnType={BtnType.Primary}
                onClick={() => {
                  navigate(
                    routes.lecturer.exam.grading
                      .replace(":courseId", courseId ?? "")
                      .replace(":examId", examId ?? "")
                      .replace(":submissionId", params.row.submission_id)
                  );
                }}
                margin='0 0 10px 0'
                translation-key='course_lecturer_assignment_grading'
              >
                {t("course_lecturer_assignment_grading")}
              </Button>
            </Box>
          );
        }
        return null;
      }
    }
  ];

  const fetchPlagiarismDetectionForCodeQuestion = async (
    reportName: string,
    codeQuestionIds: string[]
  ) => {
    const codePlagiarismDetectionApiUrl =
      process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
    setIsPlagiarismDetectionLoading(true);
    setIsCheckReportExistLoading(true);
    const codeSubmissionsData = {
      report_name: reportName,
      language: "Python",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d482",
      code_question_ids: codeQuestionIds
    };

    try {
      const response = await axios.post(
        `${codePlagiarismDetectionApiUrl}/reports`,
        codeSubmissionsData
      );
      setIsPlagiarismDetectionLoading(false);
      setIsCheckReportExistLoading(false);
      return response.data;
    } catch (error) {
      setIsPlagiarismDetectionLoading(false);
      setIsCheckReportExistLoading(false);
      throw error;
    }
  };

  const onHandlePlagiarismDetection = async (reportName: string, codeQuestionIds: string[]) => {
    try {
      const result = await fetchPlagiarismDetectionForCodeQuestion(reportName, codeQuestionIds);
      if (result.status === "success") {
        navigate(
          `${routes.lecturer.exam.code_plagiarism_detection.replace("reportId", result.data.id)}`,
          {
            state: {
              report: result.data
            }
          }
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCheckCodeQuestionIdsReportExists = async (codeQuestionIds: string[]) => {
    const codePlagiarismDetectionApiUrl =
      process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
    setIsCheckReportExistLoading(true);
    try {
      const response = await axios.post(
        `${codePlagiarismDetectionApiUrl}/reports/check-code-question-ids-exist`,
        {
          code_question_ids: codeQuestionIds
        }
      );
      setIsCheckReportExistLoading(false);
      return response.data;
    } catch (error) {
      setIsCheckReportExistLoading(false);
      throw error;
    }
  };

  const onHandleReportExists = async (reportName: string, codeQuestionIds: string[]) => {
    try {
      if (!codeQuestionIds.length) return;
      const result = await fetchCheckCodeQuestionIdsReportExists(codeQuestionIds);
      if (result.status === "success") {
        if (result.data) {
          handleOpenCreateReportConfirmDialog({
            value: true,
            isExisted: true
          });
        } else {
          handleOpenCreateReportConfirmDialog({
            value: true,
            isExisted: false
          });
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };
  const [tableHeadingPlus, setTableHeadingPlus] = useState<GridColDef[]>([]);

  const handleCloseMultiSelectCodeQuestionsDialog = useCallback(() => {
    setIsMultiSelectCodeQuestionsDialogOpen(
      (prevState) =>
        ({
          ...prevState,
          value: false
        }) as any
    );
  }, []);

  const handleOpenCreateReportConfirmDialog = useCallback(
    (value: { value: boolean; isExisted: boolean }) => {
      setIsCreateReportConfirmDialogOpen(value);
    },
    []
  );

  const handleCloseCreateReportConfirmDialog = useCallback(() => {
    setIsCreateReportConfirmDialogOpen({ value: false, isExisted: false });
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const examId = useParams<{ examId: string }>().examId;
  const courseId = useParams<{ courseId: string }>().courseId;
  const [gradeExamSubmissionState, setGradeExamSubmissionState] = useState<
    PaginationList<GradeExamSubmission>
  >({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(
    () => gradeExamSubmissionState.totalItems || 0,
    [gradeExamSubmissionState.totalItems]
  );

  const [maxGrade, setMaxGrade] = useState(10);
  const initRangeData = (maxGrade: number): GradeExamChartProps[] => {
    const numberOfRanges = 10;
    const rangeSize = maxGrade / numberOfRanges;
    const ranges: GradeExamChartProps[] = [];
    const precision = 2;

    for (let i = 0; i < numberOfRanges; i++) {
      const rangeStart = (i * rangeSize).toFixed(precision);
      const rangeEnd = ((i + 1) * rangeSize - (i === numberOfRanges - 1 ? 0 : 0.01)).toFixed(
        precision
      );
      ranges.push({
        student: 0,
        range: `${rangeStart}-${rangeEnd}`
      });
    }

    return ranges;
  };

  const processExamResults = (results: any[], maxGrade: number): GradeExamChartProps[] => {
    const ranges = initRangeData(maxGrade);

    results.forEach((result) => {
      const score = result.score;
      const index = Math.min(Math.floor(score / (maxGrade / 10)), 9);
      ranges[index].student += 1;
    });

    return ranges;
  };

  const [submissionDataset, setSubmissionDataset] = useState<GradeExamChartProps[]>(
    initRangeData(maxGrade)
  );

  const gradeExamSubmissionListTable: GradeExamSubmissionProps[] = useMemo(() => {
    if (gradeExamSubmissionState.items.length === 0) return [];
    return gradeExamSubmissionState.items.map((value) => ({
      id: value.userId,
      submission_id: value.submissionId,
      student_name: value.lastName + " " + value.firstName,
      student_email: value.email,
      current_final_grade: value.score,
      submission_status_submitted: value.status,
      last_submission_time: value.lastSubmitAt
        ? dayjs(value.lastSubmitAt).format("DD/MM/YYYY HH:mm")
        : "",
      last_grade_time: value.lastMarkAt ? dayjs(value.lastMarkAt).format("DD/MM/YYYY HH:mm") : ""
    }));
  }, [gradeExamSubmissionState.items]);

  const handleGetSubmitions = useCallback(
    async ({
      search,
      pageNo,
      pageSize
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      try {
        const result = await ExamService.gradeExamSubmission({
          examId: examId || "",
          search,
          pageNo,
          pageSize
        });
        setGradeExamSubmissionState({
          currentPage: result.currentPage,
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          items: result.grades
        });

        const processedData = processExamResults(result.grades, maxGrade);
        setSubmissionDataset(processedData);

        console.log(result, "result");
      } catch (error: any) {
        console.error(error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
    },
    [examState.examDetail.id]
  );

  useEffect(() => {
    const fetchSubmissionList = async () => {
      await handleGetSubmitions({
        search: "",
        pageNo: 0,
        pageSize: 10
      });
    };
    fetchSubmissionList();
  }, []);

  return (
    <>
      <Box className={classes.examBody}>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(
              routes.lecturer.exam.detail
                .replace(":courseId", courseId ?? "")
                .replace(":examId", examId ?? "")
            );
          }}
          startIcon={
            <ChevronLeftIcon
              sx={{
                color: "white"
              }}
            />
          }
          width='fit-content'
        >
          <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
        </Button>
        <Heading1>{examState.examDetail.name}</Heading1>
        <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
          {t("course_lecturer_sub_num_of_student")}: {examState.examOverview.submitted}/
          {examState.examOverview.numberOfStudents}
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
            <Heading1 translation-key='course_lecturer_submission_list'>
              {t("course_lecturer_submission_list")}
            </Heading1>
          </Grid>

          <Grid item xs={12}>
            <CustomDataGrid
              dataList={gradeExamSubmissionListTable}
              tableHeader={[...tableHeading, ...tableHeadingPlus]}
              onSelectData={rowSelectionHandler}
              visibleColumn={visibleColumnList}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
              getRowHeight={() => "auto"}
              onClickRow={rowClickHandler}
              // slots={{toolbar:}}
              // columnGroupingModel={columnGroupingModelPlus}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LecturerCourseExamSubmissions;

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { GridCallbackDetails, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import SubmissionBarChart from "./components/SubmissionChart";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { setErrorMess } from "reduxes/AppStatus";
import { PaginationList } from "models/general";
import { GradeExamSubmission } from "models/courseService/entity/ExamEntity";
import dayjs from "dayjs";
import JoyButton from "@mui/joy/Button";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { PieChart } from "@mui/x-charts";

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

  const navigate = useNavigate();
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };

  const tableHeading: GridColDef[] = [
    {
      field: "student_name",
      headerName: `${t("common_fullname")} ${i18next.format(t("common_student"), "lowercase")}`,
      width: 200,
      flex: 1
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
              {params.value === "SUBMITTED"
                ? t("exam_review_status_submitted")
                : t("exam_review_status_not_submitted")}
            </Box>
          </Box>
        );
      },
      flex: 1
    },
    {
      field: "last_submission_time",
      headerName: t("course_lecturer_sub_last_submission_time"),
      flex: 1
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
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
              <JoyButton
                onClick={() => {
                  navigate(
                    routes.lecturer.exam.grading
                      .replace(":courseId", courseId ?? "")
                      .replace(":examId", examId ?? "")
                      .replace(":submissionId", params.row.submission_id)
                  );
                }}
                startDecorator={<EditNoteRoundedIcon />}
                translation-key='course_lecturer_assignment_grading'
                variant='soft'
              >
                {t("course_lecturer_assignment_grading")}
              </JoyButton>
            </Box>
          );
        }
        return null;
      },
      flex: 1
    }
  ];

  const [tableHeadingPlus, setTableHeadingPlus] = useState<GridColDef[]>([]);

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
        <JoyButton
          onClick={() => {
            navigate(
              routes.lecturer.exam.detail
                .replace(":courseId", courseId ?? "")
                .replace(":examId", examId ?? "")
            );
          }}
          startDecorator={<ChevronLeftIcon fontSize='small' />}
          color='neutral'
          variant='soft'
          size='md'
          sx={{ width: "fit-content" }}
        >
          <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
        </JoyButton>
        <Heading1>{examState.examDetail.name}</Heading1>
        <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
          {t("course_lecturer_sub_num_of_student")}: {examState.examOverview.submitted}/
          {examState.examOverview.numberOfStudents}
        </ParagraphBody>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={6}>
            <SubmissionBarChart
              customStyle
              dataset={submissionDataset}
              xAxis={[{ scaleType: "band", dataKey: "range" }]}
              height={500}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6} alignItems={"center"} display={"flex"}>
            <PieChart
              colors={["#3498db", "#e74c3c"]}
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value:
                        examState.examOverview.numberOfStudents -
                          examState.examOverview.submitted || 0,
                      label: t("exam_review_status_not_submitted")
                    },
                    {
                      id: 1,
                      value: examState.examOverview.submitted || 0,
                      label: t("exam_review_status_submitted")
                    }
                  ],
                  innerRadius: 10,
                  cornerRadius: 10
                }
              ]}
              height={300}
              // sx={{
              //   maxWidth: "100%"
              // }}
              // margin={{
              //   left: 0,
              //   right: 0,
              //   top: 0,
              //   bottom: 0
              // }}
              // slotProps={{
              //   legend: {
              //     hidden: true
              //   }
              // }}
            />
          </Grid>
        </Grid>
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
              visibleColumn={visibleColumnList}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              getRowHeight={() => "auto"}
              showVerticalCellBorder={false}
              sx={{
                "&.MuiDataGrid-withBorderColor": {
                  border: "1px solid white"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "white",
                  borderBottom: "2px solid var(--gray-50)"
                },
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "#f5f9fb"
                }
              }}
              personalSx={true}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LecturerCourseExamSubmissions;

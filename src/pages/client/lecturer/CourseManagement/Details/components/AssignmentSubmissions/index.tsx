import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { CircularProgress, Grid } from "@mui/material";
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
import { Link, useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import AssignmentSubmissionFeatureBar from "./components/FeatureBar";
import classes from "./styles.module.scss";
import SubmissionBarChart from "./components/SubmissionChart";
import { useTranslation } from "react-i18next";
import assignment, { setAssignmentDetails } from "reduxes/courseService/assignment";
import { SubmissionAssignmentService } from "services/courseService/SubmissionAssignmentService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSubmissionAssignments } from "reduxes/courseService/submission_assignment";
import { RootState } from "store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AssignmentService } from "services/courseService/AssignmentService";
import CustomFileList from "components/editor/FileUploader/components/CustomFileList";
import { SubmissionAssignmentFileEntity } from "models/courseService/entity/SubmissionAssignmentFileEntity";
import { AssignmentResourceEntity } from "models/courseService/entity/AssignmentResourceEntity";
import { SubmissionAssignmentEntity } from "models/courseService/entity/SubmissionAssignmentEntity";

export enum SubmissionStatusSubmitted {
  SUBMITTED = "Đã nộp",
  NOT_SUBMITTED = "Chưa nộp"
}

export enum SubmissionStatusGraded {
  GRADED = "Đã chấm",
  NOT_GRADED = "Chưa chấm"
}
interface GradeRange {
  student: number;
  [range: string]: number | string;
}
interface SubmissionSummary {
  totalStudents: number;
  submissionsCount: number;
}
const LecturerCourseAssignmentSubmissions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const totalSubmissionCount = 20;
  const totalStudent = 30;
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
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const submissionAssignmentState = useSelector((state: RootState) => state.submissionAssignment);
  const assignmentState = useSelector((state: RootState) => state.assignment);

  const handleGetAssignmentDetails = async (id: string) => {
    try {
      const response = await AssignmentService.getAssignmentById(id);
      dispatch(setAssignmentDetails(response));
    } catch (error) {
      console.log(error);
    }
  };

  const checkTimeSubmission = (): number => {
    let timeClose = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());
    if (!submissionAssignmentState.submissionAssignmentDetails?.submitTime) {
      if (new Date() > timeClose) return 0;
      return 3;
    }
    let submitTime = new Date(
      submissionAssignmentState.submissionAssignmentDetails?.submitTime ?? new Date()
    );
    if (submitTime < timeClose) {
      return 1;
    }
    return 2;
  };

  const handleGetSubmissionAssignmentByAssignment = async (assignmentId: string) => {
    dispatch(setLoading({ isLoading: true }));
    try {
      const response =
        await SubmissionAssignmentService.getSubmissionAssignmentByAssignmentId(assignmentId);
      dispatch(setSubmissionAssignments(response));
      dispatch(setLoading({ isLoading: false }));
    } catch (error) {
      console.error("Failed to fetch submission assignment", error);
      dispatch(setLoading({ isLoading: false }));
    }
  };

  function countStudentsAndSubmissions(
    submissionAssignments: SubmissionAssignmentEntity[]
  ): SubmissionSummary {
    let totalStudents = submissionAssignments.length;
    let submissionsCount = 0;

    submissionAssignments.forEach((assignment) => {
      if (assignment?.submitTime) {
        submissionsCount++;
      }
    });

    return { totalStudents, submissionsCount };
  }
  const { totalStudents, submissionsCount } = countStudentsAndSubmissions(
    submissionAssignmentState.submissionAssignments
  );

  function calculateTimeDifference(
    date1: Date,
    date2: Date
  ): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const diffInMs = date1.getTime() - date2.getTime();

    const msInADay = 24 * 60 * 60 * 1000;
    const msInAnHour = 60 * 60 * 1000;
    const msInAMinute = 60 * 1000;
    const msInASecond = 1000;

    const days = Math.floor(diffInMs / msInADay);
    const hours = Math.floor((diffInMs % msInADay) / msInAnHour);
    const minutes = Math.floor((diffInMs % msInAnHour) / msInAMinute);
    const seconds = Math.floor((diffInMs % msInAMinute) / msInASecond);

    return {
      days: Math.abs(days),
      hours: Math.abs(hours),
      minutes: Math.abs(minutes),
      seconds: Math.abs(seconds)
    };
  }

  const timeCloseDate = new Date(assignmentState.assignmentDetails?.timeClose ?? new Date());
  const submitTimeDate = new Date(
    submissionAssignmentState.submissionAssignmentDetails?.submitTime ?? new Date()
  );
  const submitTime = calculateTimeDifference(timeCloseDate, submitTimeDate);
  const formatTime = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
    if (time.days > 0) {
      return time.days + " " + t("days") + " " + time.hours + " " + t("hours");
    } else if (time.hours > 0) {
      return time.hours + " " + t("hours") + " " + time.minutes + " " + t("minutes");
    } else {
      return time.minutes + " " + t("minutes") + " " + time.seconds + " " + t("seconds");
    }
  };

  useEffect(() => {
    handleGetSubmissionAssignmentByAssignment(assignmentId ?? "");
  }, [assignmentId]);

  const submissionList = submissionAssignmentState?.submissionAssignments.map(
    (submissionAssignment) => {
      return {
        id: submissionAssignment.id,
        student_name: submissionAssignment.user.fullName,
        student_email: submissionAssignment.user.email,
        status: {
          submission_status_submitted: submissionAssignment?.submitTime
            ? SubmissionStatusSubmitted.SUBMITTED
            : SubmissionStatusSubmitted.NOT_SUBMITTED,
          grade_status: submissionAssignment.isGraded
            ? SubmissionStatusGraded.GRADED
            : SubmissionStatusGraded.NOT_GRADED,
          late_submission: {
            is_late: checkTimeSubmission() === 1 ? true : false,
            late_duration: submissionAssignment?.submitTime
              ? formatTime(
                  calculateTimeDifference(
                    new Date(assignmentState.assignmentDetails?.timeClose ?? new Date()),
                    new Date(submissionAssignment.submitTime) ?? new Date()
                  )
                )
              : "-"
          }
        },
        last_submission_time: submissionAssignment?.timemodefied
          ? dayjs(submissionAssignment.timemodefied).format("dddd, D MMMM YYYY, h:mm A")
          : "-",
        last_grade_time: submissionAssignment.submissionGrade
          ? dayjs(submissionAssignment.submissionGrade.timeModified).format(
              "dddd, D MMMM YYYY, h:mm A"
            )
          : "-",
        submission_file:
          submissionAssignment.submissionAssignmentFiles.length != 0
            ? submissionAssignment.submissionAssignmentFiles
            : null,
        submission_online_text: submissionAssignment?.content ? submissionAssignment.content : null,
        grade: {
          grade_status: submissionAssignment.isGraded
            ? SubmissionStatusGraded.GRADED
            : SubmissionStatusGraded.NOT_GRADED,
          current_grade: submissionAssignment.submissionGrade
            ? submissionAssignment.submissionGrade.grade
            : -1,
          max_grade: 100
        },
        feedback: submissionAssignment.feedback ?? ""
      };
    }
  );
  console.log(submissionList);
  const hasOnlineText = submissionList.some((submission) => submission.submission_online_text);
  function addAttributesAndStylesToImages(html: string, className: string, css: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Thêm thuộc tính và class vào các thẻ <img>
    const images = doc.getElementsByTagName("img");
    for (let img of images) {
      img.classList.add(className);
    }

    // Tạo thẻ <style> và thêm CSS
    const style = doc.createElement("style");
    style.textContent = css;
    doc.head.appendChild(style);

    return doc.documentElement.outerHTML;
  }
  const css = `
.custom-class {
    max-width: 100%;
    padding: 10px;
    height: auto;
}
`;
  const tableHeading: GridColDef[] = [
    { field: "student_name", headerName: t("common_fullname"), width: 100 },
    { field: "student_email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: t("common_status"),
      width: 200,
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
                  params.value.grade_status === SubmissionStatusGraded.GRADED
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
      field: "grade",
      headerName: t("common_grade"),
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            <Link
              to={routes.lecturer.assignment.grading
                .replace(":submissionId", params.row.id)
                .replace(":courseId", courseId ?? "")
                .replace(":assignmentId", assignmentId ?? "")}
            >
              <Button btnType={BtnType.Primary}>Chấm điểm</Button>
            </Link>
            <Box
              sx={{
                padding: "5px",
                fontSize: "17px",
                display:
                  params.value.grade_status === SubmissionStatusGraded.GRADED ? "block" : "none"
              }}
            >
              {params.value.current_grade} / {params.value.max_grade}
            </Box>
          </Box>
        );
      }
    },
    ...(hasOnlineText
      ? [
          {
            field: "submission_online_text",
            headerName: t("course_lecturer_sub_online_text"),
            width: 200,
            renderCell: (params: any) => {
              return params.value ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: addAttributesAndStylesToImages(params.value, "custom-class", css)
                  }}
                />
              ) : (
                <Box>-</Box>
              );
            }
          }
        ]
      : []),
    {
      field: "submission_file",
      headerName: t("course_lecturer_sub_file_submission"),
      width: 400,
      renderCell: (params) =>
        params.value ? (
          <Box
            sx={{
              wordWrap: "break-word",
              whiteSpace: "pre-wrap"
            }}
          >
            <CustomFileList
              files={
                params.value.map((attachment: AssignmentResourceEntity) => {
                  let f: File = new File([""], attachment.fileName, {
                    lastModified: new Date(attachment.timemodified).getTime()
                  });
                  return {
                    id: attachment.id,
                    name: attachment.fileName,
                    downloadUrl: attachment.fileUrl,
                    size: attachment.fileSize,
                    type: attachment.mimetype,
                    file: f
                  };
                }) ?? []
              }
              treeView={false}
            />
          </Box>
        ) : (
          <Box>-</Box>
        )
    },
    {
      field: "last_grade_time",
      headerName: t("course_lecturer_sub_last_grading_time"),
      width: 100
    },
    {
      field: "feedback",
      headerName: t("course_lecturer_sub_feedback"),
      width: 200,
      renderCell: (params) => {
        return <div dangerouslySetInnerHTML={{ __html: params.value }} />;
      }
    }
  ];

  function generateGradeRanges(
    submissionAssignments: SubmissionAssignmentEntity[],
    maxScore: number
  ): GradeRange[] {
    const gradeRanges: GradeRange[] = [];
    const ranges = [
      { start: 10, end: 40 },
      { start: 41, end: 60 },
      { start: 61, end: 80 },
      { start: 81, end: 100 }
    ];

    ranges.forEach((range) => {
      const start = (range.start / 100) * maxScore;
      const end = (range.end / 100) * maxScore;
      const rangeString = `${start.toFixed(2)} - ${end.toFixed(2)}`;

      // Calculate student count within this range
      const studentCount = submissionAssignments.filter((assignment) => {
        if (assignment?.submissionGrade && assignment.isGraded) {
          const grade = assignment.submissionGrade.grade;
          return grade >= start && grade <= end;
        }
        return false;
      }).length;

      const gradeRange: GradeRange = {
        student: studentCount,
        range: rangeString
      };

      gradeRanges.push(gradeRange);
    });

    return gradeRanges;
  }
  const [submissionDataset, setSubmissionDataset] = useState<GradeRange[]>([]);
  console.log(generateGradeRanges(submissionAssignmentState.submissionAssignments, 100));

  useEffect(() => {
    setSubmissionDataset(generateGradeRanges(submissionAssignmentState.submissionAssignments, 100));
  }, [submissionAssignmentState.submissionAssignments]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(
            routes.lecturer.assignment.detail
              .replace(":courseId", courseId ?? "")
              .replace(":assignmentId", assignmentId ?? "")
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
      <Heading1>Bài tập trắc nghiệm 1</Heading1>
      <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
        {t("course_lecturer_sub_num_of_student")}: {submissionsCount}/{totalStudents}
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Heading1 translation-key='course_lecturer_submission_list'>
            {t("course_lecturer_submission_list")}
          </Heading1>
        </Grid>
        <Grid item xs={12}>
          <AssignmentSubmissionFeatureBar />
        </Grid>
        {submissionAssignmentState.isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "10px"
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
        )}
      </Grid>
    </Box>
  );
};

export default LecturerCourseAssignmentSubmissions;

import { Box, Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import StudentCourseGradeAssignment from "./components/CourseResource";
import { ECourseResourceType } from "models/courseService/course";
import GradeSummary from "./components/GradeSummary";
import CustomDataGrid from "components/common/CustomDataGrid";
import { GridRowParams } from "@mui/x-data-grid";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AssignmentService } from "services/courseService/AssignmentService";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { AssignmentGradeEntity } from "models/courseService/entity/AssignmentGradeEntity";
import { AllAssignmentGradeEntity } from "models/courseService/entity/AllAssignmentGradeEntity";
import { useSelector } from "react-redux";
import { RootState } from "store";
const StudentCourseGrade = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const courseState = useSelector((state: RootState) => state.course);
  const { loggedUser } = useAuth();
  const [assignmentList, setAssignmentList] = useState<AllAssignmentGradeEntity | null>(null);
  const getAssignmentGradeByStudent = async (courseId: string, userId: string) => {
    try {
      const response = await AssignmentService.getAssignmentGradeByStudent(courseId, userId);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedUser?.userId && courseId) {
      getAssignmentGradeByStudent(courseId, loggedUser.userId).then((response) => {
        setAssignmentList(response);
      });
    }
  }, [courseId, loggedUser]);

  const courseAssignmentList = assignmentList
    ? assignmentList.assignments?.map((assignment) => {
        return {
          id: assignment.id,
          item: assignment.title,
          type:
            assignment.type === "ASSIGNMENT"
              ? ECourseResourceType.assignment
              : ECourseResourceType.file,
          weight: assignment.maxScore,
          grade: assignment.grade ? assignment.grade : undefined,
          range: assignment.maxScore,
          percentage: (assignment.grade / assignment.maxScore) * 100,
          feedback: assignment.feedback
        };
      })
    : [];
  console.log(courseAssignmentList);
  // const courseAssignmentList = [
  //   {
  //     id: 1,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài tập 1",
  //     weight: 0,
  //     grade: undefined,
  //     range: 100,
  //     percentage: 10
  //   },
  //   {
  //     id: 2,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài tập 2",
  //     weight: 0,
  //     grade: 10,
  //     range: 100
  //   },
  //   {
  //     id: 3,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài tập 3",
  //     weight: 0,
  //     grade: 10,
  //     range: 100
  //   },
  //   {
  //     id: 4,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài kiểm tra 1",
  //     weight: 0,
  //     grade: 10,
  //     range: 100
  //   },
  //   {
  //     id: 5,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài kiểm tra 2",
  //     weight: 0,
  //     grade: 10,
  //     range: 100
  //   },
  //   {
  //     id: 6,
  //     type: ECourseResourceType.assignment,
  //     item: "Bài kiểm tra 3",
  //     weight: 0,
  //     grade: 10,
  //     range: 100
  //   }
  // ];

  const tableHeading: GridColDef[] = [
    { field: "id", headerName: "STT", minWidth: 1 },
    {
      field: "item",
      headerName: t("course_grade_grid_topic"),
      width: 200,
      flex: 0.2,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Link component={RouterLink} to={`${params.row.id}`}>
          <StudentCourseGradeAssignment name={params.value} type={params.row.type} />
        </Link>
      )
    },
    {
      field: "type",
      headerName: t("course_grade_topic_type"),
      minWidth: 1,
      flex: 0.2,
      renderCell: (params) => (
        <Typography>
          {params.value === ECourseResourceType.assignment
            ? "Bài tập"
            : params.value === ECourseResourceType.file
              ? "File"
              : "URL"}
        </Typography>
      )
    },

    {
      field: "weight",
      headerName: t("course_grade_weight"),
      minWidth: 50,
      disableColumnMenu: true,
      flex: 0.2
    },
    {
      field: "grade",
      headerName: t("common_grade"),
      minWidth: 50,
      disableColumnMenu: true,
      flex: 0.2,
      renderCell: (params: any) => (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          {Number(params.value) ? (
            <Typography fontSize={18}>{params.value}</Typography>
          ) : (
            <Typography fontSize={18}>_</Typography>
          )}
          /{params.row.range}
        </Box>
      )
    },
    {
      field: "range",
      headerName: t("course_grade_range"),
      minWidth: 50,
      disableColumnMenu: true,
      flex: 0.2,
      renderCell: (params: any) => (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          {Number(params.value) ? params.value : "_"}
        </Box>
      )
    },
    {
      field: "percentage",
      headerName: t("common_percentage"),
      minWidth: 50,
      disableColumnMenu: true,
      flex: 0.2,
      renderCell: (params: any) => (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          {Number(params.value) ? `${params.value}%` : "_"}
        </Box>
      )
    },
    {
      field: "feedback",
      headerName: t("course_grade_response"),
      minWidth: 200,
      disableColumnMenu: true,
      flex: 0.2,
      renderCell: (params: any) =>
        params?.value ? <div dangerouslySetInnerHTML={{ __html: params.value }} /> : "-"
    }
  ];

  const visibleColumnList = { id: false, type: true, item: true, grade: true, weight: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <Grid container spacing={1} className={classes.gridContainer}>
      <Grid item xs={12}>
        <Heading1 translation-key='course_grade_title'>{t("course_grade_title")}</Heading1>
      </Grid>
      <Grid item xs={12}>
        <GradeSummary
          title={courseState?.courseDetail?.name}
          average={0}
          submitted={assignmentList?.countSubmission}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          dataList={courseAssignmentList}
          tableHeader={tableHeading}
          onSelectData={rowSelectionHandler}
          visibleColumn={visibleColumnList}
          dataGridToolBar={dataGridToolbar}
          page={page}
          pageSize={pageSize}
          totalElement={totalElement}
          onPaginationModelChange={pageChangeHandler}
          showVerticalCellBorder={true}
          onClickRow={rowClickHandler}
        />
      </Grid>
    </Grid>
  );
};

export default StudentCourseGrade;

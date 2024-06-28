import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Grid, IconButton, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { GridColumnMenu, GridRowParams } from "@mui/x-data-grid";
import { GridColumnMenuItemProps } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenuItemProps";
import { GridColumnMenuProps } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenuProps";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef, GridRowSelectionModel, GridPaginationModel } from "@mui/x-data-grid";
import Heading1 from "components/text/Heading1";
import CustomDataGrid from "components/common/CustomDataGrid";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { AssignmentService } from "services/courseService/AssignmentService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StudentAssignmentList } from "models/courseService/entity/StudentAssignmentList";
import { useParams } from "react-router-dom";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";

function CustomAssignmentEdit(props: GridColumnMenuItemProps) {
  const { customEditHandler, customEditValue } = props;

  return (
    <MenuItem onClick={customEditHandler}>
      <ListItemIcon>
        <EditIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText>{customEditValue}</ListItemText>
    </MenuItem>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  const { t } = useTranslation();
  const currentColField = props.colDef.field;

  const canHaveCustomColMenu =
    currentColField !== "name" && currentColField !== "id" && currentColField !== "email";
  return canHaveCustomColMenu ? (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuUserItem: CustomAssignmentEdit
      }}
      slotProps={{
        columnMenuUserItem: {
          displayOrder: 0,
          customEditValue: t("common_edit"),
          customEditHandler: () => alert("Custom handler fired")
        }
      }}
      translation-key='common_edit'
    />
  ) : (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuUserItem: null
      }}
      slotProps={{
        columnMenuSortItem: {
          value: t("data_grid_row_ascending")
        }
      }}
      translation-key='data_grid_row_ascending'
    />
  );
}

const LecturerCourseGrade = () => {
  const { t } = useTranslation();
  const [studentAssignmentGrades, setStudentAssignmentGrades] =
    useState<StudentAssignmentList | null>(null);
  const [isLoadingStudentAssignmentGrades, setIsLoadingStudentAssignmentGrades] =
    useState<boolean>(false);

  const { courseId } = useParams<{ courseId: string }>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "role",
      value: t("common_all")
    }
  ]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(
    () => studentAssignmentGrades?.totalItems || 0,
    [studentAssignmentGrades?.totalItems]
  );

  const handleGetRetrieveStudentAssignmentGrades = useCallback(
    async ({
      search,
      pageNo = 0,
      pageSize = 10,
      courseId
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
      courseId: string;
    }) => {
      setIsLoadingStudentAssignmentGrades(true);
      try {
        const response = await AssignmentService.getRetrieveStudentAssignmentGrades(courseId, {
          search,
          pageNo,
          pageSize
        });
        console.log(response);
        setStudentAssignmentGrades(response);
      } catch (error) {
        console.log(error);
      }
      setIsLoadingStudentAssignmentGrades(false);
    },
    []
  );

  useEffect(() => {
    if (courseId) {
      handleGetRetrieveStudentAssignmentGrades({ courseId: courseId });
    }
  }, [courseId, handleGetRetrieveStudentAssignmentGrades]);

  // Transform API data for DataGrid
  const courseAssignmentList =
    studentAssignmentGrades?.assignments.map((assignment, index) => {
      return {
        id: index,
        name: assignment.name,
        range: assignment.maxGrade
      };
    }) || [];

  const tableHeading: GridColDef[] = [
    { field: "id", headerName: "STT", minWidth: 1 },
    {
      field: "name",
      headerName: t("common_fullname"),
      width: 100,
      flex: 0.2,
      disableColumnMenu: true
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 100,
      disableColumnMenu: true,
      flex: 0.2
    }
  ];

  courseAssignmentList.forEach((assignment) =>
    tableHeading.push({
      field: `${assignment.id}-${assignment.name}`,
      headerName: assignment.name,
      renderCell: (params: any) => (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          {params.value !== null
            ? `${params.value} / ${assignment.range}`
            : `- / ${assignment.range}`}
          <IconButton sx={{ marginLeft: "auto" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
      flex: 0.2
    })
  );

  const participantList =
    studentAssignmentGrades?.students.map((student, index) => {
      const studentData: any = {
        id: index,
        name: student.fullName,
        email: student.email
      };
      student.grades.forEach((grade, i) => {
        studentData[`${i}-${courseAssignmentList[i].name}`] = grade;
      });
      return studentData;
    }) || [];

  const visibleColumnList = { id: false, name: true, email: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetRetrieveStudentAssignmentGrades({
        search: value,
        courseId: courseId ? courseId : ""
      });
    },
    [handleGetRetrieveStudentAssignmentGrades, courseId]
  );

  const handleApplyFilter = useCallback(() => {
    // handleGetCourseUser({
    //   search: searchValue
    // });
  }, [searchValue]);

  const handleCancelFilter = useCallback(() => {
    // handleGetCourseUser({
    //   search: searchValue
    // });
  }, [searchValue]);
  return (
    <Box className={classes.gradeBody}>
      <Grid item xs={12}>
        <Heading1 translation-key='course_grade_title'>{t("course_grade_title")}</Heading1>
      </Grid>
      <Grid item xs={12}>
        <CustomSearchFeatureBar
          isLoading={isLoadingStudentAssignmentGrades}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onHandleChange={handleSearchChange}
          numOfResults={totalElement}
          filterKeyList={[
            {
              label: t("common_role"),
              value: "role"
            }
          ]}
          filterValueList={{
            role: [
              {
                label: t("common_all"),
                value: t("common_all")
              }
            ]
          }}
          filters={filters}
          handleChangeFilters={(newFilters: { key: string; value: string }[]) => {
            setFilters(newFilters);
          }}
          onHandleApplyFilter={handleApplyFilter}
          onHandleCancelFilter={handleCancelFilter}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          loading={isLoadingStudentAssignmentGrades}
          dataList={participantList}
          tableHeader={tableHeading}
          onSelectData={rowSelectionHandler}
          visibleColumn={visibleColumnList}
          dataGridToolBar={dataGridToolbar}
          page={page}
          pageSize={pageSize}
          totalElement={totalElement}
          onPaginationModelChange={pageChangeHandler}
          showVerticalCellBorder={true}
          customColumnMenu={CustomColumnMenu}
          onClickRow={rowClickHandler}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--blue-5)"
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "var(--blue-5)"
            }
          }}
          personalSx={true}
        />
      </Grid>
    </Box>
  );
};

export default LecturerCourseGrade;

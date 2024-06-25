import { Box, CircularProgress, Grid } from "@mui/material";
import Link from "@mui/material/Link";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CourseParticipantFeatureBar from "./components/FeatureBar";
import CustomDataGrid from "components/common/CustomDataGrid";
import { GridRowParams } from "@mui/x-data-grid";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useEffect, useState } from "react";
import { CourseUserService } from "services/courseService/CourseUserService";
import { setLoading, setCourseUser } from "reduxes/courseService/courseUser";

const StudentCourseParticipant = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const courseUserState = useSelector((state: RootState) => state.courseUser);
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { courseId } = useParams<{ courseId: string }>();
  const handleGetCourseUser = async ({
    search = searchText,
    pageNo = currentPage,
    pageSize = rowsPerPage
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    if (!courseId || (courseId === courseUserState.courseId && courseUserState.users.length > 0)) {
      return;
    }

    dispatch(setLoading(true));
    try {
      const getCourseUserResponse = await CourseUserService.getUserByCourseId(courseId, {
        search,
        pageNo,
        pageSize
      });
      dispatch(
        setCourseUser({
          users: getCourseUserResponse.data,
          currentPage: getCourseUserResponse.currentPage,
          totalItems: getCourseUserResponse.totalItems,
          totalPages: getCourseUserResponse.totalPages,
          courseId: courseId
        })
      );
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Failed to fetch course user", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleGetCourseUser({ search: searchText });
  }, [searchText]);

  const { t } = useTranslation();

  const tableHeading: GridColDef[] = [
    { field: "id", headerName: "STT", minWidth: 1 },
    {
      field: "name",
      headerName: t("common_fullname"),
      width: 200,
      flex: 0.8,
      renderCell: (params) => (
        <Link component={RouterLink} to={`${params.row.id}`}>
          {params.value}
        </Link>
      )
    },
    { field: "email", headerName: "Email", width: 200, flex: 0.8 },
    { field: "roles", headerName: t("common_role"), width: 50, flex: 0.4 }
  ];
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setCurrentPage(model.page);
    setRowsPerPage(model.pageSize);
    handleGetCourseUser({ search: searchText, pageNo: model.page, pageSize: model.pageSize });
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Heading1 translation-key='course_participant_title'>
          {t("course_participant_title")}
        </Heading1>
      </Grid>
      <Grid item xs={12}>
        <CourseParticipantFeatureBar />
      </Grid>

      {!courseUserState.isLoading ? (
        <Grid item xs={12}>
          <CustomDataGrid
            dataList={courseUserState.users.map((user, index) => ({
              id: user.userId,
              name: user.firstName + " " + user.lastName,
              email: user.email,
              roles: user.role
            }))}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            visibleColumn={visibleColumnList}
            dataGridToolBar={dataGridToolbar}
            getRowClassName={(params) => {
              return params.row.id === 0 ? "even-row" : "odd-row";
            }}
            page={currentPage}
            pageSize={rowsPerPage}
            totalElement={courseUserState.totalItems}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={false}
            onClickRow={rowClickHandler}
          />
        </Grid>
      ) : (
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
      )}
    </Grid>
  );
};

export default StudentCourseParticipant;

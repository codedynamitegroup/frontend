import { Grid, Paper } from "@mui/material";
import Link from "@mui/material/Link";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CourseParticipantFeatureBar from "./components/FeatureBar";
import CustomDataGrid from "components/common/CustomDataGrid";
import { GridRowParams } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StudentCourseParticipant = () => {
  const { t } = useTranslation();
  const participantList = [
    {
      id: 4,
      name: "Trương Gia Tiến",
      email: "truongtien577@gmail.com",
      roles: "Giảng viên"
    },
    { id: 2, name: "Đặng Ngọc Tiến", email: "dnt@gmail.com", roles: "Giảng viên" },
    { id: 3, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: "Sinh viên" },
    { id: 1, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: "Sinh viên" },
    { id: 5, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: "Sinh viên" },
    { id: 6, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: "Sinh viên" },
    { id: 7, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: "Sinh viên" }
  ];
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
  ) => {
    console.log(selectedRowId);
  };
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
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Heading1 translation-key='course_participant_title'>
          {t("course_participant_title")}
        </Heading1>
      </Grid>
      <Grid item xs={12}>
        <CourseParticipantFeatureBar />
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          dataList={participantList}
          tableHeader={tableHeading}
          onSelectData={rowSelectionHandler}
          visibleColumn={visibleColumnList}
          dataGridToolBar={dataGridToolbar}
          page={page}
          pageSize={pageSize}
          totalElement={totalElement}
          onPaginationModelChange={pageChangeHandler}
          showVerticalCellBorder={false}
          onClickRow={rowClickHandler}
        />
      </Grid>
    </Grid>
  );
};

export default StudentCourseParticipant;

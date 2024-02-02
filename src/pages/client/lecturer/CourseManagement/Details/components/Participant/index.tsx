import { Box, Grid, Paper } from "@mui/material";
import Link from "@mui/material/Link";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridActionsCellItem } from "@mui/x-data-grid/components/cell/GridActionsCellItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CourseParticipantFeatureBar from "./components/FeatureBar";
import CustomDataGrid from "components/common/CustomDataGrid";

const LecturerCourseParticipant = () => {
  const participantList = [
    {
      id: 4,
      name: "Trương Gia Tiến",
      email: "truongtien577@gmail.com",
      roles: "JD"
    },
    { id: 2, name: "Đặng Ngọc Tiến", email: "dnt@gmail.com", roles: 2 },
    { id: 3, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: 3 },
    { id: 1, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: 3 },
    { id: 5, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: 3 },
    { id: 6, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: 3 },
    { id: 7, name: "Nguyễn Quốc Tuấn", email: "nqt@gmail.com", roles: 3 }
  ];
  const tableHeading: GridColDef[] = [
    { field: "id", headerName: "STT", minWidth: 1 },
    {
      field: "name",
      headerName: "First name / Last name",
      width: 200,
      flex: 0.8,
      renderCell: (params) => <Link href={`${params.row.id}`}>{params.value}</Link>
    },
    { field: "email", headerName: "Email address", width: 200, flex: 0.8 },
    { field: "roles", headerName: "Roles", width: 50, flex: 0.4 },
    {
      field: "action",
      headerName: "Actions",
      type: "actions",
      width: 200,
      flex: 0.5,
      getActions: () => [
        <GridActionsCellItem icon={<EditIcon />} label='Edit' />,
        <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />
      ]
    }
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

  return (
    <Box className={classes.participantBody}>
      <Grid item xs={12}>
        <Heading1>Danh sách thành viên</Heading1>
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
        />
      </Grid>
    </Box>
  );
};

export default LecturerCourseParticipant;

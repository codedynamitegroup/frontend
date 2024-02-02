import { Box, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, Paper } from "@mui/material";
import Link from "@mui/material/Link";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import EditIcon from "@mui/icons-material/Edit";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CustomDataGrid from "../../../../../../../components/common/CustomDataGrid";
import { GridColumnGroupingModel } from "@mui/x-data-grid/models/gridColumnGrouping";
import { GridColumnMenuProps } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenuProps";
import { GridColumnMenuItemProps } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenuItemProps";
import { GridColumnMenu } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CourseGradeFeatureBar from "./components/FeatureBar";

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
          customEditValue: "Chỉnh sửa",
          customEditHandler: () => alert("Custom handler fired")
        }
      }}
    />
  ) : (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuUserItem: null
      }}
      slotProps={{
        columnMenuSortItem: {
          value: "Tăng dần"
        }
      }}
    />
  );
}

const LecturerCourseGrade = () => {
  const courseAssignmentList = [
    { id: 1, name: "Test 1", range: 100 },
    { id: 2, name: "Very Long Test 2 Name", range: 10 },
    { id: 3, name: "Very Test 2 Name", range: 10 },
    { id: 4, name: "Very 2 Name", range: 10 },
    { id: 5, name: "Very Name", range: 10 },
    { id: 6, name: "Very Name", range: 10 }
  ];
  const groupChildren = courseAssignmentList.map((assignment) => {
    return { field: `${assignment.id}-${assignment.name}` };
  });
  const tableHeading: GridColDef[] = [
    { field: "id", headerName: "STT", minWidth: 1 },
    {
      field: "name",
      headerName: "First name / Last name",
      width: 100,
      flex: 0.2,
      disableColumnMenu: true,
      renderCell: (params) => <Link href={`${params.row.id}`}>{params.value}</Link>
    },
    {
      field: "email",
      headerName: "Email address",
      minWidth: 100,
      disableColumnMenu: true,
      flex: 0.2
    }
  ];
  courseAssignmentList.map((assignment) =>
    tableHeading.push({
      field: `${assignment.id}-${assignment.name}`,
      headerName: assignment.name,
      renderCell: (params: any) => (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Link href={`${params.row.id}`}>
            {params.value} /{assignment.range}
          </Link>
          <IconButton sx={{ marginLeft: "auto" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
      flex: 0.2
    })
  );
  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "score",
      headerName: "Điểm",
      description: "Điểm thành phần của từng khóa học",
      freeReordering: true,
      children: groupChildren
    }
  ];

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
    <Box className={classes.gradeBody}>
      <Grid item xs={12}>
        <Heading1>Báo cáo điểm</Heading1>
      </Grid>
      <Grid item xs={12}>
        <CourseGradeFeatureBar />
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
          columnGroupingModel={columnGroupingModel}
          showVerticalCellBorder={true}
          customColumnMenu={CustomColumnMenu}
        />
      </Grid>
    </Box>
  );
};

export default LecturerCourseGrade;

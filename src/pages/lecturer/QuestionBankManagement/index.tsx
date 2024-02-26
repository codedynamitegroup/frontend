import {
  Box,
  Tab,
  TabProps,
  Stack,
  Grid,
  Container,
  Button as MButton,
  Divider
} from "@mui/material";

import Typography from "@mui/joy/Typography";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Heading1 from "components/text/Heading1";
import Heading6 from "components/text/Heading6";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  GridToolbarContainer
} from "@mui/x-data-grid";
import Button from "@mui/joy/Button";
import SearchBar from "components/common/search/SearchBar";
import { red, grey } from "@mui/material/colors";

const CustomTab = styled((props: TabProps) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",

  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1)
}));
const rows = [
  {
    id: 1,
    category: "Học thuật toán",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: 2,
    category: "Java",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: 3,
    category: "Mảng 1 chiều",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: 4,
    category: "Mảng 2 chiều",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: 5,
    category: "Con trỏ",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  }
];
// function EditToolbar() {
//   return (
//     <GridToolbarContainer>
//       <Box>
//         <MButton color='primary' startIcon={<AddIcon />}>
//           Thêm mới
//         </MButton>
//         <Divider />
//       </Box>
//     </GridToolbarContainer>
//   );
// }

const QuestionBankManagement = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [value, setValue] = useState("1");
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: rows,
    total: 0,
    page: 1,
    pageSize: 5
  });
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      sortable: false,
      width: 20,
      align: "center",
      headerClassName: "qbm-class"
    },
    {
      field: "category",
      headerName: "Tên danh mục",
      sortable: false,
      flex: 3,
      headerClassName: "qbm-class"
    },
    {
      field: "created",
      headerName: "Ngày tạo bởi",
      sortable: false,
      flex: 3,
      renderCell: (params) => (
        <div>
          <div>{params.row.createdAtBy.name}</div>
          <div>{params.row.createdAtBy.time}</div>
        </div>
      ),
      headerClassName: "qbm-class"
    },
    {
      field: "updated",
      headerName: "Lần chỉnh sửa cuối bởi",
      sortable: false,
      flex: 3,
      renderCell: (params) => (
        <div>
          <div>{params.row.updatedAtBy.name}</div>
          <div>{params.row.updatedAtBy.time}</div>
        </div>
      ),
      headerClassName: "qbm-class"
    },
    {
      field: "operation",
      headerName: "Tác vụ",
      sortable: false,
      flex: 1,
      type: "actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Save'
            sx={{
              color: "primary.main"
            }}
            onClick={() => null}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Cancel'
            className='textPrimary'
            onClick={() => null}
            sx={{
              color: red[500]
            }}
          />
        ];
      },
      headerClassName: "qbm-class"
    }
  ];
  useEffect(() => {
    //fetch data
  }, [pageState.page, pageState.pageSize]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [assignmentTypes, setAssignmentTypes] = useState(["Tự luận", "Nộp tệp"]);

  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label='lab API tabs'>
            <CustomTab label='Chung' value='1' />
            <CustomTab label='Cá nhân' value='2' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Container maxWidth='xl'>
            <Stack spacing={2}>
              <Typography level='h1'>Ngân hàng câu hỏi chung</Typography>

              <Grid container spacing={1}>
                <Grid item xs={12} md={2}>
                  <Button
                    size='lg'
                    variant='outlined'
                    sx={{ fontSize: "120%", display: "block" }}
                    fullWidth
                  >
                    Thêm mới
                  </Button>
                </Grid>
              </Grid>

              <SearchBar onSearchClick={() => null} placeHolder='Tìm kiếm theo danh mục ...' />
              <DataGrid
                sx={{
                  zIndex: 0,
                  "& .MuiDataGrid-columnHeader": { backgroundColor: grey[100] }
                }}
                autoHeight
                rows={pageState.data}
                rowCount={pageState.total}
                loading={pageState.isLoading}
                paginationModel={{ page: pageState.page, pageSize: pageState.pageSize }}
                onPaginationModelChange={(model, details) => {
                  setPageState((old) => ({ ...old, page: model.page, pageSize: model.pageSize }));
                }}
                columns={columns}
                pageSizeOptions={[5, 10, 30, 50]}
                paginationMode='server'
                disableColumnFilter
                // slots={{
                //   toolbar: EditToolbar
                // }}
              />
            </Stack>
          </Container>
        </TabPanel>
        <TabPanel value='2'>Item Two</TabPanel>
      </TabContext>
    </Box>
  );
};

export default QuestionBankManagement;

import { Box, Stack, Grid, Container, Button as MButton, Divider } from "@mui/material";

import Typography from "@mui/joy/Typography";

import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener
} from "@mui/x-data-grid";
import Button from "@mui/joy/Button";
import SearchBar from "components/common/search/SearchBar";
import { red, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

const rows = [
  {
    id: "abc",
    category: "Học thuật toán",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: "abc2",
    category: "Java",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: "abc3",
    category: "Mảng 1 chiều",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: "abc4",
    category: "Mảng 2 chiều",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" }
  },
  {
    id: "abc5",
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
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: rows,
    total: 0,
    page: 1,
    pageSize: 5
  });
  const columns: GridColDef[] = [
    {
      field: "stt",
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
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`${params.row.id}`);
  };

  return (
    <div>
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
                "& .MuiDataGrid-columnHeader": { backgroundColor: grey[100] }
              }}
              autoHeight
              rows={pageState.data.map((item, index) => ({ stt: index + 1, ...item }))}
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
              onRowClick={handleRowClick}
              // slots={{
              //   toolbar: EditToolbar
              // }}
            />
          </Stack>
        </Container>
      </TabPanel>
      <TabPanel value='2'>Item Two</TabPanel>
    </div>
  );
};

export default QuestionBankManagement;

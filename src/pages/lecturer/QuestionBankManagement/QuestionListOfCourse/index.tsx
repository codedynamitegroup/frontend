import { useParams } from "react-router-dom";
import { Box, Stack, Grid, Container, Button as MButton, Divider } from "@mui/material";

import Typography from "@mui/joy/Typography";

import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
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
    id: 1,
    questionName: "Con trỏ là gì?",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" },
    qtype: "Nhiều lựa chọn"
  },
  {
    id: 2,
    questionName: "Stack và Queue là gì?",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" },
    qtype: "Tự luận"
  }
];
const QuestionListOfCourse = () => {
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
      field: "questionName",
      headerName: "Tên câu hỏi",
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
      field: "qtype",
      headerName: "Phân loại",
      sortable: false,
      flex: 1,
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
          <GridActionsCellItem icon={<PreviewIcon />} label='Preview' onClick={() => null} />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => null}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
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
    console.log(params);
    // navigate(`${params.row.id}`);
  };

  const [assignmentTypes, setAssignmentTypes] = useState(["Tự luận", "Nộp tệp"]);
  const urlParams = useParams();
  console.log(urlParams);
  return (
    <div>
      <TabPanel value='1'>
        <Container maxWidth='xl'>
          <Stack spacing={2}>
            <Typography level='h1'>Học thuật toán</Typography>

            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <Button
                  size='lg'
                  variant='outlined'
                  sx={{ fontSize: "120%", display: "block" }}
                  fullWidth
                >
                  Export câu hỏi ra file
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  size='lg'
                  variant='outlined'
                  sx={{ fontSize: "120%", display: "block" }}
                  fullWidth
                >
                  Thêm câu hỏi
                </Button>
              </Grid>
            </Grid>

            <SearchBar onSearchClick={() => null} placeHolder='Nhập tên câu hỏi ...' />
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
              // onRowClick={handleRowClick}
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

export default QuestionListOfCourse;

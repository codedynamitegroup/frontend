import { useMatches, useParams } from "react-router-dom";
import {
  Box,
  Stack,
  Grid,
  Container,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  Avatar
} from "@mui/material";

import Typography from "@mui/joy/Typography";

import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState, useRef } from "react";

import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener
} from "@mui/x-data-grid";
import { Textarea } from "@mui/joy";

import SearchBar from "components/common/search/SearchBar";
import { red, grey } from "@mui/material/colors";
import { useNavigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { routes } from "routes/routes";
import Button, { BtnType } from "components/common/buttons/Button";

import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import PickQuestionTypeToAddDialog from "pages/lecturer/ExamManagemenent/CreateExam/components/PickQuestionTypeToAddDialog";
import qtype from "utils/constant/Qtype";
import Heading1 from "components/text/Heading1";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import AccessedUserListItem, { AccessLevel } from "./component/AccessedUserListItem";

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
    questionName: "Stack và Queue llllllllllllllllllllllllllllllà gì?",
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
      sortable: false,
      width: 20,
      align: "center",
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.stt}</ParagraphBody>;
      },
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>STT</ParagraphBody>;
      }
    },
    {
      field: "questionName",
      sortable: false,
      flex: 3,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.questionName}</ParagraphBody>;
      },
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>Tên câu hỏi</ParagraphBody>;
      }
    },
    {
      field: "created",
      sortable: false,
      flex: 3,
      renderCell: (params) => (
        <div>
          <ParagraphBody>{params.row.createdAtBy.name}</ParagraphBody>
          <div>{params.row.createdAtBy.time}</div>
        </div>
      ),
      headerClassName: classes["table-head"],
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>Ngày tạo bởi</ParagraphBody>;
      }
    },
    {
      field: "updated",
      sortable: false,
      flex: 3,
      renderCell: (params) => (
        <div>
          <ParagraphBody>{params.row.updatedAtBy.name}</ParagraphBody>
          <div>{params.row.updatedAtBy.time}</div>
        </div>
      ),
      headerClassName: classes["table-head"],
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>Lần chỉnh sửa bởi</ParagraphBody>;
      }
    },
    {
      field: "qtype",
      sortable: false,
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.qtype}</ParagraphBody>;
      },
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>Phân loại</ParagraphBody>;
      }
    },
    {
      field: "operation",
      sortable: false,
      flex: 2,
      type: "actions",
      cellClassName: "actions",
      renderHeader: (params) => {
        return <ParagraphBody fontWeight={700}>Tác vụ</ParagraphBody>;
      },
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<PreviewIcon />}
            label='Preview'
            onClick={() => setOpenPreviewEssay(true)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              setIsAddingQuestion(true);
              setIsAddNewQuestionDialogOpen(false);
              navigate(`update/${typeToCreateNewQuestion}`);
            }}
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
      headerClassName: classes["table-head"]
    }
  ];

  useEffect(() => {
    //fetch data
  }, [pageState.page, pageState.pageSize]);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.reset === true) setIsAddingQuestion(false);
  }, [location]);

  useEffect(() => {
    const handlePopstate = () => setIsAddingQuestion(false);

    // Đăng ký sự kiện popstate
    window.addEventListener("popstate", handlePopstate);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    console.log(params);
    // navigate(`${params.row.id}`);
  };
  const handleCreateQuestion = () => {
    setIsAddingQuestion(true);
    setIsAddNewQuestionDialogOpen(false);
    navigate(`create/${typeToCreateNewQuestion}`);
  };

  const [assignmentTypes, setAssignmentTypes] = useState(["Tự luận", "Nộp tệp"]);
  const urlParams = useParams();
  console.log(urlParams);
  const [isAddNewQuestionDialogOpen, setIsAddNewQuestionDialogOpen] = useState(false);
  const [typeToCreateNewQuestion, setTypeToCreateNewQuestion] = useState(qtype.essay.code);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [openPreviewEssay, setOpenPreviewEssay] = useState(false);
  const matches = useMatches();
  // console.log(matches);
  const [value, setValue]: any[] = useOutletContext();
  const [initialized, setInitialized] = useState(true);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);

  useEffect(() => {
    setIsAddingQuestion(false);
    if (initialized) {
      setInitialized(false);
    } else {
      navigate("/lecturer/question-bank-management");
    }
  }, [value]);
  return (
    <div>
      <PickQuestionTypeToAddDialog
        open={isAddNewQuestionDialogOpen}
        handleClose={() => setIsAddNewQuestionDialogOpen(false)}
        title='Chọn kiểu câu hỏi muốn thêm'
        cancelText='Hủy bỏ'
        confirmText='Thêm'
        onHanldeConfirm={handleCreateQuestion}
        onHandleCancel={() => setIsAddNewQuestionDialogOpen(false)}
        questionType={typeToCreateNewQuestion}
        handleChangeQuestionType={setTypeToCreateNewQuestion}
      />
      <PreviewEssay
        open={openPreviewEssay}
        setOpen={setOpenPreviewEssay}
        aria-labelledby={"customized-dialog-title2"}
        maxWidth='md'
        fullWidth
      />
      {isAddingQuestion && <Outlet />}
      {!isAddingQuestion && (
        <TabPanel value='1' sx={{ padding: 0 }}>
          <Box className={classes.tabWrapper}>
            <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
              <span onClick={() => navigate(`/${routes.lecturer.question_bank.path}`)}>
                Ngân hàng câu hỏi
              </span>{" "}
              {"> "}
              <span onClick={() => navigate(".")}>Học thuật toán</span>
            </ParagraphBody>
          </Box>
          <Container>
            <Stack spacing={2} marginBottom={3} paddingTop={1}>
              <Heading1 fontWeight={500}>Học thuật toán</Heading1>
              <Typography>Thông tin danh mục: các bài tập về thuật toán</Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <Button btnType={BtnType.Primary}>
                  <ParagraphBody paddingX={3}>Export câu hỏi ra file</ParagraphBody>
                </Button>
                <Button
                  btnType={BtnType.Primary}
                  onClick={() => setIsAddNewQuestionDialogOpen(true)}
                >
                  <ParagraphBody paddingX={3}> Thêm câu hỏi</ParagraphBody>
                </Button>
              </Stack>

              <SearchBar onSearchClick={() => null} placeHolder='Nhập tên câu hỏi ...' />
              <DataGrid
                sx={{
                  "& .MuiDataGrid-cell": { padding: "16px" }
                }}
                autoHeight
                getRowHeight={() => "auto"}
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
                hideFooterSelectedRowCount
                // onRowClick={handleRowClick}
                // slots={{
                //   toolbar: EditToolbar
                // }}
              />
            </Stack>
          </Container>
        </TabPanel>
      )}
      {!isAddingQuestion && (
        <TabPanel value='2' sx={{ padding: 0 }}>
          <Box className={classes.tabWrapper}>
            <ParagraphBody className={classes.breadCump} colorName='--gray-50' fontWeight={"600"}>
              <span onClick={() => navigate(`/${routes.lecturer.question_bank.path}`)}>
                Ngân hàng câu hỏi
              </span>{" "}
              {"> "}
              <span onClick={() => navigate(".")}>Học OOP</span>
            </ParagraphBody>
          </Box>
          <Container>
            <Stack spacing={2} marginBottom={3} paddingTop={1}>
              <Heading1 fontWeight={500}>Học OOP</Heading1>
              <Typography>Thông tin danh mục: các bài tập về OOP</Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <Button btnType={BtnType.Primary}>
                  <ParagraphBody paddingX={3}>Export câu hỏi ra file</ParagraphBody>
                </Button>
                <Button
                  btnType={BtnType.Primary}
                  onClick={() => setIsAddNewQuestionDialogOpen(true)}
                >
                  <ParagraphBody paddingX={3}> Thêm câu hỏi</ParagraphBody>
                </Button>
              </Stack>

              <Stack direction='row' justifyContent='space-between'>
                <SearchBar onSearchClick={() => null} placeHolder='Nhập tên câu hỏi ...' />
                <Button btnType={BtnType.Primary} onClick={() => setOpenAccessDialog(true)}>
                  <ParagraphBody paddingX={3}>Quyền truy cập</ParagraphBody>
                </Button>
              </Stack>
              <DataGrid
                sx={{
                  "& .MuiDataGrid-cell": { padding: "16px" }
                }}
                autoHeight
                getRowHeight={() => "auto"}
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
                hideFooterSelectedRowCount
                // onRowClick={handleRowClick}
                // slots={{
                //   toolbar: EditToolbar
                // }}
              />
            </Stack>
          </Container>
          <Dialog
            aria-labelledby='assess-list-dialog'
            open={openAccessDialog}
            onClose={() => setOpenAccessDialog(false)}
            maxWidth='sm'
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
              Danh sách quyền truy cập
            </DialogTitle>
            <IconButton
              aria-label='close'
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
              onClick={() => setOpenAccessDialog(false)}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Textarea minRows={1} placeholder='Thêm người' />
                <ParagraphBody>Những người có quyền truy cập</ParagraphBody>
                <Stack spacing={1}>
                  <AccessedUserListItem
                    email='nguyenquoctuan385@gmail.com'
                    avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                    name='Nguyễn Quốc Tuấn'
                    accessLevel={AccessLevel.OWNER}
                  />
                  <AccessedUserListItem
                    email='nguyenquoctuan385@gmail.com'
                    avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                    name='Nguyễn Quốc Tuấn'
                    accessLevel={AccessLevel.EDITOR}
                  />
                  <AccessedUserListItem
                    email='nguyenquoctuan385@gmail.com'
                    avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                    name='Nguyễn Quốc Tuấn'
                    accessLevel={AccessLevel.EDITOR}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                btnType={BtnType.Primary}
                onClick={() => setOpenAccessDialog(false)}
                fullWidth
              >
                <ParagraphBody> Lưu</ParagraphBody>
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
      )}
    </div>
  );
};

export default QuestionListOfCourse;

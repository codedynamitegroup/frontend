import { Box, Stack, Grid, Container } from "@mui/material";

import Typography from "@mui/joy/Typography";

import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState, useRef } from "react";

import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
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
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import qtype from "utils/constant/Qtype";
import Heading1 from "components/text/Heading1";
import Heading5 from "components/text/Heading5";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import AccessedUserListDialog from "./component/AccessedUserListDialog";
import PickQuestionTypeToAddDialog from "../../ExamManagemenent/CreateExam/components/PickQuestionTypeToAddDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { QuestionService } from "services/coreService/QuestionService";
import { setQuestionsCategory } from "reduxes/coreService/questionCategory";

const rows = [
  {
    id: 1,
    questionName: "Con trỏ là gì?",
    createdAtBy: { name: "Nguyễn Quốc Tuấn", time: "02/12/2023 10:30AM" },
    updatedAtBy: { name: "Dương Chí Thông", time: "05/12/2023 10:30PM" },
    qtype: "Tự luận"
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
  const [searchText, setSearchText] = useState("");
  const dispath = useDispatch<AppDispatch>();
  const questionState = useSelector((state: RootState) => state.question);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };

  const handleGetQuestions = async (
    categoryId: string,
    {
      search = searchText,
      pageNo = page,
      pageSize = rowsPerPage
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
    }
  ) => {
    try {
      const getQuestionResponse = await QuestionService.getQuestionsByCategoryId(categoryId, {
        search,
        pageNo,
        pageSize
      });
      dispath(setQuestionsCategory(getQuestionResponse));
      console.log(getQuestionResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("fetching data" + questionState.questions);
    const fetchInitialQuestions = async () => {
      await handleGetQuestions("e6354740-c3f5-4f76-be0b-ea8bb16aa51e", { search: searchText });
    };
    fetchInitialQuestions();
  }, [searchText]);


  const { t } = useTranslation();
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: rows,
    total: 0,
    page: 1,
    pageSize: 5
  });
  const columnsProps: GridColDef[] = [
    {
      field: "stt",
      sortable: false,
      width: 20,
      align: "center",
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.stt}</ParagraphBody>;
      }
    },
    {
      field: "questionName",
      sortable: false,
      flex: 3,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.questionName}</ParagraphBody>;
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
      headerClassName: classes["table-head"]
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
      headerClassName: classes["table-head"]
    },
    {
      field: "qtype",
      sortable: false,
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.qtype}</ParagraphBody>;
      }
    },
    {
      field: "operation",
      sortable: false,
      flex: 2,
      type: "actions",
      cellClassName: "actions",

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
  const addHeaderNameByLanguage = (
    columns: GridColDef[],
    headerName: Array<String>
  ): GridColDef[] => {
    return headerName.map(
      (value, index) =>
        (columns[index] = {
          ...columns[index],
          renderHeader: (params) => {
            return <ParagraphBody fontWeight={700}>{value}</ParagraphBody>;
          }
        })
    );
  };
  const headerName = t("question_bank_category_question_list_header_table", {
    returnObjects: true
  }) as Array<String>;
  const columns = addHeaderNameByLanguage(columnsProps, headerName);

  useEffect(() => {
    //fetch data
  }, [pageState.page, pageState.pageSize]);

  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    console.log(params);
    // navigate(`${params.row.id}`);
  };
  const urlParams = useParams();
  const handleCreateQuestion = () => {
    setIsAddNewQuestionDialogOpen(false);
    navigate(`create/${typeToCreateNewQuestion}`);
  };

  const handleCreateQuestionAI = () => {
    navigate(`ai/create`);
  };

  const [assignmentTypes, setAssignmentTypes] = useState(["Tự luận", "Nộp tệp"]);

  const [isAddNewQuestionDialogOpen, setIsAddNewQuestionDialogOpen] = useState(false);
  const [typeToCreateNewQuestion, setTypeToCreateNewQuestion] = useState(qtype.essay.code);
  const [openPreviewEssay, setOpenPreviewEssay] = useState(false);
  const { value, setValue }: any = useOutletContext();
  const [initialized, setInitialized] = useState(true);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);

  useEffect(() => {
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
        transaltion-key='question_bank_add_question_title'
        title={t("question_bank_add_question_title")}
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
      <TabPanel value='1' sx={{ padding: 0 }}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
            <span
              onClick={() => navigate(routes.lecturer.question_bank.path)}
              translation-key='common_question_bank'
            >
              {i18next.format(t("common_question_bank"), "firstUppercase")}
            </span>{" "}
            {"> "}
            <span onClick={() => navigate(".")}>Học thuật toán</span>
          </ParagraphBody>
        </Box>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>Học thuật toán</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}: các bài tập về OOP
            </Heading5>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button btnType={BtnType.Primary}>
                <ParagraphBody paddingX={3} translation-key='common_data_export'>
                  {t("common_data_export")}
                </ParagraphBody>
              </Button>
              <Button btnType={BtnType.Primary} onClick={() => setIsAddNewQuestionDialogOpen(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_question'>
                  {" "}
                  {t("common_add_question")}
                </ParagraphBody>
              </Button>
              <Button btnType={BtnType.Outlined} onClick={handleCreateQuestionAI}>
                <ParagraphBody
                  paddingX={3}
                  translation-key='question_bank_category_question_list_create_by_AI'
                >
                  {t("question_bank_category_question_list_create_by_AI")}
                </ParagraphBody>
              </Button>
            </Stack>

            <SearchBar
              onSearchClick={() => null}
              translation-key='question_bank_category_question_list_enter_question_name'
              placeHolder={`${t("question_bank_category_question_list_enter_question_name")} ...`}
            />
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
      <TabPanel value='2' sx={{ padding: 0 }}>
        <Box className={classes.tabWrapper}>
          <ParagraphBody className={classes.breadCump} colorname='--gray-50' fontWeight={"600"}>
            <span
              onClick={() => navigate(routes.lecturer.question_bank.path)}
              translation-key='common_question_bank'
            >
              {i18next.format(t("common_question_bank"), "firstUppercase")}
            </span>{" "}
            {"> "}
            <span onClick={() => navigate(".")}>Học OOP</span>
          </ParagraphBody>
        </Box>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>Học OOP</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}: các bài tập về OOP
            </Heading5>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button btnType={BtnType.Primary}>
                <ParagraphBody paddingX={3} translation-key='common_data_export'>
                  {t("common_data_export")}
                </ParagraphBody>
              </Button>
              <Button btnType={BtnType.Primary} onClick={() => setIsAddNewQuestionDialogOpen(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_question'>
                  {t("common_add_question")}
                </ParagraphBody>
              </Button>
              <Button btnType={BtnType.Outlined} onClick={handleCreateQuestionAI}>
                <ParagraphBody
                  paddingX={3}
                  translation-key='question_bank_category_question_list_create_by_AI'
                >
                  {t("question_bank_category_question_list_create_by_AI")}
                </ParagraphBody>
              </Button>
            </Stack>

            <Stack direction='row' justifyContent='space-between'>
              <SearchBar
                onSearchClick={() => null}
                translation-key='question_bank_category_question_list_enter_question_name'
                placeHolder={`${t("question_bank_category_question_list_enter_question_name")} ...`}
              />
              <Button btnType={BtnType.Primary} onClick={() => setOpenAccessDialog(true)}>
                <ParagraphBody paddingX={3} translation-key='question_bank_access_right'>
                  {t("question_bank_access_right")}
                </ParagraphBody>
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
        <AccessedUserListDialog
          aria-labelledby='assess-list-dialog'
          open={openAccessDialog}
          setOpenAccessDialog={setOpenAccessDialog}
          maxWidth='sm'
          fullWidth
        />
      </TabPanel>
    </div>
  );
};

export default QuestionListOfCourse;

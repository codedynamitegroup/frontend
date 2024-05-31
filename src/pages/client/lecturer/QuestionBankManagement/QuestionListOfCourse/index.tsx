import { Box, Stack, Container } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridActionsCellItem, GridEventListener } from "@mui/x-data-grid";
import SearchBar from "components/common/search/SearchBar";
import { red } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
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
import { setCategoryDetails } from "reduxes/courseService/questionBankCategory";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import dayjs from "dayjs";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";

const QuestionListOfCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoryState = useSelector((state: RootState) => state.questionBankCategory);
  const questionCategoryState = useSelector((state: RootState) => state.questionCategory);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isAddNewQuestionDialogOpen, setIsAddNewQuestionDialogOpen] = useState(false);
  const [typeToCreateNewQuestion, setTypeToCreateNewQuestion] = useState(qtype.essay.code);
  const [openPreviewEssay, setOpenPreviewEssay] = useState(false);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: questionCategoryState.questions,
    total: questionCategoryState.totalItems,
    page: 0,
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
        return <ParagraphBody>{params.row.name}</ParagraphBody>;
      }
    },
    {
      field: "created",
      sortable: false,
      flex: 3,
      renderCell: (params) => (
        <div>
          <ParagraphBody>
            {params.row.createdBy.firstName} {params.row.createdBy.lastName}
          </ParagraphBody>
          <div>{dayjs(params.row.createdAt).format("DD/MM/YYYY")}</div>
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
          <ParagraphBody>
            {params.row.updatedBy.firstName} {params.row.updatedBy.lastName}
          </ParagraphBody>
          <div>{dayjs(params.row.updatedAt).format("DD/MM/YYYY")}</div>
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

  const handleSearch = async (searchText: string) => {
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
      dispatch(setQuestionsCategory(getQuestionResponse));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetCategory = async (categoryId: string) => {
    try {
      const getCategoryResponse =
        await QuestionBankCategoryService.getQuestionBankCategoryById(categoryId);
      dispatch(setCategoryDetails(getCategoryResponse));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    console.log(params);
    // navigate(`${params.row.id}`);
  };
  const handleCreateQuestion = () => {
    setIsAddNewQuestionDialogOpen(false);
    navigate(`create/${typeToCreateNewQuestion}`);
  };

  const handleCreateQuestionAI = () => {
    navigate(`ai/create`);
  };

  useEffect(() => {
    const fetchInitialCategory = async () => {
      if (categoryId) {
        await handleGetQuestions(categoryId, {
          search: searchText,
          pageNo: page,
          pageSize: rowsPerPage
        });
        await handleGetCategory(categoryId);
      }
    };
    fetchInitialCategory();
  }, [categoryId, searchText, page, rowsPerPage]);

  useEffect(() => {
    setRowsPerPage(pageState.pageSize);
    setPage(pageState.page);
    if (categoryId) {
      handleGetQuestions(categoryId, { search: searchText, pageNo: page, pageSize: rowsPerPage });
      handleGetCategory(categoryId);
    }
    setPageState((old) => ({
      ...old,
      data: questionCategoryState.questions,
      total: questionCategoryState.totalItems
    }));
  }, [pageState.page, pageState.pageSize]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (categoryId) {
        await handleGetQuestions(categoryId, {
          search: searchText,
          pageNo: page,
          pageSize: rowsPerPage
        });
        await handleGetCategory(categoryId);
      }
      setPageState(() => ({
        isLoading: false,
        data: questionCategoryState.questions,
        total: questionCategoryState.totalItems,
        page: page,
        pageSize: rowsPerPage
      }));
    };

    fetchInitialData();
  }, [categoryId, searchText]);

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
            <span onClick={() => navigate(".")}>{categoryState.categoryDetails?.name}</span>
          </ParagraphBody>
        </Box>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>{categoryState.categoryDetails?.name}</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}:{" "}
              {categoryState.categoryDetails?.description}
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
              onSearchClick={handleSearch}
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
                setPageState((old) => ({
                  ...old,
                  data: pageState.data.map((item, index) => ({
                    stt: index + 1,
                    qtypeText:
                      item.qtype === QuestionTypeEnum.ESSAY
                        ? "Câu hỏi tự luận"
                        : item.qtype === QuestionTypeEnum.MULTIPLE_CHOICE
                          ? "Câu hỏi nhiều đáp án"
                          : item.qtype === QuestionTypeEnum.SHORT_ANSWER
                            ? "Câu hỏi ngắn"
                            : "Code",
                    ...item
                  })),
                  total: pageState.total,
                  page: model.page,
                  pageSize: model.pageSize
                }));
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
            <span onClick={() => navigate(".")}>{categoryState.categoryDetails?.name}</span>
          </ParagraphBody>
        </Box>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>{categoryState.categoryDetails?.name}</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}:{" "}
              {categoryState.categoryDetails?.description}
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

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import TabPanel from "@mui/lab/TabPanel";
import { Container, Stack } from "@mui/material";
import { red } from "@mui/material/colors";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridEventListener,
  GridPaginationModel,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Button, { BtnType } from "components/common/buttons/Button";
import CustomDataGrid from "components/common/CustomDataGrid";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";
import PreviewCodeQuestion from "components/dialog/preview/PreviewCodeQuestion";
import PreviewEssay from "components/dialog/preview/PreviewEssay";
import PreviewMultipleChoice from "components/dialog/preview/PreviewMultipleChoice";
import PreviewShortAnswer from "components/dialog/preview/PreviewShortAnswer";
import PreviewTrueFalse from "components/dialog/preview/PreviewTrueFalse";
import Heading1 from "components/text/Heading1";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import dayjs from "dayjs";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { setLoading, setQuestionsCategory } from "reduxes/coreService/questionCategory";
import { setCategoryDetails } from "reduxes/courseService/questionBankCategory";
import { routes } from "routes/routes";
import { QuestionService } from "services/coreService/QuestionService";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import { AppDispatch, RootState } from "store";
import qtype from "utils/constant/Qtype";
import AccessedUserListDialog from "./component/AccessedUserListDialog";
import PickQuestionTypeToAddDialog from "./component/PickQuestionTypeToAddDialog";
import classes from "./styles.module.scss";

const QuestionListOfCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoryState = useSelector((state: RootState) => state.questionBankCategory);
  const questionCategoryState = useSelector((state: RootState) => state.questionCategory);
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isAddNewQuestionDialogOpen, setIsAddNewQuestionDialogOpen] = useState(false);
  const [typeToCreateNewQuestion, setTypeToCreateNewQuestion] = useState(qtype.essay.code);
  const [openPreviewEssay, setOpenPreviewEssay] = useState(false);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);
  const [openPreviewShortAnswer, setOpenPreviewShortAnswer] = React.useState(false);
  const [openPreviewTrueFalse, setOpenPreviewTrueFalse] = React.useState(false);
  const [openPreviewMultipleChoiceDialog, setOpenPreviewMultipleChoiceDialog] =
    React.useState(false);
  const [questionPreview, setQuestionPreview] = React.useState<QuestionEntity>();
  const dataGridToolbar = { enableToolbar: true };
  const [previewQuestionId, setPreviewQuestionId] = React.useState<string>("");
  const [openPreviewCodeQuestion, setOpenPreviewCodeQuestion] = React.useState(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = React.useState<QuestionEntity | null>(null);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

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
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.name}</ParagraphBody>;
      }
    },
    {
      field: "description",
      sortable: false,
      flex: 3,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return (
          <ParagraphBody>
            <div dangerouslySetInnerHTML={{ __html: params.row.questionText ?? "" }}></div>
          </ParagraphBody>
        );
      }
    },
    {
      field: "qtype",
      sortable: false,
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.qtypeText}</ParagraphBody>;
      }
    },
    {
      field: "created",
      sortable: false,
      flex: 2,
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
      flex: 2,
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
      field: "operation",
      sortable: false,
      flex: 2,
      type: "actions",
      cellClassName: "actions",

      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<PreviewIcon />}
            label='Preview'
            onClick={() => {
              setPreviewQuestionId(params.row.id);
              switch (params.row.qtype) {
                case qtype.multiple_choice.code:
                  setOpenPreviewMultipleChoiceDialog(!openPreviewMultipleChoiceDialog);
                  break;
                case qtype.essay.code:
                  setOpenPreviewEssay(!openPreviewEssay);
                  break;
                case qtype.short_answer.code:
                  setQuestionPreview(params.row);
                  setOpenPreviewShortAnswer(!openPreviewShortAnswer);
                  break;
                case qtype.true_false.code:
                  setOpenPreviewTrueFalse(!openPreviewTrueFalse);
                  break;
                case qtype.source_code.code:
                  setOpenPreviewCodeQuestion(!openPreviewCodeQuestion);
                  break;
              }
            }}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: "primary.main"
            }}
            onClick={() => {
              navigate(
                `edit/${
                  params.row.qtype === "CODE"
                    ? "code-question"
                    : params.row.qtype === "MULTIPLE_CHOICE"
                      ? "multiple-choice-question"
                      : params.row.qtype === "ESSAY"
                        ? "essay-question"
                        : params.row.qtype === "TRUE_FALSE"
                          ? "true-false-question"
                          : params.row.qtype === "SHORT_ANSWER"
                            ? "short-answer-question"
                            : ""
                }/${params.row.id}`,
                {
                  state: {
                    isQuestionBank: true,
                    categoryName: categoryState.categoryDetails?.name
                  }
                }
              );
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            className='textPrimary'
            onClick={() => {
              setIsOpenConfirmDelete(true);
              setQuestionToDelete(params.row);
            }}
            // handleDeleteQuestion.bind(null, params.row.id.toString())}
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

  const handleGetQuestions = async ({
    categoryId,
    isOrgQuestionBank = categoryState.tab === "1" ? true : false,
    search = searchText,
    pageNo = page,
    pageSize = rowsPerPage
  }: {
    categoryId: string;
    isOrgQuestionBank?: boolean;
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      dispatch(setLoading(true));
      const getQuestionResponse = await QuestionService.getQuestionsByCategoryId({
        categoryId,
        isOrgQuestionBank,
        search,
        pageNo,
        pageSize
      });
      dispatch(setQuestionsCategory(getQuestionResponse));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Failed to fetch questions by category id", error);
      dispatch(setLoading(false));
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

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const deleteQuestionResponse = await QuestionService.deleteQuestionById(questionId);
      if (deleteQuestionResponse) {
        handleGetQuestions({
          categoryId: categoryId || "",
          search: searchText,
          pageNo: page,
          pageSize: rowsPerPage
        });
        dispatch(setSuccessMess("Delete question successfully"));
      }
    } catch (error) {
      console.error("Failed to delete question", error);
      dispatch(setErrorMess("Failed to delete question"));
    }
  };

  const onDeleteConfirmDelete = () => {
    try {
      if (questionToDelete) {
        handleDeleteQuestion(questionToDelete.id);
      }
      setIsOpenConfirmDelete(false);
    } catch (error) {
      setIsOpenConfirmDelete(false);
    }
  };

  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setRowsPerPage(model.pageSize);
    if (categoryId) {
      handleGetQuestions({
        categoryId,
        isOrgQuestionBank: categoryState.tab === "1" ? true : false,
        search: searchText,
        pageNo: page,
        pageSize: rowsPerPage
      });
    }
  };

  // const handleRowClick: GridEventListener<"rowClick"> = (params) => {
  // console.log(params);
  // navigate(`${params.row.id}`);
  // };
  const handleCreateQuestion = () => {
    setIsAddNewQuestionDialogOpen(false);

    const tab = categoryState.tab === "1" ? true : false;

    navigate(`create/${typeToCreateNewQuestion}`, {
      state: {
        isLecturerCreateQuestionBank: true,
        isQuestionBank: true,
        isOrgQuestionBank: tab,
        categoryName: categoryState.categoryDetails?.name
      }
    });
  };

  useEffect(() => {
    if (categoryId) {
      handleGetCategory(categoryId);
      handleGetQuestions({
        categoryId,
        isOrgQuestionBank: categoryState.tab === "1" ? true : false,
        search: searchText,
        pageNo: page,
        pageSize: rowsPerPage
      });
    }
  }, [categoryId, searchText, page, rowsPerPage, categoryState.tab]);

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
      {openPreviewMultipleChoiceDialog && (
        <PreviewMultipleChoice
          questionId={previewQuestionId}
          open={openPreviewMultipleChoiceDialog}
          setOpen={setOpenPreviewMultipleChoiceDialog}
          aria-labelledby={"customized-dialog-title1"}
          maxWidth='md'
          fullWidth
        />
      )}
      {openPreviewEssay && (
        <PreviewEssay
          questionId={previewQuestionId}
          open={openPreviewEssay}
          setOpen={setOpenPreviewEssay}
          aria-labelledby={"customized-dialog-title2"}
          maxWidth='md'
          fullWidth
        />
      )}

      {openPreviewShortAnswer && (
        <PreviewShortAnswer
          open={openPreviewShortAnswer}
          questionId={previewQuestionId}
          setOpen={setOpenPreviewShortAnswer}
          aria-labelledby={"customized-dialog-title3"}
          maxWidth='md'
          fullWidth
        />
      )}

      {openPreviewTrueFalse && (
        <PreviewTrueFalse
          questionId={previewQuestionId}
          open={openPreviewTrueFalse}
          setOpen={setOpenPreviewTrueFalse}
          aria-labelledby={"customized-dialog-title4"}
          maxWidth='md'
          fullWidth
        />
      )}

      {openPreviewCodeQuestion && (
        <PreviewCodeQuestion
          questionId={previewQuestionId}
          open={openPreviewCodeQuestion}
          setOpen={setOpenPreviewCodeQuestion}
          aria-labelledby={"customized-dialog-title5"}
          maxWidth='md'
          fullWidth
        />
      )}

      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this question?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />

      <TabPanel value='1' sx={{ padding: 0 }}>
        <Container>
          <CustomBreadCrumb
            breadCrumbData={[
              {
                label:
                  t("common_question_bank").charAt(0).toUpperCase() +
                  t("common_question_bank").slice(1),
                navLink: routes.lecturer.question_bank.path
              }
            ]}
            lastBreadCrumbLabel={categoryState.categoryDetails?.name ?? ""}
          />
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>{categoryState.categoryDetails?.name}</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}:{" "}
              <ReactQuill
                value={categoryState.categoryDetails?.description || ""}
                readOnly={true}
                theme={"bubble"}
              />
            </Heading5>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button btnType={BtnType.Primary} onClick={() => setIsAddNewQuestionDialogOpen(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_question'>
                  {" "}
                  {t("common_add_question")}
                </ParagraphBody>
              </Button>
              {/* <Button btnType={BtnType.Outlined} onClick={handleCreateQuestionAI}>
                <ParagraphBody
                  paddingX={3}
                  translation-key='question_bank_category_question_list_create_by_AI'
                >
                  {t("question_bank_category_question_list_create_by_AI")}
                </ParagraphBody>
              </Button> */}
            </Stack>

            <CustomAutocomplete
              isLoading={false}
              translation-key='question_bank_category_question_list_enter_question_name'
              placeHolder={`${t("question_bank_category_question_list_enter_question_name")} ...`}
              value={searchText}
              setValue={setSearchText}
              options={[]}
              onHandleChange={handleSearch}
            />
            <CustomDataGrid
              sx={{
                "& .MuiDataGrid-cell": {
                  border: "none"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f9fb"
                },
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "#f5f9fb"
                }
              }}
              dataList={questionCategoryState.questions.map((item, index) => ({
                stt: index + 1,
                qtypeText:
                  item.qtype === QuestionTypeEnum.SHORT_ANSWER
                    ? "câu hỏi ngắn"
                    : item.qtype === QuestionTypeEnum.MULTIPLE_CHOICE
                      ? "câu hỏi trắc nghiệm"
                      : item.qtype === QuestionTypeEnum.ESSAY
                        ? "câu hỏi tự luận"
                        : item.qtype === QuestionTypeEnum.TRUE_FALSE
                          ? "câu hỏi đúng/sai"
                          : item.qtype === QuestionTypeEnum.CODE
                            ? "câu hỏi code"
                            : "",
                ...item
              }))}
              tableHeader={columns}
              onSelectData={rowSelectionHandler}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={questionCategoryState.totalItems}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
              // onClickRow={handleRowClick}
            />
          </Stack>
        </Container>
      </TabPanel>
      <TabPanel value='2' sx={{ padding: 0 }}>
        {/* <Box className={classes.tabWrapper}>
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
        </Box> */}
        <Container>
          <CustomBreadCrumb
            breadCrumbData={[
              {
                label:
                  t("common_question_bank").charAt(0).toUpperCase() +
                  t("common_question_bank").slice(1),
                navLink: routes.lecturer.question_bank.path
              }
            ]}
            lastBreadCrumbLabel={categoryState.categoryDetails?.name ?? ""}
          />

          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={500}>{categoryState.categoryDetails?.name}</Heading1>
            <Heading5
              fontStyle={"italic"}
              fontWeight={"400"}
              colorname='--gray-50'
              translation-key='question_bank_create_category_info'
            >
              {t("question_bank_create_category_info")}:{" "}
              <ReactQuill
                value={categoryState.categoryDetails?.description || ""}
                readOnly={true}
                theme={"bubble"}
              />
            </Heading5>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              {/* <Button btnType={BtnType.Primary}>
                <ParagraphBody paddingX={3} translation-key='common_data_export'>
                  {t("common_data_export")}
                </ParagraphBody>
              </Button> */}
              <Button btnType={BtnType.Primary} onClick={() => setIsAddNewQuestionDialogOpen(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_question'>
                  {t("common_add_question")}
                </ParagraphBody>
              </Button>
              {/* <Button btnType={BtnType.Outlined} onClick={handleCreateQuestionAI}>
                <ParagraphBody
                  paddingX={3}
                  translation-key='question_bank_category_question_list_create_by_AI'
                >
                  {t("question_bank_category_question_list_create_by_AI")}
                </ParagraphBody>
              </Button> */}
            </Stack>

            {/* <Stack direction='row' justifyContent='space-between'>
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
            </Stack> */}
            <CustomAutocomplete
              isLoading={false}
              translation-key='question_bank_category_question_list_enter_question_name'
              placeHolder={`${t("question_bank_category_question_list_enter_question_name")} ...`}
              value={searchText}
              setValue={setSearchText}
              options={[]}
              onHandleChange={handleSearch}
            />
            <CustomDataGrid
              sx={{
                "& .MuiDataGrid-cell": {
                  border: "none"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f9fb"
                },
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "#f5f9fb"
                }
              }}
              dataList={questionCategoryState.questions.map((item, index) => ({
                stt: index + 1,
                ...item
              }))}
              tableHeader={columns}
              onSelectData={rowSelectionHandler}
              dataGridToolBar={dataGridToolbar}
              pageSize={rowsPerPage}
              page={page}
              totalElement={questionCategoryState.totalItems}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
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

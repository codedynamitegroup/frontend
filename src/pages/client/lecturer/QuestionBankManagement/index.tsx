import {
  Stack,
  Container,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridActionsCellItem, GridEventListener } from "@mui/x-data-grid";
import SearchBar from "components/common/search/SearchBar";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import classes from "./styles.module.scss";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "reduxes/courseService/questionBankCategory";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import dayjs from "dayjs";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";

const QuestionBankManagement = () => {
  const [searchText, setSearchText] = useState("");
  const dispath = useDispatch<AppDispatch>();
  const questionBankCategoriesState = useSelector((state: RootState) => state.questionBankCategory);
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
  };

  const handleGetQuestionBankCategories = async ({
    search = searchText,
    pageNo = page,
    pageSize = rowsPerPage
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      const getQuestionBankCategoryResponse =
        await QuestionBankCategoryService.getQuestionBankCategories({
          search,
          pageNo,
          pageSize
        });
      dispath(setCategories(getQuestionBankCategoryResponse));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      await QuestionBankCategoryService.updateQuestionBankCategory({
        id: selectedRowData?.id || "",
        name: dataEdit?.name || "",
        description: dataEdit?.description || ""
      });
      handleGetQuestionBankCategories({ search: searchText });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    try {
      await QuestionBankCategoryService.createQuestionBankCategory({
        name: dataCreate?.name || "",
        description: dataCreate?.description || "",
        createdBy: "8c98e9e1-a9e7-49ee-b9fd-0cb5bd7814f7"
      });
      handleGetQuestionBankCategories({ search: searchText });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await QuestionBankCategoryService.deleteQuestionBankCategory(id);
      handleGetQuestionBankCategories({ search: searchText });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialQuestionBankCategories = async () => {
      await handleGetQuestionBankCategories({ search: searchText });
    };
    fetchInitialQuestionBankCategories();
  }, [searchText]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    handleGetQuestionBankCategories({
      search: searchText,
      pageNo: 0,
      pageSize: +event.target.value
    });
  };

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const { t } = useTranslation();
  const [pageState, setPageState] = useState({
    page: page,
    pageSize: rowsPerPage
  });

  const [selectedRowData, setSelectedRowData] = useState<QuestionBankCategoryEntity>();
  const [dataEdit, setDataEdit] = useState<QuestionBankCategoryEntity>(
    {} as QuestionBankCategoryEntity
  );
  const [dataCreate, setDataCreate] = useState<QuestionBankCategoryEntity>(
    {} as QuestionBankCategoryEntity
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const columnsProps: GridColDef[] = [
    {
      field: "stt",
      sortable: false,
      flex: 0.7,
      align: "center",
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.stt}</ParagraphBody>;
      }
    },
    {
      field: "category",
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
          <ParagraphBody>{params.row.createdByName}</ParagraphBody>
          <div>{dayjs(params.row.createdAt).format("DD/MM/YYYY HH:mm")}</div>
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
          <ParagraphBody>{params.row.updatedByName}</ParagraphBody>
          <div>{dayjs(params.row.updatedAt).format("DD/MM/YYYY HH:mm")}</div>
        </div>
      ),
      headerClassName: classes["table-head"]
    },
    {
      field: "operation",
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
            onClick={() => {
              const selectedCategory =
                questionBankCategoriesState.categories.questionBankCategories.find(
                  (item) => item.id === id
                );
              if (selectedCategory) {
                setSelectedRowData(selectedCategory);
                setDataEdit(selectedCategory);
                setOpenEditDialog(true);
              }
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Cancel'
            className='textPrimary'
            onClick={() => {
              handleDeleteCategory(id as string);
            }}
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
  const headerName = t("question_bank_category_header_table", {
    returnObjects: true
  }) as Array<String>;
  const columns = addHeaderNameByLanguage(columnsProps, headerName);
  useEffect(() => {
    handleGetQuestionBankCategories({
      search: searchText,
      pageNo: pageState.page,
      pageSize: pageState.pageSize
    });
  }, [pageState.page, pageState.pageSize, searchText]);
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`${params.row.id}`);
  };

  return (
    <div>
      <TabPanel value='1' className={classes["tab-panel"]}>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={"500"} translation-key='common_question_bank'>
              {i18next.format(t("common_question_bank"), "firstUppercase")}
            </Heading1>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button btnType={BtnType.Primary} onClick={() => setOpenCreateDialog(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_new'>
                  {i18next.format(t("common_add_new"), "firstUppercase")}
                </ParagraphBody>
              </Button>
            </Stack>

            <CustomAutocomplete
              // ={searchHandle}
              placeHolder={`${t("question_bank_category_find_by_category")} ...`}
              translation-key='question_bank_category_find_by_category'
              value={searchText}
              setValue={setSearchText}
              options={[]}
              onHandleChange={searchHandle}
            />
            <DataGrid
              sx={{
                "& .MuiDataGrid-cell": { padding: "16px" },
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer"
                }
              }}
              translation-key-header='question_bank_category_header_table'
              autoHeight
              disableColumnMenu
              getRowHeight={() => "auto"}
              rows={questionBankCategoriesState.categories.questionBankCategories.map(
                (item, index) => ({
                  stt: index + 1,
                  ...item
                })
              )}
              rowCount={questionBankCategoriesState.categories.totalItems}
              loading={questionBankCategoriesState.isLoading}
              paginationModel={{
                page: page,
                pageSize: rowsPerPage
              }}
              onPaginationModelChange={(model, details) => {
                setPageState((old) => ({ ...old, page: model.page, pageSize: model.pageSize }));
                setPage(model.page);
                setRowsPerPage(model.pageSize);
              }}
              columns={columns}
              pageSizeOptions={[5, 10, 30, 50]}
              paginationMode='server'
              disableColumnFilter
              onRowClick={handleRowClick}
              hideFooterSelectedRowCount
              localeText={{
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count, page }) => {
                    return t("common_table_from_to", { from: from, to: to, countText: count });
                  },
                  labelRowsPerPage: t("common_table_row_per_page")
                }
              }}
              // slots={{
              //   toolbar: EditToolbar
              // }}
            />
          </Stack>
        </Container>
      </TabPanel>
      <TabPanel value='2' className={classes["tab-panel"]}>
        <Container>
          <Stack spacing={2} marginBottom={3} paddingTop={1}>
            <Heading1 fontWeight={"500"} translation-key='common_question_bank'>
              {i18next.format(t("common_question_bank"), "firstUppercase")}
            </Heading1>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Button btnType={BtnType.Primary} onClick={() => setOpenCreateDialog(true)}>
                <ParagraphBody paddingX={3} translation-key='common_add_new'>
                  {i18next.format(t("common_add_new"), "firstUppercase")}
                </ParagraphBody>
              </Button>
            </Stack>

            <SearchBar
              onSearchClick={() => null}
              placeHolder={`${t("question_bank_category_find_by_category")} ...`}
              translation-key='question_bank_category_find_by_category'
            />
            <DataGrid
              sx={{
                "& .MuiDataGrid-cell": { padding: "16px" },
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer"
                }
              }}
              autoHeight
              disableColumnMenu
              getRowHeight={() => "auto"}
              rows={questionBankCategoriesState.categories.questionBankCategories.map(
                (item: QuestionBankCategoryEntity, index: number) => ({
                  stt: index + 1,
                  ...item
                })
              )}
              rowCount={questionBankCategoriesState.categories.totalItems}
              loading={questionBankCategoriesState.isLoading}
              paginationModel={{
                page: questionBankCategoriesState.categories.currentPage,
                pageSize: questionBankCategoriesState.categories.totalPages
              }}
              onPaginationModelChange={(model, details) => {
                setPageState((old) => ({ ...old, page: model.page, pageSize: model.pageSize }));
              }}
              columns={columns}
              pageSizeOptions={[5, 10, 30, 50]}
              paginationMode='server'
              disableColumnFilter
              onRowClick={handleRowClick}
              hideFooterSelectedRowCount
              localeText={{
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count, page }) => {
                    return t("common_table_from_to", { from: from, to: to, countText: count });
                  },
                  labelRowsPerPage: t("common_table_row_per_page")
                }
              }}
              // slots={{
              //   toolbar: EditToolbar
              // }}
            />
          </Stack>
        </Container>
      </TabPanel>
      <Dialog
        aria-labelledby='customized-dialog-title'
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id='customized-dialog-title'
          translation-key='question_bank_create_category'
        >
          {t("question_bank_create_category")}
        </DialogTitle>
        <IconButton
          aria-label='close'
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
          onClick={() => setOpenCreateDialog(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack spacing={1}>
            <Textarea
              translation-key='question_bank_create_category_name'
              name='Outlined'
              placeholder={t("question_bank_create_category_name")}
              onChange={(e) => {
                setDataCreate({ ...dataCreate, name: e.target.value });
              }}
              variant='outlined'
              minRows={1}
            />
            <Textarea
              transaltion-key='question_bank_create_category_info'
              name='Outlined'
              placeholder={t("question_bank_create_category_info")}
              onChange={(e) => {
                setDataCreate({ ...dataCreate, description: e.target.value });
              }}
              variant='outlined'
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button btnType={BtnType.Primary} onClick={() => setOpenCreateDialog(false)}>
            <ParagraphBody translation-key='common_save' onClick={handleCreate}>
              {" "}
              {t("common_save")}
            </ParagraphBody>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        aria-labelledby='customized-dialog-title-edit'
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id='customized-dialog-title-edit'
          translation-key='question_bank_edit_category'
        >
          {t("question_bank_edit_category")}
        </DialogTitle>
        <IconButton
          aria-label='close'
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
          onClick={() => setOpenEditDialog(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack spacing={1}>
            <Textarea
              translation-key='question_bank_create_category_name'
              name='Outlined'
              defaultValue={selectedRowData?.name || ""}
              onChange={(e) => {
                setDataEdit({ ...dataEdit, name: e.target.value });
              }}
              variant='outlined'
              minRows={1}
            />
            <Textarea
              transaltion-key='question_bank_create_category_info'
              name='Outlined'
              defaultValue={selectedRowData?.description || ""}
              onChange={(e) => {
                setDataEdit({ ...dataEdit, description: e.target.value });
              }}
              variant='outlined'
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button btnType={BtnType.Primary} onClick={() => setOpenEditDialog(false)}>
            <ParagraphBody translation-key='common_save' onClick={handleEdit}>
              {" "}
              {t("common_save")}
            </ParagraphBody>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuestionBankManagement;

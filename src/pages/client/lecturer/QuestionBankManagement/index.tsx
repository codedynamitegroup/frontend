import {
  Stack,
  Container,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  TextField
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridPaginationModel,
  GridCallbackDetails
} from "@mui/x-data-grid";
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
import { clearCategories, setCategories } from "reduxes/courseService/questionBankCategory";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import dayjs from "dayjs";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/authService/entity/user";
import CustomDataGrid from "components/common/CustomDataGrid";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

const QuestionBankManagement = () => {
  const [searchText, setSearchText] = useState("");
  const dispath = useDispatch<AppDispatch>();
  const questionBankCategoriesState = useSelector((state: RootState) => state.questionBankCategory);
  const dataGridToolbar = { enableToolbar: true };
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
          isOrgQuestionBank: categoryState.tab === "1" ? true : false,
          organizationId: user.organization.organizationId,
          search,
          pageNo,
          pageSize
        });
      dispath(setCategories(getQuestionBankCategoryResponse));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (data: any) => {
    try {
      await QuestionBankCategoryService.updateQuestionBankCategory({
        id: selectedRowData?.id || "",
        name: data.name || "",
        description: data.description || ""
      });
      handleGetQuestionBankCategories({ search: searchText });
      handleCloseEditDialog(); // Tắt dialog sau khi chỉnh sửa thành công
    } catch (error) {
      console.log(error);
    }
  };

  const user: User = useSelector(selectCurrentUser);
 const dispatch = useDispatch<AppDispatch>();
  const categoryState = useSelector((state: RootState) => state.questionBankCategory);

  const handleCreate = async (data: any) => {
    try {
      await QuestionBankCategoryService.createQuestionBankCategory({
        name: data.name || "",
        description: data.description || "",
        organizationId: user.organization.organizationId,
        isOrgQuestionBank: categoryState.tab === "1" ? true : false,
        createdBy: user.userId
      });
      handleGetQuestionBankCategories({ search: searchText });
      handleCloseCreateDialog();
      resetCreate();
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    QuestionBankCategoryService.deleteQuestionBankCategory(deletedCategoryId)
      .then(() => {
        dispatch(setSuccessMess("Delete category successfully"));
        dispatch(clearCategories());
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(setErrorMess("Delete category failed"));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };


  useEffect(() => {
    const fetchInitialQuestionBankCategories = async () => {
      await handleGetQuestionBankCategories({ search: searchText });
    };
    fetchInitialQuestionBankCategories();
  }, [searchText, categoryState.tab]);

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
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.name}</ParagraphBody>;
      }
    },
    {
      field: "organizationName",
      sortable: false,
      flex: 2,
      headerClassName: classes["table-head"],
      renderCell: (params) => {
        return <ParagraphBody>{params.row.organizationName}</ParagraphBody>;
      }
    },
    {
      field: "created",
      sortable: false,
      flex: 2,
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
      flex: 2,
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
              setDeletedCategoryId(id as string);
              setIsOpenConfirmDelete(true);
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

  const totalElement = useMemo(
    () => questionBankCategoriesState.categories.totalItems || 0,
    [questionBankCategoriesState.categories]
  );

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setRowsPerPage(model.pageSize);
    handleGetQuestionBankCategories({
      search: searchText,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedCategoryId, setDeletedCategoryId] = useState<string>("");

  const validationSchema = yup.object({
    name: yup.string().required("Tên danh mục không được để trống"),
    description: yup.string().required("Mô tả không được để trống")
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenCreateDialog = () => {
    resetCreate();
    setOpenCreateDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  useEffect(() => {
    if (selectedRowData) {
      resetEdit({
        name: selectedRowData.name,
        description: selectedRowData.description
      });
    }
  }, [selectedRowData, resetEdit]);

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
              isLoading={questionBankCategoriesState.isLoading}
              placeHolder={`${t("question_bank_category_find_by_category")} ...`}
              translation-key='question_bank_category_find_by_category'
              value={searchText}
              setValue={setSearchText}
              options={[]}
              onHandleChange={searchHandle}
            />
            <CustomDataGrid
              loading={questionBankCategoriesState.isLoading}
              dataList={questionBankCategoriesState.categories.questionBankCategories.map(
                (item, index) => ({
                  stt: index + 1,
                  ...item
                })
              )}
              tableHeader={columns}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              onClickRow={handleRowClick}
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
              personalSx={true}
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

            <CustomAutocomplete
              isLoading={questionBankCategoriesState.isLoading}
              // ={searchHandle}
              placeHolder={`${t("question_bank_category_find_by_category")} ...`}
              translation-key='question_bank_category_find_by_category'
              value={searchText}
              setValue={setSearchText}
              options={[]}
              onHandleChange={searchHandle}
            />
            <CustomDataGrid
              loading={questionBankCategoriesState.isLoading}
              dataList={questionBankCategoriesState.categories.questionBankCategories.map(
                (item, index) => ({
                  stt: index + 1,
                  ...item
                })
              )}
              tableHeader={columns}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              onClickRow={handleRowClick}
              sx={{
                "& .MuiDataGrid-cell": {
                  border: "none"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "var(--blue-5)"
                },
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "var(--blue-5)"
                }
              }}
              personalSx={true}
            />
          </Stack>
        </Container>
      </TabPanel>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this category?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        className={classes["dialog"]}
      >
        <form onSubmit={handleSubmitCreate(handleCreate)}>
          <DialogTitle className={classes["dialog-title"]}>
            {t("question_bank_create_category")}
            <IconButton
              aria-label='close'
              onClick={handleCloseCreateDialog}
              className={classes["dialog-close"]}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes["dialog-content"]}>
            <Controller
              name='name'
              control={controlCreate}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("question_bank_create_category_name")}
                  variant='outlined'
                  fullWidth
                  margin='dense'
                  error={!!errorsCreate.name}
                  helperText={errorsCreate.name?.message}
                />
              )}
            />
            <Controller
              name='description'
              control={controlCreate}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("question_bank_create_category_info")}
                  variant='outlined'
                  fullWidth
                  margin='dense'
                  error={!!errorsCreate.description}
                  helperText={errorsCreate.description?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions className={classes["dialog-actions"]}>
            <Button btnType={BtnType.Secondary} onClick={handleCloseCreateDialog}>
              {t("cancel")}
            </Button>
            <Button btnType={BtnType.Primary} type='submit'>
              {t("add")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} className={classes["dialog"]}>
        <form onSubmit={handleSubmitEdit(handleEdit)}>
          <DialogTitle className={classes["dialog-title"]}>
            {t("question_category_edit")}
            <IconButton
              aria-label='close'
              onClick={handleCloseEditDialog}
              className={classes["dialog-close"]}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes["dialog-content"]}>
            <Controller
              name='name'
              control={controlEdit}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("question_category_name")}
                  variant='outlined'
                  fullWidth
                  margin='dense'
                  error={!!errorsEdit.name}
                  helperText={errorsEdit.name?.message}
                />
              )}
            />
            <Controller
              name='description'
              control={controlEdit}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("question_category_description")}
                  variant='outlined'
                  fullWidth
                  margin='dense'
                  error={!!errorsEdit.description}
                  helperText={errorsEdit.description?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions className={classes["dialog-actions"]}>
            <Button btnType={BtnType.Secondary} onClick={handleCloseEditDialog}>
              {t("cancel")}
            </Button>
            <Button btnType={BtnType.Primary} type='submit'>
              {t("save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default QuestionBankManagement;

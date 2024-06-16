import {
  Stack,
  Container,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  Grid
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  clearCategories,
  setCategories,
  setLoading
} from "reduxes/courseService/questionBankCategory";
import { QuestionBankCategoryService } from "services/courseService/QuestionBankCategoryService";
import dayjs from "dayjs";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";
import CustomAutocomplete from "components/common/search/CustomAutocomplete";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/authService/entity/user";
import CustomDataGrid from "components/common/CustomDataGrid";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";

const AdminQuestionBankManagement = () => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const questionBankCategoriesState = useSelector((state: RootState) => state.questionBankCategory);
  const user: User = useSelector(selectCurrentUser);
  const categoryState = useSelector((state: RootState) => state.questionBankCategory);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const dataGridToolbar = { enableToolbar: true };

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const totalElement = useMemo(
    () => questionBankCategoriesState.categories.totalItems || 0,
    [questionBankCategoriesState.categories]
  );

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedCategoryId, setDeletedCategoryId] = useState<string>("");

  const [selectedRowData, setSelectedRowData] = useState<QuestionBankCategoryEntity>();
  const [dataEdit, setDataEdit] = useState<QuestionBankCategoryEntity>(
    {} as QuestionBankCategoryEntity
  );
  const [dataCreate, setDataCreate] = useState<QuestionBankCategoryEntity>(
    {} as QuestionBankCategoryEntity
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`${params.row.id}`);
  };
  const searchHandle = async (searchText: string) => {
    setSearchText(searchText);
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

  const handleGetQuestionBankCategories = useCallback(
    async ({
      search = searchText,
      pageNo = page,
      pageSize = rowsPerPage
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setLoading(true));
      try {
        const getQuestionBankCategoryResponse =
          await QuestionBankCategoryService.getQuestionBankCategories({
            isOrgQuestionBank: true,
            search,
            pageNo,
            pageSize
          });
        dispatch(setCategories(getQuestionBankCategoryResponse));
        dispatch(setLoading(false));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
        dispatch(setLoading(false));
      }
    },
    [dispatch, t]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetQuestionBankCategories({
        search: value
      });
    },
    [handleGetQuestionBankCategories]
  );

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
        isOrgQuestionBank: true,
        createdBy: user.userId
      });
      handleGetQuestionBankCategories({ search: searchText });
    } catch (error) {
      console.log(error);
    }
  };

  const tableHeading: GridColDef[] = [
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

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setRowsPerPage(model.pageSize);
    handleGetQuestionBankCategories({
      search: searchText,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  useEffect(() => {
    const fetchQuestionBankCategory = async () => {
      if (categoryState.categories.questionBankCategories.length > 0) return;
      dispatch(setInititalLoading(true));
      await handleGetQuestionBankCategories({ search: searchText });
      dispatch(setInititalLoading(false));
    };
    fetchQuestionBankCategory();
  }, [
    dispatch,
    handleGetQuestionBankCategories,
    questionBankCategoriesState.categories.questionBankCategories
  ]);

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
  const columns = addHeaderNameByLanguage(tableHeading, headerName);

  return (
    <div>
      <Container>
        <Stack spacing={2} marginBottom={3} paddingTop={1}>
          <Heading1 fontWeight={"500"} translation-key='common_question_bank'>
            {i18next.format(t("common_question_bank"), "firstUppercase")}
          </Heading1>

          <Grid item xs={12}>
            <CustomSearchFeatureBar
              isLoading={categoryState.isLoading}
              searchValue={searchText}
              setSearchValue={setSearchText}
              onHandleChange={handleSearchChange}
              createBtnText={t("common_add_new")}
              onClickCreate={() => {
                setOpenCreateDialog(true);
              }}
              numOfResults={totalElement}
              isFilter={false}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomDataGrid
              loading={questionBankCategoriesState.isLoading}
              dataList={questionBankCategoriesState.categories.questionBankCategories.map(
                (item, index) => ({
                  stt: index + 1,
                  ...item
                })
              )}
              tableHeader={tableHeading}
              onSelectData={handleRowClick}
              dataGridToolBar={dataGridToolbar}
              page={page}
              pageSize={rowsPerPage}
              totalElement={totalElement}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={true}
              getRowHeight={() => "auto"}
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
          </Grid>
        </Stack>
      </Container>
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
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this category?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
    </div>
  );
};

export default AdminQuestionBankManagement;

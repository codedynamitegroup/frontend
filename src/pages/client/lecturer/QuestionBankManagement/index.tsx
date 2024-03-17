import {
  Stack,
  Container,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useMemo, useState } from "react";

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

const QuestionBankManagement = () => {
  const { t } = useTranslation();
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: rows,
    total: 0,
    page: 1,
    pageSize: 5
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
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
        return <ParagraphBody>{params.row.category}</ParagraphBody>;
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
              //set the edit value
              setOpenCreateDialog(true);
            }}
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
    //fetch data
  }, [pageState.page, pageState.pageSize]);
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
              translation-key-header='question_bank_category_header_table'
              autoHeight
              disableColumnMenu
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
              variant='outlined'
              minRows={1}
            />
            <Textarea
              transaltion-key='question_bank_create_category_info'
              name='Outlined'
              placeholder={t("question_bank_create_category_info")}
              variant='outlined'
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button btnType={BtnType.Primary} onClick={() => setOpenCreateDialog(false)}>
            <ParagraphBody translation-key='common_save'> {t("common_save")}</ParagraphBody>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuestionBankManagement;

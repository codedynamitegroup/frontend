import { Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import * as React from "react";
import FeatureBar from "../../FeatureBar";
import { GridRowParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

interface ReusedResourceDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

export default function ReusedResourceDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: ReusedResourceDialogProps) {
  const { t } = useTranslation();
  const questionList = [
    {
      id: 1,
      name: "Thông báo bài tập 1",
      topic: "Chương 1",
      type: "Thông báo"
    },
    {
      id: 2,
      name: "Thông báo bài tập 2",
      topic: "Chương 1",
      type: "Thông báo"
    },
    {
      id: 3,
      name: "Bài tập OOP chương 1",
      topic: "Chương 1",
      type: "Bài tập"
    },
    {
      id: 4,
      name: "Bài kiểm tra giữa kỳ",
      topic: "Kiểm tra",
      type: "Bài kiểm tra"
    }
  ];
  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      { field: "id", headerName: "STT", minWidth: 1 },
      {
        field: "name",
        headerName: t("common_title"),
        minWidth: 400
      },
      {
        field: "type",
        headerName: t("common_classify_category"),
        minWidth: 300
      },
      {
        field: "topic",
        headerName: t("common_filter_topic"),
        minWidth: 150
      }
    ],
    []
  );

  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='1000px'
      {...props}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FeatureBar
            colSearchLabel={t("common_find_by_col")}
            colItems={[
              { label: t("common_title"), value: "name" },
              { label: t("common_classify_category"), value: "type" },
              { label: t("common_filter_topic"), value: "topic" }
            ]}
            translation-key={[
              "common_find_by_col",
              "common_title",
              "common_filter_topic",
              "common_classify_category"
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            dataList={questionList}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            visibleColumn={visibleColumnList}
            dataGridToolBar={dataGridToolbar}
            page={page}
            pageSize={pageSize}
            totalElement={totalElement}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={false}
            onClickRow={rowClickHandler}
            checkboxSelection
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}

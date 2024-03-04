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
        headerName: "Tiêu đề",
        minWidth: 400
      },
      {
        field: "type",
        headerName: "Phân Loại",
        minWidth: 300
      },
      {
        field: "topic",
        headerName: "Chủ đề",
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
  ) => {
    console.log(selectedRowId);
  };
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
            colSearchLabel='Tìm kiếm theo cột'
            colItems={[
              { label: "Tiêu đề", value: "name" },
              { label: "Phân loại", value: "type" },
              { label: "Chủ đề", value: "topic" }
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

import { Box, Card, Grid, Tooltip } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import * as React from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InputTextField from "components/common/inputs/InputTextField";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading3 from "components/text/Heading3";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import ParagraphSmall from "components/text/ParagraphSmall";

interface CreateReportConfirmDialogProps extends DialogProps {
  title?: string;
  isReportExisted?: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  isConfirmLoading?: boolean;
}

export default function CreateReportConfirmDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  isConfirmLoading = false,
  isReportExisted,
  ...props
}: CreateReportConfirmDialogProps) {
  const [reportName, setReportName] = React.useState<string>("");
  const questionList = [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d504",
      title: "Tính tổng từ 1 đến n",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_name: "CS101 - Lập trình căn bản",
      created_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d505",
      title: "Tỉnh tổng các số chẵn từ 1 đến n",
      exam_name: "Bài kiểm tra giữa kỳ",
      course_name: "CS102 - Lập trình nâng cao",
      created_at: "2024-03-24T07:19:47.000Z"
    }
  ];

  const tableHeading: GridColDef[] = [
    { field: "title", headerName: "Tên câu hỏi", flex: 2 },
    { field: "exam_name", headerName: "Bài kiểm tra", flex: 2 },
    { field: "course_name", headerName: "Môn học", flex: 2 },
    {
      field: "created_at",
      headerName: "Ngày tạo",
      minWidth: 200,
      valueFormatter: (params) => {
        return new Date(params.value || "").toLocaleString();
      }
    }
  ];

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
  const totalElement = questionList.length;

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
      isConfirmLoading={isConfirmLoading}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth={isReportExisted ? "1000px" : "550px"}
      {...props}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputTextField
            type='text'
            title={"Tên báo cáo gian lận"}
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder={"Nhập tên báo cáo gian lận bạn muốn tạo"}
            fullWidth
          />
        </Grid>
        {isReportExisted && (
          <>
            <Grid item xs={12}>
              <Heading3>Danh sách câu hỏi sử dụng trong báo cáo</Heading3>
            </Grid>
            <Grid item xs={12}>
              <CustomDataGrid
                dataList={questionList}
                tableHeader={tableHeading}
                onSelectData={rowSelectionHandler}
                dataGridToolBar={dataGridToolbar}
                page={page}
                pageSize={pageSize}
                totalElement={totalElement}
                onPaginationModelChange={pageChangeHandler}
                showVerticalCellBorder={false}
                onClickRow={rowClickHandler}
              />
            </Grid>
          </>
        )}
      </Grid>
    </CustomDialog>
  );
}

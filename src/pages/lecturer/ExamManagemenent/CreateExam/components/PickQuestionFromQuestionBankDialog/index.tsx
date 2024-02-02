import { Grid, Link } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicSelect from "components/common/select/BasicSelect";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import QuestionsFeatureBar from "../FeatureBar";

interface PickQuestionFromQuestionBankDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  categoryPickTitle?: string;
  categoryList?: {
    value: string;
    label: string;
  }[];
}

export default function PickQuestionFromQuestionBankDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  categoryPickTitle,
  categoryList,
  ...props
}: PickQuestionFromQuestionBankDialogProps) {
  const [category, setCategory] = React.useState("0");
  const questionList = [
    {
      id: 4,
      name: "Trắc nghiệm lập trình C++",
      description: "Hãy cho biết con trỏ trong C++ là gì?",
      max_grade: 10,
      type: {
        value: "essay",
        label: "Tự luận"
      }
    },
    {
      id: 2,
      name: "Câu hỏi về phát triển phần mềm",
      description: "Who is the father of Software Engineering?",
      max_grade: 10,
      type: {
        value: "multiple-choice",
        label: "Trắc nghiệm"
      }
    },
    {
      id: 3,
      name: "Câu hỏi về phát triển phần mềm",
      description: "What is the full form of HTML?",
      max_grade: 10,
      type: {
        value: "short-answer",
        label: "Trả lời ngắn"
      }
    },
    {
      id: 1,
      name: "Câu hỏi về phát triển phần mềm",
      description: "HTML stands for Hyper Text Markup Language",
      max_grade: 10,
      type: {
        value: "true-false",
        label: "Đúng/Sai"
      }
    }
  ];
  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      { field: "id", headerName: "STT", minWidth: 1 },
      {
        field: "name",
        headerName: "Tên câu hỏi",
        width: 200,
        flex: 0.8,
        renderCell: (params) => <Link href={`${params.row.id}`}>{params.value}</Link>
      },
      {
        field: "description",
        headerName: "Mô tả câu hỏi",
        width: 200,
        flex: 0.8
      },
      {
        field: "type",
        headerName: "Kiểu",
        width: 50,
        flex: 0.4,
        renderCell: (params) => <ParagraphBody>{params.value.label}</ParagraphBody>
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

  const handleCategoryChange = (value: string) => {
    setCategory(value);
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
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>{categoryPickTitle || ""}</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <BasicSelect
            labelId='category-label'
            value={category}
            onHandleChange={handleCategoryChange}
            items={categoryList}
            backgroundColor='white'
            style={{
              marginTop: "0px"
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <QuestionsFeatureBar
            colSearchLabel='Tìm kiếm theo cột'
            colItems={[
              { label: "Tên câu hỏi", value: "name" },
              { label: "Kiểu", value: "type" }
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
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}

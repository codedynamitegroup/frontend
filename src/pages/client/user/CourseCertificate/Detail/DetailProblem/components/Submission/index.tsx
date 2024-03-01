import classes from "./styles.module.scss";
import React from "react";
import Box from "@mui/material/Box";
import ParagraphBody from "components/text/ParagraphBody";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import CustomDataGrid from "components/common/CustomDataGrid";
import { GridSlotsComponentsProps } from "@mui/x-data-grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";

export default function LessonDetailSubmission() {
  const submission = [
    {
      id: 1,
      status: 1,
      language: "C++",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      id: 2,
      status: 2,
      language: "Java",
      runtime: 12,
      memory: 13
    },
    {
      id: 3,
      status: 1,
      language: "Javascript",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      id: 4,
      status: 2,
      language: "C++",
      runtime: 14,
      memory: 15
    }
  ];

  const visibleColumnList = { status: true, language: true, runtime: true, memory: true };
  const dataGridToolbar = { enableToolbar: false };
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
  const tableHeading: GridColDef[] = [
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      flex: 0.8,
      renderCell: (params) => (
        <span style={{ color: params.row.status === 1 ? "red" : "green" }}>
          {params.row.status === 1 ? "Sai kết quả" : "Đã được chấp nhận"}
        </span>
      )
    },
    {
      field: "language",
      headerName: "Ngôn ngữ",
      width: 50,
      flex: 0.4,
      renderCell: (params) => <span className={classes.language}>{params.value}</span>
    },
    {
      field: "runtime",
      headerName: "Thời gian thực thi",
      width: 200,
      flex: 0.8,
      renderCell: (params) => (
        <Box className={classes.runtime}>
          <AccessTimeIcon className={classes.icon} />
          <span>{params.value} ms</span>
        </Box>
      )
    },
    {
      field: "memory",
      headerName: "Bộ nhớ",
      width: 200,
      flex: 0.8,
      renderCell: (params) => (
        <Box className={classes.memory}>
          <MemoryIcon className={classes.icon} />
          <span>{params.value} KB</span>
        </Box>
      )
    }
  ];
  function CustomFooterStatusComponent(props: NonNullable<GridSlotsComponentsProps["footer"]>) {
    return <Box></Box>;
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.submissionTable}>
        <CustomDataGrid
          dataList={submission}
          tableHeader={tableHeading}
          onSelectData={rowSelectionHandler}
          visibleColumn={visibleColumnList}
          dataGridToolBar={dataGridToolbar}
          page={page}
          pageSize={pageSize}
          totalElement={totalElement}
          onPaginationModelChange={pageChangeHandler}
          showVerticalCellBorder={false}
          customFooter={CustomFooterStatusComponent}
        />
      </Box>
    </Box>
  );
}

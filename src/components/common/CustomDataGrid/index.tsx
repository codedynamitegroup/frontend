/* eslint-disable react/jsx-no-undef */
import Box from "@mui/material/Box";

import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridToolbar } from "@mui/x-data-grid/components/toolbar/GridToolbar";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridEventListener, GridSlotsComponentsProps } from "@mui/x-data-grid";
import classes from "./styles.module.scss";
import { truncate } from "fs";

interface DataGridProps {
  dataList: Array<any>;
  tableHeader: Array<GridColDef>;
  visibleColumn?: any;
  onSelectData: any;
  onClickRow: any;
  dataGridToolBar?: any;
  pageSize: number;
  page: number;
  totalElement: number;
  onPaginationModelChange: any;
  columnGroupingModel?: any;
  showVerticalCellBorder: boolean;
  customColumnMenu?: any;
  customFooter?: any;
  getRowHeight?: any;
  checkboxSelection?: boolean;
}

const CustomDataGrid = (props: DataGridProps) => {
  const {
    dataList,
    tableHeader,
    onSelectData,
    visibleColumn,
    checkboxSelection,
    dataGridToolBar,
    pageSize,
    page,
    totalElement,
    onPaginationModelChange,
    columnGroupingModel,
    showVerticalCellBorder,
    customColumnMenu,
    customFooter,
    onClickRow
  } = props;
  const rowSelectionHandler = (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    onSelectData(rowSelectionModel, details);
  };

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    onPaginationModelChange(model, details);
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    onClickRow(params);
  };

  return (
    <Box className={classes.container}>
      <DataGrid
        rows={dataList}
        columns={tableHeader}
        columnVisibilityModel={visibleColumn}
        checkboxSelection={checkboxSelection}
        columnGroupingModel={columnGroupingModel}
        initialState={{
          pagination: {
            paginationModel: { page: page, pageSize: pageSize }
          }
        }}
        showCellVerticalBorder={showVerticalCellBorder}
        rowCount={totalElement}
        pageSizeOptions={[5, 10, 15, 20]}
        onRowSelectionModelChange={rowSelectionHandler}
        onRowClick={handleRowClick}
        density='comfortable'
        disableColumnFilter
        disableColumnSelector
        disableRowSelectionOnClick
        experimentalFeatures={{ columnGrouping: true }}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true }
          }
        }}
        localeText={{
          MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count, page }) =>
              `${from}–${to} của ${count !== -1 ? count : `lớn hơn ${to}`}`,
            labelRowsPerPage: `Số dòng mỗi trang`
          },
          footerRowSelected: (count) => `${count} dòng đã được chọn`,
          toolbarDensity: "Độ rộng của hàng",
          toolbarDensityCompact: "Gọn nhẹ",
          toolbarDensityStandard: "Tiêu chuẩn",
          toolbarDensityComfortable: "Thoải mái",
          columnMenuSortAsc: "Xếp tăng dần",
          columnMenuSortDesc: "Xếp giảm dần"
        }}
        slots={{
          toolbar: dataGridToolBar && dataGridToolBar.enableToolbar ? GridToolbar : null,
          columnMenu: customColumnMenu,
          footer: customFooter
        }}
        onPaginationModelChange={pageChangeHandler}
        getRowHeight={props.getRowHeight}
      />
    </Box>
  );
};
export default CustomDataGrid;

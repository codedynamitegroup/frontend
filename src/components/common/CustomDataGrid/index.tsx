/* eslint-disable react/jsx-no-undef */
import Box from "@mui/material/Box";

import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { GridToolbar } from "@mui/x-data-grid/components/toolbar/GridToolbar";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridEventListener } from "@mui/x-data-grid";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

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
  columnHeaderHeight?: number;
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
    onClickRow,
    columnHeaderHeight
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
  const { t } = useTranslation();

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
            labelDisplayedRows: ({ from, to, count, page }) => {
              return t("common_table_from_to", { from: from, to: to, countText: count });
            },
            labelRowsPerPage: t("common_table_row_per_page")
          },
          footerRowSelected: (count) => {
            return t("data_grid_selected_row", { selected: count });
          },
          toolbarDensity: t("data_grid_row_width"),
          toolbarDensityCompact: t("data_grid_row_width_compact"),
          toolbarDensityStandard: t("data_grid_row_width_standard"),
          toolbarDensityComfortable: t("data_grid_row_width_comfortable"),
          columnMenuSortAsc: t("data_grid_row_ascending"),
          columnMenuSortDesc: t("data_grid_row_descending"),
          columnMenuUnsort: t("data_grid_row_unsort")
        }}
        slots={{
          toolbar: dataGridToolBar && dataGridToolBar.enableToolbar ? GridToolbar : null,
          columnMenu: customColumnMenu,
          footer: customFooter
        }}
        sx={{
          "& .MuiDataGrid-row:hover": {
            cursor: onClickRow ? "pointer" : "default"
          }
        }}
        onPaginationModelChange={pageChangeHandler}
        getRowHeight={props.getRowHeight}
        columnHeaderHeight={columnHeaderHeight || 56}
        translation-key={[
          "common_table_from_to",
          "data_grid_row_width_compact",
          "common_table_from_to",
          "data_grid_row_width",
          "data_grid_row_width_standard",
          "data_grid_row_width_comfortable",
          "data_grid_row_ascending",
          "data_grid_row_descending",
          "data_grid_selected_row"
        ]}
      />
    </Box>
  );
};
export default CustomDataGrid;

/* eslint-disable react/jsx-no-undef */
import Box from "@mui/material/Box";

import { GridEventListener } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { GridToolbar } from "@mui/x-data-grid/components/toolbar/GridToolbar";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel, GridRowClassNameParams } from "@mui/x-data-grid/models";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

interface DataGridProps {
  loading?: boolean;
  dataList: Array<any>;
  tableHeader: Array<GridColDef>;
  visibleColumn?: any;
  onSelectData: any;
  onClickRow?: GridEventListener<"rowClick">;
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
  cellClickParamFields?: string[];
  sx?: any;
  slots?: any;
  getCellClassName?: any;
  getRowClassName?: (params: GridRowClassNameParams<any>) => string;
  personalSx?: boolean;
}

const CustomDataGrid = (props: DataGridProps) => {
  const {
    loading = false,
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
    columnHeaderHeight,
    cellClickParamFields,
    sx = {},
    slots = {},
    getCellClassName,
    getRowClassName,
    personalSx
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

  const handleCellClick: GridEventListener<"cellClick"> = (params, event) => {
    // Disable cell click event if the field is in the cellClickParamFields
    if (params.field && cellClickParamFields?.includes(params.field)) {
      event.stopPropagation();
    }
  };
  const { t } = useTranslation();

  return (
    <Box className={classes.tableWrapper}>
      <DataGrid
        loading={loading}
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
        showColumnVerticalBorder={false}
        rowCount={totalElement}
        pageSizeOptions={[5, 10, 15, 20]}
        onRowSelectionModelChange={rowSelectionHandler}
        onRowClick={onClickRow}
        density='comfortable'
        getCellClassName={getCellClassName}
        getRowClassName={getRowClassName}
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
          footer: customFooter,
          ...slots
        }}
        sx={
          personalSx
            ? { ...sx }
            : {
                "& .MuiDataGrid-row:hover": {
                  cursor: onClickRow ? "pointer" : "default"
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "var(--gray-2)"
                },
                ...sx
              }
        }
        pagination
        paginationMode='server'
        onCellClick={handleCellClick}
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

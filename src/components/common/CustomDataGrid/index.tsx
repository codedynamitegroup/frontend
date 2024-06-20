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
import { styled } from "@mui/material/styles";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626"
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959"
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343"
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c"
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff"
  }
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg width='120' height='100' viewBox='0 0 184 152' aria-hidden focusable='false'>
        <g fill='none' fillRule='evenodd'>
          <g transform='translate(24 31.67)'>
            <ellipse className='ant-empty-img-5' cx='67.797' cy='106.89' rx='67.797' ry='12.668' />
            <path
              className='ant-empty-img-1'
              d='M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z'
            />
            <path
              className='ant-empty-img-2'
              d='M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z'
            />
            <path
              className='ant-empty-img-3'
              d='M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z'
            />
          </g>
          <path
            className='ant-empty-img-3'
            d='M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z'
          />
          <g className='ant-empty-img-4' transform='translate(149.65 15.383)'>
            <ellipse cx='20.654' cy='3.167' rx='2.849' ry='2.815' />
            <path d='M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z' />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

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
  getRowId?: (params: any) => string;
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
    personalSx,
    getRowId
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
        getRowId={getRowId}
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
          noRowsOverlay: CustomNoRowsOverlay,
          ...slots
        }}
        sx={
          personalSx
            ? {
                "& .MuiDataGrid-row:hover": {
                  cursor: onClickRow ? "pointer" : "default"
                },
                "& .MuiDataGrid-overlayWrapper": {
                  height: "auto !important",
                  margin: "20px"
                },
                "& .MuiDataGrid-overlayWrapperInner": {
                  height: "auto !important"
                },
                ...sx
              }
            : {
                "& .MuiDataGrid-row:hover": {
                  cursor: onClickRow ? "pointer" : "default"
                },
                "& .MuiDataGrid-columnHeaders": {
                  height: 80 // Tăng chiều cao của header
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  lineHeight: "normal", // Đặt lại line-height
                  whiteSpace: "normal", // Cho phép xuống dòng
                  overflow: "visible", // Hiển thị đầy đủ nội dung
                  textOverflow: "unset" // Bỏ text overflow
                },
                "& .MuiDataGrid-overlayWrapper": {
                  height: "auto !important",
                  margin: "20px"
                },
                "& .MuiDataGrid-overlayWrapperInner": {
                  height: "auto !important"
                },
                ...sx
              }
        }
        pagination
        filterMode='server'
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

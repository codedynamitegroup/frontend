import { Box } from "@mui/material";
import React, { memo } from "react";
import classes from "./styles.module.scss";
import Heading5 from "components/text/Heading5";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

type Props = {};

const CodeQuestionLanguages = memo((props: Props) => {
  const initialRows: GridRowsProp = [
    {
      id: 1,
      name: "ADA",
      timeLimit: 3,
      memoryLimit: 512,
      isSelected: true
    },
    {
      id: 2,
      name: "C++",
      timeLimit: 2,
      memoryLimit: 512,
      isSelected: true
    },
    {
      id: 3,
      name: "Java 15",
      timeLimit: 4,
      memoryLimit: 2048,
      isSelected: true
    }
  ];

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row: any) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Ngôn ngữ",
      type: "text",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: false
    },
    {
      field: "timeLimit",
      headerName: "Giới hạn thời gian(giây)",
      width: 300,
      type: "number",
      align: "center",
      headerAlign: "center",
      editable: true
    },
    {
      field: "memoryLimit",
      width: 300,
      headerName: "Giới hạn bộ nhớ(MB)",
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "number"
    },
    {
      field: "isSelected",
      width: 150,
      headerName: "Sử dụng",
      editable: true,
      type: "boolean"
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Hành động",
      width: 200,
      align: "center",
      headerAlign: "center",
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon className={classes.icon} />}
              label='Save'
              sx={{
                color: "primary.main"
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon className={classes.icon} />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon className={classes.icon} />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />
        ];
      }
    }
  ];

  return (
    <Box className={classes["body"]}>
      <Heading5 fontStyle={"italic"} fontWeight={"400"} colorName='--gray-50'>
        Dưới đây là danh sách các ngôn ngữ lập trình có sẵn
      </Heading5>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode='row'
        className={classes.dataGrid}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}
      />
    </Box>
  );
});

export default CodeQuestionLanguages;

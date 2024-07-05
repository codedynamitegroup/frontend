import { Box, Checkbox, Switch, TextField } from "@mui/material";
import React, { memo, useEffect } from "react";
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
  GridRowEditStopReasons,
  useGridApiContext,
  GridRenderCellParams,
  GridEditInputCell,
  GridRenderEditCellParams
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { ProgrammingLanguageEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageEntity";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import cloneDeep from "lodash.clonedeep";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { CheckBox } from "@mui/icons-material";

type Props = {};
type ProgrammingLanguageFormValue = {
  programmingLanguages: ProgrammingLanguageAdminEntity[];
};
const CodeQuestionLanguages = ({}: Props) => {
  const { t } = useTranslation();
  const programmingLanguageMethod = useFormContext<ProgrammingLanguageFormValue>();
  const initialRows: GridRowsProp = programmingLanguageMethod
    .getValues("programmingLanguages")
    .map((field, index) => ({
      rowId: index,
      id: field.id,
      timeLimit: field.timeLimit,
      memoryLimit: field.memoryLimit,
      isSelected: field.choosen,
      name: field.name
    }));

  function TimeLimitEditInputCell(props: GridRenderCellParams<any, number>) {
    const { id, field, hasFocus, value } = props;
    const numberId: number = id as number;
    const apiRef = useGridApiContext();
    const ref = React.useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    useEnhancedEffect(() => {
      if (hasFocus && ref.current) {
        const input = ref.current.querySelector<HTMLInputElement>(`input[value="${value}"]`);
        input?.focus();
      }
    }, [hasFocus, value]);

    return (
      <Controller
        name={`programmingLanguages.${numberId}.timeLimit`}
        control={programmingLanguageMethod.control}
        render={({ field: { onChange: onFormChange } }) => (
          <TextField
            variant='standard'
            ref={ref}
            type='number'
            inputProps={{
              min: 0.1,
              step: 0.1,
              style: { textAlign: "center" }
            }}
            value={value}
            onChange={(e) => {
              onFormChange(e);
              handleChange(e);
            }}
          />
        )}
      />
    );
  }
  function MemoryEditInputCell(props: GridRenderCellParams<any, number>) {
    const { id, field, hasFocus, value } = props;
    const numberId: number = id as number;
    const apiRef = useGridApiContext();
    const ref = React.useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    useEnhancedEffect(() => {
      if (hasFocus && ref.current) {
        const input = ref.current.querySelector<HTMLInputElement>(`input[value="${value}"]`);
        input?.focus();
      }
    }, [hasFocus, value]);

    return (
      <Controller
        name={`programmingLanguages.${numberId}.memoryLimit`}
        control={programmingLanguageMethod.control}
        render={({ field: { onChange: onFormChange } }) => (
          <TextField
            variant='standard'
            ref={ref}
            type='number'
            inputProps={{
              min: 204800,
              style: { textAlign: "center" }
            }}
            value={value}
            onChange={(e) => {
              onFormChange(e);
              handleChange(e);
            }}
          />
        )}
      />
    );
  }
  function SelectEditInputCell(props: GridRenderCellParams<any, boolean>) {
    const { id, field, hasFocus, value } = props;
    const numberId: number = id as number;
    const apiRef = useGridApiContext();
    const ref = React.useRef<HTMLButtonElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    useEnhancedEffect(() => {
      if (hasFocus && ref.current) {
        const input = ref.current.querySelector<HTMLButtonElement>(`input`);
        input?.focus();
      }
    }, [hasFocus, value]);

    return (
      <Controller
        name={`programmingLanguages.${numberId}.choosen`}
        control={programmingLanguageMethod.control}
        render={({ field: { onChange: onFormChange, value: formValue } }) => (
          <Checkbox
            ref={ref}
            checked={formValue}
            onChange={(e) => {
              onFormChange(e);
              handleChange(e);
            }}
          />
        )}
      />
    );
  }
  const renderTimeLimitEditInputCell: GridColDef["renderCell"] = (params) => {
    return <TimeLimitEditInputCell {...params} />;
  };
  const renderMemoryLimitEditInputCell: GridColDef["renderCell"] = (params) => {
    return <MemoryEditInputCell {...params} />;
  };
  const renderSelectEditInputCell: GridColDef["renderCell"] = (params) => {
    return <SelectEditInputCell {...params} />;
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("common_language"),
      type: "text",
      width: 300,
      align: "left",
      headerAlign: "left",
      editable: false
    },
    {
      field: "timeLimit",
      headerName: t("code_management_detail_lang_time_limit"),
      width: 300,
      align: "center",
      headerAlign: "center",
      renderEditCell: renderTimeLimitEditInputCell,
      editable: true
    },
    {
      field: "memoryLimit",
      width: 300,
      headerName: t("code_management_detail_lang_storage_limit"),
      editable: true,
      align: "center",
      headerAlign: "center",
      renderEditCell: renderMemoryLimitEditInputCell
    },
    {
      field: "isSelected",
      width: 150,
      headerName: t("common_use"),
      editable: true,
      renderEditCell: renderSelectEditInputCell,
      type: "boolean"
    }
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: t("common_action"),
    //   width: 200,
    //   align: "center",
    //   headerAlign: "center",
    //   cellClassName: "actions",
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<SaveIcon className={classes.icon} />}
    //           label='Save'
    //           sx={{
    //             color: "primary.main"
    //           }}
    //           onClick={handleSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           icon={<CancelIcon className={classes.icon} />}
    //           label='Cancel'
    //           className='textPrimary'
    //           onClick={handleCancelClick(id)}
    //           color='inherit'
    //         />
    //       ];
    //     }

    //     return [
    //       <GridActionsCellItem
    //         icon={<EditIcon className={classes.icon} />}
    //         label='Edit'
    //         className='textPrimary'
    //         onClick={handleEditClick(id)}
    //         color='inherit'
    //       />
    //     ];
    //   }
    // }
  ];
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // event.defaultMuiPrevented = true;
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
  };

  // const processRowUpdate = (newRow: GridRowModel) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   let newRows = cloneDeep(rows).map((row: any) => (row.id === newRow.id ? updatedRow : row));
  //   setRows(newRows);
  //   return updatedRow;
  // };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box className={classes["body"]}>
      <Heading5 fontStyle={"italic"} fontWeight={"400"} colorname='--gray-50'>
        {t("code_management_detail_lang_description")}
      </Heading5>
      <DataGrid
        rows={initialRows}
        columns={columns}
        editMode='row'
        className={classes.dataGrid}
        getRowId={(row) => row.rowId as number}
        // rowModesModel={rowModesModel}
        disableRowSelectionOnClick
        // onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        // processRowUpdate={processRowUpdate}
        // slotProps={{
        //   toolbar: { setRows, setRowModesModel }
        // }}
      />
    </Box>
  );
};

export default CodeQuestionLanguages;

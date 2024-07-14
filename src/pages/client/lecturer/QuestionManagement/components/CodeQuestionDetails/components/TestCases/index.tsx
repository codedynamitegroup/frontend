import { Box, TextField } from "@mui/material";
import React, { memo, useState } from "react";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import TestCasePopup from "./components/PopupTestCase";
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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmAlert from "components/common/dialogs/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import TextArea from "@uiw/react-md-editor/lib/components/TextArea/index.nohighlight";

type Props = {};

type TestCaseFormValue = {
  testCases: TestCaseEntity[];
};

const CodeQuestionTestCases = () => {
  const { t } = useTranslation();
  const [openTestCasePopup, setOpenTestCasePopup] = useState<boolean>(false);
  const [openConfirmAlert, setOpenConfirmAlert] = useState<boolean>(false);
  const [itemEdit, setItemEdit] = useState<any>(null);
  const {
    register,
    control: codeQuestionControl,
    setValue,
    getValues,
    formState: { errors: codeQuestionFormErrors }
  } = useFormContext<TestCaseFormValue>();
  const {
    fields,
    remove: removeTC,
    append,
    update,
    remove
  } = useFieldArray({
    control: codeQuestionControl,
    name: "testCases",
    keyName: "fieldArrayId"
  });

  const initialRows: GridRowsProp = fields.map((field, index) => ({
    key: field.fieldArrayId,
    id: index + 1,
    input: `input_${index + 1}`,
    output: `output_${index + 1}`,
    isSample: field.isSample
    // score: field.score
  }));

  const [rows, setRows] = React.useState(initialRows);
  const [itemIndex, setItemIndex] = React.useState(-1);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    // setItemEdit(rows.find((row: any) => row.id === id));
    const index = id.valueOf();
    if (typeof index === "number") setItemIndex(index - 1);
    else setItemIndex(-1);
    // setValue(`testCases.${0}.inputData`, "data.inputData");
    setOpenTestCasePopup(true);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const index = id.valueOf();
    if (typeof index === "number") remove(index - 1);
    // setOpenConfirmAlert(true);
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

  // const processRowUpdate = (newRow: GridRowModel) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  // const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
  //   setRowModesModel(newRowModesModel);
  // };

  const columns: GridColDef[] = [
    { field: "id", headerName: t("common_num_order"), width: 100, editable: false },
    {
      field: "input",
      headerName: t("detail_problem_input"),
      type: "text",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: false
    },
    {
      field: "output",
      headerName: t("detail_problem_output"),
      width: 200,
      type: "text",
      align: "left",
      headerAlign: "left",
      editable: false
    },
    {
      field: "isSample",
      width: 150,
      headerName: t("common_template"),
      type: "boolean"
    },
    // {
    //   field: "score",
    //   headerName: t("common_score"),
    //   width: 150,
    //   editable: true,
    //   type: "number"
    // },
    {
      field: "actions",
      type: "actions",
      headerName: t("common_action"),
      width: 300,
      cellClassName: "actions",
      getActions: ({ id }) => {
        // const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        // if (isInEditMode) {
        //   return [
        //     <GridActionsCellItem
        //       icon={<SaveIcon className={classes.icon} />}
        //       label='Save'
        //       sx={{
        //         color: "primary.main"
        //       }}
        //       onClick={handleSaveClick(id)}
        //     />,
        //     <GridActionsCellItem
        //       icon={<CancelIcon className={classes.icon} />}
        //       label='Cancel'
        //       className='textPrimary'
        //       onClick={handleCancelClick(id)}
        //       color='inherit'
        //     />
        //   ];
        // }

        return [
          <GridActionsCellItem
            icon={<EditIcon className={classes.icon} />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon className={classes.icon} />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />
        ];
      }
    }
  ];

  const handleDelete = () => {
    setOpenConfirmAlert(false);
  };

  return (
    <Box className={classes["body"]}>
      <Box className={classes["head-wrapper"]}>
        <Heading5
          translation-key='code_management_detail_test_case_description'
          fontStyle={"italic"}
          fontWeight={"400"}
          colorname='--gray-50'
        >
          {t("code_management_detail_test_case_description")}{" "}
        </Heading5>
        <Box className={classes["btn-wrapper"]}>
          <Button btnType={BtnType.Outlined} translation-key='code_management_detail_upload_zip'>
            {t("code_management_detail_upload_zip")}
          </Button>
          <Button
            translation-key='code_management_detail_add_test_case'
            btnType={BtnType.Primary}
            onClick={() => {
              setItemIndex(-1);
              setOpenTestCasePopup(true);
            }}
          >
            {t("code_management_detail_add_test_case")}
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={initialRows}
        columns={columns}
        // editMode='row'
        className={classes.dataGrid}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } }
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            border: "none"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f9fb"
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "#f5f9fb"
          }
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        // slotProps={{
        //   toolbar: { setRows, setRowModesModel }
        // }}
      />
      {/* <Button
        onClick={() => {
          // console.log(getValues());
          setValue(`testCases.${0}.inputData`, "hi");
        }}
      >
        cc
      </Button> */}

      <TestCasePopup
        itemIndex={itemIndex}
        open={openTestCasePopup}
        addNewMethod={(data: TestCaseEntity) => {
          append(data);
        }}
        updateMethod={(index, data) => {
          update(index, data);
        }}
        setOpen={setOpenTestCasePopup}
      />
      <ConfirmAlert
        open={openConfirmAlert}
        setOpen={setOpenConfirmAlert}
        title={t("code_management_detail_delete_confirm")}
        content={t("code_management_detail_delete_confirm_question")}
        handleDelete={handleDelete}
        translation-key={[
          "code_management_detail_delete_confirm_question",
          "code_management_detail_delete_confirm"
        ]}
      />
    </Box>
  );
};

export default CodeQuestionTestCases;

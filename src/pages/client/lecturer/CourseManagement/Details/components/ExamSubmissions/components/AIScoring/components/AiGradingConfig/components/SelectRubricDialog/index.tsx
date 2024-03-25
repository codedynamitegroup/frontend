import { useDispatch, useSelector } from "react-redux";
import classes from "./styles.module.scss";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton
} from "@mui/material";
import { RootState } from "store";
import { close } from "reduxes/SelectRubricDialog";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { openEditRubric, openNewRubric } from "reduxes/NewEditRubricDialog";
import { close as closeSelectRubricDialog } from "reduxes/SelectRubricDialog";
import EditRubricDialog from "../EditRubricDialog";

interface SelectRubricConfigProps {}

const rubrisList = [
  {
    id: 1,
    name: "Rubric 1",
    description:
      "Rubric 1 descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
  },
  {
    id: 2,
    name: "Rubric 2",
    description: "Rubric 2 description"
  },
  {
    id: 3,
    name: "Rubric 3",
    description: "Rubric 3 description"
  },
  {
    id: 4,
    name: "Rubric 4",
    description: "Rubric 4 description"
  },
  {
    id: 5,
    name: "Rubric 5",
    description: "Rubric 5 description"
  }
];
const tempCriteria = ["Innovation", "Quality", "Efficiency", "Completeness"];

const SelectRubricConfig = ({}: SelectRubricConfigProps) => {
  const page = 0;
  const pageSize = 20;
  const totalElement = 100;

  const status = useSelector((state: RootState) => state.selectRubricDialog.status);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(close());
  };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };
  const editHandler = (params: GridRenderCellParams<any>) => {
    console.log(params);
    dispatch(openEditRubric());
    dispatch(close());
  };
  const addRubricHandler = () => {
    dispatch(openNewRubric());
    dispatch(closeSelectRubricDialog());
  };

  const tableHeading: GridColDef[] = [
    {
      field: "name",
      headerName: "Rubric Name",
      renderCell: (params) => (
        <Typography className={classes.rubricNameCell}>{params.value}</Typography>
      )
    },
    {
      field: "description",
      headerName: "Description",
      renderCell: (params) => (
        <Typography className={classes.rubricDescriptionCell}>{params.value}</Typography>
      ),
      flex: 0.5
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <Stack direction='row' spacing={1}>
          <Button variant='outlined' color='error' className={classes.iconBtn}>
            <DeleteIcon fontSize='small' color='error' />
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.iconBtn}
            onClick={() => editHandler(params)}
          >
            <EditRoundedIcon fontSize='small' />
          </Button>
        </Stack>
      ),
      flex: 0.2
    }
  ];

  return (
    <>
      <Dialog
        open={status}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.container}
        fullWidth={true}
        maxWidth={"sm"}
        sx={{ height: "100%" }}
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {"Select Rubric"}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <CustomDataGrid
              sx={{
                ".MuiDataGrid-columnSeparator": {
                  display: "none"
                },
                "&.MuiDataGrid-root": {
                  border: "none"
                },
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important"
                }
              }}
              dataList={rubrisList}
              tableHeader={tableHeading}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onSelectData={rowSelectionHandler}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
              checkboxSelection={true}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={addRubricHandler}
            startIcon={<AddIcon />}
            sx={{ textAlign: "center" }}
            variant='outlined'
          >
            Add new rubric
          </Button>
          <Button onClick={handleClose} autoFocus variant='contained'>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <EditRubricDialog
        criteries={tempCriteria}
        name='Rubric 1'
        description='Rubric 1 description'
      />
    </>
  );
};

export default SelectRubricConfig;

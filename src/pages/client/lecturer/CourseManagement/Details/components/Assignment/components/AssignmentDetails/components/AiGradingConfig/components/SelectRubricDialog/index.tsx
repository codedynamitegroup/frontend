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
import { useTranslation } from "react-i18next";
import { RubricUserService } from "services/courseService/RubricUserService";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RubricUserEntity } from "models/courseService/entity/RubricUserEntity";
import RubicsDialog from "components/RubicsDialog";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ConfirmAlert from "components/common/dialogs/ConfirmAlert";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";

interface RubricUserProps {
  id: string;
  rubricId: string;
  name: string;
  description: string;
  content: string;
}

interface SelectRubricConfigProps {
  onSelectRubric: (rubric: any) => void;
}
const SelectRubricConfig = ({ onSelectRubric }: SelectRubricConfigProps) => {
  const page = 0;
  const pageSize = 20;
  const totalElement = 100;

  const status = useSelector((state: RootState) => state.selectRubricDialog.status);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openEditRubricDialog, setOpenEditRubricDialog] = useState(false);
  const onClose = () => {
    setOpenEditRubricDialog(false);
  };

  const handleClose = () => {
    dispatch(close());
  };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    // onSelectRubric(params.row);
    // dispatch(closeSelectRubricDialog());
  };

  const addRubricHandler = () => {
    dispatch(openNewRubric());
    dispatch(closeSelectRubricDialog());
  };

  const { loggedUser } = useAuth();
  const [rubrics, setRubrics] = useState<RubricUserEntity[]>([]);
  const [openPreviewRubricDialog, setOpenPreviewRubricDialog] = useState<boolean>(false);
  const [previewRubric, setPreviewRubric] = useState<RubricUserEntity>();
  const [openConfirmAlert, setOpenConfirmAlert] = useState<boolean>(false);
  const [rubricIdDelete, setRubricIdDelete] = useState<string>("");

  console.log("rubricIdDelete", rubricIdDelete);
  const handleDeleteRubric = async () => {
    if (!rubricIdDelete) return;
    RubricUserService.deleteRubricUser(rubricIdDelete)
      .then(() => {
        dispatch(setSuccessMess("Delete rubric successfully"));
        dispatch(close());
      })
      .catch((error) => {
        dispatch(setErrorMess("Delete rubric failed"));
        console.error("Failed to delete rubric", error);
      });
  };

  const getAllRubricsByUserId = useCallback(async () => {
    await RubricUserService.getAllOrganizationsByUserId({
      userId: loggedUser?.userId || "",
      pageNo: 0,
      pageSize: 10
    })
      .then((res) => {
        setRubrics(res.rubricUsers);
      })
      .catch((err) => {});
  }, [loggedUser?.userId]);

  useEffect(() => {
    getAllRubricsByUserId();
  }, [getAllRubricsByUserId]);

  const tableHeading: GridColDef[] = [
    {
      field: "name",
      headerName: t("grading_config_select_rubric_dialog_name"),
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("grading_config_select_rubric_dialog_name")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.name}</ParagraphBody>;
      },
      flex: 1
    },
    {
      field: "description",
      headerName: t("common_description"),
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_description")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphBody width={"auto"}>{params.row.description}</ParagraphBody>;
      },
      flex: 2
    },
    {
      field: "action",
      headerName: t("common_action"),
      renderCell: (params) => (
        <Stack direction='row' spacing={1}>
          <Button
            variant='outlined'
            color='primary'
            className={classes.iconBtn}
            onClick={() => {
              setPreviewRubric(params.row as RubricUserEntity);
              setOpenEditRubricDialog(true);
            }}
          >
            <EditRoundedIcon fontSize='small' />
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.iconBtn}
            onClick={() => {
              onSelectRubric(params.row);
              dispatch(closeSelectRubricDialog());
            }}
          >
            <TaskAltIcon fontSize='small' />
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.iconBtn}
            onClick={() => {
              setPreviewRubric(params.row as RubricUserEntity);
              setOpenPreviewRubricDialog(true);
            }}
          >
            <RemoveRedEyeIcon fontSize='small' />
          </Button>
          <Button
            variant='outlined'
            color='error'
            className={classes.iconBtn}
            onClick={() => {
              setRubricIdDelete(params.row.id);
              setOpenConfirmAlert(true);
            }}
          >
            <DeleteIcon fontSize='small' color='error' />
          </Button>
        </Stack>
      ),
      flex: 1
    }
  ];

  const rubricUserListTable: RubricUserProps[] = useMemo(() => {
    if (rubrics.length > 0) {
      return rubrics.map((rubric) => ({
        id: rubric.id,
        rubricId: rubric.id,
        name: rubric.name,
        description: rubric.description,
        content: rubric.content
      }));
    } else {
      return [];
    }
  }, [rubrics]);

  return (
    <>
      <Dialog
        open={status}
        onClose={handleClose}
        aria-labelledby='select-rubric-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.container}
        fullWidth={true}
        maxWidth={"md"}
        sx={{ height: "100%" }}
        PaperProps={{
          sx: {
            maxHeight: 630,
            height: "100%"
          }
        }}
      >
        <DialogTitle
          translation-key='grading_config_select_rubric_dialog_title'
          id='select-rubric-dialog-title'
          sx={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {t("grading_config_select_rubric_dialog_title")}
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
              dataList={rubricUserListTable}
              tableHeader={tableHeading}
              page={page}
              pageSize={pageSize}
              totalElement={totalElement}
              onClickRow={rowClickHandler}
              onSelectData={rowSelectionHandler}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={addRubricHandler}
            startIcon={<AddIcon />}
            sx={{ textAlign: "center" }}
            variant='outlined'
            translation-key='grading_config_add_new_rubric'
          >
            {t("grading_config_add_new_rubric")}
          </Button>
          <Button
            onClick={handleClose}
            autoFocus
            variant='contained'
            translation-key='common_agree'
          >
            {t("common_agree")}
          </Button>
        </DialogActions>
      </Dialog>
      {openEditRubricDialog && (
        <EditRubricDialog
          previewRubric={previewRubric}
          onClose={onClose}
          isOpen={openEditRubricDialog}
        />
      )}

      <RubicsDialog
        open={openPreviewRubricDialog}
        title='Rubric'
        handleClose={() => setOpenPreviewRubricDialog(false)}
        previewRubric={previewRubric}
      />
      <ConfirmDelete
        isOpen={openConfirmAlert}
        title={"Confirm delete"}
        description='Are you sure you want to delete this rubric?'
        onCancel={() => {
          setOpenConfirmAlert(false);
        }}
        onDelete={handleDeleteRubric}
      />
    </>
  );
};

export default SelectRubricConfig;

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
  IconButton,
  Grid,
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Box
} from "@mui/material";
import { RootState } from "store";
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
import { close } from "reduxes/SelectRubricCriteriaDialog";
import { useState } from "react";
import clsx from "clsx";
import { openEditCriteria, openNewCriteria } from "reduxes/NewEditRubricCriteriaDialog";
import NewCriteriaDialog from "../NewCriteriaDialog";
import EditCriteriaDialog from "../EditCriteriaDialog";
import { useTranslation } from "react-i18next";

interface SelectCriteriaConfigProps {}

const customCriteriaList = [
  {
    id: 1,
    name: "Criteria 1",
    description: "Criteria 1 description"
  },
  {
    id: 2,
    name: "Criteria 2",
    description: "Criteria 2 description"
  },
  {
    id: 3,
    name: "Criteria 3",
    description: "Criteria 3 description"
  },
  {
    id: 4,
    name: "Criteria 4",
    description: "Criteria 4 description"
  },
  {
    id: 5,
    name: "Criteria 5",
    description: "Criteria 5 description"
  }
];
const defaultCriteriaList = [
  {
    id: 1,
    name: "Innovation",
    description: "Innovation description"
  },
  {
    id: 2,
    name: "Quality",
    description: "Quality description"
  },
  {
    id: 3,
    name: "Efficiency",
    description: "Efficiency description"
  },
  {
    id: 4,
    name: "Completeness",
    description: "Completeness description"
  }
];

const SelectCriteriaConfig = () => {
  const page = 0;
  const pageSize = 20;
  const totalElement = 100;

  const status = useSelector((state: RootState) => state.selectCriteriaDialog.status);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    console.log(params);
  };
  const editHandler = (params: GridRenderCellParams<any>) => {
    dispatch(openEditCriteria());
    dispatch(close());
  };
  const addCriteriaHandler = () => {
    dispatch(openNewCriteria());
    dispatch(close());
  };

  const tableHeading: GridColDef[] = [
    {
      field: "name",
      headerName: t("grading_config_criteria_name"),
      renderCell: (params) => (
        <Typography className={classes.criteriaNameCell}>{params.value}</Typography>
      )
    },
    {
      field: "description",
      headerName: t("common_description"),
      renderCell: (params) => (
        <Typography className={classes.criteriaDescriptionCell}>{params.value}</Typography>
      ),
      flex: 0.5
    },
    {
      field: "action",
      headerName: t("common_action"),
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
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Dialog
        open={status}
        onClose={handleClose}
        aria-labelledby='select-criteria-dialog-title'
        aria-describedby='select-criteria-dialog-description'
        className={classes.container}
        fullWidth={true}
        maxWidth={"sm"}
        sx={{ height: "100%" }}
        PaperProps={{
          sx: {
            // width: "50%",
            maxHeight: 660,
            height: "100%"
          }
        }}
      >
        <DialogTitle
          id='select-criteria-dialog-title'
          sx={{ fontSize: "1.5rem", fontWeight: 700 }}
          translation-key='grading_config_select_criteria_title'
        >
          {t("grading_config_select_criteria_title")}
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
          <DialogContentText id='select-criteria-dialog-description'>
            <Box sx={{ marginBottom: "5px" }}>
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={"outlined"}
                    sx={{ borderStartEndRadius: "0px", borderEndEndRadius: "0px" }}
                    onClick={() => setActiveTab(0)}
                    className={clsx(classes.tabButton, activeTab === 0 && classes.activeTabButton)}
                    translation-key='common_default'
                  >
                    {t("common_default")}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={"outlined"}
                    sx={{ borderStartStartRadius: "0px", borderEndStartRadius: "0px" }}
                    onClick={() => setActiveTab(1)}
                    className={clsx(classes.tabButton, activeTab === 1 && classes.activeTabButton)}
                    translation-key='common_custom'
                  >
                    {t("common_custom")}
                  </Button>
                </Grid>
              </Grid>
              {activeTab === 0 && (
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {defaultCriteriaList.map((defaultCriteria) => (
                    <ListItem key={defaultCriteria.id} disablePadding>
                      <ListItemButton
                        role={undefined}
                        // onClick={handleToggle(value)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge='start'
                            // checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            // inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          //  id={labelId}
                          primary={defaultCriteria.name}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            {activeTab === 1 && (
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
                dataList={customCriteriaList}
                tableHeader={tableHeading}
                page={page}
                pageSize={pageSize}
                totalElement={totalElement}
                onSelectData={rowSelectionHandler}
                onPaginationModelChange={pageChangeHandler}
                showVerticalCellBorder={false}
                checkboxSelection={true}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {activeTab === 1 && (
            <Button
              onClick={addCriteriaHandler}
              startIcon={<AddIcon />}
              sx={{ textAlign: "center" }}
              variant='outlined'
              translation-key='grading_config_add_new_criteria'
            >
              {t("grading_config_add_new_criteria")}
            </Button>
          )}

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
      <EditCriteriaDialog name='Criteria 1' description='Criteria 1 description' />
      <NewCriteriaDialog />
    </>
  );
};

export default SelectCriteriaConfig;

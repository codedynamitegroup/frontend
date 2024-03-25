import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField
} from "@mui/material";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { closeEditCriteria } from "reduxes/NewEditRubricCriteriaDialog";
import { open } from "reduxes/SelectRubricCriteriaDialog";

interface CriteriaConfigDialogProps {
  name: string;
  description: string;
}

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    max-height: 280px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? "#C7D0DD" : "#1C2025"};
    background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"};

    &:hover {
      border-color: 'red !important';
    }

    &:focus {
      outline: 0;
      border-color: '#3788d8';
      box-shadow: 0 0 0 2px ${theme.palette.mode === "dark" ? "#0072E5" : "#3788d8"};
    }
  `
);

const EditCriteriaDialog = ({ name, description }: CriteriaConfigDialogProps) => {
  const status = useSelector(
    (state: RootState) => state.rubricCriteriaConfigDialog.editCriteriaStatus
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEditCriteria());
  };
  const handleBack = () => {
    dispatch(closeEditCriteria());
    dispatch(open());
  };

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
          {"Edit Criteria"}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.configlabel}>{`Name`}</Typography>
                <TextField
                  id='outlined-basic'
                  variant='outlined'
                  fullWidth
                  className={classes.inputTextField}
                  color='primary'
                  sx={{ borderRadius: "20px" }}
                  value={name}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.configlabel}>{`Description`}</Typography>
                <Textarea
                  aria-label='empty textarea'
                  placeholder='Positive with focus on where the user can improve'
                  minLength={3}
                  value={description}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ textAlign: "center" }}
            variant='outlined'
          >
            Back to select criteria
          </Button>
          <Button onClick={handleClose} autoFocus variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditCriteriaDialog;

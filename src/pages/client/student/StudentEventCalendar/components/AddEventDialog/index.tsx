import { DialogProps, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomDatePicker from "components/common/datetime/CustomDatePicker";
import CustomDialog from "components/common/dialogs/CustomDialog";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import dayjs from "dayjs";
import classes from "./styles.module.scss";

interface AddEventDialogProps extends DialogProps {
  data: {
    event_title: string;
    start: string;
  };
  handleChangData: (newData: { event_title: string; start: string }) => void;
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

const AddEventDialog = ({
  data,
  handleChangData,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: AddEventDialogProps) => {
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='800px'
      {...props}
    >
      <Box component='form' className={classes.formBody} autoComplete='off'>
        <InputTextField
          type='text'
          title='Tên sự kiện'
          value={data.event_title}
          onChange={(e) => {
            handleChangData({ event_title: e.target.value, start: data.start });
          }}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Ngày</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDatePicker
              value={dayjs(data.start)}
              onHandleValueChange={(newValue) => {
                handleChangData({
                  event_title: data.event_title,
                  start: newValue?.toString() || ""
                });
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Loại sự kiện</TextTitle>
          </Grid>
          <Grid item xs={9}>
            Sinh viên
          </Grid>
        </Grid>
      </Box>
    </CustomDialog>
  );
};

export default AddEventDialog;

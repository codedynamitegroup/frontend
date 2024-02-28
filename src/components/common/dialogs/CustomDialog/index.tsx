import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider, IconButton } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button, { BtnType } from "components/common/buttons/Button";
import * as React from "react";

interface CustomDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  minWidth?: string;
  actionsDisabled?: boolean;
}

export default function CustomDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  minWidth,
  actionsDisabled,
  ...props
}: CustomDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      sx={{
        "& .MuiDialog-paper": {
          minWidth: minWidth || "550px"
        }
      }}
      PaperProps={{ sx: { borderRadius: "10px" } }}
      {...props}
    >
      <DialogTitle id='id'>
        <Box display='flex' alignItems='center'>
          <Box flexGrow={1}>{title || ""}</Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
      {actionsDisabled && actionsDisabled === true ? null : (
        <DialogActions>
          <Button
            onClick={onHandleCancel ? onHandleCancel : handleClose}
            btnType={BtnType.Outlined}
          >
            {cancelText || "Hủy bỏ"}
          </Button>
          <Button
            onClick={onHanldeConfirm ? onHanldeConfirm : handleClose}
            btnType={BtnType.Primary}
            autoFocus
          >
            {confirmText || "Xác nhận"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

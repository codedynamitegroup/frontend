import * as React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button, { BtnType } from "components/common/buttons/Button";
import { Box, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PickQuestionTypeToAddDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHanldeConfirm?: () => void;
}

export default function PickQuestionTypeToAddDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHanldeConfirm,
  ...props
}: PickQuestionTypeToAddDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
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
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHanldeConfirm ? onHanldeConfirm : handleClose} btnType={BtnType.Primary}>
          {confirmText || "Xác nhận"}
        </Button>
        <Button onClick={handleClose} btnType={BtnType.Outlined}>
          {cancelText || "Hủy bỏ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

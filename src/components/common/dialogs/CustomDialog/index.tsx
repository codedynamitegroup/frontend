import CloseIcon from "@mui/icons-material/Close";
import JoyButton from "@mui/joy/Button";
import { Box, Divider, IconButton } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

interface CustomDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  minWidth?: string;
  maxHeight?: string;
  actionsDisabled?: boolean;
  confirmDisabled?: boolean;
  isConfirmLoading?: boolean;
  titleBackground?: string;
  customActions?: React.ReactNode;
  onHandleSubmit?: () => void;
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
  maxHeight,
  actionsDisabled,
  confirmDisabled,
  isConfirmLoading = false,
  titleBackground,
  customActions,
  onHandleSubmit,
  ...props
}: CustomDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      sx={{
        "& .MuiDialog-paper": {
          minWidth: minWidth || "550px",
          maxHeight: maxHeight || null
          // overflow: "hidden"
        }
      }}
      PaperProps={{ sx: { borderRadius: "10px" } }}
      {...props}
    >
      <DialogTitle
        id='id'
        sx={{
          backgroundColor: titleBackground ? titleBackground : undefined
        }}
      >
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

      <Box
        component='form'
        autoComplete='off'
        onSubmit={
          onHandleSubmit
            ? (e) => {
                e.preventDefault();
                onHandleSubmit();
              }
            : undefined
        }
      >
        <DialogContent>{children}</DialogContent>
        {actionsDisabled && actionsDisabled === true ? null : (
          <DialogActions>
            <JoyButton
              onClick={onHandleCancel ? onHandleCancel : handleClose}
              variant='outlined'
              translation-key='common_cancel'
            >
              {cancelText || t("common_cancel")}
            </JoyButton>
            <JoyButton
              loading={isConfirmLoading}
              onClick={onHanldeConfirm ? onHanldeConfirm : handleClose}
              autoFocus
              disabled={confirmDisabled}
              translation-key='common_confirm'
            >
              {confirmText || t("common_confirm")}
            </JoyButton>
          </DialogActions>
        )}
        {customActions && customActions}
      </Box>
    </Dialog>
  );
}

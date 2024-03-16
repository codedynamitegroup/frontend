import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

interface AlertDialogProps {
  title: string;
  content: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => void;
}
export default function ConfirmAlert(props: AlertDialogProps) {
  const { t } = useTranslation();
  const { title, content, open, setOpen, handleDelete } = props;
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} translation-key='common_cancel'>
          {t("common_cancel")}
        </Button>
        <Button onClick={handleConfirm} autoFocus translation-key='common_confirm'>
          {t("common_confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export enum AlertType {
  Success = "success",
  INFO = "info",
  Warning = "warning",
  Error = "error"
}

interface SnackbarAlertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content?: string;
  type?: AlertType;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}
export default function SnackbarAlert({
  open,
  setOpen,
  content,
  type,
  anchorOrigin
}: SnackbarAlertProps) {
  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const vertical = "top";
  const horizontal = "right";

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin || { vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity={type}>
          {content}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

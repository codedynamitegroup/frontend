import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import useCallbackPrompt from "hooks/useCallbackPrompt";

export default function AlertDialog({ isBlocking }: { isBlocking: boolean }) {
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(isBlocking);

  return (
    <Dialog
      open={showPrompt}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{"Unsaved Changes"}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          It looks like you have been editing something. If you leave before saving, your changes
          will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmNavigation} color='primary'>
          Yes
        </Button>
        <Button onClick={cancelNavigation} color='primary' autoFocus>
          Back to Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

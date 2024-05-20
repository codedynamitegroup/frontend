import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, unstable_usePrompt, useBlocker } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

function useCallbackPrompt(when: boolean): [boolean, () => void, () => void] {
  const [showPrompt, setShowPrompt] = useState(false);

  const blocker = useBlocker(({ currentLocation, nextLocation, historyAction }) => {
    console.log("currentLocation", currentLocation);
    console.log("nextLocation", nextLocation);
    console.log("historyAction", historyAction);

    if (when && nextLocation.pathname !== currentLocation.pathname) {
      setShowPrompt(true);
      return true;
    }
    return false;
  });

  const cancelNavigation = () => {
    setShowPrompt(false);
    if (blocker.reset) blocker.reset();
  };

  const confirmNavigation = () => {
    setShowPrompt(false);

    if (blocker.proceed) blocker.proceed();
  };

  return [showPrompt, confirmNavigation, cancelNavigation];
}

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

import { Alert, Snackbar } from "@mui/material";
import LoadingScreen from "components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { clearErrorMess, clearSuccessMess, selectStateSnackbar } from "reduxes/AppStatus";
import { selectedIsLoadingAuth, selectedLoading } from "reduxes/Loading";

export const AppStatus = () => {
  const dispach = useDispatch();
  const status = useSelector(selectStateSnackbar);
  const isLoading = useSelector(selectedLoading);
  const isLoadingAuth = useSelector(selectedIsLoadingAuth);
  return (
    <>
      {(isLoading || isLoadingAuth) && <LoadingScreen />}
      <Snackbar
        open={!!status.error}
        autoHideDuration={5000}
        onClose={() => dispach(clearErrorMess(undefined))}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert
          elevation={6}
          variant='filled'
          onClose={() => dispach(clearErrorMess(undefined))}
          severity='error'
        >
          {status.error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!status.success}
        autoHideDuration={5000}
        onClose={() => dispach(clearSuccessMess(undefined))}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert
          elevation={6}
          variant='filled'
          onClose={() => dispach(clearSuccessMess(undefined))}
          severity='success'
          sx={{ backgroundColor: "var(--green-1)", color: "#293306", fontWeight: 500 }}
        >
          {status.success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppStatus;

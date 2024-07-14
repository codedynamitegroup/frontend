import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Avatar } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import classes from "./styles.module.scss";
import { SynchronizeMoodleService } from "services/courseService/SynchronizeMoodleService";
import useAuth from "hooks/useAuth";

enum Statuses {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL"
}

const StatusBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status"
})<{ status: Statuses }>(({ theme, status }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  maxWidth: "150px",
  backgroundColor:
    status === Statuses.SUCCESS
      ? "#E8FBE8"
      : status === Statuses.PROCESSING
        ? "#E8F1FB"
        : status === Statuses.FAIL
          ? "lightcoral"
          : "lightgrey",
  color:
    status === Statuses.SUCCESS
      ? "#00B52D"
      : status === Statuses.PROCESSING
        ? "#002DB5"
        : status === Statuses.FAIL
          ? "red"
          : "grey",
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
}));

const Line = styled("div", {
  shouldForwardProp: (prop) => prop !== "status"
})<{ status: Statuses }>(({ theme, status }) => ({
  width: "2px",
  height: "100%",
  backgroundColor: status === Statuses.SUCCESS ? "#00B52D" : "grey",
  position: "absolute",
  left: "20px",
  top: "0"
}));

const NumberCircle = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "status"
})<{ status: Statuses }>(({ theme, status }) => ({
  backgroundColor:
    status === Statuses.SUCCESS ? "#00B52D" : status === Statuses.PROCESSING ? "#002DB5" : "grey",
  color: "white",
  width: theme.spacing(4),
  height: theme.spacing(4),
  fontSize: "14px",
  marginRight: theme.spacing(1)
}));

const SynchronizeMoodle: React.FC = () => {
  const [userStatus, setUserStatus] = useState<Statuses>(Statuses.PENDING);
  const [courseStatus, setCourseStatus] = useState<Statuses>(Statuses.PENDING);
  const [otherResourcesStatus, setOtherResourcesStatus] = useState<Statuses>(Statuses.PENDING);
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const fetchStatusFromDB = async (id: string) => {
    try {
      const response = await SynchronizeMoodleService.synchronizeMoodle(id);
      if (response.status === 200) {
        setUserStatus(Statuses.SUCCESS);
        setCourseStatus(Statuses.SUCCESS);
        setOtherResourcesStatus(Statuses.SUCCESS);
        setIsSynchronizing(false);
      }
    } catch (error) {
      setUserStatus(Statuses.FAIL);
      setCourseStatus(Statuses.FAIL);
      setOtherResourcesStatus(Statuses.FAIL);
      setIsSynchronizing(false);
    }
    setTimeout(() => setUserStatus(Statuses.PROCESSING), 1000);
    setTimeout(() => {
      setUserStatus(Statuses.SUCCESS);
      setCourseStatus(Statuses.PROCESSING);
    }, 3000);
    setTimeout(() => {
      setCourseStatus(Statuses.SUCCESS);
      setOtherResourcesStatus(Statuses.PROCESSING);
    }, 5000);
    setTimeout(() => setOtherResourcesStatus(Statuses.SUCCESS), 7000);
    setTimeout(() => setIsSynchronizing(false), 7000);
  };
  const { loggedUser } = useAuth();

  const handleSynchronize = () => {
    setIsSynchronizing(true);
    fetchStatusFromDB(loggedUser.organization.organizationId);
  };

  return (
    <Grid className={classes.root} container direction='column'>
      <Box>
        <Box className={classes.stepWrapper}>
          <NumberCircle status={userStatus}>1</NumberCircle>
          <Typography variant='body1'>Người dùng</Typography>
        </Box>
        <StatusBox status={userStatus}>{userStatus}</StatusBox>
      </Box>
      <Box>
        <Box className={classes.stepWrapper}>
          <NumberCircle status={courseStatus}>2</NumberCircle>
          <Typography variant='body1'>Khóa học</Typography>
        </Box>
        <StatusBox status={courseStatus}>{courseStatus}</StatusBox>
      </Box>
      <Box>
        <Box className={classes.stepWrapper}>
          <NumberCircle status={otherResourcesStatus}>3</NumberCircle>
          <Typography variant='body1'>Các tài nguyên khác</Typography>
        </Box>
        <StatusBox status={otherResourcesStatus}>{otherResourcesStatus}</StatusBox>
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
        <LoadingButton
          variant='contained'
          color='primary'
          onClick={handleSynchronize}
          loading={isSynchronizing}
        >
          ĐỒNG BỘ
        </LoadingButton>
      </Box>
    </Grid>
  );
};

export default SynchronizeMoodle;

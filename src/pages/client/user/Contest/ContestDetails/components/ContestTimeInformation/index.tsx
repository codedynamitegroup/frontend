import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { EContestStatus } from "../..";
import { Box, Button, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import CalendarIcon from "@mui/icons-material/DateRange";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Heading6 from "components/text/Heading6";
import Heading1 from "components/text/Heading1";
interface PropsData {
  startDate: string;
  endDate: string;
  status: EContestStatus;
  joinContest: boolean;
}

const ContestTimeInformation = (props: PropsData) => {
  const { startDate, status, endDate, joinContest } = props;
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  let inputDate: any;

  startDate < endDate ? (inputDate = endDate) : (inputDate = startDate);

  const leading0 = (num: any) => {
    return num < 10 ? "0" + num : num;
  };

  const getTimeUntil = (deadline: any) => {
    const currentDate = new Date();
    const time = Date.parse(deadline) - currentDate.getTime();
    if (time < 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    setInterval(() => getTimeUntil(inputDate), 1000);

    return () => getTimeUntil(inputDate);
  }, [inputDate]);

  return (
    <Paper className={classes.container}>
      {status === EContestStatus.featured ? (
        <Box className={classes.timeDetailContainer}>
          <Stack direction='row'>
            <CalendarIcon fontSize='small' className={classes.dateIcon} />
            <Typography className={classes.timeInfoText}>
              Cuộc thi sẽ diễn ra trong {leading0(days)} ngày {leading0(hours)} giờ{" "}
              {leading0(minutes)} phút {leading0(seconds)} giây
            </Typography>
          </Stack>
        </Box>
      ) : status === EContestStatus.happening ? (
        <Box className={classes.timeDetailContainer}>
          <Stack direction='row'>
            <AccessAlarmsIcon fontSize='small' className={classes.dateIcon} />
            <Typography className={classes.timeInfoText}>Cuộc thi đang diễn ra</Typography>
          </Stack>
          <Stack direction={"row"}>
            <CalendarIcon fontSize='small' className={classes.dateIcon} />
            <Typography className={classes.timeInfoText}>
              Cuộc thi sẽ kết thúc trong {leading0(days)} ngày {leading0(hours)} giờ{" "}
              {leading0(minutes)} phút {leading0(seconds)} giây
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box className={classes.timeDetailContainer}>
          <Stack direction='row'>
            <NotificationsActiveIcon fontSize='small' className={classes.dateIcon} />
            <Typography className={classes.timeInfoText}>
              Cuộc thi đã kết thúc vào {endDate}
            </Typography>
          </Stack>
        </Box>
      )}

      {joinContest ? (
        status === EContestStatus.featured ? (
          <Heading1 fontSize={"25px"} fontWeight={500} color={"var(--green-300) !important"}>
            Bạn đã đăng ký tham gia cuộc thi này
          </Heading1>
        ) : status === EContestStatus.happening ? (
          <Heading1 fontSize={"25px"} fontWeight={500} color={"var(--green-300) !important"}>
            Bạn đang tham gia cuộc thi này
          </Heading1>
        ) : (
          <Heading1 fontSize={"25px"} fontWeight={500} color={"var(--orange-4) !important"}>
            Bạn đã tham gia cuộc thi này
          </Heading1>
        )
      ) : (
        <Button variant='outlined'>Tham gia cuộc thi</Button>
      )}
    </Paper>
  );
};

export default ContestTimeInformation;

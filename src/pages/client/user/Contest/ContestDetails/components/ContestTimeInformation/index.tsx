import Paper from "@mui/material/Paper";
import React, { useEffect, useRef, useState } from "react";
import { EContestStatus } from "../..";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import CalendarIcon from "@mui/icons-material/DateRange";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Heading6 from "components/text/Heading6";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";
import ContestTimeDisplay from "../TimeDisplay";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface PropsData {
  startDate: string;
  endDate: string;
  status: EContestStatus;
  joinContest: boolean;
  contestName: string;
}

const ContestTimeInformation = (props: PropsData) => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const breadcrumbClickHandle = () => {};
  const { startDate, status, endDate, joinContest, contestName } = props;
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  let inputDate: any;
  const convertedEndDate = new Date(endDate);

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
      <Box>
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorName='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.user.contest.root)}
            >
              Danh sách cuộc thi
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall
              colorName='--blue-500'
              className={classes.cursorPointer}
              onClick={breadcrumbClickHandle}
            >
              Batch coding
            </ParagraphSmall>
          </Box>
        </Box>
        <Typography
          fontWeight={"bolder"}
          fontSize={"26px"}
          fontFamily={"OpenSans, Arial, Helvetica, sans-serif"}
          marginBottom={"5px"}
        >
          {contestName}
        </Typography>
        {joinContest ? (
          status === EContestStatus.featured ? (
            <Heading1 className={classes.currentJoinStatus} color={"var(--green-300) !important"}>
              Bạn đã đăng ký tham gia cuộc thi này
            </Heading1>
          ) : status === EContestStatus.happening ? (
            <Heading1 className={classes.currentJoinStatus} color={"var(--green-300) !important"}>
              Bạn đang tham gia cuộc thi này
            </Heading1>
          ) : (
            <Heading1 className={classes.currentJoinStatus} color={"var(--orange-4) !important"}>
              Bạn đã tham gia cuộc thi này
            </Heading1>
          )
        ) : (
          <Button variant='contained'>Tham gia thi</Button>
        )}
      </Box>

      <Stack>
        {status === EContestStatus.featured || status === EContestStatus.happening ? (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <CalendarIcon fontSize='small' />
              <Typography className={classes.timeDescriptionText}>
                Cuộc thi sẽ {status === EContestStatus.featured ? "bắt đầu" : "kết thúc"} trong
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              <ContestTimeDisplay time={leading0(days)} type='Ngày' />
              <ContestTimeDisplay time={leading0(hours)} type='Giờ' />
              <ContestTimeDisplay time={leading0(minutes)} type='Phút' />
              <ContestTimeDisplay time={leading0(seconds)} type='Giây' />
            </Stack>
          </Box>
        ) : (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <NotificationsActiveIcon fontSize='small' />
              <Typography className={classes.timeDescriptionText}>
                Cuộc thi đã kết thúc lúc
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              <ContestTimeDisplay time={convertedEndDate.getDate()} type='Ngày' />
              <ContestTimeDisplay time={convertedEndDate.getMonth() + 1} type='Tháng' />
              <ContestTimeDisplay time={convertedEndDate.getFullYear() % 100} type='Năm' />
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default ContestTimeInformation;

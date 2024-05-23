import Paper from "@mui/material/Paper";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import CalendarIcon from "@mui/icons-material/DateRange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Heading1 from "components/text/Heading1";
import ContestTimeDisplay from "../TimeDisplay";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import moment from "moment";

interface PropsData {
  startDate: string;
  endDate: string;
  status: ContestStartTimeFilterEnum;
  joinContest: boolean;
  contestName: string;
}

const ContestTimeInformation = (props: PropsData) => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { startDate, status, endDate, joinContest, contestName } = props;
  const convertedEndDate = new Date(endDate);

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const inputDate = useMemo(() => {
    return status === ContestStartTimeFilterEnum.UPCOMING ? startDate : endDate;
  }, [startDate, endDate, status]);

  const getTimeUntil = (deadline: any) => {
    if (!deadline) {
      return;
    }
    const time = moment(deadline).diff(moment().utc(), "milliseconds");
    if (time < 0) {
      setYears(0);
      setMonths(0);
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      setYears(Math.floor(time / (1000 * 60 * 60 * 24 * 365)));
      setMonths(Math.floor((time / (1000 * 60 * 60 * 24 * 30)) % 12));
      setDays(Math.floor((time / (1000 * 60 * 60 * 24)) % 30));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  const { t } = useTranslation();

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
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.user.contest.root)}
              translation-key='contest_list_title'
            >
              {t("contest_list_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500'>{contestName}</ParagraphSmall>
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
          status === ContestStartTimeFilterEnum.UPCOMING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--green-300) !important"}
              translation-key='contest_detail_joined_feature_status'
            >
              {t("contest_detail_joined_feature_status")}
            </Heading1>
          ) : status === ContestStartTimeFilterEnum.HAPPENING ? (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--green-300) !important"}
              translation-key='contest_detail_joined_happening_status'
            >
              {t("contest_detail_joined_happening_status")}
            </Heading1>
          ) : (
            <Heading1
              className={classes.currentJoinStatus}
              color={"var(--orange-4) !important"}
              translation-key='contest_detail_joined_ended_status'
            >
              {t("contest_detail_joined_ended_status")}
            </Heading1>
          )
        ) : (
          <Button variant='contained' translation-key='contest_detail_join_button'>
            {t("contest_detail_join_button")}
          </Button>
        )}
      </Box>

      <Stack>
        {status === ContestStartTimeFilterEnum.UPCOMING && (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <CalendarIcon fontSize='small' />
              <Typography
                className={classes.timeDescriptionText}
                translation-key='contest_detail_feature_status'
              >
                {t("contest_detail_feature_status")}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              {years > 0 && (
                <ContestTimeDisplay time={years} type={t("contest_detail_feature_year")} />
              )}
              {months > 0 && (
                <ContestTimeDisplay time={months} type={t("contest_detail_feature_month")} />
              )}
              {days > 0 && (
                <ContestTimeDisplay time={days} type={t("contest_detail_feature_day")} />
              )}
              <ContestTimeDisplay time={hours} type={t("contest_detail_feature_hour")} />
              <ContestTimeDisplay time={minutes} type={t("contest_detail_feature_minute")} />
              <ContestTimeDisplay time={seconds} type={t("contest_detail_feature_second")} />
            </Stack>
          </Box>
        )}
        {endDate && status === ContestStartTimeFilterEnum.HAPPENING && (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <CalendarIcon fontSize='small' />
              <Typography
                className={classes.timeDescriptionText}
                translation-key='contest_detail_happening_status'
              >
                {t("contest_detail_happening_status")}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              {years > 0 && (
                <ContestTimeDisplay time={years} type={t("contest_detail_feature_year")} />
              )}
              {months > 0 && (
                <ContestTimeDisplay time={months} type={t("contest_detail_feature_month")} />
              )}
              {days > 0 && (
                <ContestTimeDisplay time={days} type={t("contest_detail_feature_day")} />
              )}
              <ContestTimeDisplay time={hours} type={t("contest_detail_feature_hour")} />
              <ContestTimeDisplay time={minutes} type={t("contest_detail_feature_minute")} />
              <ContestTimeDisplay time={seconds} type={t("contest_detail_feature_second")} />
            </Stack>
          </Box>
        )}
        {status === ContestStartTimeFilterEnum.ENDED && (
          <Box className={classes.timeDetailContainer}>
            <Stack direction={"row"} justifyContent={"center"}>
              <NotificationsActiveIcon fontSize='small' />
              <Typography
                className={classes.timeDescriptionText}
                translation-key='contest_detail_ended_status'
              >
                {t("contest_detail_ended_status")}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ marginTop: "5px" }}
            >
              <ContestTimeDisplay
                time={convertedEndDate.getDate()}
                type={t("contest_detail_feature_day")}
              />
              <ContestTimeDisplay
                time={convertedEndDate.getMonth() + 1}
                type={t("contest_detail_feature_month")}
              />
              <ContestTimeDisplay
                time={convertedEndDate.getFullYear() % 100}
                type={t("contest_detail_feature_year")}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default ContestTimeInformation;
